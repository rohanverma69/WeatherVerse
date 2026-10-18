import React, { useState, useRef } from 'react';
import { HourlyForecastItem, TemperatureUnit } from '../../types/weather';
import { formatTemp, formatLocalTime, formatTempNumber } from '../../utils/units';
import { TrendingUp, Droplets, Thermometer } from 'lucide-react';

interface TemperatureChartProps {
  hourly: HourlyForecastItem[];
  timezone: string;
  tempUnit: TemperatureUnit;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  hourly,
  timezone,
  tempUnit,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Take the first 16 to 24 hours
  const data = hourly.slice(0, 20);
  if (data.length < 2) return null;

  // Chart Dimensions
  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingTop = 35;
  const paddingBottom = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find min and max temperature
  const temps = data.map((d) => formatTempNumber(d.temperature, tempUnit));
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = maxTemp - minTemp || 1;

  // Calculate coordinates for temperature curve
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const tempVal = formatTempNumber(d.temperature, tempUnit);
    const y = paddingTop + chartHeight - ((tempVal - minTemp) / tempRange) * chartHeight;
    return { x, y, data: d, tempVal };
  });

  // Generate smooth cubic Bézier curve path
  const generateBezierPath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) / 2;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) / 2;
      const cy2 = p1.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = generateBezierPath();
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  // Handle mouse move to find closest point
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoverIndex(closestIdx);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[0];

  return (
    <div className="w-full relative rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 shadow-glass">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>24-Hour Temperature & Rain Trend</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time spline curve telemetry with precipitation probability
          </p>
        </div>

        {/* Active hovered point info chip */}
        {activePoint && (
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-mono">
            <div className="text-slate-400">
              Time:{' '}
              <span className="text-white font-bold">
                {formatLocalTime(activePoint.data.timestamp, timezone, { hour: 'numeric', hour12: true })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-cyan-300 font-bold">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTemp(activePoint.data.temperature, tempUnit)}</span>
            </div>
            <div className="flex items-center gap-1 text-sky-400 font-bold">
              <Droplets className="w-3.5 h-3.5" />
              <span>{activePoint.data.precipitationProbability}%</span>
            </div>
          </div>
        )}
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Temperature Area Gradient */}
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.0" />
            </linearGradient>

            {/* Precipitation Bar Gradient */}
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Precipitation Probability Bars (Background) */}
          {points.map((p, idx) => {
            const prob = p.data.precipitationProbability;
            const barH = (prob / 100) * (chartHeight * 0.45);
            const barY = height - paddingBottom - barH;
            const barW = Math.max(6, (chartWidth / points.length) * 0.45);
            return (
              <rect
                key={`rain-${idx}`}
                x={p.x - barW / 2}
                y={barY}
                width={barW}
                height={barH}
                fill="url(#rainGradient)"
                rx={3}
                opacity={0.65}
              />
            );
          })}

          {/* Area Fill under spline */}
          <path d={areaPath} fill="url(#tempGradient)" />

          {/* Temperature Spline Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#00F2FE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <g key={idx}>
                {/* Outer Glow on hover */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={8}
                    fill="none"
                    stroke="#00F2FE"
                    strokeWidth="2"
                    opacity={0.8}
                    className="animate-ping"
                  />
                )}
                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : 3}
                  fill={isHovered ? '#FFFFFF' : '#00F2FE'}
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Temperature label above point */}
                {(idx % 2 === 0 || isHovered) && (
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={isHovered ? '700' : '500'}
                  >
                    {p.tempVal}°
                  </text>
                )}

                {/* Time label below chart */}
                {idx % 3 === 0 && (
                  <text
                    x={p.x}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {formatLocalTime(p.data.timestamp, timezone, { hour: 'numeric', hour12: true })}
                  </text>
                )}
              </g>
            );
          })}

          {/* Vertical Crosshair line when hovered */}
          {hoverIndex !== null && (
            <line
              x1={points[hoverIndex].x}
              y1={paddingTop}
              x2={points[hoverIndex].x}
              y2={height - paddingBottom}
              stroke="#00F2FE"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity={0.8}
            />
          )}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-end gap-6 mt-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#00f2fe]" />
          <span>Temperature Curve</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-sky-400/70 rounded-sm" />
          <span>Rain Probability Bar</span>
        </div>
      </div>
    </div>
  );
};
