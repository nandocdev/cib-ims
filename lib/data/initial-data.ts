// lib/data/initial-data.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Base de datos estandarizada institucional para sembrado y persistencia

import { Regulation, User } from '@/types/cib';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    uid: 'cib-usr-001',
    email: 'usuario1@cib.gob.pa',
    displayName: 'Comisionado Rafael Mendoza',
    badgeNumber: 'CIB-001-DIR',
    role: 'COMISIONADO_DIRECTOR',
    rank: 'Comisionado Director General',
    department: 'Dirección General de Ciberinvestigación Táctica',
    active: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'user-002',
    uid: 'cib-usr-002',
    email: 'forense1@cib.gob.pa',
    displayName: 'Capitán Alberto Castillero',
    badgeNumber: 'CIB-101-FOR',
    role: 'AGENTE_FORENSE_TECNICO',
    rank: 'Capitán de Evidencia Digital',
    department: 'Unidad de Volcado de Memoria y Redes',
    active: true,
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user-003',
    uid: 'cib-usr-003',
    email: 'forense2@cib.gob.pa',
    displayName: 'Teniente Elena De La Rosa',
    badgeNumber: 'CIB-102-FOR',
    role: 'AGENTE_FORENSE_TECNICO',
    rank: 'Teniente Forense de Malware',
    department: 'Laboratorio de Ingeniería Inversa y Sandbox',
    active: true,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-004',
    uid: 'cib-usr-004',
    email: 'forense3@cib.gob.pa',
    displayName: 'Subteniente Carlos Bethancourt',
    badgeNumber: 'CIB-103-FOR',
    role: 'AGENTE_FORENSE_TECNICO',
    rank: 'Subteniente de Telecomunicaciones',
    department: 'División de Intercepción de Tráfico y PCAP',
    active: true,
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'user-005',
    uid: 'cib-usr-005',
    email: 'auditor1@cib.gob.pa',
    displayName: 'Licda. Mireya Solís',
    badgeNumber: 'CIB-201-AUD',
    role: 'AUDITOR_LEGAL_NORMATIVO',
    rank: 'Auditora Senior de Cumplimiento',
    department: 'Fiscalía Especializada en Ciberdelitos y Cadena de Custodia',
    active: true,
    createdAt: '2026-03-01T08:30:00Z',
  },
  {
    id: 'user-006',
    uid: 'cib-usr-006',
    email: 'auditor2@cib.gob.pa',
    displayName: 'Lic. Fernando Quintero',
    badgeNumber: 'CIB-202-AUD',
    role: 'AUDITOR_LEGAL_NORMATIVO',
    rank: 'Auditor Normativo y Jurisprudencia',
    department: 'Oficina de Asesoría Legal Tecnológica',
    active: true,
    createdAt: '2026-03-10T09:30:00Z',
  },
  {
    id: 'user-007',
    uid: 'cib-usr-007',
    email: 'riesgo1@cib.gob.pa',
    displayName: 'Ing. Rodrigo Villarreal',
    badgeNumber: 'CIB-301-RSK',
    role: 'ANALISTA_DE_RIESGO',
    rank: 'Especialista en Modelado Cuantitativo',
    department: 'Centro de Inteligencia de Amenazas y PxI',
    active: true,
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'user-008',
    uid: 'cib-usr-008',
    email: 'riesgo2@cib.gob.pa',
    displayName: 'Ing. Diana Montero',
    badgeNumber: 'CIB-302-RSK',
    role: 'ANALISTA_DE_RIESGO',
    rank: 'Analista de Infraestructura Crítica',
    department: 'Centro de Operaciones de Seguridad (CSIRT-PA)',
    active: true,
    createdAt: '2026-04-01T11:00:00Z',
  },
  {
    id: 'user-009',
    uid: 'cib-usr-009',
    email: 'cadete1@cib.gob.pa',
    displayName: 'Cadete Samuel Arosemena',
    badgeNumber: 'CIB-401-CAD',
    role: 'OBSERVADOR_CADETE',
    rank: 'Cadete de 2do Año - Academia Forense',
    department: 'Escuela de Entrenamiento y Simulación Táctica',
    active: true,
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'user-010',
    uid: 'cib-usr-010',
    email: 'cadete2@cib.gob.pa',
    displayName: 'Cadete Gabriela Hurtado',
    badgeNumber: 'CIB-402-CAD',
    role: 'OBSERVADOR_CADETE',
    rank: 'Cadete de 2do Año - Academia Forense',
    department: 'Escuela de Entrenamiento y Simulación Táctica',
    active: true,
    createdAt: '2026-05-01T08:00:00Z',
  },
];

export const INITIAL_REGULATIONS: Regulation[] = [
  {
    id: 'reg-01',
    code: 'LEY-81-2019',
    name: 'Ley 81 de 26 de marzo de 2019 - Sobre Protección de Datos Personales',
    jurisdiction: 'PANAMA',
    promulgationDate: '2019-03-26',
    summary:
      'Marco legal de orden público e interés social en la República de Panamá para regular el tratamiento de datos personales en bases de datos automatizadas o manuales. Establece principios de licitud, finalidad, consentimiento previo e informado y régimen sancionador ante la ANTAI.',
    keyArticles: [
      {
        articleNumber: 'Artículo 9',
        description: 'Obligación del custodio o responsable de adoptar medidas técnicas y organizativas para la confidencialidad.',
        forensicApplication: 'Fundamento legal para sancionar exfiltraciones o almacenamiento desprotegido de imágenes de cédulas y licencias.',
      },
      {
        articleNumber: 'Artículo 34',
        description: 'Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) y tutela administrativa ante ANTAI.',
        forensicApplication: 'Exigencia de portales de autogestión de consentimiento trazable y derecho de supresión.',
      },
      {
        articleNumber: 'Artículo 38',
        description: 'Régimen de sanciones e infracciones graves y muy graves con multas de hasta B/. 10,000.',
        forensicApplication: 'Cálculo de penalización financiera dentro de la evaluación de impacto (I) en la matriz de riesgo.',
      },
    ],
    officialLink: 'https://www.gacetaoficial.gob.pa',
  },
  {
    id: 'reg-02',
    code: 'OPIN-ANTAI-002-2022',
    name: 'Circular MEF 2023-4680 / Opinión ANTAI No. 002-2022 - Criterio Vinculante sobre Fotografías de Documentos de Identidad',
    jurisdiction: 'PANAMA',
    promulgationDate: '2022-04-18',
    summary:
      'Criterio técnico-jurídico vinculante emitido por la Autoridad Nacional de Transparencia y Acceso a la Información (ANTAI) que declara ilegal la captura indiscriminada y almacenamiento de imágenes o fotocopias de cédulas y licencias de conducir sin base legal explícita o consentimiento reforzado.',
    keyArticles: [
      {
        articleNumber: 'Punto Resolutivo 2',
        description: 'Ilicitud de exigir o fotografiar la cédula de identidad personal para trámites comerciales o acceso a aplicaciones.',
        forensicApplication: 'Elemento pericial determinante en Operación TechGlobe (CIB-2026-001-TG).',
      },
    ],
  },
  {
    id: 'reg-03',
    code: 'LEY-51-2008',
    name: 'Ley 51 de 22 de julio de 2008 - Comercio Electrónico y Firmas Electrónicas en Panamá',
    jurisdiction: 'PANAMA',
    promulgationDate: '2008-07-22',
    summary:
      'Ley que define y regula los documentos electrónicos, firmas digitales, prestación de servicios de certificación y conservación e inmutabilidad de la evidencia informática procesal.',
    keyArticles: [
      {
        articleNumber: 'Artículo 5',
        description: 'Validez jurídica, eficacia probatoria y admisibilidad procesal de los documentos electrónicos originales.',
        forensicApplication: 'Exige cadena de custodia criptográfica mediante hashes SHA-256 para todo artefacto forense.',
      },
      {
        articleNumber: 'Artículo 28',
        description: 'Certificación y sellado de tiempo para auditoría procesal.',
        forensicApplication: 'Exige marcas temporales sincronizadas vía servidores NTP certificados para bitácoras.',
      },
    ],
  },
  {
    id: 'reg-04',
    code: 'RES-AIG-18-2026',
    name: 'Resolución AIG No. 18-2026 - Guía Técnica Nacional para la Gestión de Incidentes Cibernéticos y CSIRT Panamá',
    jurisdiction: 'PANAMA',
    promulgationDate: '2026-01-14',
    summary:
      'Directriz vinculante emitida por la Autoridad Nacional para la Innovación Gubernamental (AIG) que establece protocolos de notificación obligatoria de incidentes críticos, autorización previa de sistemas y prohibición estricta de mantener plataformas en producción con vulnerabilidades críticas.',
    keyArticles: [
      {
        articleNumber: 'Capítulo II - Art. 4',
        description: 'Clasificación de severidad PxI e umbral de alerta roja para riesgos mayores o iguales a 20.',
        forensicApplication: 'Parámetro de automatización en CIB-IMS para escalar expedientes a intervención inmediata del Director.',
      },
      {
        articleNumber: 'Capítulo IV - Art. 11',
        description: 'Prohibición imperativa de poner o mantener en producción plataformas estatales con componentes vulnerables no mitigados.',
        forensicApplication: 'Fundamento legal para la orden de congelamiento inmediato en Operación Portal-Estatal (CIB-2026-003-PE).',
      },
    ],
  },
  {
    id: 'reg-05',
    code: 'GDPR-EU-2016-679',
    name: 'Reglamento General de Protección de Datos (GDPR / RGPD)',
    jurisdiction: 'INTERNACIONAL',
    promulgationDate: '2016-04-27',
    summary:
      'Estándar global de privacidad y soberanía de datos personales. Aplica extraterritorialmente (Art. 3) a organizaciones fuera de la UE que traten datos de residentes europeos o monitoreen su comportamiento.',
    keyArticles: [
      {
        articleNumber: 'Artículo 3',
        description: 'Ámbito de aplicación territorial y extraterritorialidad cuando se tratan datos de ciudadanos en la Unión Europea.',
        forensicApplication: 'Sustento del doble riesgo sancionatorio transfronterizo en Operación TechGlobe ante la EDPB.',
      },
      {
        articleNumber: 'Artículo 33',
        description: 'Notificación de una violación de la seguridad de los datos personales a la autoridad de control en 72 horas.',
        forensicApplication: 'Requisito de trazabilidad temporal estricta en el timeline forense de 5 días.',
      },
    ],
  },
  {
    id: 'reg-06',
    code: 'CONV-BERNA',
    name: 'Convenio de Berna para la Protección de las Obras Literarias y Artísticas',
    jurisdiction: 'INTERNACIONAL',
    promulgationDate: '1971-07-24',
    summary:
      'Tratado internacional ratificado por Panamá que garantiza la protección automática de programas computacionales y obras intelectuales sin necesidad de registro formal previo.',
    keyArticles: [
      {
        articleNumber: 'Artículo 2.1',
        description: 'Inclusión de creaciones intelectuales y código informático ejecutable.',
        forensicApplication: 'Respaldo legal frente a litigios de infracción de licencias GPLv3 y uso indebido de recursos gráficos.',
      },
    ],
  },
  {
    id: 'reg-07',
    code: 'NIST-CSF-2.0',
    name: 'NIST Cybersecurity Framework v2.0 (Govern, Identify, Protect, Detect, Respond, Recover)',
    jurisdiction: 'INTERNACIONAL',
    promulgationDate: '2024-02-26',
    summary:
      'Marco internacional de taxonomía de seguridad utilizado por el CIB para guiar las fases de respuesta táctica, gestión de parches y cadena de suministro.',
    keyArticles: [
      {
        articleNumber: 'Función: GOVERN & PROTECT',
        description: 'Gestión de riesgos en cadena de suministro (C-SCRM) y control estricto de accesos privilegiados (Zero Trust).',
        forensicApplication: 'Marco de control para revocar privilegios Domain Admin permanentes de proveedores en infraestructura estatal.',
      },
    ],
  },
  {
    id: 'reg-08',
    code: 'LEY-64-2012',
    name: 'Ley 64 de 10 de octubre de 2012 - Sobre Derecho de Autor y Derechos Conexos',
    jurisdiction: 'PANAMA',
    promulgationDate: '2012-10-10',
    summary:
      'Ley panameña sobre derechos morales y patrimoniales que tutela el software, bases de datos y creaciones gráficas. Prohíbe la reproducción no autorizada, alteración de marcas de agua y uso comercial de software pirata.',
    keyArticles: [
      {
        articleNumber: 'Artículos 23 y 24',
        description: 'Derechos exclusivos de reproducción y comunicación pública de obras intelectuales.',
        forensicApplication: 'Sustento penal y civil para sancionar el uso de recursos gráficos y código sin licencia en Operación Trojan-PC20.',
      },
    ],
  },
  {
    id: 'reg-09',
    code: 'LEY-35-1996',
    name: 'Ley 35 de 10 de mayo de 1996 - Sobre Propiedad Industrial y Secretos Comerciales',
    jurisdiction: 'PANAMA',
    promulgationDate: '1996-05-10',
    summary:
      'Régimen legal para la protección de secretos comerciales, patentes e invenciones industriales en Panamá. Sanciona la revelación o apoderamiento ilícito de información confidencial de carácter técnico e industrial.',
    keyArticles: [
      {
        articleNumber: 'Artículos 83 y 84',
        description: 'Protección frente al apoderamiento de secretos comerciales sin consentimiento del titular.',
        forensicApplication: 'Base jurídica para procesar amenazas internas y espionaje en Operación Mole-Insider.',
      },
    ],
  },
  {
    id: 'reg-10',
    code: 'DEC-EJEC-709-2011',
    name: 'Decreto Ejecutivo 709 de 2011 - Política Nacional de Ciberseguridad y Creación del CSIRT Panamá',
    jurisdiction: 'PANAMA',
    promulgationDate: '2011-09-12',
    summary:
      'Marco de coordinación interinstitucional que establece el Equipo Nacional de Respuesta a Incidentes de Seguridad de la Información (CSIRT Panamá) y los protocolos de cooperación ante amenazas cibernéticas críticas.',
    keyArticles: [
      {
        articleNumber: 'Artículo 5',
        description: 'Coordinación táctica de respuesta a incidentes que comprometan infraestructuras críticas del Estado.',
        forensicApplication: 'Protocolo de escalamiento para Operación Portal-Estatal y Stux-Grid.',
      },
    ],
  },
  {
    id: 'reg-11',
    code: 'COD-PENAL-PANAMA',
    name: 'Código Penal de la República de Panamá - Título VIII, Capítulo II: Delitos contra la Seguridad Informática',
    jurisdiction: 'PANAMA',
    promulgationDate: '2007-05-22',
    summary:
      'Artículos 289 al 292 del Código Penal que tipifican el acceso ilícito a sistemas informáticos, sabotaje digital, daño a datos y uso de programas maliciosos con penas de prisión de 2 a 6 años.',
    keyArticles: [
      {
        articleNumber: 'Artículo 289',
        description: 'Acceso no autorizado, modificación, destrucción o interferencia de sistemas y datos informáticos.',
        forensicApplication: 'Calificación delictiva para casos de ransomware, robo de credenciales y troyanos.',
      },
    ],
  },
];

// Re-exportar los 14 expedientes oficiales del CIB
export { INITIAL_CASES } from './initial-cases';
