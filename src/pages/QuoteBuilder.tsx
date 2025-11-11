import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, Eye, GripVertical } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, generateOsNumber } from '@/lib/utils-format';
import type { Quote, QuoteItem } from '@/lib/types';

export default function QuoteBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { quotes, services, settings, addQuote, updateQuote } = useData();
  
  const [quote, setQuote] = useState<Quote>({
    id: uuidv4(),
    osNumber: generateOsNumber(settings.nextOsSequence),
    date: new Date().toISOString().split('T')[0],
    client: { name: '', phone: '', document: '', address: '' },
    items: [],
    observations: '',
    validity: 7,
    discount: 0,
    discountType: 'value',
    taxes: 0,
    travelFee: 0,
    subtotal: 0,
    total: 0,
    status: 'draft',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load existing quote for editing
  useEffect(() => {
    if (id) {
      const existingQuote = quotes.find(q => q.id === id);
      if (existingQuote) {
        setQuote(existingQuote);
      }
    }
  }, [id, quotes]);

  // Recalculate totals whenever items, discount, taxes, or travelFee change
  useEffect(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = quote.discountType === 'percent' 
      ? subtotal * (quote.discount / 100)
      : quote.discount;
    const total = subtotal - discountAmount + quote.taxes + quote.travelFee;
    
    setQuote(prev => ({ ...prev, subtotal, total }));
  }, [quote.items, quote.discount, quote.discountType, quote.taxes, quote.travelFee]);

  const addItem = () => {
    const newItem: QuoteItem = {
      serviceId: '',
      serviceName: '',
      category: '',
      subcategory: '',
      unit: 'unidade',
      qty: 1,
      unitPrice: 0,
      subtotal: 0,
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    setQuote(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      
      // Recalculate subtotal for this item
      if (field === 'qty' || field === 'unitPrice') {
        items[index].subtotal = items[index].qty * items[index].unitPrice;
      }
      
      return { ...prev, items };
    });
  };

  const selectService = (index: number, serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      updateItem(index, 'serviceId', serviceId);
      updateItem(index, 'serviceName', service.name);
      updateItem(index, 'category', service.category);
      updateItem(index, 'subcategory', service.subcategory);
      updateItem(index, 'unit', service.unit);
      updateItem(index, 'unitPrice', service.defaultPrice);
    }
  };

  const removeItem = (index: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === quote.items.length - 1)
    ) {
      return;
    }

    setQuote(prev => {
      const items = [...prev.items];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      return { ...prev, items };
    });
  };

  const handleSave = async (finalize: boolean = false) => {
    if (!quote.client.name.trim()) {
      alert('Por favor, preencha o nome do cliente');
      return;
    }

    if (quote.items.length === 0) {
      alert('Adicione pelo menos um serviço ao orçamento');
      return;
    }

    const hasInvalidItems = quote.items.some(
      item => !item.serviceName.trim() || item.qty <= 0 || item.unitPrice < 0
    );

    if (hasInvalidItems) {
      alert('Todos os serviços devem ter nome, quantidade maior que zero e preço válido');
      return;
    }

    setIsSaving(true);
    try {
      const quoteToSave = {
        ...quote,
        status: finalize ? 'finalized' as const : 'draft' as const,
      };

      if (id) {
        await updateQuote(quoteToSave);
      } else {
        await addQuote(quoteToSave);
      }

      if (finalize) {
        navigate(`/preview/${quoteToSave.id}`);
      } else {
        navigate('/history');
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      alert('Erro ao salvar orçamento. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{id ? 'Editar' : 'Novo'} Orçamento</h1>
            <p className="text-muted-foreground">{quote.osNumber}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar & Finalizar
            </Button>
          </div>
        </div>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nome *</Label>
                <Input
                  id="clientName"
                  value={quote.client.name}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    client: { ...prev.client, name: e.target.value }
                  }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Telefone/WhatsApp</Label>
                <Input
                  id="clientPhone"
                  value={quote.client.phone}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    client: { ...prev.client, phone: e.target.value }
                  }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label htmlFor="clientDocument">CPF/CNPJ</Label>
                <Input
                  id="clientDocument"
                  value={quote.client.document}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    client: { ...prev.client, document: e.target.value }
                  }))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Endereço</Label>
                <Input
                  id="clientAddress"
                  value={quote.client.address}
                  onChange={(e) => setQuote(prev => ({
                    ...prev,
                    client: { ...prev.client, address: e.target.value }
                  }))}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Serviços</CardTitle>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Serviço
            </Button>
          </CardHeader>
          <CardContent>
            {quote.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.
              </div>
            ) : (
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1 pt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Service Selection */}
                        <div className="md:col-span-5">
                          <Label>Serviço do Catálogo</Label>
                          <Select
                            value={item.serviceId}
                            onValueChange={(value) => selectService(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar do catálogo" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - {service.category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Manual Service Name */}
                        <div className="md:col-span-5">
                          <Label>Nome do Serviço *</Label>
                          <Input
                            value={item.serviceName}
                            onChange={(e) => updateItem(index, 'serviceName', e.target.value)}
                            placeholder="Digite manualmente ou selecione do catálogo"
                          />
                        </div>

                        {/* Unit */}
                        <div className="md:col-span-2">
                          <Label>Unidade</Label>
                          <Input
                            value={item.unit}
                            onChange={(e) => updateItem(index, 'unit', e.target.value)}
                            placeholder="un, m², h"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2">
                          <Label>Quantidade *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.qty}
                            onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="md:col-span-3">
                          <Label>Valor Unitário *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>

                        {/* Subtotal (read-only) */}
                        <div className="md:col-span-3">
                          <Label>Subtotal</Label>
                          <Input
                            value={formatCurrency(item.subtotal)}
                            readOnly
                            className="bg-muted"
                          />
                        </div>

                        {/* Category/Subcategory (if from catalog) */}
                        {item.serviceId && (
                          <div className="md:col-span-4">
                            <Label>Categoria</Label>
                            <Input
                              value={`${item.category} / ${item.subcategory}`}
                              readOnly
                              className="bg-muted text-sm"
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculations */}
        <Card>
          <CardHeader>
            <CardTitle>Valores e Ajustes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="discount">Desconto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={quote.discount}
                      onChange={(e) => setQuote(prev => ({
                        ...prev,
                        discount: parseFloat(e.target.value) || 0
                      }))}
                    />
                    <Select
                      value={quote.discountType}
                      onValueChange={(value: 'value' | 'percent') => setQuote(prev => ({
                        ...prev,
                        discountType: value
                      }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="value">R$</SelectItem>
                        <SelectItem value="percent">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="taxes">Impostos/Taxas</Label>
                  <Input
                    id="taxes"
                    type="number"
                    min="0"
                    step="0.01"
                    value={quote.taxes}
                    onChange={(e) => setQuote(prev => ({
                      ...prev,
                      taxes: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="travelFee">Taxa de Deslocamento</Label>
                  <Input
                    id="travelFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={quote.travelFee}
                    onChange={(e) => setQuote(prev => ({
                      ...prev,
                      travelFee: parseFloat(e.target.value) || 0
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="validity">Validade (dias)</Label>
                  <Input
                    id="validity"
                    type="number"
                    min="1"
                    value={quote.validity}
                    onChange={(e) => setQuote(prev => ({
                      ...prev,
                      validity: parseInt(e.target.value) || 7
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-3 p-6 bg-muted rounded-lg">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Desconto:</span>
                    <span>
                      - {quote.discountType === 'percent' 
                        ? `${quote.discount}% (${formatCurrency(quote.subtotal * (quote.discount / 100))})`
                        : formatCurrency(quote.discount)
                      }
                    </span>
                  </div>
                )}
                {quote.taxes > 0 && (
                  <div className="flex justify-between">
                    <span>Impostos/Taxas:</span>
                    <span>+ {formatCurrency(quote.taxes)}</span>
                  </div>
                )}
                {quote.travelFee > 0 && (
                  <div className="flex justify-between">
                    <span>Taxa Deslocamento:</span>
                    <span>+ {formatCurrency(quote.travelFee)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-2xl font-bold text-primary">
                  <span>Total:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={quote.observations}
              onChange={(e) => setQuote(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Observações adicionais, condições de pagamento, etc."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => navigate('/history')}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar & Finalizar
          </Button>
        </div>
      </div>
    </Layout>
  );
}
