'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const demographicsData = [
  { name: 'Age 3-10', value: 3, color: '#14b8a6' },
  { name: 'Age 11-15', value: 2, color: '#93c5fd' },
  { name: 'Age 16-21', value: 2, color: '#5b88da' },
];

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, outerRadius, name, value,
}: any) => {
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-outfit"
      fontSize={13}
      fontWeight={700}
      fill={
        name === 'Age 3-10' ? '#14b8a6' :
          name === 'Age 11-15' ? '#93c5fd' : '#5b88da'
      }
    >
      {`${name}: ${value}`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = demographicsData.reduce((sum, d) => sum + d.value, 0);
    const pct = ((payload[0].value / total) * 100).toFixed(0);
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-[12px] px-4 py-3 shadow-lg">
        <p className="font-noto-sans font-medium text-text-primary text-[14px] mb-1">
          {payload[0].name}
        </p>
        <p className="font-noto-sans text-text-secondary text-[13px]">
          <span className="font-medium" style={{ color: payload[0].payload.color }}>
            {payload[0].value} participants
          </span>
          {' '}({pct}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PopulationDemographicsChart() {
  return (
    <div className="w-full">
      <div className="w-full min-w-0 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={demographicsData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
              animationDuration={800}
              animationEasing="ease-out"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={2}
            >
              {demographicsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-[6px] items-center text-center mt-2">
        <p className="font-noto-sans font-medium leading-[20px] text-text-secondary text-[14px]">
          Total Sample Size: <span className="font-outfit font-bold">7 participants</span>
        </p>
        <p className="font-noto-sans font-medium leading-[20px] text-text-muted text-[12px]">
          Age Range: 3–21 years • All Genders
        </p>
      </div>
    </div>
  );
}
