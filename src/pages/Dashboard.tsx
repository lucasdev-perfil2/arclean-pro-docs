import { Link } from 'react-router-dom';
import { Plus, Wrench, History, Settings, Download, FileText, CheckSquare, XCircle, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils-format';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Dashboard() {
  const { quotes, loading, exportBackup, deleteQuote } = useData();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  const recentQuotes = quotes.slice(0, 5);

  const stats = {
    total: quotes.length,
    finalized: quotes.filter(q => q.status === 'finalized').length,
    draft: quotes.filter(q => q.status === 'draft').length,
    totalValue: quotes
      .filter(q => q.status === 'finalized')
      .reduce((sum, q) => sum + q.total, 0),
  };

  const handleToggleSelection = (quoteId: string) => {
    setSelectedQuotes(prev =>
      prev.includes(quoteId)
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuotes(recentQuotes.map(q => q.id));
  };

  const handleDeselectAll = () => {
    setSelectedQuotes([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedQuotes.length === 0) return;
    
    if (!confirm(`Deseja realmente deletar ${selectedQuotes.length} orçamento(s)?`)) {
      return;
    }

    try {
      for (const id of selectedQuotes) {
        await deleteQuote(id);
      }
      setSelectedQuotes([]);
      setSelectionMode(false);
      toast({ title: `${selectedQuotes.length} orçamento(s) deletado(s) com sucesso!` });
    } catch (error) {
      toast({
        title: 'Erro ao deletar orçamentos',
        variant: 'destructive',
      });
    }
  };

  const handleExitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedQuotes([]);
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-8">
        {/* Hero Section - Compacta e Moderna */}
        <div className="gradient-primary rounded-xl p-4 md:p-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-3xl font-bold">Bem-vindo ao ArClean</h1>
            <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground">
              Online
            </span>
          </div>
          <p className="text-primary-foreground/90 text-sm md:text-base hidden sm:block">
            Sistema completo para gestão de orçamentos
          </p>
        </div>

        {/* Quick Actions - Compactos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/quote">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full gradient-accent flex items-center justify-center">
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-semibold">Novo Orçamento</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Criar OS</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/services">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
                  <Wrench className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-semibold">Serviços</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Gerenciar</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center">
                  <History className="w-4 h-4 md:w-5 md:h-5 text-secondary-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-semibold">Histórico</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Ver todos</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-3 md:p-4 gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-semibold">Configurações</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Ajustar</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats - Compactos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Total de OS</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Finalizadas</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-success">{stats.finalized}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Rascunhos</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-warning">{stats.draft}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs md:text-sm">Valor Total</CardDescription>
              <CardTitle className="text-xl md:text-2xl">{formatCurrency(stats.totalValue)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Quotes - Com Scroll e Seleção */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg md:text-2xl">Últimos Orçamentos</CardTitle>
              <CardDescription className="text-xs md:text-sm">Os 5 orçamentos mais recentes</CardDescription>
            </div>
            <div className="flex gap-2">
              {!selectionMode ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectionMode(true)}
                    disabled={recentQuotes.length === 0}
                    className="text-xs md:text-sm"
                  >
                    <CheckSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Selecionar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportBackup}
                    className="text-xs md:text-sm"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Backup</span>
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExitSelectionMode}
                  className="text-xs md:text-sm"
                >
                  <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Cancelar
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Action Bar - Aparece quando há seleções */}
          {selectionMode && selectedQuotes.length > 0 && (
            <div className="px-4 md:px-6 pb-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs md:text-sm font-medium">
                  {selectedQuotes.length} orçamento(s) selecionado(s)
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAll}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Todos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeselectAll}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    Nenhum
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteSelected}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <CardContent className="pt-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Carregando...
              </div>
            ) : recentQuotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum orçamento criado ainda.
                <br />
                <Link to="/quote" className="text-primary hover:underline mt-2 inline-block">
                  Criar primeiro orçamento
                </Link>
              </div>
            ) : (
              <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent space-y-2">
                {recentQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border transition-base ${
                      selectedQuotes.includes(quote.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    {selectionMode && (
                      <Checkbox
                        checked={selectedQuotes.includes(quote.id)}
                        onCheckedChange={() => handleToggleSelection(quote.id)}
                        className="flex-shrink-0"
                      />
                    )}
                    
                    <Link
                      to={`/history`}
                      className="flex items-center justify-between flex-1 min-w-0"
                      onClick={(e) => selectionMode && e.preventDefault()}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm md:text-base truncate">{quote.osNumber}</p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{quote.client.name}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-semibold text-sm md:text-base">{formatCurrency(quote.total)}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatDate(quote.date)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
