'use client'

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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
import { useFeaturedProfessionals, useCreateFeaturedProfessional } from '@/hooks/api/useFeaturedProfessionals';
import { useToast } from '@/components/ui/use-toast';

export default function FeaturedProfessionalsAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    profile_id: '',
    title: '',
    description: '',
    highlight_text: '',
    badge_color: 'primary',
    display_order: 0,
    ends_at: ''
  });

  const { data: featuredData, isLoading, refetch } = useFeaturedProfessionals(20, true);
  const createMutation = useCreateFeaturedProfessional();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMutation.mutateAsync({
        ...formData,
        ends_at: formData.ends_at || undefined
      });
      
      toast({
        title: 'Sucesso',
        description: 'Profissional adicionado aos destaques!',
      });
      
      setIsDialogOpen(false);
      setFormData({
        profile_id: '',
        title: '',
        description: '',
        highlight_text: '',
        badge_color: 'primary',
        display_order: 0,
        ends_at: ''
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar profissional aos destaques.',
        variant: 'destructive',
      });
    }
  };

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'danger': return 'destructive';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profissionais em Destaque</h1>
          <p className="text-gray-600">Gerencie os profissionais que aparecem na página principal</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Destaque
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Profissional em Destaque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="profile_id">ID do Profissional</Label>
                <Input
                  id="profile_id"
                  value={formData.profile_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_id: e.target.value }))}
                  placeholder="UUID do perfil do profissional"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Profissional Verificado"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do destaque"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="highlight_text">Texto do Badge</Label>
                <Input
                  id="highlight_text"
                  value={formData.highlight_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, highlight_text: e.target.value }))}
                  placeholder="Ex: Destaque, Premium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="badge_color">Cor do Badge</Label>
                <Select 
                  value={formData.badge_color} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, badge_color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primária</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="danger">Perigo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="ends_at">Data de Expiração (opcional)</Label>
                <Input
                  id="ends_at"
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, ends_at: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profissionais Atualmente em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          {featuredData?.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum profissional em destaque no momento
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featuredData?.data.map((featured) => (
                  <TableRow key={featured.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{featured.profile.name}</div>
                        <div className="text-sm text-gray-500">{featured.profile.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{featured.title}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(featured.badge_color)}>
                        {featured.highlight_text}
                      </Badge>
                    </TableCell>
                    <TableCell>{featured.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={featured.active ? 'default' : 'secondary'}>
                        {featured.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 