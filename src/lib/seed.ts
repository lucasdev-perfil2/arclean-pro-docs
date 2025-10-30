import { AppData } from './types';

export const seedData: AppData = {
  company: {
    name: "ArClean",
    owner: "Allan Clauzen",
    phone: "",
    email: "",
    address: "",
    logoDataUrl: ""
  },
  settings: {
    currency: "BRL",
    nextOsSequence: 1,
    pdfTemplate: "detailed"
  },
  services: [
    { id:"svc-0001",name:"Limpeza de filtros de ar",category:"Manutenção Preventiva",subcategory:"Filtros",unit:"unidade",defaultPrice:0,description:"Limpeza e substituição se necessário dos filtros de ar." },
    { id:"svc-0002",name:"Limpeza das serpentinas (evaporadora)",category:"Manutenção Preventiva",subcategory:"Serpentinas",unit:"unidade",defaultPrice:0,description:"Limpeza da evaporadora, remoção de sujeira e verificação de aletas." },
    { id:"svc-0003",name:"Limpeza das serpentinas (condensadora)",category:"Manutenção Preventiva",subcategory:"Serpentinas",unit:"unidade",defaultPrice:0,description:"Limpeza da condensadora e verificação de fluxo de ar." },
    { id:"svc-0004",name:"Verificação de pressões e temperaturas do gás",category:"Manutenção Preventiva",subcategory:"Verificações",unit:"hora",defaultPrice:0,description:"Medição de pressões e temperaturas para diagnóstico de performance." },
    { id:"svc-0005",name:"Teste elétrico e de amperagem",category:"Manutenção Preventiva",subcategory:"Elétrico",unit:"hora",defaultPrice:0,description:"Medir corrente, verificar carregamento e consumo." },
    { id:"svc-0006",name:"Limpeza do dreno e bandeja de condensado",category:"Manutenção Preventiva",subcategory:"Dreno",unit:"unidade",defaultPrice:0,description:"Desobstruir e sanitizar dreno e bandeja de condensado." },
    { id:"svc-0007",name:"Verificação de ruídos e vibrações",category:"Manutenção Preventiva",subcategory:"Testes",unit:"hora",defaultPrice:0,description:"Avaliação de ruídos, vibrações e alinhamento." },
    { id:"svc-0008",name:"Aperto de conexões elétricas e mecânicas",category:"Manutenção Preventiva",subcategory:"Manutenção leve",unit:"hora",defaultPrice:0,description:"Apertar conexões e fixações para segurança." },
    { id:"svc-0009",name:"Verificação de fixações, suportes e isolamento térmico",category:"Manutenção Preventiva",subcategory:"Estrutural",unit:"unidade",defaultPrice:0,description:"Inspeção de suportes, bases e isolamento térmico." },
    { id:"svc-0010",name:"Avaliação da performance geral e rendimento do equipamento",category:"Manutenção Preventiva",subcategory:"Performance",unit:"hora",defaultPrice:0,description:"Teste completo de performance e eficiência do equipamento." },

    { id:"svc-0011",name:"Substituição de peças (compressor, capacitor, etc.)",category:"Manutenção Corretiva",subcategory:"Substituição",unit:"unidade",defaultPrice:0,description:"Substituição de componentes danificados como compressor, capacitor, motor e sensores." },
    { id:"svc-0012",name:"Reparo de vazamento de gás refrigerante",category:"Manutenção Corretiva",subcategory:"Vazamentos",unit:"unidade",defaultPrice:0,description:"Localizar e soldar vazamentos em linhas de refrigerante." },
    { id:"svc-0013",name:"Recarregamento de gás refrigerante",category:"Manutenção Corretiva",subcategory:"Gás",unit:"kg",defaultPrice:0,description:"Carga de gás refrigerante com balança e manômetro." },
    { id:"svc-0014",name:"Substituição de componentes elétricos/eletrônicos",category:"Manutenção Corretiva",subcategory:"Elétrico",unit:"unidade",defaultPrice:0,description:"Troca de sensores, placas eletrônicas e componentes." },
    { id:"svc-0015",name:"Desobstrução do dreno",category:"Manutenção Corretiva",subcategory:"Dreno",unit:"unidade",defaultPrice:0,description:"Remoção de obstruções e limpeza do dreno." },
    { id:"svc-0016",name:"Reparo em tubulações de cobre",category:"Manutenção Corretiva",subcategory:"Tubulação",unit:"metro",defaultPrice:0,description:"Soldagem e substituição de trechos de tubulação de cobre." },
    { id:"svc-0017",name:"Substituição de ventiladores ou hélices",category:"Manutenção Corretiva",subcategory:"Ventilação",unit:"unidade",defaultPrice:0,description:"Troca de ventiladores/motores danificados." },
    { id:"svc-0018",name:"Recuperação de fios e conectores",category:"Manutenção Corretiva",subcategory:"Elétrica",unit:"hora",defaultPrice:0,description:"Reparar fiação, conectores e emendas." },

    { id:"svc-0019",name:"Termografia (detectar sobreaquecimento)",category:"Manutenção Preditiva",subcategory:"Instrumentação",unit:"serviço",defaultPrice:0,description:"Inspeção termográfica para identificar pontos quentes no sistema elétrico." },
    { id:"svc-0020",name:"Medição de vibração e ruído",category:"Manutenção Preditiva",subcategory:"Instrumentação",unit:"serviço",defaultPrice:0,description:"Análise de vibração para prever falhas mecânicas." },
    { id:"svc-0021",name:"Análise de pressão e temperatura",category:"Manutenção Preditiva",subcategory:"Instrumentação",unit:"serviço",defaultPrice:0,description:"Registro de pressões e temperaturas para monitoramento de tendência." },
    { id:"svc-0022",name:"Verificação de corrente elétrica e consumo",category:"Manutenção Preditiva",subcategory:"Instrumentação",unit:"serviço",defaultPrice:0,description:"Medição do consumo elétrico e corrente para diagnóstico energético." },
    { id:"svc-0023",name:"Monitoramento remoto (sistemas grandes)",category:"Manutenção Preditiva",subcategory:"Monitoramento",unit:"instalação",defaultPrice:0,description:"Configuração e instalação de monitoramento remoto de parâmetros." },

    { id:"svc-0024",name:"Lavagem completa da evaporadora (desmontagem)",category:"Higienização / Limpeza Profunda",subcategory:"Evaporadora",unit:"serviço",defaultPrice:0,description:"Lavagem completa com desmontagem, secagem e aplicação bactericida." },
    { id:"svc-0025",name:"Lavagem da condensadora",category:"Higienização / Limpeza Profunda",subcategory:"Condensadora",unit:"serviço",defaultPrice:0,description:"Lavagem externa da condensadora e verificação de desempenho." },
    { id:"svc-0026",name:"Aplicação de bactericida/fungicida",category:"Higienização / Limpeza Profunda",subcategory:"Sanitização",unit:"serviço",defaultPrice:0,description:"Aplicação de produtos bactericidas e fungicidas certificados." },
    { id:"svc-0027",name:"Limpeza da serpentina com produto químico",category:"Higienização / Limpeza Profunda",subcategory:"Serpentinas",unit:"serviço",defaultPrice:0,description:"Desobstrução química e limpeza profunda das serpentinas." },
    { id:"svc-0028",name:"Higienização do dreno e bandeja",category:"Higienização / Limpeza Profunda",subcategory:"Dreno",unit:"serviço",defaultPrice:0,description:"Sanitização completa do sistema de drenagem e bandeja." },
    { id:"svc-0029",name:"Limpeza do gabinete e carenagem",category:"Higienização / Limpeza Profunda",subcategory:"Gabinete",unit:"serviço",defaultPrice:0,description:"Limpeza e higienização do gabinete e componentes externos." },

    { id:"svc-0030",name:"Teste de vazamento com nitrogênio/detector",category:"Recarga de Gás Refrigerante",subcategory:"Testes",unit:"serviço",defaultPrice:0,description:"Teste de estanqueidade para localizar vazamentos." },
    { id:"svc-0031",name:"Soldagem e vedação do ponto de vazamento",category:"Recarga de Gás Refrigerante",subcategory:"Reparo",unit:"serviço",defaultPrice:0,description:"Soldagem e vedação especializada do ponto de vazamento." },
    { id:"svc-0032",name:"Vácuo da tubulação",category:"Recarga de Gás Refrigerante",subcategory:"Preparação",unit:"serviço",defaultPrice:0,description:"Vácuo da linha antes da carga de gás." },
    { id:"svc-0033",name:"Carga de gás correta (R410A/R22/R32)",category:"Recarga de Gás Refrigerante",subcategory:"Carga",unit:"kg",defaultPrice:0,description:"Carga de gás refrigerante com balança e medição precisa." },

    { id:"svc-0034",name:"Substituição de cabos e conectores",category:"Serviços Elétricos e Eletrônicos",subcategory:"Fiação",unit:"metro",defaultPrice:0,description:"Troca de cabos elétricos e conectores." },
    { id:"svc-0035",name:"Troca de disjuntores e fusíveis",category:"Serviços Elétricos e Eletrônicos",subcategory:"Proteção",unit:"unidade",defaultPrice:0,description:"Substituição de dispositivos de proteção elétrica." },
    { id:"svc-0036",name:"Reparo de placa eletrônica",category:"Serviços Elétricos e Eletrônicos",subcategory:"Eletrônica",unit:"serviço",defaultPrice:0,description:"Análise e reparo de placas eletrônicas." },
    { id:"svc-0037",name:"Troca de sensores de temperatura",category:"Serviços Elétricos e Eletrônicos",subcategory:"Sensores",unit:"unidade",defaultPrice:0,description:"Substituição e calibração de sensores." },
    { id:"svc-0038",name:"Verificação de aterramento",category:"Serviços Elétricos e Eletrônicos",subcategory:"Segurança",unit:"serviço",defaultPrice:0,description:"Teste de aterramento e segurança elétrica." },
    { id:"svc-0039",name:"Substituição de capacitor de partida",category:"Serviços Elétricos e Eletrônicos",subcategory:"Componentes",unit:"unidade",defaultPrice:0,description:"Troca de capacitores de partida e testes." },

    { id:"svc-0040",name:"Troca de suportes e bases antivibração",category:"Serviços Mecânicos e Estruturais",subcategory:"Suporte",unit:"serviço",defaultPrice:0,description:"Substituição de suportes, pads e bases antivibração." },
    { id:"svc-0041",name:"Substituição de carenagem danificada",category:"Serviços Mecânicos e Estruturais",subcategory:"Carenagem",unit:"serviço",defaultPrice:0,description:"Troca ou reparo da carenagem do equipamento." },
    { id:"svc-0042",name:"Reparo ou troca de ventoinha / hélice",category:"Serviços Mecânicos e Estruturais",subcategory:"Ventilação",unit:"unidade",defaultPrice:0,description:"Reparo ou substituição de hélice e motor de ventilador." },
    { id:"svc-0043",name:"Alinhamento do ventilador",category:"Serviços Mecânicos e Estruturais",subcategory:"Ventilação",unit:"serviço",defaultPrice:0,description:"Balanceamento e alinhamento do ventilador." },
    { id:"svc-0044",name:"Substituição de rolamentos e mancais",category:"Serviços Mecânicos e Estruturais",subcategory:"Mecânica",unit:"unidade",defaultPrice:0,description:"Troca de rolamentos, lubrificação e testes." },

    { id:"svc-0045",name:"Instalação completa (tubulação, elétrica, dreno)",category:"Instalação e Reinstalação",subcategory:"Instalação",unit:"serviço",defaultPrice:0,description:"Instalação completa do sistema com testes finais." },
    { id:"svc-0046",name:"Reinstalação / mudança de local",category:"Instalação e Reinstalação",subcategory:"Reinstalação",unit:"serviço",defaultPrice:0,description:"Desmontagem, transporte e reinstalação no novo local." },
    { id:"svc-0047",name:"Cálculo de carga térmica e dimensionamento",category:"Instalação e Reinstalação",subcategory:"Projeto",unit:"serviço",defaultPrice:0,description:"Dimensionamento e recomendação do equipamento ideal." },
    { id:"svc-0048",name:"Vácuo da linha e teste de estanqueidade",category:"Instalação e Reinstalação",subcategory:"Testes",unit:"serviço",defaultPrice:0,description:"Vácuo e teste obrigatório antes da carga de gás." },
    { id:"svc-0049",name:"Isolamento térmico das linhas",category:"Instalação e Reinstalação",subcategory:"Isolamento",unit:"metro",defaultPrice:0,description:"Aplicação de isolamento térmico nas tubulações." },

    { id:"svc-0050",name:"Plano de manutenção preventiva programada (PMOC)",category:"Manutenção Administrativa (Gestão Técnica)",subcategory:"Gestão",unit:"plano",defaultPrice:0,description:"Elaboração do plano de manutenção preventiva (PMOC)." },
    { id:"svc-0051",name:"Relatórios técnicos de inspeção",category:"Manutenção Administrativa (Gestão Técnica)",subcategory:"Documentação",unit:"serviço",defaultPrice:0,description:"Emissão de relatórios e laudos técnicos." },
    { id:"svc-0052",name:"Controle de trocas de filtros e peças",category:"Manutenção Administrativa (Gestão Técnica)",subcategory:"Gestão",unit:"serviço",defaultPrice:0,description:"Registro e controle de trocas e peças de manutenção." },
    { id:"svc-0053",name:"Registro de intervenções",category:"Manutenção Administrativa (Gestão Técnica)",subcategory:"Documentação",unit:"serviço",defaultPrice:0,description:"Registro formal de cada intervenção técnica." },

    { id:"svc-0054",name:"Instalação de automação (termostatos, Wi-Fi)",category:"Serviços Especiais",subcategory:"Automação",unit:"serviço",defaultPrice:0,description:"Instalação e configuração de dispositivos de automação e controle." },
    { id:"svc-0055",name:"Desodorização e sanitização com ozônio",category:"Serviços Especiais",subcategory:"Sanitização",unit:"serviço",defaultPrice:0,description:"Aplicação controlada de ozônio para desodorização e sanitização." },
    { id:"svc-0056",name:"Conversão de gás (ex: R22 → R410A)",category:"Serviços Especiais",subcategory:"Conversão",unit:"serviço",defaultPrice:0,description:"Conversão técnica do sistema para diferente tipo de gás." },
    { id:"svc-0057",name:"Balanceamento de dutos e vazão de ar",category:"Serviços Especiais",subcategory:"Dutos",unit:"serviço",defaultPrice:0,description:"Medição e balanceamento de dutos e vazão de ar." },
    { id:"svc-0058",name:"Isolamento acústico",category:"Serviços Especiais",subcategory:"Acústica",unit:"serviço",defaultPrice:0,description:"Soluções e implementação de isolamento para redução de ruído." },
    { id:"svc-0059",name:"Retrofit / modernização de sistemas antigos",category:"Serviços Especiais",subcategory:"Retrofit",unit:"serviço",defaultPrice:0,description:"Atualização e modernização de sistemas antigos para eficiência." }
  ],
  quotes: []
};
