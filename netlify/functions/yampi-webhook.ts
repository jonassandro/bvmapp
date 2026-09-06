import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as crypto from 'crypto';
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Mapeamento oficial e estrito de SKU Yampi -> moduleId da nova oferta
 */
const SKU_TO_MODULE_MAP: Record<string, string> = {
  '2GWE9VK2T': 'BASE',
  'EPA42N3F7': 'PACK48',
  'HP9CNGR7F': 'TREINOSDIA',
  '8NWZZ8SL6': 'PROGRAMA8',
  'Y5UNWY2C7': 'TREINOS30',
  'Z8GMW9GJA': 'NUTRICAO',
};

let isFirebaseInitialized = false;

/**
 * Inicialização segura e singleton do Firebase Admin SDK
 */
function initFirebaseAdmin() {
  if (isFirebaseInitialized || getApps().length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'basevisualmusculacao';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Configuração incompleta: FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY devem estar configurados nas variáveis de ambiente da Netlify.'
    );
  }

  // Trata corretamente quebras de linha enviadas como string literal "\n"
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  isFirebaseInitialized = true;
}

/**
 * Obtém a instância do Firestore com o databaseId correto do projeto
 */
function getAdminDb() {
  initFirebaseAdmin();
  const dbId =
    process.env.FIREBASE_DATABASE_ID ||
    process.env.FIRESTORE_DATABASE_ID ||
    'ai-studio-basevisualdamusc-944d86d0-0fa6-4be8-a6ed-4abc881ee1c8';

  const app = getApp();
  if (dbId && dbId !== '(default)') {
    return getFirestore(app, dbId);
  }
  return getFirestore(app);
}

/**
 * Busca cabeçalho de forma case-insensitive
 */
function getHeader(headers: Record<string, string | undefined>, name: string): string | undefined {
  const target = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}

/**
 * Validação de segurança HMAC-SHA256 do corpo RAW da requisição da Yampi
 */
function verifyYampiSignature(rawBody: string, signature: string | undefined, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const computedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const expectedBuffer = Buffer.from(computedHmac, 'utf8');
    const providedBuffer = Buffer.from(signature.trim(), 'utf8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch (err) {
    console.error('Erro na validação timingSafeEqual da assinatura:', err);
    return false;
  }
}

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // 1. Validar método HTTP (somente POST permitido)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método não permitido. Utilize POST.' }),
    };
  }

  // 2. Obter segredo da variável de ambiente
  const webhookSecret = process.env.YAMPI_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('YAMPI_WEBHOOK_SECRET não configurado no ambiente.');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erro de configuração do servidor.' }),
    };
  }

  // 3. Obter corpo RAW antes de qualquer transformação
  const rawBody =
    event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body || '';

  const signature = getHeader(event.headers, 'X-Yampi-Hmac-SHA256');

  // 4. Validar assinatura HMAC-SHA256
  const isValid = verifyYampiSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.warn('Assinatura Yampi inválida ou ausente.');
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Assinatura inválida (X-Yampi-Hmac-SHA256).' }),
    };
  }

  // 5. Parsear payload JSON
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Payload inválido. Não foi possível interpretar o JSON.' }),
    };
  }

  // 6. Verificar evento esperado: order.paid
  const eventName = payload?.event;
  if (eventName !== 'order.paid') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Evento '${eventName}' ignorado com sucesso. Apenas 'order.paid' libera acessos.`,
      }),
    };
  }

  // 7. Extrair e normalizar e-mail do comprador
  const customerEmail = payload?.resource?.customer?.data?.email;
  if (!customerEmail || typeof customerEmail !== 'string') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'E-mail do comprador não encontrado em resource.customer.data.email.',
      }),
    };
  }

  const normalizedEmail = customerEmail.trim().toLowerCase();
  const orderId = String(payload?.resource?.id || payload?.resource?.number || 'desconhecido');

  // 8. Obter todos os itens do pedido
  const items = payload?.resource?.items?.data;
  if (!Array.isArray(items) || items.length === 0) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Lista de itens não encontrada em resource.items.data.',
      }),
    };
  }

  // 9. Mapear SKUs para moduleIds oficiais (suporta produto principal + order bumps)
  const modulesToGrant = new Map<string, { sku: string; moduleId: string }>();

  for (const item of items) {
    const rawSku = (item.item_sku || item.sku?.data?.sku || '').toString().trim().toUpperCase();
    if (!rawSku) continue;

    const moduleId = SKU_TO_MODULE_MAP[rawSku];
    if (moduleId) {
      modulesToGrant.set(moduleId, { sku: rawSku, moduleId });
    }
  }

  if (modulesToGrant.size === 0) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Pedido aprovado processado, mas nenhum dos SKUs pertence aos módulos mapeados.',
        orderId,
        email: normalizedEmail,
      }),
    };
  }

  // 10. Gravar no Firestore de forma idempotente
  try {
    const db = getAdminDb();

    // Tentar localizar userId caso o usuário já tenha conta criada no Firebase Auth
    let existingUserId: string | null = null;
    try {
      const userRecord = await getAuth(getApp()).getUserByEmail(normalizedEmail);
      existingUserId = userRecord.uid;
    } catch {
      // Usuário ainda não possui conta no Firebase Auth (fluxo natural de nova compra)
      existingUserId = null;
    }

    const grantedModules: string[] = [];

    for (const { sku, moduleId } of modulesToGrant.values()) {
      // ID determinístico garante idempotência: mesmo e-mail + mesmo módulo nunca duplica
      const safeEmail = normalizedEmail.replace(/\//g, '_');
      const docId = `${safeEmail}_${moduleId}`;
      const docRef = db.collection('user_access').doc(docId);

      const docSnap = await docRef.get();
      const now = FieldValue.serverTimestamp();

      if (!docSnap.exists) {
        await docRef.set({
          email: normalizedEmail,
          moduleId,
          active: true,
          sku,
          orderId,
          source: 'yampi',
          createdAt: now,
          updatedAt: now,
          ...(existingUserId ? { userId: existingUserId } : { userId: null }),
        });
      } else {
        const existingData = docSnap.data() || {};
        await docRef.set(
          {
            email: normalizedEmail,
            moduleId,
            active: true,
            sku,
            orderId,
            source: 'yampi',
            createdAt: existingData.createdAt || now,
            updatedAt: now,
            userId: existingUserId || existingData.userId || null,
          },
          { merge: true }
        );
      }

      grantedModules.push(moduleId);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Acessos liberados com sucesso.',
        email: normalizedEmail,
        orderId,
        modules: grantedModules,
      }),
    };
  } catch (err: any) {
    console.error('Erro ao gravar acessos no Firestore:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Erro interno ao processar a liberação no Firestore.',
      }),
    };
  }
};
