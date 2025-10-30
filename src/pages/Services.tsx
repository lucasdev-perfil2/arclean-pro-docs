import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Service } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export default function Services() {
  const { services, addService, updateService, deleteService } = useData();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('0');

  // Group services by category
  const categories = Array.from(new Set(services.map(s => s.category)));
  
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.category.toLowerCase().includes(search.toLowerCase()) ||
    service.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartEdit = (service: Service) => {
    setEditingId(service.id);
    setEditPrice(service.defaultPrice.toString());
  };

  const handleSaveEdit = async (service: Service) => {
    await updateService({
      ...service,
      defaultPrice: parseFloat(editPrice) || 0,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de serviços</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar serviços..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Services by Category */}
        <div className="space-y-6">
          {categories.map(category => {
            const categoryServices = filteredServices.filter(s => s.category === category);
            
            if (categoryServices.length === 0) return null;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>{categoryServices.length} serviço(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryServices.map(service => (
                      <div
                        key={service.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-base"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {service.subcategory} • {service.unit}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {editingId === service.id ? (
                            <>
                              <Input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-24 h-8 text-sm"
                                placeholder="Preço"
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleSaveEdit(service)}
                              >
                                <Check className="w-4 h-4 text-success" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={handleCancelEdit}
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-primary">
                                R$ {service.defaultPrice.toFixed(2)}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleStartEdit(service)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum serviço encontrado
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
