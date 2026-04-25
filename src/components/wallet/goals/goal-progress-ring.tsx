"use client";

/**
 * GoalProgressRing
 *
 * Circular SVG progress ring component.
 * - Displays the completion percentage in the center
 * - Ring color: green when on track, red when behind schedule
 *   (on-track = elapsed time ratio ≤ percent / 100)
 */

interface GoalProgressRingProps {
  /** 0–100 completion percentage */
  percent: number;
  /** ISO string start date for on-track calculation */
  startDate: string;
  /** ISO string end date for on-track calculation */
  endDate: string;
  /** Circle diameter in px (default 80) */
  size?: number;
  /** Stroke width in px (default 8) */
  strokeWidth?: number;
}

export default function GoalProgressRing({
  percent,
  startDate,
  endDate,
  size = 80,
  strokeWidth = 8,
}: GoalProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;

  // Determine on-track status
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start;
  const elapsed = now - start;
  const elapsedRatio = totalDuration > 0 ? Math.min(1, elapsed / totalDuration) : 0;

  // Goal is on track when current progress meets or exceeds time elapsed
  const isOnTrack = clampedPercent / 100 >= elapsedRatio;
  const trackColor = clampedPercent >= 100
    ? "#10B981" // completed — always green
    : isOnTrack
      ? "#10B981" // green: progressing fast enough
      : "#EF4444"; // red: falling behind

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-label={`Progress: ${clampedPercent}%`}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
        />
      </svg>
      {/* Center label */}
      <span
        className="absolute text-xs font-bold"
        style={{ color: trackColor }}
      >
        {clampedPercent.toFixed(0)}%
      </span>
    </div>
  );
}
