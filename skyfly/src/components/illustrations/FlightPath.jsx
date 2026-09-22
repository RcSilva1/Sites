/**
 * Ilustração original em SVG: uma rota de voo pontilhada entre dois
 * aeroportos, no estilo dos mapas de rota exibidos em revistas de bordo.
 * Não reproduz nenhuma logomarca, obra ou material de terceiros.
 */
export default function FlightPath({ className }) {
  return (
    <svg viewBox="0 0 560 360" className={className} role="img" aria-label="Ilustração de rota de voo entre dois pontos">
      <defs>
        <radialGradient id="skyfly-glow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1d3a5f" />
          <stop offset="100%" stopColor="#0e1a2b" />
        </radialGradient>
      </defs>
      <rect width="560" height="360" rx="16" fill="url(#skyfly-glow)" />

      {/* Linhas de latitude sutis */}
      {[70, 140, 210, 280].map((y) => (
        <line key={y} x1="24" y1={y} x2="536" y2={y} stroke="#2c4059" strokeWidth="1" />
      ))}

      {/* Rota pontilhada */}
      <path
        d="M 80 250 Q 280 60 480 150"
        fill="none"
        stroke="#c89b3c"
        strokeWidth="2"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      {/* Origem */}
      <circle cx="80" cy="250" r="6" fill="#eef1f4" />
      <circle cx="80" cy="250" r="11" fill="none" stroke="#eef1f4" strokeWidth="1" opacity="0.5" />
      <text x="80" y="278" textAnchor="middle" fill="#9fb0c3" fontSize="13" fontFamily="IBM Plex Mono, monospace">
        GRU
      </text>

      {/* Destino */}
      <circle cx="480" cy="150" r="6" fill="#c89b3c" />
      <circle cx="480" cy="150" r="11" fill="none" stroke="#c89b3c" strokeWidth="1" opacity="0.5" />
      <text x="480" y="178" textAnchor="middle" fill="#c89b3c" fontSize="13" fontFamily="IBM Plex Mono, monospace">
        LIS
      </text>

      {/* Ícone simplificado de avião sobre a rota */}
      <g transform="translate(300,105) rotate(-18)">
        <path
          d="M0 0 L26 4 L36 0 L26 -4 Z M14 -2 L10 -14 L14 -14 L20 -2 Z M14 2 L10 14 L14 14 L20 2 Z"
          fill="#eef1f4"
        />
      </g>
    </svg>
  );
}
