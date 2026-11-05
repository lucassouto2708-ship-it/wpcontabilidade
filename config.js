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

  // WhatsApp e telefone da empresa
  whatsapp: {
    number: "5533999978932",         // somente dígitos: 55 + DDD + número
    display: "(33) 9 9997-8932",     // como aparece no site
  },

  instagram: "https://www.instagram.com/wpcontabil/",
  instagramHandle: "@wpcontabil",
  email: "empresarial@wpcontabilidadegroup.com",
  phone: {                          // mesmo número, para ligações
    number: "5533999978932",
    display: "(33) 9 9997-8932",
  },
  // Atendimento 100% digital: endereço físico não é exibido no site.
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
