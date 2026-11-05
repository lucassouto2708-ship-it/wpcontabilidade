/**
 * WP Contabilidade — CONFIGURAÇÃO CENTRAL
 * Todas as informações de contato, marca e integrações ficam aqui.
 * Campos vazios ("") são ocultados automaticamente no site.
 */
window.SITE_CONFIG = {
  brand: {
    name: "WP",
    fullName: "WP — Escritório de Contabilidade",
    tagline: "Assessoria, consultoria e soluções empresariais com atendimento em todo o Brasil.",
  },

  // ⚠️ PENDENTE DE CONFIRMAÇÃO: o número informado (+55 33 9867-8932) tem 8 dígitos
  // após o DDD. Celulares no Brasil usam 9 dígitos (ex.: 33 9 9867-8932).
  // Confirme com o cliente e ajuste apenas os dois campos abaixo.
  whatsapp: {
    number: "553398678932",          // somente dígitos: 55 + DDD + número
    display: "+55 33 9867-8932",     // como aparece no site
  },

  instagram: "",   // PENDENTE: ex. "https://instagram.com/perfil_oficial"
  email: "pwcontabil@outlook.com",
  phone: {                          // telefone do cadastro do CNPJ (ligação)
    number: "553399115030",
    display: "(33) 9911-5030",
  },
  address: {
    street: "R. Duarte Coelho, 617 — Apto 201",
    district: "Morada do Vale",
    city: "Governador Valadares",
    state: "MG",
    zip: "35057-150",
  },
  // Mapa e link "Como chegar" gerados a partir do endereço acima
  mapQuery: "Rua Duarte Coelho, 617, Morada do Vale, Governador Valadares - MG, 35057-150",
  cnpj: "57.727.107/0001-53",
  crc: "",         // PENDENTE: registro profissional (CRC), se fornecido
  siteUrl: "",     // PENDENTE: ex. "https://www.wpcontabilidade.com.br"

  // Métricas — deixe vazio até ter os IDs reais. Nada é carregado se vazio.
  analytics: {
    ga4Id: "",        // ex. "G-XXXXXXXXXX"
    metaPixelId: "",  // ex. "123456789012345"
  },

  messages: {
    default: "Olá! Gostaria de falar com um especialista da WP Contabilidade.",
    assessoria: "Olá! Gostaria de saber mais sobre os serviços de assessoria e consultoria contábil.",
    regularizacao: "Olá! Gostaria de informações sobre regularização de empresas.",
    ir: "Olá! Gostaria de informações sobre o serviço de declaração de Imposto de Renda.",
    certificado: "Olá! Gostaria de informações sobre emissão ou renovação de certificado digital.",
  },

  // Depoimentos REAIS apenas. Enquanto vazio, o site exibe a seção "Nossos compromissos".
  // Formato: { name: "Nome", rating: 5, text: "Depoimento...", service: "Imposto de Renda" }
  testimonials: [],
};
