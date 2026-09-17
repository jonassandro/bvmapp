import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WorkoutPlan } from '../types';

const LOCAL_STORAGE_KEY = 'base_visual_saved_workouts';

/**
 * Salva um treino no Firestore em users/{uid}/workouts/{workoutId}
 * Possui fallback transparente para localStorage.
 */
export async function saveWorkoutToFirestore(
  uid: string,
  workout: WorkoutPlan
): Promise<string> {
  const workoutId = workout.id || `workout_${Date.now()}`;

  // Se o usuário estiver autenticado no Firebase, salvar na subcoleção do Firestore
  if (uid && uid !== 'USR_VISITOR' && uid !== 'USR_CURRENT') {
    try {
      const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
      await setDoc(workoutRef, {
        ...workout,
        id: workoutId,
        updatedAt: serverTimestamp(),
        createdAt: workout.createdAt || new Date().toISOString(),
      });
      return workoutId;
    } catch (err) {
      console.warn('Falha ao salvar no Firestore, salvando localmente:', err);
    }
  }

  // Armazenamento em localStorage como garantia/fallback
  try {
    const localWorkouts = getLocalWorkouts();
    const existingIndex = localWorkouts.findIndex((w) => w.id === workoutId);
    const updatedWorkout = { ...workout, id: workoutId };

    if (existingIndex >= 0) {
      localWorkouts[existingIndex] = updatedWorkout;
    } else {
      localWorkouts.unshift(updatedWorkout);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localWorkouts));
  } catch (localErr) {
    console.error('Erro ao salvar localmente:', localErr);
  }

  return workoutId;
}

/**
 * Carrega todos os treinos salvos do usuário (Firestore + LocalStorage)
 */
export async function getUserWorkouts(uid: string): Promise<WorkoutPlan[]> {
  const workouts: WorkoutPlan[] = [];

  if (uid && uid !== 'USR_VISITOR' && uid !== 'USR_CURRENT') {
    try {
      const workoutsRef = collection(db, 'users', uid, 'workouts');
      const q = query(workoutsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      snapshot.forEach((docSnap) => {
        workouts.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });

      if (workouts.length > 0) {
        return workouts;
      }
    } catch (err) {
      console.warn('Aviso ao consultar Firestore para treinos:', err);
    }
  }

  // Se não houver no Firestore ou offline, busca do localStorage
  return getLocalWorkouts();
}

/**
 * Exclui um treino no Firestore e no localStorage
 */
export async function deleteWorkoutFromFirestore(
  uid: string,
  workoutId: string
): Promise<void> {
  if (uid && uid !== 'USR_VISITOR' && uid !== 'USR_CURRENT') {
    try {
      const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
      await deleteDoc(workoutRef);
    } catch (err) {
      console.warn('Erro ao deletar no Firestore:', err);
    }
  }

  // Remove também do localStorage
  try {
    const local = getLocalWorkouts().filter((w) => w.id !== workoutId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
  } catch (err) {
    console.error('Erro ao deletar localmente:', err);
  }
}

/**
 * Renomeia o título de um treino
 */
export async function renameWorkoutInFirestore(
  uid: string,
  workoutId: string,
  newTitle: string
): Promise<void> {
  if (uid && uid !== 'USR_VISITOR' && uid !== 'USR_CURRENT') {
    try {
      const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        title: newTitle,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Erro ao renomear no Firestore:', err);
    }
  }

  // Atualiza no localStorage
  try {
    const local = getLocalWorkouts().map((w) =>
      w.id === workoutId ? { ...w, title: newTitle, updatedAt: new Date().toISOString() } : w
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
  } catch (err) {
    console.error('Erro ao renomear localmente:', err);
  }
}

function getLocalWorkouts(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
