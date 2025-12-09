
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useDatabase } from '@/contexts/DatabaseContext';

export type SparePart = Tables<'elite_spare_parts'>;
export type SparePartInsert = TablesInsert<'elite_spare_parts'>;
export type SparePartUpdate = TablesUpdate<'elite_spare_parts'>;

export const useSparePartsData = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['spare_parts', getTableName('spare_parts')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(getTableName('spare_parts'))
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SparePart[];
    },
  });
};

export const useAddSparePart = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (part: SparePartInsert) => {
      const { data, error } = await supabase
        .from(getTableName('spare_parts'))
        .insert(part)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare_parts'] });
    },
  });
};

export const useUpdateSparePart = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SparePartUpdate }) => {
      const { data, error } = await supabase
        .from(getTableName('spare_parts'))
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare_parts'] });
    },
  });
};

export const useDeleteSparePart = () => {
  const queryClient = useQueryClient();
  const { getTableName } = useDatabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(getTableName('spare_parts'))
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare_parts'] });
    },
  });
};

export const useLowStockParts = () => {
  const { getTableName } = useDatabase();

  return useQuery({
    queryKey: ['low_stock_parts', getTableName('spare_parts')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(getTableName('spare_parts'))
        .select('*')
        .filter('quantity_in_stock', 'lte', 'reorder_threshold')
        .order('quantity_in_stock', { ascending: true });

      if (error) throw error;
      return data as SparePart[];
    },
  });
};
