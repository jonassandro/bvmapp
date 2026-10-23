import React from 'react';

interface MuscleIllustrationProps {
  category: string;
  isActive?: boolean;
  className?: string;
  size?: number;
}

export const MuscleIllustration: React.FC<MuscleIllustrationProps> = ({
  category,
  isActive = false,
  className = 'w-10 h-10',
  size = 40,
}) => {
  const normCat = (category || '').toLowerCase();

  // Color scheme:
  // Base body contour: dark charcoal/bronze
  const baseFill = '#221916';
  const baseStroke = '#3D2C28';
  // Highlighted muscle colors:
  const highlightFill = isActive ? '#FF2222' : '#CC0000';
  const highlightGlow = isActive ? '#FF5555' : '#E62E2E';
  const fiberStroke = isActive ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';

  switch (normCat) {
    case 'peito':
      // Front torso focusing on Pectoralis Major & Minor
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="chestGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Head & Neck silhouette */}
          <path d="M44 8 C44 5 56 5 56 8 L54 18 C58 20 62 21 66 22 L34 22 C38 21 42 20 46 18 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Trapezius & Shoulders outline */}
          <path d="M34 22 L22 28 L14 42 L20 46 L26 36 L26 78 L34 88 L66 88 L74 78 L74 36 L80 46 L86 42 L78 28 L66 22 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1.2" />
          {/* Ribs & Abs contour (background) */}
          <path d="M38 58 L50 60 L62 58 L60 84 L50 86 L40 84 Z" fill="#18110F" stroke={baseStroke} strokeWidth="0.8" />
          
          {/* Left Pectoral */}
          <path
            d="M50 30 C45 28 35 28 27 34 C25 43 27 50 35 53 C42 55 48 52 50 48 Z"
            fill="url(#chestGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#chestGlow)"
          />
          {/* Left pectoral inner striations */}
          <path d="M32 38 C38 40 45 42 49 39" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M33 45 C39 47 45 47 48 44" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Right Pectoral */}
          <path
            d="M50 30 C55 28 65 28 73 34 C75 43 73 50 65 53 C58 55 52 52 50 48 Z"
            fill="url(#chestGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#chestGlow)"
          />
          {/* Right pectoral inner striations */}
          <path d="M68 38 C62 40 55 42 51 39" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M67 45 C61 47 55 47 52 44" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Sternal line / Cleavage */}
          <line x1="50" y1="28" x2="50" y2="52" stroke="#100A09" strokeWidth="1.5" />
        </svg>
      );

    case 'costas':
      // Posterior view of back: Latissimus Dorsi, Trapezius, Rhomboids
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="backGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="backGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Head & Neck silhouette back */}
          <path d="M43 7 C43 4 57 4 57 7 L55 18 L45 18 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Arms silhouette */}
          <path d="M25 28 L14 44 L20 48 L28 35 L28 76 L36 86 L64 86 L72 76 L72 35 L80 48 L86 44 L75 28 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Trapezius (Diamond shape) */}
          <path
            d="M50 18 L64 25 L58 42 L50 48 L42 42 L36 25 Z"
            fill="url(#backGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#backGlow)"
          />
          {/* Latissimus Dorsi Left (V-Taper) */}
          <path
            d="M42 42 L26 34 C24 45 28 62 37 68 C40 68 45 64 47 56 L44 45 Z"
            fill="url(#backGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#backGlow)"
          />
          {/* Latissimus Dorsi Right */}
          <path
            d="M58 42 L74 34 C76 45 72 62 63 68 C60 68 55 64 53 56 L56 45 Z"
            fill="url(#backGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#backGlow)"
          />
          {/* Spine indicator */}
          <line x1="50" y1="20" x2="50" y2="76" stroke="#0E0807" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Lower back / lumbar */}
          <path d="M43 68 L50 62 L57 68 L55 78 L50 82 L45 78 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
        </svg>
      );

    case 'ombros':
      // Upper body showing Deltoid heads (anterior, lateral, posterior)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="deltoidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="deltoidGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Head & Neck */}
          <path d="M44 8 C44 5 56 5 56 8 L54 20 L46 20 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Central Torso & Chest silhouette */}
          <path d="M36 24 C40 22 50 22 64 24 L68 48 C64 54 50 56 32 48 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          <path d="M38 52 L62 52 L60 84 L40 84 Z" fill="#1A1210" stroke={baseStroke} strokeWidth="1" />
          {/* Arms below shoulder */}
          <path d="M22 52 L26 78 L18 78 L14 52 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          <path d="M78 52 L74 78 L82 78 L86 52 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Left Deltoid (Boulder shoulder) */}
          <path
            d="M34 23 C26 25 18 30 14 38 C12 45 16 52 23 53 C28 53 32 46 34 38 Z"
            fill="url(#deltoidGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#deltoidGlow)"
          />
          {/* Left deltoid striations (anterior / lateral separation) */}
          <path d="M24 28 C22 36 21 44 23 49" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M29 32 C27 38 27 44 28 47" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Right Deltoid */}
          <path
            d="M66 23 C74 25 82 30 86 38 C88 45 84 52 77 53 C72 53 68 46 66 38 Z"
            fill="url(#deltoidGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#deltoidGlow)"
          />
          {/* Right deltoid striations */}
          <path d="M76 28 C78 36 79 44 77 49" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M71 32 C73 38 73 44 72 47" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Clavicle bones */}
          <path d="M36 24 C43 27 50 27 50 27 C50 27 57 27 64 24" stroke="#44322C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'biceps':
      // Arm flexed showing peak Biceps Brachii
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="bicepsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="bicepsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Shoulder anchor */}
          <path d="M12 28 C16 20 28 18 36 22 L38 34 C30 36 20 38 14 36 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Triceps back of arm */}
          <path d="M16 36 C18 48 24 58 32 66 L28 72 C18 64 12 50 12 36 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Forearm & Fist */}
          <path d="M32 66 L52 64 L74 46 L78 50 L60 74 L42 78 L32 68 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          <circle cx="80" cy="46" r="8" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Biceps Peak (contracted muscle) */}
          <path
            d="M34 26 C42 22 56 24 64 36 C66 45 62 55 52 60 C42 62 36 54 34 44 Z"
            fill="url(#bicepsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#bicepsGlow)"
          />
          {/* Peak muscle split (long & short head) */}
          <path d="M44 32 C50 36 55 42 56 50" stroke={fiberStroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M38 38 C44 42 48 48 48 54" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          {/* Vascularity subtle vein on biceps */}
          <path d="M42 27 C46 32 48 40 46 48" stroke="rgba(255, 120, 120, 0.5)" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      );

    case 'triceps':
      // Posterior arm angle highlighting all 3 heads of Triceps
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="tricepsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="tricepsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Shoulder cap */}
          <path d="M68 14 C78 16 84 26 82 36 L70 38 C70 28 66 20 62 16 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Front arm/biceps outline (relaxed) */}
          <path d="M72 38 C70 48 66 58 60 64 L52 62 C58 54 62 44 64 36 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Forearm extending down */}
          <path d="M46 72 L36 90 L26 86 L36 68 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Horseshoe Triceps Horseshoe Body */}
          <path
            d="M44 26 C52 24 64 28 66 38 C68 50 62 64 48 70 C40 68 34 58 36 44 C38 34 40 28 44 26 Z"
            fill="url(#tricepsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#tricepsGlow)"
          />
          {/* Horseshoe tendon & lateral head striation */}
          <path d="M48 38 C53 44 54 52 50 62" stroke={fiberStroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M41 44 C44 49 45 56 42 62" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />
          {/* Olecranon (elbow point) */}
          <circle cx="43" cy="71" r="3" fill="#3A2824" />
        </svg>
      );

    case 'pernas':
      // Lower body: Quadriceps, Hamstrings & Calves
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="legsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="legsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Waist / Hip belt */}
          <path d="M30 10 L70 10 L68 18 L50 20 L32 18 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Left Thigh (Quadriceps sweep) */}
          <path
            d="M32 18 C26 26 22 40 28 54 C32 60 40 60 44 56 C46 44 46 28 42 20 Z"
            fill="url(#legsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#legsGlow)"
          />
          {/* Left Quad Teardrop (Vastus Medialis & Lateralis) */}
          <path d="M31 32 C33 42 37 50 40 53" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Right Thigh (Quadriceps sweep) */}
          <path
            d="M68 18 C74 26 78 40 72 54 C68 60 60 60 56 56 C54 44 54 28 58 20 Z"
            fill="url(#legsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#legsGlow)"
          />
          {/* Right Quad Teardrop */}
          <path d="M69 32 C67 42 63 50 60 53" stroke={fiberStroke} strokeWidth="1" strokeLinecap="round" />

          {/* Knees */}
          <ellipse cx="36" cy="62" rx="4" ry="3" fill="#2E201C" stroke={baseStroke} strokeWidth="1" />
          <ellipse cx="64" cy="62" rx="4" ry="3" fill="#2E201C" stroke={baseStroke} strokeWidth="1" />

          {/* Left Calf (Gastrocnemius diamond) */}
          <path
            d="M33 65 C26 72 26 80 32 88 L40 88 C43 80 41 72 38 65 Z"
            fill="url(#legsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#legsGlow)"
          />
          {/* Right Calf */}
          <path
            d="M67 65 C74 72 74 80 68 88 L60 88 C57 80 59 72 62 65 Z"
            fill="url(#legsGrad)"
            stroke={highlightGlow}
            strokeWidth="1.2"
            filter="url(#legsGlow)"
          />
          {/* Feet */}
          <path d="M28 88 L40 88 L42 94 L26 94 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          <path d="M72 88 L60 88 L58 94 L74 94 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
        </svg>
      );

    case 'core':
      // Rectus Abdominis (6-pack) & Obliques
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="absGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="absGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={highlightFill} floodOpacity={isActive ? "0.7" : "0.3"} />
            </filter>
          </defs>
          {/* Upper chest outline */}
          <path d="M26 14 C36 10 64 10 74 14 L76 28 C64 32 36 32 24 28 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />
          {/* Pelvis base */}
          <path d="M30 84 L70 84 L64 94 L36 94 Z" fill={baseFill} stroke={baseStroke} strokeWidth="1" />

          {/* Left Obliques */}
          <path
            d="M26 34 C24 46 26 62 33 72 L36 68 C32 58 31 46 34 36 Z"
            fill="url(#absGrad)"
            stroke={highlightGlow}
            strokeWidth="1"
            filter="url(#absGlow)"
          />
          {/* Right Obliques */}
          <path
            d="M74 34 C76 46 74 62 67 72 L64 68 C68 58 69 46 66 36 Z"
            fill="url(#absGrad)"
            stroke={highlightGlow}
            strokeWidth="1"
            filter="url(#absGlow)"
          />

          {/* Top Pack Left */}
          <rect x="38" y="32" width="10" height="10" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />
          {/* Top Pack Right */}
          <rect x="52" y="32" width="10" height="10" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />

          {/* Mid Pack Left */}
          <rect x="38" y="46" width="10" height="11" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />
          {/* Mid Pack Right */}
          <rect x="52" y="46" width="10" height="11" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />

          {/* Lower Pack Left */}
          <rect x="39" y="61" width="9" height="12" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />
          {/* Lower Pack Right */}
          <rect x="52" y="61" width="9" height="12" rx="2.5" fill="url(#absGrad)" stroke={highlightGlow} strokeWidth="1" filter="url(#absGlow)" />

          {/* Linea Alba (Center line) */}
          <line x1="50" y1="30" x2="50" y2="76" stroke="#120A08" strokeWidth="2" />
        </svg>
      );

    case 'todos':
    default:
      // Full body athletic anatomical silhouette
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="fullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={highlightGlow} />
              <stop offset="100%" stopColor={highlightFill} />
            </linearGradient>
            <filter id="fullGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={highlightFill} floodOpacity={isActive ? "0.6" : "0.2"} />
            </filter>
          </defs>
          {/* Head */}
          <circle cx="50" cy="11" r="6" fill={isActive ? "url(#fullGrad)" : baseFill} stroke={isActive ? highlightGlow : baseStroke} strokeWidth="1" />
          {/* Upper Body / Torso & Shoulders */}
          <path
            d="M34 22 C38 20 44 20 50 20 C56 20 62 20 66 22 L76 32 L72 50 L64 48 L64 32 L58 36 L58 56 L62 70 L54 70 L50 60 L46 70 L38 70 L42 56 L42 36 L36 32 L36 48 L28 50 L24 32 Z"
            fill={isActive ? "url(#fullGrad)" : baseFill}
            stroke={isActive ? highlightGlow : baseStroke}
            strokeWidth="1.2"
            filter={isActive ? "url(#fullGlow)" : undefined}
          />
          {/* Left Leg */}
          <path
            d="M40 70 L38 88 L34 94 L42 94 L46 88 L46 70 Z"
            fill={isActive ? "url(#fullGrad)" : baseFill}
            stroke={isActive ? highlightGlow : baseStroke}
            strokeWidth="1"
          />
          {/* Right Leg */}
          <path
            d="M60 70 L62 88 L66 94 L58 94 L54 88 L54 70 Z"
            fill={isActive ? "url(#fullGrad)" : baseFill}
            stroke={isActive ? highlightGlow : baseStroke}
            strokeWidth="1"
          />
          {/* Chest lines when active or neutral */}
          <path d="M44 28 C47 30 50 30 50 30 C50 30 53 30 56 28" stroke={isActive ? "#FFFFFF" : "#553E37"} strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
  }
};
