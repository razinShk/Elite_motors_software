import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    salesRevenue: number;
    servicesRevenue: number;
  }>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            `₹${Number(value).toLocaleString()}`, 
            name === 'revenue' ? 'Total Revenue' : 
            name === 'salesRevenue' ? 'Parts Sales' : 'Services'
          ]} 
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          strokeWidth={2} 
          name="Total Revenue" 
        />
        <Line 
          type="monotone" 
          dataKey="salesRevenue" 
          stroke="#82ca9d" 
          strokeWidth={2} 
          name="Parts Sales" 
        />
        <Line 
          type="monotone" 
          dataKey="servicesRevenue" 
          stroke="#ffc658" 
          strokeWidth={2} 
          name="Services" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
