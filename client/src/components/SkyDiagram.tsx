import type { HilalResult } from "@/lib/astronomy";

interface SkyDiagramProps {
  result: HilalResult;
  compact?: boolean;
}

/**
 * SVG sky diagram showing sun/moon positions relative to the horizon.
 * Altitude maps to Y position, azimuth difference maps to X offset.
 * Uses a fixed 400x240 viewBox — CSS `w-full h-auto` handles responsive scaling.
 */
export function SkyDiagram({ result, compact }: SkyDiagramProps) {
  const width = 400;
  const height = 240;
  const horizonY = height * 0.7;
  const centerX = width / 2;

  // Map altitude to Y: 0° at horizon, positive goes up
  const altToY = (alt: number) => {
    const maxAlt = 45; // max visible altitude range
    const clampedAlt = Math.max(-15, Math.min(maxAlt, alt));
    const aboveHorizonHeight = horizonY - 20;
    return horizonY - (clampedAlt / maxAlt) * aboveHorizonHeight;
  };

  // Moon position relative to sun, using azimuth difference
  const azDiff = result.moonAzimuth - result.sunAzimuth;
  const normalizedAzDiff = Math.max(-60, Math.min(60, azDiff));
  const moonXOffset = (normalizedAzDiff / 60) * (width * 0.35);

  const sunX = centerX;
  const sunY = altToY(result.sunAltitude);
  const moonX = centerX + moonXOffset;
  const moonY = altToY(result.moonAltitude);

  const isVisible = result.moonAltitude > 0;
  // compact flag scales down element sizes within the fixed 400x240 viewBox
  const sunR = compact ? 11 : 14;
  const moonR = compact ? 9 : 11;
  const fontSize = compact ? 9 : 11;
  const labelFontSize = compact ? 8 : 10;
  // Use unique gradient IDs to avoid conflicts when multiple diagrams render simultaneously
  const gradId = compact ? 'c' : 'f';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Sky diagram showing moon at ${result.moonAltitude.toFixed(1)}° altitude and sun at ${result.sunAltitude.toFixed(1)}° altitude`}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id={`sky-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(222, 30%, 18%)" />
          <stop offset="60%" stopColor="hsl(22, 60%, 35%)" />
          <stop offset="100%" stopColor="hsl(32, 70%, 50%)" />
        </linearGradient>
        <radialGradient id={`moonGlow-${gradId}`}>
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Sky background */}
      <rect width={width} height={horizonY} fill={`url(#sky-${gradId})`} rx="4" />

      {/* Ground */}
      <rect y={horizonY} width={width} height={height - horizonY} fill="hsl(30, 15%, 20%)" rx="0" />

      {/* Horizon line */}
      <line
        x1="0" y1={horizonY} x2={width} y2={horizonY}
        stroke="hsl(42, 60%, 50%)" strokeWidth="1.5" strokeDasharray="4,3"
      />
      <text x="6" y={horizonY - 4} fill="hsl(42, 60%, 60%)" fontSize={labelFontSize} fontFamily="sans-serif">
        Horizon (0°)
      </text>

      {/* Altitude grid lines */}
      {[10, 20, 30].map((alt) => (
        <g key={alt}>
          <line
            x1="0" y1={altToY(alt)} x2={width} y2={altToY(alt)}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2,4"
          />
          <text
            x={width - 4} y={altToY(alt) - 2}
            fill="rgba(255,255,255,0.25)" fontSize={labelFontSize - 2}
            fontFamily="sans-serif" textAnchor="end"
          >
            {alt}°
          </text>
        </g>
      ))}

      {/* Elongation arc between sun and moon */}
      {result.elongation > 0.5 && (
        <g>
          <line
            x1={sunX} y1={sunY} x2={moonX} y2={moonY}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3"
          />
          <text
            x={(sunX + moonX) / 2} y={(sunY + moonY) / 2 - 6}
            fill="rgba(255,255,255,0.6)" fontSize={labelFontSize}
            fontFamily="sans-serif" textAnchor="middle"
          >
            {result.elongation.toFixed(1)}°
          </text>
        </g>
      )}

      {/* Sun */}
      <g>
        <circle cx={sunX} cy={sunY} r={sunR} fill="hsl(42, 90%, 55%)" />
        <circle cx={sunX} cy={sunY} r={sunR + 8} fill="rgba(255,200,50,0.15)" />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const r1 = sunR + 2;
          const r2 = sunR + 9;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={sunX + Math.cos(rad) * r1}
              y1={sunY + Math.sin(rad) * r1}
              x2={sunX + Math.cos(rad) * r2}
              y2={sunY + Math.sin(rad) * r2}
              stroke="hsl(42, 90%, 55%)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
        <text
          x={sunX} y={sunY + sunR + 16}
          fill="hsl(42, 80%, 65%)" fontSize={fontSize}
          fontFamily="sans-serif" textAnchor="middle" fontWeight="600"
        >
          Sun ({result.sunAltitude.toFixed(1)}°)
        </text>
      </g>

      {/* Moon */}
      <g>
        {/* Moon glow */}
        <circle cx={moonX} cy={moonY} r={moonR + 13} fill={`url(#moonGlow-${gradId})`} />
        {/* Moon body - crescent shape */}
        <circle cx={moonX} cy={moonY} r={moonR} fill="hsl(45, 10%, 88%)" />
        <circle
          cx={moonX + (compact ? 3 : 4)} cy={moonY}
          r={moonR - 2}
          fill="hsl(222, 30%, 18%)"
          opacity={1 - result.illumination * 2}
        />
        <text
          x={moonX} y={moonY + moonR + 13}
          fill={isVisible ? "hsl(162, 60%, 65%)" : "hsl(0, 60%, 65%)"}
          fontSize={fontSize} fontFamily="sans-serif" textAnchor="middle" fontWeight="600"
        >
          Moon ({result.moonAltitude.toFixed(1)}°)
        </text>
      </g>

      {/* Alt line from horizon to moon */}
      {result.moonAltitude > 0.5 && (
        <g>
          <line
            x1={moonX} y1={horizonY} x2={moonX} y2={moonY}
            stroke="rgba(100,220,180,0.3)" strokeWidth="1" strokeDasharray="2,2"
          />
        </g>
      )}
    </svg>
  );
}
