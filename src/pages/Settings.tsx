import { useState } from 'react';
import { Upload, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { company, settings, updateCompany, updateSettings, exportBackup, importBackup } = useData();
  
  const [companyData, setCompanyData] = useState(company);
  const [settingsData, setSettingsData] = useState(settings);

  const handleSaveCompany = async () => {
    await updateCompany(companyData);
  };

  const handleSaveSettings = async () => {
    await updateSettings(settingsData);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCompanyData({ ...companyData, logoDataUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importBackup(file);
      // Refresh page data
      window.location.reload();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Ajuste as configurações do sistema</p>
        </div>

        {/* Company Data */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>Informações que aparecerão nos orçamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo da Empresa</Label>
              <div className="flex items-center gap-4">
                {companyData.logoDataUrl && (
                  <img
                    src={companyData.logoDataUrl}
                    alt="Logo"
                    className="w-20 h-20 object-contain rounded border border-border"
                  />
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Proprietário</Label>
                <Input
                  id="owner"
                  value={companyData.owner}
                  onChange={(e) => setCompanyData({ ...companyData, owner: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  placeholder="contato@arclean.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>

            <Button onClick={handleSaveCompany}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Dados da Empresa
            </Button>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Preferências gerais do aplicativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nextOsSequence">Próximo Número de OS</Label>
              <Input
                id="nextOsSequence"
                type="number"
                value={settingsData.nextOsSequence}
                onChange={(e) => setSettingsData({ ...settingsData, nextOsSequence: parseInt(e.target.value) || 1 })}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Próxima OS será: OS-{new Date().getFullYear()}-{String(settingsData.nextOsSequence).padStart(4, '0')}
              </p>
            </div>

            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Backup/Restore */}
        <Card>
          <CardHeader>
            <CardTitle>Backup e Restauração</CardTitle>
            <CardDescription>Faça backup ou restaure seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportBackup} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Backup JSON
              </Button>

              <Label htmlFor="import-backup" className="cursor-pointer">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-base text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Importar Backup JSON
                </div>
                <Input
                  id="import-backup"
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              O backup inclui todos os serviços, orçamentos e configurações. Use para migrar dados entre dispositivos.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
