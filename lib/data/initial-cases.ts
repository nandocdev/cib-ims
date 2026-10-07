// lib/data/initial-cases.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Catálogo Oficial de 14 Expedientes Forenses e Incidentes Digitales
// 3 Casos Abiertos de Taller Estudiantil + 11 Casos Cerrados de Precedentes y Jurisprudencia

import { Case } from '@/types/cib';

export const INITIAL_CASES: Case[] = [
  // ===========================================================================
  // 🟢 CASOS ACTIVOS / ABIERTOS (Para resolución por los estudiantes)
  // ===========================================================================

  // 1. Caso CIB-2026-001-TG: OPERACIÓN TECHGLOBE
  {
    id: 'case-001',
    codigo: 'CIB-2026-001-TG',
    title: 'Contaminación GPLv3, Exfiltración de Cédulas y Transferencia Transfronteriza Ilícita',
    operationCodename: 'Operación TechGlobe',
    summary:
      'Compromiso de aplicación comercial móvil/web en la nube, módulo de Inteligencia Artificial generativa y base de datos de usuarios. Se constata incorporación de un módulo de código abierto bajo licencia GPLv3 empaquetado en software privativo; almacenamiento no autorizado de 5,000 imágenes de cédulas y licencias; y bases de datos en nube internacional sin cifrado en reposo ni contrato de custodia.',
    classification: 'RESERVADO',
    status: 'ABIERTO', // Activo para resolución estudiantil (Grupo 1)
    vector: 'SUPPLY_CHAIN',
    probability: 4,
    impact: 5,
    riskScore: 20, // P(4) * I(5) = 20 (CRÍTICO)
    leadInvestigatorBadge: 'CIB-001-DIR',
    leadInvestigatorEmail: 'usuario1@cib.gob.pa',
    leadInvestigatorName: 'Comisionado Rafael Mendoza',
    targetEntity: 'Aplicación Móvil/Web TechGlobe Panamá Cloud & Base de Datos Transfronteriza',
    detectedAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-15T18:00:00Z',
    studentMission:
      'Determinar la estrategia de descontaminación de código fuente por violación GPLv3, saneamiento pericial de datos biométricos no conformes y ajuste estricto a la directriz ANTAI y Ley 81 de 2019.',
    mitigationMeasures: [
      'Identificar y aislar de inmediato el módulo binario compilado bajo licencia GPLv3 copyleft.',
      'Proceder a la eliminación pericial certificada de las 5,000 imágenes de cédulas no autorizadas en repositorios cloud.',
      'Suspender transferencias internacionales de datos hacia Alemania hasta protocolizar Cláusulas Contractuales Tipo (SCC).',
      'Desplegar banner de consentimiento expreso e informado con bitácora inmutable auditable.',
    ],
    applicableRegulations: ['LEY-81-2019', 'LEY-51-2008', 'GDPR-EU-2016-679', 'CONV-BERNA', 'OPIN-ANTAI-002-2022'],
    evidenceCount: 3,
    daysLoggedCount: 5,
    evidence: [
      {
        id: 'ev-001-1',
        evidenceCode: 'EV-2026-001-A',
        name: 'Módulo de Código GPLv3 Incrustado - lib_ai_engine.so.bin',
        description: 'Binario descompilado que confirma la integración de librería bajo licencia GPLv3 copyleft fuerte dentro del producto comercial propietario cerrado.',
        fileType: 'binary/shared-lib',
        fileSize: '48.2 MB',
        hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        chainOfCustodyCustodian: 'Teniente Elena De La Rosa (CIB-102-FOR)',
        collectionTimestamp: '2026-02-10T11:30:00Z',
        extractionLocation: 'Repositorio Git Producción /src/modules/ai_engine/',
        isCompromised: true,
        notes: 'Infracción directa de licencia copyleft que legalmente obliga a liberar todo el código fuente propietario.',
      },
      {
        id: 'ev-001-2',
        evidenceCode: 'EV-2026-001-B',
        name: 'Depósito de Cédulas y Licencias - s3_identity_vault.tar.gz',
        description: 'Volcado de 5,000 imágenes de documentos de identidad personales alojados sin cifrado en reposo en servidor cloud sin autorización.',
        fileType: 'application/gzip',
        fileSize: '14.8 GB',
        hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        chainOfCustodyCustodian: 'Capitán Alberto Castillero (CIB-101-FOR)',
        collectionTimestamp: '2026-02-11T14:15:00Z',
        extractionLocation: 'Amazon S3 Bucket eu-central-1:techglobe-user-kyc',
        isCompromised: true,
        notes: 'Violación al Art. 9 de la Ley 81 y Circular MEF 2023-4680 / Opinión ANTAI 002-2022 sobre captura ilícita de cédulas.',
      },
      {
        id: 'ev-001-3',
        evidenceCode: 'EV-2026-001-C',
        name: 'Telemetría de Conexiones Transfronterizas Frankfurt.pcap',
        description: 'Trazas de flujo de red entre dispositivos móviles de usuarios en Panamá y servidores AWS en Frankfurt sin acuerdo de transferencia.',
        fileType: 'network/pcap',
        fileSize: '3.6 GB',
        hashSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        chainOfCustodyCustodian: 'Subteniente Carlos Bethancourt (CIB-103-FOR)',
        collectionTimestamp: '2026-02-12T09:00:00Z',
        extractionLocation: 'Gateway API Perimetral TechGlobe',
        isCompromised: false,
        notes: 'Evidencia técnica de transferencia transfronteriza no autorizada sujeta a jurisdicción ANTAI y GDPR Art. 3.',
      },
    ],
    timeline: [
      {
        dayNumber: 1,
        title: 'Día 1: Detección, Preservación y Triaje',
        timestamp: '2026-02-10T08:00:00Z',
        leadInvestigator: 'Capitán Alberto Castillero',
        actionsTaken: [
          'Recepción y radicación de denuncia formal remitida sobre tratamiento abusivo de datos y código copyleft.',
          'Congelamiento pericial de logs de auditoría en la nube y preservación de imágenes de contenedores.',
          'Extracción de copia espejo del repositorio de código fuente para auditoría estática (SAST).',
        ],
        findings: 'El repositorio contiene dependencias externas no declaradas y módulos de captura de documentos.',
        telemetryLogs: [
          '08:15:00 CLOUD-AUDIT Snapshot created for S3 bucket "techglobe-user-kyc"',
          '09:30:12 GIT-FORENSICS Clone sha: 8fbc410 cloned to forensic sandbox write-blocker',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 2,
        title: 'Día 2: Análisis Forense de Código, Licencias y Accesos',
        timestamp: '2026-02-11T09:00:00Z',
        leadInvestigator: 'Teniente Elena De La Rosa',
        actionsTaken: [
          'Auditoría de licencias con herramientas FOSSology y escaneo de cabeceras de autor.',
          'Identificación de librería de Inteligencia Artificial bajo licencia GPLv3 vinculada estáticamente.',
          'Constatación de contaminación de código (copyleft viral) en el software distribuido.',
        ],
        findings: 'La empresa empaqueta y comercializa como software privativo un componente que legalmente obliga a liberar todo el código fuente.',
        telemetryLogs: [
          '10:45:22 FOSSOLOGY MATCH: GPL-3.0-only identified in /src/modules/ai_engine/core.c (100% similarity)',
          '14:20:01 REVERSE-ENG strings binary confirms absence of copyright attribution and GPL disclaimer',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 3,
        title: 'Día 3: Auditoría Normativa y Mapeo de Jurisdicción',
        timestamp: '2026-02-12T10:00:00Z',
        leadInvestigator: 'Licda. Mireya Solís',
        actionsTaken: [
          'Inspección del bucket de almacenamiento y validación de permisos de lectura.',
          'Verificación de existencia de consentimiento informado previo, expreso y trazable.',
          'Mapeo de transferencias internacionales de datos hacia Alemania sin autorización de ANTAI.',
        ],
        findings: 'Almacenamiento ilícito de 5,000 imágenes de cédulas y licencias personales en violación flagrante de la Ley 81 de 2019.',
        telemetryLogs: [
          '11:15:00 COMPLIANCE CHECK: 0 consent logs found for captured identity card images',
          '15:30:44 IP-GEOLOCATION AWS Frankfurt instance confirmed receiving daily sync batches',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 4,
        title: 'Día 4: Evaluación de Impacto (P × I) y Cadena de Riesgo',
        timestamp: '2026-02-13T11:00:00Z',
        leadInvestigator: 'Ing. Rodrigo Villarreal',
        actionsTaken: [
          'Cálculo cuantitativo de la Matriz de Riesgo Forense: Probabilidad 4 (Alta), Impacto 5 (Catastrófico).',
          'Puntaje de Riesgo Inherente: 20/25 (Nivel CRÍTICO). Alerta Roja institucional activada.',
          'Evaluación de multas concurrentes ANTAI (hasta $10,000 por infracción gravísima) y GDPR (hasta 20M EUR).',
        ],
        findings: 'Riesgo inminente de demandas por derechos de autor y sanciones multimillonarias por fuga y tratamiento ilegal.',
        telemetryLogs: [
          '09:00:00 RISK MATRIX P(4) x I(5) = 20. THREAT TIER: CRITICAL / RED ALERT',
          '16:45:00 REGULATORY EXPOSURE: Dual jurisdiction breach (ANTAI Panama + EDPB Europe)',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 5,
        title: 'Día 5: Asignación al Estudiante y Plan de Resolución',
        timestamp: '2026-02-14T14:00:00Z',
        leadInvestigator: 'Comisionado Rafael Mendoza',
        actionsTaken: [
          'Expediente radicado como ABIERTO para intervención táctica por Grupo 1 de Ciberinvestigadores.',
          'Requerimiento de dictamen sobre remoción de componente GPLv3 o liberación de código fuente.',
          'Requerimiento de protocolo pericial de borrado seguro DoD 5220.22-M para imágenes de cédulas.',
        ],
        findings: 'El caso permanece en estado ABIERTO para resolución y formulación de plan de remediación en el sistema.',
        telemetryLogs: [
          '14:00:00 CASE CIB-2026-001-TG STATUS: ABIERTO. ASSIGNED TO STUDENT FORENSIC UNIT.',
        ],
        chainOfCustodyVerified: true,
      },
    ],
    interrogations: [
      {
        id: 'q-001-1',
        questionNumber: 1,
        scenarioContext: 'Durante el careo técnico con el Representante Legal de la empresa desarrolladora:',
        questionText: 'Si la empresa no cobró de forma separada por el módulo de IA bajo GPLv3, ¿puede mantener el software como propiedad cerrada sin infringir los derechos de autor?',
        trickTrapDescription:
          'Trampa común de gratuidad: Confundir la ausencia de cobro directo con la exención de los términos de la licencia GPLv3.',
        expectedForensicAnswer:
          'FALSO. La licencia GPLv3 no distingue entre distribución onerosa o gratuita. Al compilar y distribuir una obra derivada o combinada estáticamente con un módulo GPLv3, la cláusula copyleft exige que todo el software resultante sea puesto a disposición del público bajo los mismos términos de código abierto.',
        legalBasis: 'Ley 64 de 2012 (Artículos 1, 2 y 38 sobre Obras Derivadas) y Cláusula 5 de Licencia GNU GPLv3.',
        difficulty: 'AVANZADO',
      },
      {
        id: 'q-001-2',
        questionNumber: 2,
        scenarioContext: 'Audiencia preliminar de protección de datos personales ante la ANTAI:',
        questionText: 'Si el usuario aceptó los "Términos y Condiciones" generales de la app con un check global, ¿es legal haberle tomado fotos de su cédula y licencia para verificar su identidad?',
        trickTrapDescription:
          'Intento de justificar la recolección de datos sensibles o biométricos mediante consentimientos genéricos y forzados.',
        expectedForensicAnswer:
          'FALSO. La Ley 81 de 2019 y la Opinión Vinculante ANTAI 002-2022 establecen que el consentimiento debe ser previo, informado, inequívoco y para una finalidad específica. La captura de imágenes de cédulas y licencias constituye tratamiento de datos protegidos y no puede ampararse en cláusulas genéricas o contratos de adhesión.',
        legalBasis: 'Ley 81 de 2019 (Artículos 4, 6 y 9) y Opinión ANTAI No. 002-2022.',
        difficulty: 'CRITICO',
      },
    ],
  },

  // 2. Caso CIB-2026-002-PC20: OPERACIÓN TROJAN-PC20
  {
    id: 'case-002',
    codigo: 'CIB-2026-002-PC20',
    title: 'Infección por Troyano en 20 PCs de Diseño, Tráfico C2 y Uso Ilegal de Propiedad Intelectual',
    operationCodename: 'Operación Trojan-PC20',
    summary:
      'Compromiso de 20 estaciones de trabajo del departamento de diseño gráfico y red corporativa. Se evidenció la ejecución del instalador "software_gratis.exe" descargado por colaboradores con permisos de administrador local, estableciendo canales de Comando y Control (C2) hacia una IP externa maliciosa. Adicionalmente se constató el uso comercial no autorizado de imágenes con marcas de agua y fragmentos de código protegidos sin licencia.',
    classification: 'CONFIDENCIAL',
    status: 'ABIERTO', // Activo para resolución estudiantil (Grupo 2)
    vector: 'TROJAN_EXFILTRATION',
    probability: 4,
    impact: 4,
    riskScore: 16, // P(4) * I(4) = 16 (ALTO)
    leadInvestigatorBadge: 'CIB-101-FOR',
    leadInvestigatorEmail: 'forense1@cib.gob.pa',
    leadInvestigatorName: 'Capitán Alberto Castillero',
    targetEntity: 'Departamento de Diseño y 20 Estaciones de Trabajo en Red Corporativa LAN',
    detectedAt: '2026-02-18T09:00:00Z',
    updatedAt: '2026-02-22T16:00:00Z',
    studentMission:
      'Aislamiento inmediato de red en las 20 estaciones, erradicación del troyano y persistencias en registro, auditoría forense de propiedad intelectual de imágenes/código y redefinición mandatoria de privilegios mínimos (GPO/AppLocker).',
    mitigationMeasures: [
      'Aislamiento de VLAN y bloqueo de tráfico perimetral saliente hacia la IP del servidor C2.',
      'Revocación inmediata de privilegios de administrador local en las 20 estaciones de trabajo afectadas.',
      'Extracción pericial de volcados de memoria RAM y muestras de software_gratis.exe para análisis en sandbox.',
      'Implementación de Directivas de Grupo (GPO) con AppLocker para restringir ejecución de binarios no firmados.',
      'Auditoría y purga de activos gráficos utilizados comercialmente con marcas de agua de terceros.',
    ],
    applicableRegulations: ['LEY-64-2012', 'LEY-35-1996', 'CONV-BERNA', 'LEY-51-2008'],
    evidenceCount: 3,
    daysLoggedCount: 5,
    evidence: [
      {
        id: 'ev-002-1',
        evidenceCode: 'EV-2026-002-A',
        name: 'Instalador Malicioso - software_gratis.exe',
        description: 'Binario descargado desde portal no oficial que contenía un droppeador de troyano empaquetado en UPX con capacidades de keylogging y backdoor.',
        fileType: 'application/x-dosexec',
        fileSize: '12.4 MB',
        hashSha256: '5d41402abc4b2a76b9719d911017c592b0e77402dc4549f39003ffea3decd101',
        chainOfCustodyCustodian: 'Teniente Elena De La Rosa (CIB-102-FOR)',
        collectionTimestamp: '2026-02-18T11:00:00Z',
        extractionLocation: 'Estación WS-DSGN-04: C:\\Users\\Diseno\\Downloads\\software_gratis.exe',
        isCompromised: true,
        notes: 'Muestra infectada analizada en CIB Sandbox. Conexión hacia IP 185.220.101.44.',
      },
      {
        id: 'ev-002-2',
        evidenceCode: 'EV-2026-002-B',
        name: 'Captura de Tráfico C2 - beaconing_c2_traffic.pcap',
        description: 'Tráfico de red capturado en el switch de borde que evidencia balizamiento (beaconing) periódico cada 60 segundos hacia infraestructura C2 en el extranjero.',
        fileType: 'network/pcap',
        fileSize: '840 MB',
        hashSha256: '7b52009b64fd0a2a49e6d8a939753077792b0554aca504529d020088998de45a',
        chainOfCustodyCustodian: 'Subteniente Carlos Bethancourt (CIB-103-FOR)',
        collectionTimestamp: '2026-02-19T14:30:00Z',
        extractionLocation: 'Firewall Perimetral Corporativo / Interfaz LAN Segmento Diseño',
        isCompromised: true,
        notes: 'Exfiltración de credenciales en memoria y capturas de pantalla de estaciones de diseño.',
      },
      {
        id: 'ev-002-3',
        evidenceCode: 'EV-2026-002-C',
        name: 'Dossier de Imágenes Infractoras y Código Copiado',
        description: 'Compilado pericial de 35 artes publicitarios con marcas de agua borradas digitalmente y código de plantillas web sustraídas sin licencia comercial.',
        fileType: 'application/zip',
        fileSize: '2.1 GB',
        hashSha256: '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e1646daacb2299',
        chainOfCustodyCustodian: 'Lic. Fernando Quintero (CIB-202-AUD)',
        collectionTimestamp: '2026-02-20T10:15:00Z',
        extractionLocation: 'Servidor NAS Compartido: \\\\NAS-CORP\\Diseno\\Campanas_2026\\',
        isCompromised: true,
        notes: 'Infracción civil y penal bajo la Ley 64 de 2012 y Tratados OMPI de Derechos de Autor.',
      },
    ],
    timeline: [
      {
        dayNumber: 1,
        title: 'Día 1: Detección de Alertas de Tráfico y Aislamiento Inicial',
        timestamp: '2026-02-18T09:00:00Z',
        leadInvestigator: 'Capitán Alberto Castillero',
        actionsTaken: [
          'Detección de anomalías en el IDS por comunicaciones repetitivas en puerto 4444 saliente.',
          'Identificación de 20 máquinas de la subred 192.168.40.0/24 con conexiones activas sospechosas.',
          'Orden de desconexión preventiva de cables de red y apagado de interfaces WiFi en el departamento.',
        ],
        findings: '20 computadoras infectadas con troyano con persistencia en el registro de Windows.',
        telemetryLogs: [
          '09:12:00 IDS ALERT: Outbound suspicious TCP connection from 192.168.40.10 to 185.220.101.44:4444',
          '09:45:00 VLAN 40 (Design) isolated from core routing table',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 2,
        title: 'Día 2: Triaje Forense de Artefactos y Volcado de RAM',
        timestamp: '2026-02-19T08:30:00Z',
        leadInvestigator: 'Teniente Elena De La Rosa',
        actionsTaken: [
          'Extracción de imágenes forenses de memoria RAM en las máquinas con mayor actividad de tráfico.',
          'Localización del vector de entrada: instalador software_gratis.exe ejecutado a las 08:15 am.',
          'Comprobación de que todos los diseñadores contaban con privilegios de administrador local sin restricciones.',
        ],
        findings: 'El troyano inyectó módulos DLL en procesos explorer.exe y svchost.exe para evasión de antivirus.',
        telemetryLogs: [
          '11:20:00 VOLATILITY: Injected DLL detected in explorer.exe PID 4120',
          '14:00:00 REGISTRY PERSISTENCE: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WinUpdater',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 3,
        title: 'Día 3: Auditoría Normativa de Propiedad Intelectual',
        timestamp: '2026-02-20T10:00:00Z',
        leadInvestigator: 'Lic. Fernando Quintero',
        actionsTaken: [
          'Inspección de las bibliotecas de recursos gráficos almacenadas en el servidor NAS de diseño.',
          'Identificación de obras fotográficas protegidas con marcas de agua clonadas o editadas.',
          'Verificación de licencias de software: 14 de las 20 máquinas utilizaban software de edición sin licencia comercial válida.',
        ],
        findings: 'Exposición a demandas por infracción de derechos patrimoniales y morales de autor bajo la Ley 64 de 2012.',
        telemetryLogs: [
          '10:30:00 AUDIT FOUND: 35 commercial assets lacking proof of license purchase',
          '15:00:00 COPYRIGHT INFRINGEMENT: Stock photo watermark removal detected in published banners',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 4,
        title: 'Día 4: Evaluación de Impacto (P × I = 16) y Matriz de Riesgo',
        timestamp: '2026-02-21T11:00:00Z',
        leadInvestigator: 'Ing. Rodrigo Villarreal',
        actionsTaken: [
          'Determinación de Probabilidad 4 (Frecuente por falta de políticas de usuario) e Impacto 4 (Severo por fuga y demandas).',
          'Riesgo Evaluado: 16 (Nivel ALTO). Requiere remediación integral de controles de seguridad de punto final.',
          'Modelado de impacto financiero por interrupción operativa y posibles sanciones por piratería de software.',
        ],
        findings: 'Vulnerabilidad estructural en la arquitectura de privilegios y concienciación del personal.',
        telemetryLogs: [
          '11:00:00 RISK CALCULATION: Probability 4 x Impact 4 = 16 (ALTO)',
          '16:30:00 RECOMMENDATION: Full endpoint reimaging and deployment of AppLocker allowlisting',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 5,
        title: 'Día 5: Asignación al Estudiante y Plan de Contención',
        timestamp: '2026-02-22T14:00:00Z',
        leadInvestigator: 'Capitán Alberto Castillero',
        actionsTaken: [
          'Caso mantenido en estado ABIERTO para resolución y plan de contingencia por el Grupo 2.',
          'Requerimiento de políticas GPO de privilegios mínimos y desinstalación de herramientas sin licencia.',
          'Revisión pericial de las medidas para reincorporar las 20 estaciones de trabajo a la red institucional.',
        ],
        findings: 'Expediente listo para ejecución de medidas correctivas y dictamen final por el equipo forense estudiantil.',
        telemetryLogs: [
          '14:00:00 CASE CIB-2026-002-PC20 STATUS: ABIERTO. ASSIGNED TO STUDENT GROUP 2.',
        ],
        chainOfCustodyVerified: true,
      },
    ],
    interrogations: [
      {
        id: 'q-002-1',
        questionNumber: 1,
        scenarioContext: 'Durante la entrevista con el Jefe de Soporte Técnico:',
        questionText: 'Si los diseñadores necesitaban instalar fuentes y plugins urgentemente para cumplir con una entrega, ¿es una práctica aceptable dejarles permisos de administrador local permanente en sus computadoras?',
        trickTrapDescription:
          'Trampa de conveniencia operativa frente a los principios fundamentales de ciberseguridad defensiva.',
        expectedForensicAnswer:
          'FALSO. El principio de privilegios mínimos (Least Privilege) prohíbe que usuarios estándar operen con credenciales de administrador local en estaciones corporativas. Toda instalación debe gestionarse vía portal de autoservicio controlado o software centralizado para evitar la ejecución de malware como software_gratis.exe.',
        legalBasis: 'Estándar ISO/IEC 27001 (Control A.9.4.4) y Guía de Controles Críticos CIS Control 5.',
        difficulty: 'INTERMEDIO',
      },
      {
        id: 'q-002-2',
        questionNumber: 2,
        scenarioContext: 'Interpelación legal sobre los artes publicitarios utilizados:',
        questionText: 'Si una imagen está disponible en Google Imágenes y la empresa la utilizó en una campaña publicitaria eliminando la marca de agua, ¿se considera uso legítimo (fair use) en la República de Panamá?',
        trickTrapDescription:
          'Mito común de que las imágenes en buscadores de acceso público carecen de derechos de autor.',
        expectedForensicAnswer:
          'FALSO. En Panamá, la Ley 64 de 2012 y el Convenio de Berna protegen toda obra original desde su creación. El uso comercial sin licencia y la eliminación intencional de la marca de agua o información de gestión de derechos constituye una infracción deliberada con responsabilidad civil y penal.',
        legalBasis: 'Ley 64 de 2012 sobre Derecho de Autor (Artículos 23, 24 y 157) y Convenio de Berna.',
        difficulty: 'AVANZADO',
      },
    ],
  },

  // 3. Caso CIB-2026-003-PE: OPERACIÓN PORTAL-ESTATAL
  {
    id: 'case-003',
    codigo: 'CIB-2026-003-PE',
    title: 'Vulnerabilidad RCE en Componente Externo y Cuentas Domain Admin del Proveedor sin MFA',
    operationCodename: 'Operación Portal-Estatal',
    summary:
      'Auditoría y triaje pericial en el Portal Web de Atención Ciudadana e Infraestructura Gubernamental. Se identificó la omisión de un parche de seguridad crítico (Ejecución Remota de Código - RCE) en un componente de terceros expuesto a Internet, acumulando más de 90 días sin remediación. Adicionalmente, el proveedor tecnológico contratado mantiene 5 cuentas de Domain Admin activas sin bitácoras de auditoría, sin rotación de credenciales y sin autenticación multifactor (MFA).',
    classification: 'SECRETO DE ESTADO',
    status: 'ABIERTO', // Activo para resolución estudiantil (Grupo 3)
    vector: 'ZERO_DAY_EXPLOIT',
    probability: 4,
    impact: 5,
    riskScore: 20, // P(4) * I(5) = 20 (CRÍTICO)
    leadInvestigatorBadge: 'CIB-001-DIR',
    leadInvestigatorEmail: 'usuario1@cib.gob.pa',
    leadInvestigatorName: 'Comisionado Rafael Mendoza',
    targetEntity: 'Portal Web de Atención Ciudadana e Infraestructura de Directorio Activo Gubernamental',
    detectedAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-25T20:00:00Z',
    studentMission:
      'Formular el plan de contingencia inmediata ante la AIG, aplicar controles compensatorios en WAF, revocar cuentas Domain Admin permanentes del proveedor e implementar el modelo de acceso PAM/MFA para mitigar el riesgo de cadena de suministro.',
    mitigationMeasures: [
      'Orden formal de congelamiento temporal de la plataforma o activación de regla virtual patching en WAF.',
      'Revocación pericial inmediata de las 5 credenciales Domain Admin asignadas al contratista externo.',
      'Aplicación urgente del parche oficial de seguridad en el servidor de pruebas y pase controlado a producción.',
      'Implementación mandatoria de solución PAM (Privileged Access Management) con MFA y sesiones grabadas.',
      'Remisión del informe pericial vinculante a la AIG conforme a la Resolución No. 18-2026.',
    ],
    applicableRegulations: ['RES-AIG-18-2026', 'LEY-81-2019', 'DEC-EJEC-709-2011', 'NIST-SP-800-61'],
    evidenceCount: 3,
    daysLoggedCount: 5,
    evidence: [
      {
        id: 'ev-003-1',
        evidenceCode: 'EV-2026-003-A',
        name: 'Reporte de Vulnerabilidad CVE-2025-48812 (RCE Crítico)',
        description: 'Dictamen de análisis de vulnerabilidades perimetral que constata la presencia de un fallo de ejecución remota de código en el módulo de carga de formularios del portal gubernamental.',
        fileType: 'application/pdf',
        fileSize: '4.2 MB',
        hashSha256: 'bc529431e5bb02030405060708090a0b0c0d0e0f101112131415161718192021',
        chainOfCustodyCustodian: 'Teniente Elena De La Rosa (CIB-102-FOR)',
        collectionTimestamp: '2026-01-20T10:15:00Z',
        extractionLocation: 'Servidor Web Producción SRV-GOB-WEB01 (IP 192.168.10.50)',
        isCompromised: true,
        notes: 'CVSS v3.1 Base Score: 9.8 (CRÍTICO). Parche emitido por el fabricante hace 90 días no aplicado.',
      },
      {
        id: 'ev-003-2',
        evidenceCode: 'EV-2026-003-B',
        name: 'Auditoría de Cuentas Activas - Active Directory Dump',
        description: 'Extracción pericial de objetos de usuario del Directorio Activo que revela 5 cuentas pertenecientes al proveedor externo con membresía en Domain Admins sin expiración ni MFA.',
        fileType: 'text/csv',
        fileSize: '18.4 MB',
        hashSha256: 'de0102030405060708090a0b0c0d0e0f10111213141516171819202122232425',
        chainOfCustodyCustodian: 'Capitán Alberto Castillero (CIB-101-FOR)',
        collectionTimestamp: '2026-01-21T13:45:00Z',
        extractionLocation: 'Controlador de Dominio Primario DC01.GOB.PA',
        isCompromised: true,
        notes: 'Violación directa de la Resolución AIG 18-2026 sobre gestión de accesos privilegiados a contratistas.',
      },
      {
        id: 'ev-003-3',
        evidenceCode: 'EV-2026-003-C',
        name: 'Trazas de Conexiones RDP sin Cifrado y sin MFA',
        description: 'Registros de eventos de seguridad (Event ID 4624) que evidencian accesos remotos nocturnos desde direcciones IP residenciales utilizando las credenciales del proveedor sin verificación en dos pasos.',
        fileType: 'application/octet-stream',
        fileSize: '1.2 GB',
        hashSha256: 'fa3132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f',
        chainOfCustodyCustodian: 'Subteniente Carlos Bethancourt (CIB-103-FOR)',
        collectionTimestamp: '2026-01-22T08:00:00Z',
        extractionLocation: 'Servidor Gateway VPN/RDP Institucional',
        isCompromised: false,
        notes: 'Ausencia total de trazabilidad sobre qué operador humano utilizó cada cuenta compartida.',
      },
    ],
    timeline: [
      {
        dayNumber: 1,
        title: 'Día 1: Notificación de Hallazgos y Apertura de Expediente',
        timestamp: '2026-01-20T08:00:00Z',
        leadInvestigator: 'Comisionado Rafael Mendoza',
        actionsTaken: [
          'Apertura del expediente oficial CIB-2026-003-PE ante alerta remitida por CSIRT Panamá.',
          'Emisión de orden de aseguramiento pericial sobre el servidor web y el controlador de dominio.',
          'Citación urgente al Oficial de Seguridad de la Información (CISO) de la entidad estatal.',
        ],
        findings: 'Portal gubernamental de atención ciudadana con vulnerabilidad RCE crítica expuesta sin mitigación.',
        telemetryLogs: [
          '08:00:00 CSIRT-PANAMA DISPATCH: Critical vulnerability detected in public portal IP 200.46.x.x',
          '09:30:00 CIB INVESTIGATOR TEAM DEPLOYED TO GOVERNMENT DATA CENTER',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 2,
        title: 'Día 2: Inspección del Directorio Activo y Accesos del Proveedor',
        timestamp: '2026-01-21T09:30:00Z',
        leadInvestigator: 'Capitán Alberto Castillero',
        actionsTaken: [
          'Extracción y análisis de cuentas con privilegios elevados en el Directorio Activo.',
          'Constatación de 5 cuentas Domain Admin creadas para el proveedor externo en 2023 nunca revocadas.',
          'Verificación de que las contraseñas no se modifican desde hace 18 meses y carecen de segundo factor de autenticación.',
        ],
        findings: 'El proveedor posee control administrativo total sobre toda la red institucional del Estado sin supervisión.',
        telemetryLogs: [
          '11:15:00 AD AUDIT: 5 accounts with Domain Admin membership belonging to "ext-consulting"',
          '14:22:00 PASSWORD AGE: Last changed 542 days ago. MFA Status: DISABLED',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 3,
        title: 'Día 3: Auditoría Normativa y Contravención de Resolución AIG',
        timestamp: '2026-01-22T10:00:00Z',
        leadInvestigator: 'Licda. Mireya Solís',
        actionsTaken: [
          'Evaluación de cumplimiento frente a la Resolución AIG No. 18-2026 y Decreto Ejecutivo 709 de 2011.',
          'Determinación de incumplimiento grave del Artículo 11 (Prohibición de plataformas vulnerables en producción).',
          'Determinación de incumplimiento de la Ley 81 de 2019 al exponer datos de millones de trámites ciudadanos.',
        ],
        findings: 'Violación directa de la directriz vinculante gubernamental con potencial sanción administrativa y penal.',
        telemetryLogs: [
          '10:30:00 REGULATORY BREACH: Res. AIG 18-2026 Art. 11 & Ley 81 Art. 4 violation confirmed',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 4,
        title: 'Día 4: Matriz de Severidad (P × I = 20) y Riesgo Crítico',
        timestamp: '2026-01-23T11:45:00Z',
        leadInvestigator: 'Ing. Rodrigo Villarreal',
        actionsTaken: [
          'Evaluación de Probabilidad 4 (Frecuente / Escaneos constantes) e Impacto 5 (Catastrófico / Compromiso total del Estado).',
          'Puntaje de Riesgo: 20/25 (Nivel CRÍTICO). Umbral de intervención inmediata del Comisionado Director.',
          'Identificación de vector de propagación lateral hacia bases de datos de identidad ciudadana.',
        ],
        findings: 'Riesgo inminente de toma de control gubernamental por ciberdelincuentes internacionales.',
        telemetryLogs: [
          '11:45:00 RISK EVALUATION P(4) x I(5) = 20. CLASSIFICATION: CRITICO (MAXIMUM SEVERITY)',
        ],
        chainOfCustodyVerified: true,
      },
      {
        dayNumber: 5,
        title: 'Día 5: Asignación al Estudiante y Plan de Remediación Obligatoria',
        timestamp: '2026-01-24T15:00:00Z',
        leadInvestigator: 'Comisionado Rafael Mendoza',
        actionsTaken: [
          'Expediente radicado en estado ABIERTO para que el Grupo 3 estructure el plan de remediación ante la AIG.',
          'Requerimiento de directiva de aplicación de parche y controles compensatorios WAF en ambiente de pruebas.',
          'Requerimiento de revocación inmediata de cuentas permanentes y transición a esquema PAM con MFA.',
        ],
        findings: 'Expediente listo para resolución y cierre procesal en el sistema por el equipo de ciberinvestigadores.',
        telemetryLogs: [
          '15:00:00 CASE CIB-2026-003-PE STATUS: ABIERTO. ASSIGNED TO STUDENT GROUP 3 FOR RESOLUTION.',
        ],
        chainOfCustodyVerified: true,
      },
    ],
    interrogations: [
      {
        id: 'q-003-1',
        questionNumber: 1,
        scenarioContext: 'Durante la interpelación técnica en la Asamblea Nacional:',
        questionText: 'Si el fabricante del software tardó meses en liberar el parche de seguridad y el sistema es para atender ciudadanos, ¿la institución pública puede mantener la plataforma operando en Internet sin problemas legales argumentando que la culpa es del fabricante?',
        trickTrapDescription:
          'Trampa de derivación de culpa a terceros proveedores de software.',
        expectedForensicAnswer:
          'FALSO. La Resolución AIG No. 18-2026 establece de forma imperativa la prohibición estricta de poner o mantener en producción plataformas estatales con interacción ciudadana que contengan vulnerabilidades críticas no mitigadas. La institución está obligada por ley a implementar controles compensatorios inmediatos (como WAF virtual patching) o suspender temporalmente el servicio hasta garantizar la seguridad.',
        legalBasis: 'Resolución AIG No. 18-2026 (Capítulo IV, Artículo 11 - Prohibición de Vulnerabilidades Críticas).',
        difficulty: 'AVANZADO',
      },
      {
        id: 'q-003-2',
        questionNumber: 2,
        scenarioContext: 'Audiencia de Rendición de Cuentas ante la ANTAI:',
        questionText: 'Si ocurre un hackeo a la base de datos a través de la cuenta del proveedor externo, ¿la responsabilidad legal ante la ANTAI y los ciudadanos recae únicamente sobre el proveedor y no sobre la institución pública?',
        trickTrapDescription:
          'Intento de transferir la responsabilidad como custodio de datos públicos.',
        expectedForensicAnswer:
          'FALSO. Bajo la Ley 81 de 2019, la institución pública es el Responsable del Tratamiento y tiene la obligación legal y constitucional de custodia. El proveedor externo actúa únicamente como Encargado. La institución es legalmente responsable por la falta de supervisión, falta de MFA y ausencia de controles de acceso sobre sus contratistas.',
        legalBasis: 'Ley 81 de 2019 (Responsabilidad del Responsable del Tratamiento vs. Encargado).',
        difficulty: 'CRITICO',
      },
    ],
  },

  // ===========================================================================
  // 🔴 CASOS CERRADOS / ARCHIVADOS (Dossier histórico de precedentes)
  // ===========================================================================

  // 4. Caso CIB-2025-014-RX: OPERACIÓN BLACK-VAULT
  {
    id: 'case-004',
    codigo: 'CIB-2025-014-RX',
    title: 'Ransomware LockBit 3.0 en Sector Salud y Exfiltración de Expedientes Clínicos',
    operationCodename: 'Operación Black-Vault',
    summary:
      'Ataque de ransomware de doble extorsión perpetrado contra una red hospitalaria privada mediante intrusión inicial por un puerto RDP expuesto a Internet sin MFA. Los atacantes exfiltraron 120 GB de expedientes clínicos y cifraron servidores de base de datos hospitalaria exigiendo rescate en criptomonedas.',
    classification: 'SECRETO DE ESTADO',
    status: 'CERRADO',
    vector: 'RANSOMWARE',
    probability: 5,
    impact: 5,
    riskScore: 25, // P(5) * I(5) = 25 (CRÍTICO MÁXIMO)
    leadInvestigatorBadge: 'CIB-001-DIR',
    leadInvestigatorEmail: 'usuario1@cib.gob.pa',
    leadInvestigatorName: 'Comisionado Rafael Mendoza',
    targetEntity: 'Red Hospitalaria Privada y Servidores de Expedientes Clínicos',
    detectedAt: '2025-09-15T03:00:00Z',
    sealedAt: '2025-09-30T17:00:00Z',
    updatedAt: '2025-09-30T17:00:00Z',
    studentMission: 'Precedente jurisprudencial sobre prohibición de pago de rescate y restauración desde respaldos inmutables.',
    mitigationMeasures: [
      'Prohibición tajante del pago de rescate conforme a lineamientos internacionales y Código Penal.',
      'Reconstrucción total de servidores desde respaldos fríos inmutables (air-gapped) verificados.',
      'Cierre y eliminación de puertos RDP expuestos a WAN y migración a VPN con túnel IPsec y MFA.',
      'Sanción máxima impuesta por la ANTAI por negligencia grave en la custodia de datos sensibles de salud.',
    ],
    applicableRegulations: ['LEY-81-2019', 'COD-PENAL-PANAMA', 'DEC-EJEC-709-2011'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 5. Caso CIB-2025-022-SW: OPERACIÓN PHISH-FINANCE
  {
    id: 'case-005',
    codigo: 'CIB-2025-022-SW',
    title: 'Fraude BEC con Dominio Homógrafo y Desvío de Transferencias Comerciales',
    operationCodename: 'Operación Phish-Finance',
    summary:
      'Suplantación de identidad ejecutiva (Business Email Compromise) mediante el registro de un dominio homógrafo (typosquatting) simulando la identidad del Director Financiero. Se desviaron dos transferencias bancarias internacionales por $450,000 mediante facturas adulteradas.',
    classification: 'CONFIDENCIAL',
    status: 'CERRADO',
    vector: 'PHISHING_SPEAR',
    probability: 3,
    impact: 4,
    riskScore: 12, // P(3) * I(4) = 12 (MEDIO)
    leadInvestigatorBadge: 'CIB-201-AUD',
    leadInvestigatorEmail: 'auditor1@cib.gob.pa',
    leadInvestigatorName: 'Licda. Mireya Solís',
    targetEntity: 'Dirección de Finanzas y Proveedores de Comercio Internacional',
    detectedAt: '2025-10-02T10:00:00Z',
    sealedAt: '2025-10-15T16:00:00Z',
    updatedAt: '2025-10-15T16:00:00Z',
    studentMission: 'Precedente sobre congelamiento de fondos y configuración estricta de SPF/DKIM/DMARC.',
    mitigationMeasures: [
      'Congelamiento bancario preventivo a través de la Unidad de Análisis Financiero (UAF).',
      'Despliegue mandatorio de registros SPF, DKIM y DMARC con política estricta p=reject en servidores de correo.',
      'Implementación de llaves físicas de seguridad FIDO2 para toda autorización de transferencias.',
    ],
    applicableRegulations: ['LEY-51-2008', 'LEY-23-2015', 'COD-PENAL-PANAMA'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 6. Caso CIB-2025-031-SC: OPERACIÓN DEPENDENCY-POISON
  {
    id: 'case-006',
    codigo: 'CIB-2025-031-SC',
    title: 'Envenenamiento de Paquete NPM en Pasarela de Pagos Interna de Fintech',
    operationCodename: 'Operación Dependency-Poison',
    summary:
      'Ataque a la cadena de suministro de software mediante la publicación de una versión comprometida de una biblioteca abierta en NPM utilizada en la pasarela de pagos interna de una fintech panameña. El paquete capturaba números de tarjeta de crédito antes del cifrado.',
    classification: 'RESERVADO',
    status: 'CERRADO',
    vector: 'SUPPLY_CHAIN',
    probability: 2,
    impact: 5,
    riskScore: 10, // P(2) * I(5) = 10 (MEDIO)
    leadInvestigatorBadge: 'CIB-102-FOR',
    leadInvestigatorEmail: 'forense2@cib.gob.pa',
    leadInvestigatorName: 'Teniente Elena De La Rosa',
    targetEntity: 'Pasarela de Pagos Digitales y Pipeline CI/CD Fintech Panamá',
    detectedAt: '2025-10-25T14:00:00Z',
    sealedAt: '2025-11-04T18:00:00Z',
    updatedAt: '2025-11-04T18:00:00Z',
    studentMission: 'Precedente forense sobre Software Bill of Materials (SBOM) y análisis estático de composición.',
    mitigationMeasures: [
      'Remoción inmediata de la dependencia infectada y congelamiento del repositorio de artefactos.',
      'Implementación obligatoria de firmas SBOM en pipelines de integración continua (CI/CD).',
      'Despliegue de herramientas de Software Composition Analysis (SCA) y bloqueo de dependencias huérfanas.',
    ],
    applicableRegulations: ['LEY-51-2008', 'PCI-DSS-4', 'NIST-SP-800-161'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 7. Caso CIB-2025-045-AP: OPERACIÓN SHADOW-API
  {
    id: 'case-007',
    codigo: 'CIB-2025-045-AP',
    title: 'Fuga de Datos por BOLA en Endpoints REST Móviles de Consulta de Saldos',
    operationCodename: 'Operación Shadow-API',
    summary:
      'Vulnerabilidad de Autorización Rota a Nivel de Objeto (BOLA / OWASP API1) en los endpoints REST del backend móvil de una institución bancaria. Un usuario autenticado podía consultar saldos e historiales de terceros simplemente incrementando el parámetro accountId en las peticiones JSON.',
    classification: 'CONFIDENCIAL',
    status: 'CERRADO',
    vector: 'API_VULNERABILITY',
    probability: 4,
    impact: 4,
    riskScore: 16, // P(4) * I(4) = 16 (ALTO)
    leadInvestigatorBadge: 'CIB-101-FOR',
    leadInvestigatorEmail: 'forense1@cib.gob.pa',
    leadInvestigatorName: 'Capitán Alberto Castillero',
    targetEntity: 'API Gateway y Plataforma de Banca Móvil',
    detectedAt: '2025-11-10T12:00:00Z',
    sealedAt: '2025-11-20T17:30:00Z',
    updatedAt: '2025-11-20T17:30:00Z',
    studentMission: 'Precedente de auditoría de APIs, validación de titularidad de token JWT y control BOLA.',
    mitigationMeasures: [
      'Reescritura del middleware de autorización en el API Gateway para contrastar el token JWT contra el ID del recurso.',
      'Auditoría y pentesting mandatorio de todos los endpoints públicos antes del pase a producción.',
      'Sanción administrativa y requerimiento de plan de remediación emitido por la Superintendencia de Bancos.',
    ],
    applicableRegulations: ['LEY-81-2019', 'OWASP-API-TOP10', 'ACUERDO-SBP-2020'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 8. Caso CIB-2025-058-IN: OPERACIÓN MOLE-INSIDER
  {
    id: 'case-008',
    codigo: 'CIB-2025-058-IN',
    title: 'Amenaza Interna y Espionaje Industrial por Exfiltración a Repositorio Privado',
    operationCodename: 'Operación Mole-Insider',
    summary:
      'Un ingeniero senior de infraestructura descontento descargó 40 GB de planos industriales, fórmulas químicas y algoritmos propietarios hacia un repositorio privado de GitHub horas antes de presentar su renuncia formal para incorporarse a una empresa competidora.',
    classification: 'SECRETO DE ESTADO',
    status: 'CERRADO',
    vector: 'INSIDER_THREAT',
    probability: 2,
    impact: 5,
    riskScore: 10, // P(2) * I(5) = 10 (MEDIO)
    leadInvestigatorBadge: 'CIB-202-AUD',
    leadInvestigatorEmail: 'auditor2@cib.gob.pa',
    leadInvestigatorName: 'Lic. Fernando Quintero',
    targetEntity: 'Servidor Central de Desarrollo y Repositorios Industriales',
    detectedAt: '2025-11-28T16:00:00Z',
    sealedAt: '2025-12-05T19:00:00Z',
    updatedAt: '2025-12-05T19:00:00Z',
    studentMission: 'Precedente legal y forense sobre secreto comercial, cadena de custodia de proxy y medidas DLP.',
    mitigationMeasures: [
      'Extracción pericial de bitácoras de Git y tráfico de proxy corporativo confirmando la exfiltración.',
      'Diligencia judicial de secuestro y confiscación de dispositivos personales involucrados.',
      'Despliegue corporativo de agentes DLP (Data Loss Prevention) y bloqueo de repositorios externos en la red corporativa.',
    ],
    applicableRegulations: ['LEY-35-1996', 'COD-PENAL-PANAMA', 'COD-TRABAJO-PANAMA'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 9. Caso CIB-2025-067-DD: OPERACIÓN BOT-TSUNAMI
  {
    id: 'case-009',
    codigo: 'CIB-2025-067-DD',
    title: 'Ataque DDoS Volumétrico de 450 Gbps contra Servidores DNS de ISP Nacional',
    operationCodename: 'Operación Bot-Tsunami',
    summary:
      'Ataque de denegación de servicio distribuido (DDoS) volumétrico masivo por amplificación DNS y NTP que generó picos de 450 Gbps contra los resolvedores primarios de un ISP, afectando la navegación de más de 300,000 usuarios en el territorio nacional durante 4 horas.',
    classification: 'RESERVADO',
    status: 'CERRADO',
    vector: 'DDOS_INFRASTRUCTURE',
    probability: 4,
    impact: 3,
    riskScore: 12, // P(4) * I(3) = 12 (MEDIO)
    leadInvestigatorBadge: 'CIB-103-FOR',
    leadInvestigatorEmail: 'forense3@cib.gob.pa',
    leadInvestigatorName: 'Subteniente Carlos Bethancourt',
    targetEntity: 'Centro de Datos y Servidores DNS Primarios de Telecomunicaciones',
    detectedAt: '2025-12-12T18:00:00Z',
    sealedAt: '2025-12-18T20:00:00Z',
    updatedAt: '2025-12-18T20:00:00Z',
    studentMission: 'Precedente de defensa de infraestructura crítica de telecomunicaciones y mitigación Anycast.',
    mitigationMeasures: [
      'Redirección inmediata de tráfico hacia centros de depuración (Scrubbing Centers) en capa de tránsito.',
      'Implementación de Response Rate Limiting (RRL) en todos los resolvedores DNS autoritativos.',
      'Ampliación de acuerdos BGP Anycast para absorción distribuida de tráfico anómalo en múltiples puntos de presencia.',
    ],
    applicableRegulations: ['LEY-36-1996', 'DEC-EJEC-709-2011', 'COD-PENAL-PANAMA'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 10. Caso CIB-2025-073-CL: OPERACIÓN OPEN-BUCKET
  {
    id: 'case-010',
    codigo: 'CIB-2025-073-CL',
    title: 'Bucket AWS S3 Público con Exposición de Contratos y Planillas Indexadas',
    operationCodename: 'Operación Open-Bucket',
    summary:
      'Configuración errónea de permisos en un depósito en la nube (AWS S3) que otorgaba permisos de lectura pública sin autenticación. Motores de búsqueda indexaron más de 80,000 documentos confidenciales que incluían contratos mercantiles, nóminas de salarios y copias de pasaportes.',
    classification: 'CONFIDENCIAL',
    status: 'CERRADO',
    vector: 'CLOUD_MISCONFIGURATION',
    probability: 5,
    impact: 3,
    riskScore: 15, // P(5) * I(3) = 15 (ALTO)
    leadInvestigatorBadge: 'CIB-301-RSK',
    leadInvestigatorEmail: 'riesgo1@cib.gob.pa',
    leadInvestigatorName: 'Ing. Rodrigo Villarreal',
    targetEntity: 'Almacenamiento Cloud AWS S3 Corporativo',
    detectedAt: '2025-12-20T08:00:00Z',
    sealedAt: '2025-12-28T16:00:00Z',
    updatedAt: '2025-12-28T16:00:00Z',
    studentMission: 'Precedente sobre auditoría de posturas de seguridad cloud (CSPM) y desindexación pericial.',
    mitigationMeasures: [
      'Activación de directiva Block Public Access a nivel de cuenta raíz de AWS con efecto retroactivo.',
      'Rotación mandatoria y revocación de todas las credenciales IAM con acceso al bucket.',
      'Gestión formal ante buscadores internacionales para purga acelerada de resultados de caché indexados.',
    ],
    applicableRegulations: ['LEY-81-2019', 'ISO-IEC-27017', 'CIS-BENCHMARKS-AWS'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 11. Caso CIB-2025-081-OT: OPERACIÓN STUX-GRID
  {
    id: 'case-011',
    codigo: 'CIB-2025-081-OT',
    title: 'Intrusión a Red SCADA de Subestación Eléctrica por Módem Celular sin Segmentación',
    operationCodename: 'Operación Stux-Grid',
    summary:
      'Detección de comandos anómalos en el bus Modbus de los controladores lógicos programables (PLCs) de una subestación de transmisión eléctrica. La intrusión se originó a través de un módem 4G de telemetría de respaldo conectado directamente a la red operativa sin cortafuegos.',
    classification: 'SECRETO DE ESTADO',
    status: 'CERRADO',
    vector: 'SCADA_ICS_INTRUSION',
    probability: 1,
    impact: 5,
    riskScore: 5, // P(1) * I(5) = 5 (BAJO por contención temprana)
    leadInvestigatorBadge: 'CIB-302-RSK',
    leadInvestigatorEmail: 'riesgo2@cib.gob.pa',
    leadInvestigatorName: 'Ing. Diana Montero',
    targetEntity: 'Subestación de Transmisión Eléctrica y Red OT / SCADA',
    detectedAt: '2026-01-02T02:00:00Z',
    sealedAt: '2026-01-10T15:00:00Z',
    updatedAt: '2026-01-10T15:00:00Z',
    studentMission: 'Precedente sobre seguridad en infraestructuras críticas industriales, modelo Purdue y diodos de datos.',
    mitigationMeasures: [
      'Desconexión física inmediata del módem celular y aislamiento de los buses de comunicación Modbus.',
      'Implementación estricta de la arquitectura de zonas y conductos del Modelo Purdue (ISA/IEC 62443).',
      'Instalación de diodos de datos unidireccionales (Data Diodes) para la exportación de telemetría sin retorno.',
    ],
    applicableRegulations: ['ISA-IEC-62443', 'NIST-CSF-CRITICAL', 'DEC-EJEC-709-2011'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 12. Caso CIB-2025-094-DS: OPERACIÓN WATERING-HOLE
  {
    id: 'case-012',
    codigo: 'CIB-2025-094-DS',
    title: 'Inyección JavaScript en WordPress Gremial Jurídico para Descarga de Infostealer',
    operationCodename: 'Operación Watering-Hole',
    summary:
      'Compromiso del gestor de contenidos (WordPress) del portal de una asociación gremial de abogados mediante inyección SQL. Los ciberatacantes incrustaron un script malicioso en la cabecera del portal que descargaba un ladrón de información (infostealer) a los profesionales que visitaban la web.',
    classification: 'RESERVADO',
    status: 'CERRADO',
    vector: 'WATERING_HOLE',
    probability: 3,
    impact: 3,
    riskScore: 9, // P(3) * I(3) = 9 (MEDIO)
    leadInvestigatorBadge: 'CIB-102-FOR',
    leadInvestigatorEmail: 'forense2@cib.gob.pa',
    leadInvestigatorName: 'Teniente Elena De La Rosa',
    targetEntity: 'Portal Web CMS de Asociación Gremial Jurídica',
    detectedAt: '2026-01-15T10:00:00Z',
    sealedAt: '2026-01-22T17:00:00Z',
    updatedAt: '2026-01-22T17:00:00Z',
    studentMission: 'Precedente sobre mitigación de ataques tipo Watering Hole y migración a arquitecturas estáticas Jamstack.',
    mitigationMeasures: [
      'Limpieza pericial de código inyectado y saneamiento de la base de datos MySQL.',
      'Aislamiento de la aplicación en contenedor Docker reforzado con lectura exclusiva del sistema de archivos.',
      'Migración de la arquitectura web hacia generador de sitios estáticos (Jamstack) sin backend de administración expuesto.',
    ],
    applicableRegulations: ['LEY-51-2008', 'COD-PENAL-PANAMA'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 13. Caso CIB-2025-102-AI: OPERACIÓN PROMPT-LEAK
  {
    id: 'case-013',
    codigo: 'CIB-2025-102-AI',
    title: 'Inyección Indirecta de Prompts a Chatbot Interno y Fuga de Credenciales Ocultas',
    operationCodename: 'Operación Prompt-Leak',
    summary:
      'Ataque de Indirect Prompt Injection ejecutado contra el asistente conversacional con IA de soporte interno. Mediante instrucciones diseñadas en tickets de soporte, los atacantes manipularon el contexto del modelo obligándolo a revelar contraseñas y llaves de API de bases de datos que estaban embebidas en el prompt del sistema.',
    classification: 'CONFIDENCIAL',
    status: 'CERRADO',
    vector: 'AI_PROMPT_INJECTION',
    probability: 4,
    impact: 3,
    riskScore: 12, // P(4) * I(3) = 12 (MEDIO)
    leadInvestigatorBadge: 'CIB-101-FOR',
    leadInvestigatorEmail: 'forense1@cib.gob.pa',
    leadInvestigatorName: 'Capitán Alberto Castillero',
    targetEntity: 'Módulo LLM de Soporte Corporativo y Conectores de Datos',
    detectedAt: '2026-01-24T14:00:00Z',
    sealedAt: '2026-01-30T18:00:00Z',
    updatedAt: '2026-01-30T18:00:00Z',
    studentMission: 'Precedente sobre OWASP Top 10 for LLM (LLM01/LLM06), guardrails de salida y gestión de secretos.',
    mitigationMeasures: [
      'Separación arquitectónica estricta entre el contexto del sistema y las entradas no confiables del usuario.',
      'Eliminación de credenciales en texto plano en prompts e integración con gestor de secretos (Secret Manager).',
      'Despliegue de validadores sintácticos de salida (Guardrails) para bloquear la impresión de patrones de secretos.',
    ],
    applicableRegulations: ['OWASP-LLM-TOP10', 'LEY-81-2019', 'NIST-AI-RMF'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },

  // 14. Caso CIB-2025-115-ID: OPERACIÓN SIM-SWAP
  {
    id: 'case-014',
    codigo: 'CIB-2025-115-ID',
    title: 'Clonación SIM de Tesorería por Ingeniería Social y Evasión de 2FA por SMS',
    operationCodename: 'Operación SIM-Swap',
    summary:
      'Ataque de suplantación de identidad en una tienda de telecomunicaciones mediante documento falso para transferir el número celular del director de tesorería a una nueva tarjeta SIM física. Con el control de la línea, los criminales interceptaron los códigos SMS de verificación en dos pasos (2FA) y vaciaron cuentas corporativas de criptoactivos.',
    classification: 'CONFIDENCIAL',
    status: 'CERRADO',
    vector: 'SIM_SWAP_FRAUD',
    probability: 3,
    impact: 4,
    riskScore: 12, // P(3) * I(4) = 12 (MEDIO)
    leadInvestigatorBadge: 'CIB-201-AUD',
    leadInvestigatorEmail: 'auditor1@cib.gob.pa',
    leadInvestigatorName: 'Licda. Mireya Solís',
    targetEntity: 'Cuentas Corporativas de Activos Digitales y Línea Celular de Tesorero',
    detectedAt: '2026-01-29T11:00:00Z',
    sealedAt: '2026-02-05T14:00:00Z',
    updatedAt: '2026-02-05T14:00:00Z',
    studentMission: 'Precedente sobre obsolescencia de 2FA por SMS y migración obligatoria a llaves físicas FIDO2 WebAuthn y TOTP.',
    mitigationMeasures: [
      'Interposición de denuncia penal por falsificación de documentos ante el Ministerio Público.',
      'Erradicación total del segundo factor de autenticación basado en mensajes SMS en toda la institución.',
      'Adopción mandatoria de llaves criptográficas físicas FIDO2 WebAuthn y aplicaciones de contraseñas de un solo uso (TOTP).',
    ],
    applicableRegulations: ['LEY-51-2008', 'REGULACION-ASEP-TELCO', 'LEY-81-2019'],
    evidenceCount: 2,
    daysLoggedCount: 5,
  },
];
