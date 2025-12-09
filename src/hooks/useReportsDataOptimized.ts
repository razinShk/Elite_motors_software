import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDatabase } from '@/contexts/DatabaseContext';

// Optimized reports data hook with fewer queries and better caching
export const useReportsDataOptimized = (selectedYear?: string) => {
  const year = selectedYear ? parseInt(selectedYear) : new Date().getFullYear();
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['reports_data_optimized', year, getTableName('sales')],
    queryFn: async () => {
      const now = new Date();
      const isCurrentYear = year === now.getFullYear();

      // For current year, show current month vs last month
      // For other years, show full year data
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);

      let currentMonthStart, lastMonthStart, lastMonthEnd;

      if (isCurrentYear) {
        currentMonthStart = new Date(year, now.getMonth(), 1);
        lastMonthStart = new Date(year, now.getMonth() - 1, 1);
        lastMonthEnd = new Date(year, now.getMonth(), 0);
      } else {
        // For other years, compare with previous year
        currentMonthStart = yearStart;
        lastMonthStart = new Date(year - 1, 0, 1);
        lastMonthEnd = new Date(year - 1, 11, 31);
      }

      // Single query to get all sales data for the year
      const { data: salesData } = await supabase
        .from(getTableName('sales'))
        .select('total_amount, sale_date')
        .gte('sale_date', yearStart.toISOString().split('T')[0])
        .lte('sale_date', yearEnd.toISOString().split('T')[0]);

      // Single query to get all services data for the year
      const services = getTableName('services');
      const service_types = getTableName('service_types');

      const { data: servicesData } = await supabase
        .from(services)
        .select(`total_cost, service_date, service_type_id, service_types:${service_types}(name)`)
        .gte('service_date', yearStart.toISOString().split('T')[0])
        .lte('service_date', yearEnd.toISOString().split('T')[0]);

      // Single query to get all parts data
      const { data: partsData } = await supabase
        .from(getTableName('spare_parts'))
        .select('part_name, quantity_in_stock, reorder_threshold')
        .lte('quantity_in_stock', 50);

      // Single query to get customer count
      const { data: customersData } = await supabase
        .from(getTableName('customers'))
        .select('id, created_at');

      // Process data in memory (much faster than multiple DB queries)
      const currentSales = salesData?.filter(sale =>
        new Date(sale.sale_date) >= currentMonthStart
      ) || [];

      const lastMonthSales = salesData?.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate >= lastMonthStart && saleDate <= lastMonthEnd;
      }) || [];

      const currentServices = servicesData?.filter(service =>
        new Date(service.service_date) >= currentMonthStart
      ) || [];

      const lastMonthServices = servicesData?.filter(service => {
        const serviceDate = new Date(service.service_date);
        return serviceDate >= lastMonthStart && serviceDate <= lastMonthEnd;
      }) || [];

      // Calculate totals
      const currentSalesTotal = currentSales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
      const lastMonthSalesTotal = lastMonthSales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
      const currentServicesTotal = currentServices.reduce((sum, service) => sum + Number(service.total_cost), 0);
      const lastMonthServicesTotal = lastMonthServices.reduce((sum, service) => sum + Number(service.total_cost), 0);

      const currentRevenue = currentSalesTotal + currentServicesTotal;
      const lastMonthRevenue = lastMonthSalesTotal + lastMonthServicesTotal;

      // Calculate percentage changes
      const revenueChange = lastMonthRevenue > 0 ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
      const servicesChange = lastMonthServices.length > 0 ?
        ((currentServices.length - lastMonthServices.length) / lastMonthServices.length) * 100 : 0;

      // Get active customers
      const activeCustomers = customersData?.length || 0;
      const lastMonthCustomers = customersData?.filter(customer => {
        const createdDate = new Date(customer.created_at);
        return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
      }).length || 0;
      const customersChange = lastMonthCustomers > 0 ? ((activeCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

      // Service types distribution (from current services)
      const serviceTypeCounts: { [key: string]: number } = {};
      currentServices.forEach(service => {
        const typeName = (service.service_types as any)?.name || 'Unknown';
        serviceTypeCounts[typeName] = (serviceTypeCounts[typeName] || 0) + 1;
      });

      const serviceTypeData = Object.entries(serviceTypeCounts).map(([name, count]) => ({
        type: name,
        count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }));

      // Low stock alerts
      const lowStockItems = partsData?.filter(part =>
        Number(part.quantity_in_stock) <= Number(part.reorder_threshold)
      ).map(part => ({
        name: part.part_name,
        current: Number(part.quantity_in_stock),
        threshold: Number(part.reorder_threshold),
        status: Number(part.quantity_in_stock) <= 0 ? 'critical' :
          Number(part.quantity_in_stock) <= Number(part.reorder_threshold) / 2 ? 'critical' : 'low'
      })) || [];

      return {
        totalRevenue: currentRevenue,
        revenueChange,
        servicesCompleted: currentServices.length,
        servicesChange,
        activeCustomers,
        customersChange,
        serviceTypeData,
        lowStockItems,
        // Simplified data for charts (can be loaded separately if needed)
        hasData: true
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Separate hook for chart data (lazy loaded)
export const useChartData = (selectedYear?: string) => {
  const year = selectedYear ? parseInt(selectedYear) : new Date().getFullYear();
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['chart_data', year, getTableName('sales')],
    queryFn: async () => {
      const now = new Date();
      const revenueData = [];

      // Get monthly data for the selected year
      const isCurrentYear = year === now.getFullYear();
      const monthsToShow = isCurrentYear ? now.getMonth() + 1 : 12; // Show all months for past years, current month for current year

      for (let i = 0; i < monthsToShow; i++) {
        const monthStart = new Date(year, i, 1);
        const monthEnd = new Date(year, i + 1, 0);

        const { data: monthSales } = await supabase
          .from(getTableName('sales'))
          .select('total_amount')
          .gte('sale_date', monthStart.toISOString().split('T')[0])
          .lte('sale_date', monthEnd.toISOString().split('T')[0]);

        const { data: monthServices } = await supabase
          .from(getTableName('services'))
          .select('total_cost')
          .gte('service_date', monthStart.toISOString().split('T')[0])
          .lte('service_date', monthEnd.toISOString().split('T')[0]);

        const monthSalesTotal = monthSales?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
        const monthServicesTotal = monthServices?.reduce((sum, service) => sum + Number(service.total_cost), 0) || 0;

        revenueData.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          revenue: monthSalesTotal + monthServicesTotal,
          salesRevenue: monthSalesTotal,
          servicesRevenue: monthServicesTotal
        });
      }

      return { revenueData };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Separate hook for top customers (lazy loaded)
export const useTopCustomersOptimized = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['top_customers_optimized', getTableName('services')],
    queryFn: async () => {
      const vehicles = getTableName('vehicles');
      const customers = getTableName('customers');

      const servicesTop = services;
      const { data: topCustomersData } = await supabase
        .from(servicesTop)
        .select(`
          vehicles:${vehicles}(customers:${customers}(id, name)),
          total_cost,
          service_date
        `)
        .order('total_cost', { ascending: false })
        .limit(50); // Reduced limit for faster query

      const customerRevenue: { [key: string]: { name: string; revenue: number; services: number; lastService: string } } = {};

      topCustomersData?.forEach(service => {
        const customer = (service.vehicles as any)?.customers;
        const customerId = customer?.id;
        const customerName = customer?.name || 'Unknown';

        if (customerId) {
          if (!customerRevenue[customerId]) {
            customerRevenue[customerId] = {
              name: customerName,
              revenue: 0,
              services: 0,
              lastService: service.service_date
            };
          }
          customerRevenue[customerId].revenue += Number(service.total_cost);
          customerRevenue[customerId].services += 1;
          if (service.service_date > customerRevenue[customerId].lastService) {
            customerRevenue[customerId].lastService = service.service_date;
          }
        }
      });

      return Object.values(customerRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(customer => ({
          name: customer.name,
          services: customer.services,
          totalSpent: customer.revenue,
          lastService: customer.lastService
        }));
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
