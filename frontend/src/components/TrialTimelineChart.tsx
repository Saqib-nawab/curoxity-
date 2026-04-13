'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const timelineData = [
  { phase: 'Study Start', months: 6, color: '#14b8a6' },
  { phase: 'Enrollment', months: 36, color: '#0d9488' },
  { phase: 'Treatment', months: 12, color: '#5eead4' },
  { phase: 'Follow-up', months: 12, color: '#99f6e4' },
  { phase: 'Completion', months: 6, color: '#ccfbf1' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-[12px] px-4 py-3 shadow-lg">
        <p className="font-noto-sans font-medium text-text-primary text-[14px] mb-1">
          {payload[0].payload.phase}
        </p>
        <p className="font-noto-sans text-text-secondary text-[13px]">
          Duration: <span className="font-medium text-[#14b8a6]">{payload[0].value} months</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarShape = (props: any) => {
  const { x, y, width, height } = props;
  const radius = Math.min(6, height / 2);
  return (
    <rect
      x={x}
      y={y}
      width={Math.max(width, 0)}
      height={height}
      rx={radius}
      ry={radius}
      fill={props.fill}
    />
  );
};

export default function TrialTimelineChart() {
  return (
    <div className="w-full">
      <div className="w-full min-w-0 h-[240px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={timelineData}
            layout="vertical"
            margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
            barCategoryGap="24%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
              tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Noto Sans' }}
              axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
              tickLine={{ stroke: 'rgba(0,0,0,0.08)' }}
              unit=""
            />
            <YAxis
              type="category"
              dataKey="phase"
              width={90}
              tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'Noto Sans' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(20,184,166,0.06)', radius: 6 }} />
            <Bar
              dataKey="months"
              shape={<CustomBarShape />}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {timelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="font-noto-sans font-normal leading-[16px] text-text-muted text-[12px] text-center mt-2">
        Study Duration: August 2014 – August 2020 (72 months)
      </p>
    </div>
  );
}
