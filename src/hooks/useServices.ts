import { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Service, ServiceCreateInput, ServiceUpdateInput } from '@/types/service';
import { useAuth } from '@/contexts/AuthContext';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createService = async (data: ServiceCreateInput) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('services')
        .insert([{ ...data, user_id: user?.id }]);

      if (error) throw error;

      toast.success('Serviço criado com sucesso!');
      await loadServices();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast.error('Erro ao criar serviço');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, data: ServiceUpdateInput) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Serviço atualizado com sucesso!');
      await loadServices();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error('Erro ao atualizar serviço');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Serviço excluído com sucesso!');
      await loadServices();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast.error('Erro ao excluir serviço');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadServiceImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem');
      throw error;
    }
  };

  return {
    services,
    loading,
    loadServices,
    createService,
    updateService,
    deleteService,
    uploadServiceImage,
  };
} 