'use client'

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  specialties: string[];
  city: string;
  state: string;
  verified: boolean;
  featured: boolean;
  status: string;
  created_at: string;
}

interface FeaturedProfessional {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  highlight_text: string;
  badge_color: string;
  display_order: number;
  active: boolean;
  starts_at: string;
  ends_at: string | null;
  profile: Professional;
}

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<FeaturedProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showFeaturedDialog, setShowFeaturedDialog] = useState(false);
  const [featuredForm, setFeaturedForm] = useState({
    title: '',
    description: '',
    highlight_text: '',
    badge_color: 'primary',
    display_order: 0,
    active: true
  });
  
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadProfessionals();
    loadFeaturedProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os profissionais.',
        variant: 'destructive',
      });
    }
  };

  const loadFeaturedProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_professionals')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFeaturedProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (professional: Professional) => {
    try {
      if (professional.featured) {
        // Remover do destaque
        const { error } = await supabase
          .from('featured_professionals')
          .delete()
          .eq('profile_id', professional.id);

        if (error) throw error;

        toast({
          title: 'Sucesso',
          description: 'Profissional removido dos destaques.',
        });
      } else {
        // Adicionar ao destaque
        setSelectedProfessional(professional);
        setFeaturedForm({
          title: `${professional.name} - Profissional Verificado`,
          description: professional.bio || 'Profissional qualificado e verificado',
          highlight_text: 'Destaque',
          badge_color: 'primary',
          display_order: featuredProfessionals.length,
          active: true
        });
        setShowFeaturedDialog(true);
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status de destaque.',
        variant: 'destructive',
      });
    }
  };

  const saveFeaturedProfessional = async () => {
    if (!selectedProfessional) return;

    try {
      const { error } = await supabase
        .from('featured_professionals')
        .insert([{
          profile_id: selectedProfessional.id,
          ...featuredForm
        }]);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Profissional adicionado aos destaques.',
      });

      setShowFeaturedDialog(false);
      setSelectedProfessional(null);
      loadProfessionals();
      loadFeaturedProfessionals();
    } catch (error) {
      console.error('Erro ao salvar destaque:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o destaque.',
        variant: 'destructive',
      });
    }
  };

  const toggleVerified = async (professional: Professional) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: !professional.verified })
        .eq('id', professional.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Profissional ${!professional.verified ? 'verificado' : 'não verificado'}.`,
      });

      loadProfessionals();
    } catch (error) {
      console.error('Erro ao alterar verificação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar a verificação.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Profissionais</h1>
          <p className="text-gray-600">Gerencie profissionais verificados e destaques</p>
        </div>
      </div>

      {/* Profissionais em Destaque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Profissionais em Destaque ({featuredProfessionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredProfessionals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum profissional em destaque
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProfessionals.map((featured) => (
                <div key={featured.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {featured.profile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{featured.profile.name}</h3>
                      <p className="text-sm text-gray-600">{featured.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{featured.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={featured.active ? 'default' : 'destructive'}>
                      {featured.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(featured.profile)}
                      >
                        {featured.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVerified(featured.profile)}
                      >
                        {featured.profile.verified ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProfessional(featured.profile);
                          setShowFeaturedDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProfessional(featured.profile);
                          setShowFeaturedDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog to add/edit featured professional */}
      <Dialog open={showFeaturedDialog} onOpenChange={setShowFeaturedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Profissional em Destaque</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={featuredForm.title}
                onChange={(e) => setFeaturedForm({ ...featuredForm, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={featuredForm.description}
                onChange={(e) => setFeaturedForm({ ...featuredForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="highlight_text" className="text-right">
                Texto de Destaque
              </Label>
              <Input
                id="highlight_text"
                value={featuredForm.highlight_text}
                onChange={(e) => setFeaturedForm({ ...featuredForm, highlight_text: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge_color" className="text-right">
                Cor do Badge
              </Label>
              <Select
                value={featuredForm.badge_color}
                onValueChange={(value) => setFeaturedForm({ ...featuredForm, badge_color: value as string })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primária</SelectItem>
                  <SelectItem value="secondary">Secundária</SelectItem>
                  <SelectItem value="destructive">Destrutiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="display_order" className="text-right">
                Ordem de Exibição
              </Label>
              <Input
                id="display_order"
                type="number"
                value={featuredForm.display_order.toString()}
                onChange={(e) => setFeaturedForm({ ...featuredForm, display_order: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Status
              </Label>
              <Switch
                id="active"
                checked={featuredForm.active}
                onCheckedChange={(value) => setFeaturedForm({ ...featuredForm, active: value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveFeaturedProfessional}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 