import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useAnnoncetList = () => {
  return useQuery({
    queryKey: ['annonces'],
    queryFn: async () => {
      const { data, error } = await supabase.from('annonces').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAnnonce = (id: number) => {
  return useQuery({
    queryKey: ['annonces', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};


export const useInsertAnnonce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newAnnonce } = await supabase
        .from('annonces')
        .insert({
          name: data.name,
          description: data.description,
          address: data.address,
          regularPrice: data.regularPrice,
         
          bathrooms: data.bathrooms,
          bedrooms: data.bedrooms,
          
          parking: data.parking,
          type: data.type,
         
          imageUrls: data.imageUrls,
          created_at: '',
          id: 0,
          imageUrl: ''
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newAnnonce;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['annonces']);
    },
  });
};



export const useUpdateAnnonce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedAnnonce } = await supabase
        .from('annonces')
        .update({
          name: data.name,
          description: data.description,
          address: data.address,
          regularPrice: data.regularPrice,
         
          bathrooms: data.bathrooms,
          bedrooms: data.bedrooms,
          
          parking: data.parking,
          type: data.type,
         
          imageUrls: data.imageUrls,
          created_at: '',
          id: 0,
          imageUrl: ''
         
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedAnnonce;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(['annonces']);
      await queryClient.invalidateQueries(['annonces', id]);
    },
  });
};



export const useDeleteAnnonce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from('annonces').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['annonce']);
    },
  });
};
