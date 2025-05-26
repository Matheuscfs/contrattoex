'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  category: string;
  createdAt: string;
}

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Instalação Elétrica Residencial',
      description: 'Serviço completo de instalação elétrica para residências',
      price: 250,
      isActive: true,
      category: 'Elétrica',
      createdAt: '2024-03-20'
    },
    {
      id: '2',
      name: 'Manutenção Preventiva',
      description: 'Checagem e manutenção preventiva da rede elétrica',
      price: 150,
      isActive: true,
      category: 'Manutenção',
      createdAt: '2024-03-21'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    isActive: true,
    category: ''
  });

  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      name: newService.name || '',
      description: newService.description || '',
      price: newService.price || 0,
      isActive: newService.isActive || true,
      category: newService.category || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      price: 0,
      isActive: true,
      category: ''
    });
    setIsDialogOpen(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService(service);
    setIsDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!editingService) return;

    const updatedServices = services.map(service => 
      service.id === editingService.id 
        ? { ...service, ...newService, id: service.id }
        : service
    );

    setServices(updatedServices);
    setEditingService(null);
    setNewService({
      name: '',
      description: '',
      price: 0,
      isActive: true,
      category: ''
    });
    setIsDialogOpen(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setServices(services.map(service =>
      service.id === id
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Serviços Prestados</CardTitle>
            <CardDescription>Gerencie seus serviços disponíveis</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do serviço abaixo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input
                    id="name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço Base (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newService.isActive}
                    onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
                  />
                  <Label htmlFor="active">Serviço Ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingService ? handleUpdateService : handleAddService}>
                  {editingService ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{service.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Categoria: {service.category}</span>
                  <span>Preço Base: R$ {service.price}</span>
                  <span>Criado em: {service.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Switch
                  checked={service.isActive}
                  onCheckedChange={() => handleToggleStatus(service.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditService(service)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 