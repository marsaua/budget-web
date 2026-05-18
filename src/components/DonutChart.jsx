import { CATEGORY_META } from "../constants";

const SIZE = 220;
const R = 80;
const CX = SIZE / 2;
const CY = SIZE / 2;
const STROKE = 26;
const ICON_ORBIT = R + STROKE / 2 + 26;

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const s = polarToXY(cx, cy, r, startAngle);
  const e = polarToXY(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function DonutChart({ transactions, summary }) {
  // Build segments from expense transactions grouped by category
  const expenseMap = {};
  for (const t of transactions) {
    if (t.kind !== "expense") continue;
    expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
  }

  const totalExpense = summary.expense || 0;
  const segments = Object.entries(expenseMap)
    .filter(([, v]) => v > 0)
    .map(([cat, amount]) => ({ cat, amount, pct: totalExpense > 0 ? amount / totalExpense : 0 }));

  // If no expenses, show a grey circle
  if (segments.length === 0) {
    segments.push({ cat: "other", amount: 0, pct: 1 });
  }

  let currentAngle = 0;
  const arcs = segments.map((seg) => {
    const sweep = seg.pct * 360;
    const start = currentAngle;
    const end = currentAngle + sweep;
    currentAngle = end;
    const midAngle = start + sweep / 2;
    const iconPos = polarToXY(CX, CY, ICON_ORBIT, midAngle);
    return { ...seg, start, end, midAngle, iconPos };
  });

  const balance = summary.balance ?? 0;
  const balanceColor = balance >= 0 ? "#5DC191" : "#F07070";

  return (
    <div className="donut-card card">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} style={{ overflow: "visible" }}>
        {arcs.map((arc, i) => {
          const meta = CATEGORY_META[arc.cat] || CATEGORY_META.other;
          return (
            <g key={i}>
              <path
                d={describeArc(CX, CY, R, arc.start, arc.end)}
                fill="none"
                stroke={meta.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
              {arc.pct > 0.04 && (
                <g>
                  <circle
                    cx={arc.iconPos.x}
                    cy={arc.iconPos.y}
                    r={16}
                    fill={meta.bg}
                  />
                  <text
                    x={arc.iconPos.x}
                    y={arc.iconPos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                  >
                    {meta.emoji}
                  </text>
                  <text
                    x={arc.iconPos.x}
                    y={arc.iconPos.y + 20}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#8FA89E"
                  >
                    {Math.round(arc.pct * 100)}%
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Centre text */}
        <text x={CX} y={CY - 10} textAnchor="middle" fontSize="11" fill="#8FA89E">
          expenses
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="20" fontWeight="600" fill="#2d3a35">
          {totalExpense.toLocaleString("uk-UA")} ₴
        </text>
        <text x={CX} y={CY + 28} textAnchor="middle" fontSize="11" fill={balanceColor} fontWeight="500">
          balance {balance >= 0 ? "+" : ""}{balance.toLocaleString("uk-UA")} ₴
        </text>
      </svg>
    </div>
  );
}
