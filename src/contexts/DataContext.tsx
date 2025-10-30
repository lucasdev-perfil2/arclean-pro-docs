import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Quote, Company, Settings } from '@/lib/types';
import * as db from '@/lib/db';
import { toast } from '@/hooks/use-toast';

interface DataContextType {
  services: Service[];
  quotes: Quote[];
  company: Company;
  settings: Settings;
  loading: boolean;
  refreshServices: () => Promise<void>;
  refreshQuotes: () => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addQuote: (quote: Quote) => Promise<void>;
  updateQuote: (quote: Quote) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  updateCompany: (company: Company) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  exportBackup: () => Promise<void>;
  importBackup: (file: File) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [company, setCompany] = useState<Company>({
    name: 'ArClean',
    owner: 'Allan Clauzen',
    phone: '',
    email: '',
    address: '',
    logoDataUrl: '',
  });
  const [settings, setSettings] = useState<Settings>({
    currency: 'BRL',
    nextOsSequence: 1,
    pdfTemplate: 'detailed',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      await db.initDB();
      
      const [servicesData, quotesData, companyData, settingsData] = await Promise.all([
        db.getServices(),
        db.getQuotes(),
        db.getCompany(),
        db.getSettings(),
      ]);

      setServices(servicesData);
      setQuotes(quotesData);
      setCompany(companyData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Ocorreu um erro ao carregar os dados. Usando dados padrão.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function refreshServices() {
    const data = await db.getServices();
    setServices(data);
  }

  async function refreshQuotes() {
    const data = await db.getQuotes();
    setQuotes(data);
  }

  async function addService(service: Service) {
    await db.addService(service);
    await refreshServices();
    toast({ title: 'Serviço adicionado com sucesso!' });
  }

  async function updateService(service: Service) {
    await db.updateService(service);
    await refreshServices();
    toast({ title: 'Serviço atualizado com sucesso!' });
  }

  async function deleteService(id: string) {
    await db.deleteService(id);
    await refreshServices();
    toast({ title: 'Serviço removido com sucesso!' });
  }

  async function addQuote(quote: Quote) {
    await db.addQuote(quote);
    await refreshQuotes();
    
    // Increment OS sequence
    const newSettings = { ...settings, nextOsSequence: settings.nextOsSequence + 1 };
    await db.updateSettings(newSettings);
    setSettings(newSettings);
    
    toast({ title: 'Orçamento salvo com sucesso!' });
  }

  async function updateQuote(quote: Quote) {
    await db.updateQuote(quote);
    await refreshQuotes();
    toast({ title: 'Orçamento atualizado com sucesso!' });
  }

  async function deleteQuote(id: string) {
    await db.deleteQuote(id);
    await refreshQuotes();
    toast({ title: 'Orçamento removido com sucesso!' });
  }

  async function updateCompany(newCompany: Company) {
    await db.updateCompany(newCompany);
    setCompany(newCompany);
    toast({ title: 'Dados da empresa atualizados!' });
  }

  async function updateSettings(newSettings: Settings) {
    await db.updateSettings(newSettings);
    setSettings(newSettings);
    toast({ title: 'Configurações atualizadas!' });
  }

  async function exportBackup() {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arclean-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: 'Backup exportado com sucesso!' });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Erro ao exportar backup',
        description: 'Ocorreu um erro ao exportar o backup.',
        variant: 'destructive',
      });
    }
  }

  async function importBackup(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await db.importData(data);
      await loadInitialData();
      
      toast({ title: 'Backup importado com sucesso!' });
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Erro ao importar backup',
        description: 'Arquivo inválido ou corrompido.',
        variant: 'destructive',
      });
    }
  }

  return (
    <DataContext.Provider
      value={{
        services,
        quotes,
        company,
        settings,
        loading,
        refreshServices,
        refreshQuotes,
        addService,
        updateService,
        deleteService,
        addQuote,
        updateQuote,
        deleteQuote,
        updateCompany,
        updateSettings,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
