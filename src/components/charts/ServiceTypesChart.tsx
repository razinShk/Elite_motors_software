import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ServiceTypesChartProps {
  data: Array<{
    type: string;
    count: number;
    color: string;
  }>;
}

const ServiceTypesChart = ({ data }: ServiceTypesChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ type, count }) => `${type}: ${count}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ServiceTypesChart;
