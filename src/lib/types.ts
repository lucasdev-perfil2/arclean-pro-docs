export interface Service {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  unit: string;
  defaultPrice: number;
  description: string;
}

export interface QuoteItem {
  serviceId: string;
  serviceName: string;
  category: string;
  subcategory: string;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  osNumber: string;
  date: string;
  client: {
    name: string;
    phone: string;
    document: string;
    address: string;
  };
  items: QuoteItem[];
  observations: string;
  validity: number;
  discount: number;
  discountType: 'value' | 'percent';
  taxes: number;
  travelFee: number;
  subtotal: number;
  total: number;
  status: 'draft' | 'finalized';
}

export interface Company {
  name: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  logoDataUrl: string;
}

export interface Settings {
  currency: string;
  nextOsSequence: number;
  pdfTemplate: string;
}

export interface AppData {
  company: Company;
  settings: Settings;
  services: Service[];
  quotes: Quote[];
}
