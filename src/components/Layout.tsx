import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, FileText, History, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/services', icon: Wrench, label: 'Serviços' },
    { path: '/quote', icon: FileText, label: 'Novo Orçamento' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/settings', icon: SettingsIcon, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">AC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ArClean</h1>
                <p className="text-xs text-muted-foreground">Gestão de Orçamentos</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-base',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
