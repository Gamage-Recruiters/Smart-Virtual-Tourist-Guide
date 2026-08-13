import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Customers', value: 1650, color: '#8B5CF6' },
//   { name: 'Agencies', value: 45, color: '#F87171' },
//   { name: 'Drivers', value: 320, color: '#2DD4BF' },
//   { name: 'Partners', value: 240, color: '#FBBF24' },
// ];
const COLORS = ["#8B5CF6", "#F87171", "#2DD4BF", "#FBBF24", "#60A5FA", "#34D399", "#F97316"];

// Custom function to show text inside pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Skip rendering label if the slice is too small
  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
      <tspan x={x} dy="-0.5em">{name}</tspan>
      <tspan x={x} dy="1.2em" fontWeight="bold">{value}</tspan>
    </text>
  );
};

const BookingPieChart = ({ data }) => {
  return (
    <div className="h-full w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="78%"
            dataKey="value"
          >
            {data.map((entry, index) => (
    <Cell key={index} fill={COLORS[index % COLORS.length]} />
))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingPieChart;
