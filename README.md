# ArClean - Sistema de Gestão de Orçamentos

Sistema profissional para gestão de orçamentos e ordens de serviço, desenvolvido para **Allan Clauzen** e focado em serviços de ar-condicionado.

## 🚀 Funcionalidades

### ✅ Implementado
- **Dashboard**: Visão geral com estatísticas e acesso rápido
- **Gestão de Serviços**: CRUD completo com 59 serviços pré-cadastrados
- **Catálogo Organizado**: Serviços agrupados por categoria e subcategoria
- **Edição Inline**: Preços editáveis diretamente na lista
- **Busca Avançada**: Pesquisa por nome, categoria ou subcategoria
- **Histórico**: Listagem completa de todos os orçamentos
- **Configurações**: Dados da empresa, logo, sequência de OS
- **Backup/Restauração**: Export/Import JSON completo
- **PWA**: App instalável com funcionamento offline
- **Persistência**: IndexedDB com fallback para localStorage
- **Design Responsivo**: Otimizado para desktop e mobile

### 🔧 Em Desenvolvimento
- **Builder de Orçamento**: Interface para criação de OS com:
  - Dados do cliente
  - Seleção de serviços
  - Cálculos automáticos (subtotal, desconto, impostos, taxa)
  - Autosave
- **Preview PDF**: Visualização WYSIWYG antes da exportação
- **Exportação PDF**: Multipágina, profissional, com layout completo
- **Exportação Excel**: Via SheetJS
- **Compartilhamento**: Web Share API + fallback WhatsApp

## 🎨 Design System

### Cores
- **Primary**: Verde-azulado (#0B7A75) - Confiança e profissionalismo
- **Accent**: Laranja suave - CTAs e destaques
- **Background**: Gradientes sutis
- **Tipografia**: Inter (moderna e legível)

### Componentes
- Design system completo em `src/index.css`
- Tokens semânticos (nunca cores diretas)
- Componentes shadcn customizados
- Animações suaves e transições

## 📦 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Design System
- **UI**: shadcn/ui
- **Database**: IndexedDB (idb)
- **PDF**: jsPDF + html2canvas
- **Excel**: SheetJS (xlsx)
- **PWA**: Service Worker + Manifest
- **IDs**: uuid

## 🚀 Como Usar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build
```

### PWA - Instalação no Dispositivo

#### Android
1. Abra o app no Chrome
2. Menu (⋮) → "Adicionar à tela inicial"
3. O app será instalado como um app nativo

#### iOS
1. Abra o app no Safari
2. Compartilhar → "Adicionar à Tela de Início"
3. O app será instalado na tela inicial

### Funcionalidades Offline
- Todos os dados são salvos localmente (IndexedDB)
- Service Worker faz cache dos assets principais
- App funciona completamente offline após primeira visita

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Layout.tsx           # Layout principal com navegação
│   └── ui/                  # Componentes shadcn
├── contexts/
│   └── DataContext.tsx      # Context para gestão de dados
├── lib/
│   ├── db.ts               # IndexedDB setup e operações
│   ├── seed.ts             # Dados iniciais (59 serviços)
│   ├── types.ts            # TypeScript interfaces
│   ├── utils-format.ts     # Formatação (moeda, data, OS)
│   ├── pdf-generator.ts    # Geração de PDF
│   ├── excel-exporter.ts   # Exportação Excel
│   ├── share-utils.ts      # Web Share API
│   └── pwa-utils.ts        # PWA utilities
├── pages/
│   ├── Dashboard.tsx       # Página inicial
│   ├── Services.tsx        # Gestão de serviços
│   ├── History.tsx         # Histórico de orçamentos
│   └── Settings.tsx        # Configurações
└── main.tsx               # Entry point
```

## 📊 Dados Iniciais

O app vem com **59 serviços pré-cadastrados** organizados em categorias:

- Manutenção Preventiva (10 serviços)
- Manutenção Corretiva (8 serviços)
- Manutenção Preditiva (5 serviços)
- Higienização / Limpeza Profunda (6 serviços)
- Recarga de Gás Refrigerante (4 serviços)
- Serviços Elétricos e Eletrônicos (6 serviços)
- Serviços Mecânicos e Estruturais (5 serviços)
- Instalação e Reinstalação (5 serviços)
- Manutenção Administrativa (4 serviços)
- Serviços Especiais (6 serviços)

## 🔐 Backup e Restauração

### Exportar Backup
1. Acesse "Configurações"
2. Clique em "Exportar Backup JSON"
3. Arquivo será baixado com data no nome

### Importar Backup
1. Acesse "Configurações"
2. Clique em "Importar Backup JSON"
3. Selecione o arquivo `.json` exportado
4. Todos os dados serão restaurados

## 📝 Formato do Orçamento (PDF)

O PDF gerado segue layout profissional:
- **Cabeçalho**: Logo, dados da empresa, nº OS, data
- **Cliente**: Nome, telefone, documento, endereço
- **Serviços**: Tabela com nome, categoria, qtd, unidade, unitário, subtotal
- **Totais**: Subtotal, desconto, impostos, taxa, total destacado
- **Rodapé**: Validade, condições, assinaturas

## 🎯 Próximos Passos

Para completar o app, ainda falta implementar:

1. **Página de Builder de Orçamento** (`/quote`)
   - Form de cliente
   - Seletor de serviços (multiselect)
   - Cálculos automáticos
   - Autosave

2. **Página de Preview** (`/preview/:id`)
   - WYSIWYG do PDF
   - Botões de ação (PDF, Excel, Compartilhar)

3. **Integração das Funções de Export**
   - PDF multipágina
   - Excel com formatação
   - WhatsApp/Share

## 📱 Suporte a Navegadores

- Chrome/Edge (recomendado)
- Firefox
- Safari
- Mobile browsers (Android/iOS)

## 🤝 Autor

**Allan Clauzen** - ArClean

---

**Desenvolvido com** 💚 **usando Lovable.dev**
