
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useDatabase } from '@/contexts/DatabaseContext';

export type Service = Tables<'elite_services'>;
export type ServiceType = Tables<'elite_service_types'>;
export type Vehicle = Tables<'elite_vehicles'>;
export type Customer = Tables<'elite_customers'>;
export type ServicePart = Tables<'elite_service_parts'>;

export interface ServiceWithDetails extends Service {
  vehicles: Vehicle & {
    customers: Customer;
  };
  service_types: ServiceType;
  service_parts: (ServicePart & {
    spare_parts: {
      part_name: string;
      part_number: string;
    };
  })[];
}

export const useServicesData = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['services', getTableName('services')],
    queryFn: async () => {
      const services = getTableName('services');
      const vehiclesRel = getTableName('vehicles');
      const customersRel = getTableName('customers');
      const serviceTypesRel = getTableName('service_types');
      const servicePartsRel = getTableName('service_parts');
      const sparePartsRel = getTableName('spare_parts');

      const { data, error } = await supabase
        .from(services)
        .select(`
          *,
          vehicles:${vehiclesRel} (
            *,
            customers:${customersRel} (*)
          ),
          service_types:${serviceTypesRel} (*),
          service_parts:${servicePartsRel} (
            *,
            spare_parts:${sparePartsRel} (
              part_name,
              part_number
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceWithDetails[];
    },
  });
};

export const useServiceTypes = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['service_types', getTableName('service_types')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(getTableName('service_types'))
        .select('*')
        .order('name');

      if (error) throw error;
      return data as ServiceType[];
    },
  });
};

export const useCustomersData = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['customers', getTableName('customers')],
    queryFn: async () => {
      const customersTable = getTableName('customers');
      const vehiclesTable = getTableName('vehicles');

      // Fetch vehicles joined with customers, then group by customer
      const { data, error } = await supabase
        .from(vehiclesTable)
        .select(`
          *,
          customers:${customersTable}(id, name, email, phone, address, created_at, updated_at)
        `);

      if (error) throw error;

      const customerIdToCustomer: Record<string, any> = {};

      (data || []).forEach((vehicle: any) => {
        const customer = vehicle.customers;
        if (!customer || !customer.id) {
          return;
        }
        if (!customerIdToCustomer[customer.id]) {
          customerIdToCustomer[customer.id] = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            vehicles: [],
          };
        }
        customerIdToCustomer[customer.id].vehicles.push({
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          registration_number: vehicle.registration_number,
          created_at: vehicle.created_at,
          updated_at: vehicle.updated_at,
        });
      });

      const customersArray = Object.values(customerIdToCustomer).sort(
        (a: any, b: any) => a.name.localeCompare(b.name)
      );

      return customersArray;
    },
  });
};

export const useCreateCustomerAndVehicle = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async ({
      customer,
      vehicle
    }: {
      customer: TablesInsert<'elite_customers'>;
      vehicle: Omit<TablesInsert<'elite_vehicles'>, 'customer_id'>
    }) => {
      // Create customer first
      const { data: customerData, error: customerError } = await supabase
        .from(getTableName('customers'))
        .insert(customer)
        .select()
        .single();

      if (customerError) throw customerError;

      // Then create vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from(getTableName('vehicles'))
        .insert({
          ...vehicle,
          customer_id: customerData.id,
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      return { customer: customerData, vehicle: vehicleData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async ({
      service,
      parts
    }: {
      service: TablesInsert<'elite_services'>;
      parts: Omit<TablesInsert<'elite_service_parts'>, 'service_id'>[]
    }) => {
      // Create the service first
      const { data: serviceData, error: serviceError } = await supabase
        .from(getTableName('services'))
        .insert(service)
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Then add the service parts if any
      if (parts.length > 0) {
        const serviceParts = parts.map(part => ({
          ...part,
          service_id: serviceData.id,
        }));

        const { error: partsError } = await supabase
          .from(getTableName('service_parts'))
          .insert(serviceParts);

        if (partsError) throw partsError;
      }

      return serviceData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['spare_parts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(getTableName('services'))
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};

export const useCreateServiceType = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (payload: Partial<TablesInsert<'elite_service_types'>>) => {
      const { data, error } = await supabase
        .from(getTableName('service_types'))
        .insert({
          name: payload.name as string,
          description: (payload as any)?.description ?? null,
          base_price: (payload as any)?.base_price ?? 0,
          estimated_duration_hours: (payload as any)?.estimated_duration_hours ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types'] });
    },
  });
};

export const useUpdateServiceType = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tables<'elite_service_types'>> }) => {
      const { data, error } = await supabase
        .from(getTableName('service_types'))
        .update({
          name: updates.name,
          description: (updates as any)?.description,
          base_price: (updates as any)?.base_price,
          estimated_duration_hours: (updates as any)?.estimated_duration_hours,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types'] });
    },
  });
};

export const useDeleteServiceType = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(getTableName('service_types'))
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(getTableName('customers'))
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpcomingServices = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['upcoming_services', getTableName('services')],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const services = getTableName('services');
      const vehiclesRel = getTableName('vehicles');
      const customersRel = getTableName('customers');
      const serviceTypesRel = getTableName('service_types');

      const { data, error } = await supabase
        .from(services)
        .select(`
          *,
          vehicles:${vehiclesRel} (
            *,
            customers:${customersRel} (*)
          ),
          service_types:${serviceTypesRel} (*)
        `)
        .gte('next_service_date', today)
        .lte('next_service_date', oneWeekFromNow)
        .order('next_service_date');

      if (error) throw error;
      return data as ServiceWithDetails[];
    },
  });
};
