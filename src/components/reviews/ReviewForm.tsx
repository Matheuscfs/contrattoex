'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ReviewInput } from '@/types/review';
import { createClient } from '@/lib/supabase/client';

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'O comentário deve ter pelo menos 10 caracteres'),
  images: z.array(z.string()).optional(),
});

interface ReviewFormProps {
  serviceId: string;
  professionalId?: string;
  companyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  serviceId,
  professionalId,
  companyId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      images: [],
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reviews/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reviews')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('reviews')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      form.setValue('images', [...images, ...uploadedUrls]);
      toast({
        title: 'Imagens enviadas',
        description: 'As imagens foram enviadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao enviar imagens:', error);
      toast({
        title: 'Erro ao enviar imagens',
        description: 'Ocorreu um erro ao enviar as imagens. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue('images', newImages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const reviewData: ReviewInput = {
        service_id: serviceId,
        professional_id: professionalId,
        company_id: companyId,
        rating: values.rating,
        comment: values.comment,
        images: values.images,
      };

      const { error } = await supabase.from('reviews').insert(reviewData);

      if (error) throw error;

      toast({
        title: 'Avaliação enviada',
        description: 'Sua avaliação foi enviada com sucesso.',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: 'Erro ao enviar avaliação',
        description: 'Ocorreu um erro ao enviar sua avaliação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Avaliar serviço</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua avaliação</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => {
                            setSelectedRating(rating);
                            field.onChange(rating);
                          }}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= selectedRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu comentário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte sua experiência com o serviço..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Fotos (opcional)</FormLabel>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-primary">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {uploading ? 'Enviando...' : 'Adicionar fotos'}
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">Enviar avaliação</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 