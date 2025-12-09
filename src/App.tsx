
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import AuthWrapper from "./components/AuthWrapper";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Servicing from "./pages/Servicing";
import Reports from "./pages/Reports";
import ServiceHistory from "./pages/ServiceHistory";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Showroom from "./pages/Showroom";
import CarDetails from "./pages/CarDetails";
import CarsDisplayHero from "./components/CarsDisplayHero";
import PublicInventory from "./pages/PublicInventory";
import ManageShowroom from "./pages/ManageShowroom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/showroom" element={<Showroom />} />
            <Route path="/car-details/:id" element={<CarDetails />} />
            <Route path="/cars-display" element={<CarsDisplayHero />} />
            <Route path="/cars-display/:id" element={<CarsDisplayHero />} />
            <Route path="/public-inventory" element={<PublicInventory />} />
            <Route element={
              <AuthWrapper>
                <Layout />
              </AuthWrapper>
            }>
              <Route path="dashboard" element={<Servicing />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="sales" element={<Sales />} />
              <Route path="servicing" element={<Servicing />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="service-history" element={<ServiceHistory />} />
              <Route path="settings" element={<Settings />} />
              <Route path="showroom-manage" element={<ManageShowroom />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DatabaseProvider>
  </QueryClientProvider>
);

export default App;
