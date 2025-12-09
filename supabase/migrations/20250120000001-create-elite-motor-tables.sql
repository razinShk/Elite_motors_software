-- Create separate tables for Elite Motor and Detailing
-- These are completely separate from the existing Shahi Garage tables

-- Elite Motor customers table
CREATE TABLE public.elite_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor vehicles table
CREATE TABLE public.elite_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.elite_customers(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor spare parts table
CREATE TABLE public.elite_spare_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_name TEXT NOT NULL,
  part_type TEXT NOT NULL,
  brand TEXT NOT NULL,
  part_number TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  reorder_threshold INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor sales table
CREATE TABLE public.elite_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor sale items table
CREATE TABLE public.elite_sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.elite_sales(id) ON DELETE CASCADE NOT NULL,
  spare_part_id UUID REFERENCES public.elite_spare_parts(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor service types table
CREATE TABLE public.elite_service_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  estimated_duration_hours INTEGER,
  base_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor services table
CREATE TABLE public.elite_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.elite_vehicles(id) ON DELETE CASCADE NOT NULL,
  service_type_id UUID REFERENCES public.elite_service_types(id) ON DELETE RESTRICT NOT NULL,
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mileage INTEGER,
  labor_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  next_service_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elite Motor service parts table
CREATE TABLE public.elite_service_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.elite_services(id) ON DELETE CASCADE NOT NULL,
  spare_part_id UUID REFERENCES public.elite_spare_parts(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert Elite Motor specific service types
INSERT INTO public.elite_service_types (name, description, estimated_duration_hours, base_price) VALUES
('Car Detailing Interior', 'Complete interior detailing and cleaning', 3, 150.00),
('Car Detailing Exterior', 'Complete exterior detailing and polishing', 4, 200.00),
('Car PPF Installation', 'Paint Protection Film installation', 6, 500.00),
('Car Wrap Service', 'Vehicle wrapping service', 8, 800.00),
('Customer Modifications', 'Custom modifications and upgrades', 5, 300.00),
('Ceramic Coating', 'Ceramic coating application', 4, 400.00),
('Premium Car Wash', 'Premium car wash service', 2, 100.00),
('Performance Upgrade', 'Performance enhancement services', 6, 600.00);

-- Insert Elite Motor specific spare parts
INSERT INTO public.elite_spare_parts (part_name, part_type, brand, part_number, price, quantity_in_stock, reorder_threshold) VALUES
('Ceramic Coating Kit', 'Detailing', 'Gyeon', 'CC-001', 250.00, 10, 3),
('PPF Film', 'Protection', '3M', 'PPF-002', 150.00, 5, 2),
('Car Wrap Vinyl', 'Wrapping', 'Avery', 'CW-003', 200.00, 8, 3),
('Interior Cleaner', 'Detailing', 'Chemical Guys', 'IC-004', 25.00, 20, 5),
('Exterior Polish', 'Detailing', 'Meguiars', 'EP-005', 35.00, 15, 5),
('Microfiber Towels', 'Detailing', 'The Rag Company', 'MT-006', 15.00, 50, 10),
('Performance Air Filter', 'Performance', 'K&N', 'PAF-007', 80.00, 12, 4),
('Exhaust System', 'Performance', 'Borla', 'ES-008', 450.00, 3, 1);

-- Enable Row Level Security on Elite Motor tables
ALTER TABLE public.elite_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_service_parts ENABLE ROW LEVEL SECURITY;

-- Create policies for Elite Motor tables (public access)
CREATE POLICY "Allow all operations on elite_customers" ON public.elite_customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_vehicles" ON public.elite_vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_spare_parts" ON public.elite_spare_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_sales" ON public.elite_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_sale_items" ON public.elite_sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_service_types" ON public.elite_service_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_services" ON public.elite_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on elite_service_parts" ON public.elite_service_parts FOR ALL USING (true) WITH CHECK (true);

-- Create functions to update Elite Motor spare parts stock after sale
CREATE OR REPLACE FUNCTION update_elite_spare_parts_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease stock when sale item is inserted
  IF TG_OP = 'INSERT' THEN
    UPDATE public.elite_spare_parts 
    SET quantity_in_stock = quantity_in_stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.spare_part_id;
    RETURN NEW;
  END IF;
  
  -- Increase stock when sale item is deleted (return/refund)
  IF TG_OP = 'DELETE' THEN
    UPDATE public.elite_spare_parts 
    SET quantity_in_stock = quantity_in_stock + OLD.quantity,
        updated_at = now()
    WHERE id = OLD.spare_part_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update Elite Motor spare parts stock after service
CREATE OR REPLACE FUNCTION update_elite_spare_parts_stock_service()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease stock when service part is used
  IF TG_OP = 'INSERT' THEN
    UPDATE public.elite_spare_parts 
    SET quantity_in_stock = quantity_in_stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.spare_part_id;
    RETURN NEW;
  END IF;
  
  -- Increase stock when service part is removed
  IF TG_OP = 'DELETE' THEN
    UPDATE public.elite_spare_parts 
    SET quantity_in_stock = quantity_in_stock + OLD.quantity,
        updated_at = now()
    WHERE id = OLD.spare_part_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate Elite Motor sale total
CREATE OR REPLACE FUNCTION calculate_elite_sale_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the total amount in elite_sales table
  UPDATE public.elite_sales 
  SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0) 
    FROM public.elite_sale_items 
    WHERE sale_id = COALESCE(NEW.sale_id, OLD.sale_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.sale_id, OLD.sale_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate Elite Motor service total
CREATE OR REPLACE FUNCTION calculate_elite_service_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the total cost in elite_services table
  UPDATE public.elite_services 
  SET total_cost = labor_charges + (
    SELECT COALESCE(SUM(subtotal), 0) 
    FROM public.elite_service_parts 
    WHERE service_id = COALESCE(NEW.service_id, OLD.service_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.service_id, OLD.service_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for Elite Motor tables
CREATE TRIGGER trigger_update_elite_stock_on_sale
  AFTER INSERT OR DELETE ON public.elite_sale_items
  FOR EACH ROW EXECUTE FUNCTION update_elite_spare_parts_stock();

CREATE TRIGGER trigger_update_elite_stock_on_service
  AFTER INSERT OR DELETE ON public.elite_service_parts
  FOR EACH ROW EXECUTE FUNCTION update_elite_spare_parts_stock_service();

CREATE TRIGGER trigger_calculate_elite_sale_total
  AFTER INSERT OR UPDATE OR DELETE ON public.elite_sale_items
  FOR EACH ROW EXECUTE FUNCTION calculate_elite_sale_total();

CREATE TRIGGER trigger_calculate_elite_service_total
  AFTER INSERT OR UPDATE OR DELETE ON public.elite_service_parts
  FOR EACH ROW EXECUTE FUNCTION calculate_elite_service_total();

CREATE TRIGGER trigger_calculate_elite_service_total_on_labor
  AFTER UPDATE OF labor_charges ON public.elite_services
  FOR EACH ROW EXECUTE FUNCTION calculate_elite_service_total();
