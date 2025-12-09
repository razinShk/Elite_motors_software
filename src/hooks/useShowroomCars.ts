import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useDatabase } from '@/contexts/DatabaseContext';

export type ShowroomCarImage = {
    id: string;
    car_id: string;
    image_url: string;
    display_order: number;
    created_at: string;
};

export type ShowroomCar = Tables<'elite_showroom_cars'> & {
    elite_showroom_car_images?: ShowroomCarImage[];
};
export type ShowroomCarInsert = TablesInsert<'elite_showroom_cars'>;
export type ShowroomCarUpdate = TablesUpdate<'elite_showroom_cars'>;

export const useShowroomCars = () => {
    const { getTableName } = useDatabase();

    return useQuery({
        queryKey: ['showroom_cars', getTableName('showroom_cars')],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('elite_showroom_cars')
                .select('*, elite_showroom_car_images(*)')
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as unknown as ShowroomCar[];
        },
    });
};

export const useAddShowroomCar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (car: ShowroomCarInsert) => {
            const { data, error } = await supabase
                .from('elite_showroom_cars')
                .insert(car)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['showroom_cars'] });
        },
    });
};

export const useUpdateShowroomCar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: ShowroomCarUpdate }) => {
            const { data, error } = await supabase
                .from('elite_showroom_cars')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['showroom_cars'] });
        },
    });
};

export const useDeleteShowroomCar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('elite_showroom_cars')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['showroom_cars'] });
        },
    });
};
