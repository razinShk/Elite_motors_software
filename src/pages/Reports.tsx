import { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReportsDataOptimized, useChartData, useTopCustomersOptimized } from '@/hooks/useReportsDataOptimized';

// Lazy load heavy chart components
const RevenueChart = lazy(() => import('@/components/charts/RevenueChart'));
const ServiceTypesChart = lazy(() => import('@/components/charts/ServiceTypesChart'));

const Reports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showCharts, setShowCharts] = useState(false);

  // Load essential data first (fast)
  const { data: reportsData, isLoading: reportsLoading } = useReportsDataOptimized(selectedYear);
  
  // Load chart data only when needed (lazy)
  const { data: chartData, isLoading: chartLoading } = useChartData(selectedYear);
  
  // Load top customers only when needed (lazy)
  const { data: topCustomers, isLoading: topCustomersLoading } = useTopCustomersOptimized();

  const formatPercentageChange = (change: number) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs">{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been downloaded`,
    });
  };

  if (reportsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading essential metrics...</span>
      </div>
    );
  }

  const criticalAlerts = reportsData?.lowStockItems?.filter(item => item.status === 'critical').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Real-time business insights and comprehensive reports</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Critical Alerts - Show first if any */}
      {criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Critical Inventory Alerts</span>
              <Badge variant="destructive">{criticalAlerts}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportsData?.lowStockItems?.filter(item => item.status === 'critical').slice(0, 6).map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-red-100 text-red-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">Stock: {item.current} / {item.threshold}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">Critical</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Essential Metrics - Load first */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold">₹{reportsData?.totalRevenue?.toLocaleString() || 0}</p>
                {formatPercentageChange(reportsData?.revenueChange || 0)}
              </div>
              <div className="text-3xl opacity-80">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Services Completed</p>
                <p className="text-2xl font-bold">{reportsData?.servicesCompleted || 0}</p>
                {formatPercentageChange(reportsData?.servicesChange || 0)}
              </div>
              <div className="text-3xl opacity-80">🔧</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Customers</p>
                <p className="text-2xl font-bold">{reportsData?.activeCustomers || 0}</p>
                {formatPercentageChange(reportsData?.customersChange || 0)}
              </div>
              <div className="text-3xl opacity-80">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Low Stock Items</p>
                <p className="text-2xl font-bold">{reportsData?.lowStockItems?.length || 0}</p>
                <p className="text-xs opacity-80">
                  {criticalAlerts} critical
                </p>
              </div>
              <div className="text-3xl opacity-80">📦</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Types Distribution - Quick view */}
      {reportsData?.serviceTypeData && reportsData.serviceTypeData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Types Distribution</CardTitle>
            <Button variant="outline" size="sm" onClick={() => generateReport('services')}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportsData.serviceTypeData.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: service.color }}></div>
                    <div>
                      <p className="font-medium">{service.type}</p>
                      <p className="text-sm text-gray-600">{service.count} services</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Load Charts Button */}
      {!showCharts && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button onClick={() => setShowCharts(true)} className="mb-4">
                Load Detailed Charts & Analytics
              </Button>
              <p className="text-sm text-gray-600">
                Click to load revenue trends, top customers, and detailed analytics
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts - Loaded on demand */}
      {showCharts && (
        <div className="space-y-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generateReport('sales')}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <RevenueChart data={chartData?.revenueData || []} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Customers</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generateReport('customers')}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {topCustomersLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(topCustomers || []).map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.services} services</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{customer.totalSpent.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{customer.lastService}</p>
                      </div>
                    </div>
                  ))}
                  {(!topCustomers || topCustomers.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No customer data available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => generateReport('inventory')}>
              <Download className="h-6 w-6" />
              <span>Inventory Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => generateReport('sales')}>
              <Download className="h-6 w-6" />
              <span>Sales Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => generateReport('services')}>
              <Download className="h-6 w-6" />
              <span>Services Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => generateReport('customers')}>
              <Download className="h-6 w-6" />
              <span>Customer Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
