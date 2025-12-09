-- Create duplicate tables for Elite Motor and Detailing
-- This creates backup/duplicate tables for each existing table

-- Duplicate customers table
CREATE TABLE public.customers_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duplicate vehicles table
CREATE TABLE public.vehicles_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers_backup(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duplicate spare_parts table
CREATE TABLE public.spare_parts_backup (
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

-- Duplicate sales table
CREATE TABLE public.sales_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duplicate sale_items table
CREATE TABLE public.sale_items_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales_backup(id) ON DELETE CASCADE NOT NULL,
  spare_part_id UUID REFERENCES public.spare_parts_backup(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duplicate service_types table
CREATE TABLE public.service_types_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  estimated_duration_hours INTEGER,
  base_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Duplicate services table
CREATE TABLE public.services_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles_backup(id) ON DELETE CASCADE NOT NULL,
  service_type_id UUID REFERENCES public.service_types_backup(id) ON DELETE RESTRICT NOT NULL,
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

-- Duplicate service_parts table
CREATE TABLE public.service_parts_backup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services_backup(id) ON DELETE CASCADE NOT NULL,
  spare_part_id UUID REFERENCES public.spare_parts_backup(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on backup tables
ALTER TABLE public.customers_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spare_parts_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_parts_backup ENABLE ROW LEVEL SECURITY;

-- Create policies for backup tables (public access)
CREATE POLICY "Allow all operations on customers_backup" ON public.customers_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vehicles_backup" ON public.vehicles_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on spare_parts_backup" ON public.spare_parts_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales_backup" ON public.sales_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sale_items_backup" ON public.sale_items_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on service_types_backup" ON public.service_types_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services_backup" ON public.services_backup FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on service_parts_backup" ON public.service_parts_backup FOR ALL USING (true) WITH CHECK (true);

-- Create functions to sync data between original and backup tables
CREATE OR REPLACE FUNCTION sync_customers_to_backup()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.customers_backup (id, name, email, phone, address, created_at, updated_at)
    VALUES (NEW.id, NEW.name, NEW.email, NEW.phone, NEW.address, NEW.created_at, NEW.updated_at)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      updated_at = EXCLUDED.updated_at;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.customers_backup WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create sync triggers for all tables
CREATE TRIGGER sync_customers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION sync_customers_to_backup();

-- Similar functions and triggers can be created for other tables
-- This is a basic example - you can extend this pattern for all tables

-- Insert sample data into backup tables (copy from original)
INSERT INTO public.customers_backup (id, name, email, phone, address, created_at, updated_at)
SELECT id, name, email, phone, address, created_at, updated_at FROM public.customers;

INSERT INTO public.vehicles_backup (id, customer_id, make, model, year, registration_number, created_at, updated_at)
SELECT id, customer_id, make, model, year, registration_number, created_at, updated_at FROM public.vehicles;

INSERT INTO public.spare_parts_backup (id, part_name, part_type, brand, part_number, price, quantity_in_stock, reorder_threshold, created_at, updated_at)
SELECT id, part_name, part_type, brand, part_number, price, quantity_in_stock, reorder_threshold, created_at, updated_at FROM public.spare_parts;

INSERT INTO public.sales_backup (id, invoice_number, customer_name, sale_date, total_amount, status, created_at, updated_at)
SELECT id, invoice_number, customer_name, sale_date, total_amount, status, created_at, updated_at FROM public.sales;

INSERT INTO public.sale_items_backup (id, sale_id, spare_part_id, quantity, unit_price, subtotal, created_at)
SELECT id, sale_id, spare_part_id, quantity, unit_price, subtotal, created_at FROM public.sale_items;

INSERT INTO public.service_types_backup (id, name, description, estimated_duration_hours, base_price, created_at)
SELECT id, name, description, estimated_duration_hours, base_price, created_at FROM public.service_types;

INSERT INTO public.services_backup (id, vehicle_id, service_type_id, service_date, mileage, labor_charges, total_cost, next_service_date, notes, status, created_at, updated_at)
SELECT id, vehicle_id, service_type_id, service_date, mileage, labor_charges, total_cost, next_service_date, notes, status, created_at, updated_at FROM public.services;

INSERT INTO public.service_parts_backup (id, service_id, spare_part_id, quantity, unit_price, subtotal, created_at)
SELECT id, service_id, spare_part_id, quantity, unit_price, subtotal, created_at FROM public.service_parts;
