import { Link } from 'react-router-dom';
import { Plus, Wrench, History, Settings, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils-format';

export default function Dashboard() {
  const { quotes, loading, exportBackup } = useData();

  const recentQuotes = quotes.slice(0, 5);

  const stats = {
    total: quotes.length,
    finalized: quotes.filter(q => q.status === 'finalized').length,
    draft: quotes.filter(q => q.status === 'draft').length,
    totalValue: quotes
      .filter(q => q.status === 'finalized')
      .reduce((sum, q) => sum + q.total, 0),
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="gradient-primary rounded-2xl p-8 text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Bem-vindo ao ArClean</h1>
          <p className="text-primary-foreground/90 text-lg">
            Sistema completo para gestão de orçamentos e ordens de serviço
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/quote">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                  <Plus className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Novo Orçamento</p>
                  <p className="text-sm text-muted-foreground">Criar OS</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/services">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Serviços</p>
                  <p className="text-sm text-muted-foreground">Gerenciar</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <History className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Histórico</p>
                  <p className="text-sm text-muted-foreground">Ver todos</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Settings className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Configurações</p>
                  <p className="text-sm text-muted-foreground">Ajustar</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de OS</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Finalizadas</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.finalized}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rascunhos</CardDescription>
              <CardTitle className="text-3xl text-warning">{stats.draft}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Valor Total</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.totalValue)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimos Orçamentos</CardTitle>
              <CardDescription>Os 5 orçamentos mais recentes</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportBackup}>
              <Download className="w-4 h-4 mr-2" />
              Backup
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : recentQuotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum orçamento criado ainda.
                <br />
                <Link to="/quote" className="text-primary hover:underline mt-2 inline-block">
                  Criar primeiro orçamento
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    to={`/history`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary transition-base"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{quote.osNumber}</p>
                        <p className="text-sm text-muted-foreground">{quote.client.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(quote.total)}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(quote.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
