// app/simulador/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Simulador Táctico de Interrogatorio Forense y Detección de Preguntas Capciosas
// Basado en el Manual Oficial de Procedimientos y Expedientes del CIB

'use client';

import React, { useState } from 'react';
import { InterrogationQuestion } from '@/types/cib';
import {
  Terminal,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Shield,
  Scale,
  Brain,
  GraduationCap,
} from 'lucide-react';

interface SimulationQuestionItem extends InterrogationQuestion {
  caseCode: string;
  operationCodename: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const SIMULATOR_QUESTIONS: SimulationQuestionItem[] = [
  // =========================================================================
  // CASO 1: OPERACIÓN TECHGLOBE
  // =========================================================================
  {
    id: 'sim-1',
    caseCode: 'CIB-2026-001-TG',
    operationCodename: 'Operación TechGlobe',
    questionNumber: 1,
    scenarioContext: 'Audiencia de Control de Garantías - Alegato de Jurisdicción:',
    questionText: 'Si el servidor donde reside la base de datos está físicamente alquilado en Frankfurt (Alemania), ¿significa que la ANTAI de Panamá no tiene ninguna potestad legal para investigar ni multar a la empresa panameña TechGlobe?',
    trickTrapDescription:
      'Trampa de territorialidad física del servidor: Pretende engañar al tribunal asumiendo que la soberanía de los datos reside en la ubicación física de las máquinas.',
    expectedForensicAnswer:
      'FALSO. La Ley 81 de 2019 aplica a personas naturales o jurídicas domiciliadas en Panamá que traten datos personales, independientemente de dónde se ubique el servidor físico. Además, el GDPR europeo aplica por extraterritorialidad al tratarse de datos de residentes europeos, generando doble contingencia legal simultánea.',
    legalBasis: 'Ley 81 de 2019 (Ámbito de aplicación territorial) y GDPR Art. 3 (Extraterritorialidad).',
    difficulty: 'AVANZADO',
    options: [
      {
        id: 'opt-a',
        text: 'Cierto, el principio de soberanía digital internacional indica que la jurisdicción exclusiva recae en el país donde está ubicado el hardware del servidor.',
        isCorrect: false,
        explanation: 'Falso. Ese principio no aplica en protección de datos personales cuando el responsable del tratamiento está constituido en Panamá.',
      },
      {
        id: 'opt-b',
        text: 'FALSO. La Ley 81 de 2019 aplica a personas jurídicas domiciliadas en Panamá que traten datos personales, sin importar dónde esté el servidor. Además, el GDPR europeo aplica por extraterritorialidad al tratarse de datos de europeos.',
        isCorrect: true,
        explanation: '¡Impecable! La ANTAI conserva plena potestad sobre la empresa domiciliada en Panamá y el GDPR genera contingencia concurrente.',
      },
      {
        id: 'opt-c',
        text: 'Cierto, solo la policía federal alemana puede solicitar auditorías a centros de datos situados en Frankfurt.',
        isCorrect: false,
        explanation: 'Incorrecto. Confunde la cooperación policial física con la jurisdicción sustantiva de protección de datos.',
      },
    ],
  },
  {
    id: 'sim-2',
    caseCode: 'CIB-2026-001-TG',
    operationCodename: 'Operación TechGlobe',
    questionNumber: 2,
    scenarioContext: 'Contrainterrogatorio del Perito en Propiedad Intelectual:',
    questionText: 'Como el código GPLv3 se descargó gratis de un repositorio público en GitHub, TechGlobe tiene derecho a vender la aplicación como software privado cerrado sin enseñarle el código a nadie, ¿correcto?',
    trickTrapDescription:
      'Confusión deliberada entre "gratuito" (freeware/gratis) y "libre" (software libre copyleft fuerte).',
    expectedForensicAnswer:
      'FALSO. La licencia GPLv3 posee una cláusula "infectiva" (copyleft fuerte). Al modificar o integrar código GPLv3 en un producto distribuido, la empresa está legalmente obligada a liberar todo el código fuente resultante bajo la misma licencia.',
    legalBasis: 'Ley 64 de 2012 (Derechos de Autor) y Convenio de Berna / Licencia GNU GPLv3.',
    difficulty: 'CRITICO',
    options: [
      {
        id: 'opt-a',
        text: 'Correcto, todo código disponible sin costo en repositorios públicos de Internet pasa automáticamente a dominio público sin restricciones.',
        isCorrect: false,
        explanation: 'Grave error conceptual. "Open source" no significa dominio público; las licencias imponen obligaciones jurídicas vinculantes.',
      },
      {
        id: 'opt-b',
        text: 'FALSO. La licencia GPLv3 posee una cláusula "infectiva" (copyleft fuerte). Al integrar código GPLv3 en un producto distribuido, la empresa está legalmente obligada a liberar todo el código fuente resultante bajo la misma licencia GPLv3.',
        isCorrect: true,
        explanation: '¡Excelente! La contaminación de código obliga por ley a liberar el software o retirar el módulo infractor.',
      },
      {
        id: 'opt-c',
        text: 'Solo si el autor original envía una carta notariada en físico a Panamá exigiendo el pago de regalías.',
        isCorrect: false,
        explanation: 'Falso. Bajo el Convenio de Berna, los derechos de autor y las licencias aplican automáticamente sin necesidad de registro ni intimación previa.',
      },
    ],
  },

  // =========================================================================
  // CASO 2: OPERACIÓN TROJAN-PC20 (software_gratis.exe)
  // =========================================================================
  {
    id: 'sim-3',
    caseCode: 'CIB-2026-002-PC20',
    operationCodename: 'Operación Trojan-PC20',
    questionNumber: 1,
    scenarioContext: 'Interrogatorio de Responsabilidad Corporativa ante la Gerencia:',
    questionText: 'Si el empleado instaló software_gratis.exe en la computadora de su trabajo sin avisarle al departamento de TI, ¿la empresa queda 100% libre de responsabilidad penal y civil si los titulares de la marca demandan por el uso del software pirateado?',
    trickTrapDescription:
      'Trampa de deslinde corporativo intentando culpar exclusivamente al empleado de base.',
    expectedForensicAnswer:
      'FALSO. Las organizaciones son legalmente responsables de los activos y herramientas utilizadas en sus operaciones. La falta de controles de supervisión e inventario constituye una negligencia administrativa que traslada la responsabilidad institucional a la empresa.',
    legalBasis: 'Ley 64 de 2012 (Responsabilidad Solidaria y Patrimonial del Empleador).',
    difficulty: 'INTERMEDIO',
    options: [
      {
        id: 'opt-a',
        text: 'Sí, la jurisprudencia civil panameña exonera totalmente a la empresa si el acto fue una decisión individual del trabajador sin firma gerencial.',
        isCorrect: false,
        explanation: 'Falso. La omisión de medidas de seguridad y control hace a la empresa legalmente responsable por culpa in vigilando.',
      },
      {
        id: 'opt-b',
        text: 'FALSO. Las organizaciones son legalmente responsables de los activos y herramientas utilizadas en sus operaciones. La falta de controles de supervisión, ausencia de inventario y conceder privilegios Local Admin constituyen negligencia que traslada la responsabilidad a la empresa.',
        isCorrect: true,
        explanation: 'Respuesta pericial sólida. Demuestra el principio de responsabilidad institucional y diligencia debida.',
      },
      {
        id: 'opt-c',
        text: 'Solo si la computadora estaba dentro del período de garantía del fabricante.',
        isCorrect: false,
        explanation: 'Absurdo y jurídicamente irrelevante.',
      },
    ],
  },
  {
    id: 'sim-4',
    caseCode: 'CIB-2026-002-PC20',
    operationCodename: 'Operación Trojan-PC20',
    questionNumber: 2,
    scenarioContext: 'Peritaje sobre Inteligencia Artificial y Propiedad Intelectual:',
    questionText: 'Si utilizo un modelo de IA generativa para crear el código fuente entero de un software comercial, ¿automáticamente soy el dueño exclusivo de los derechos de autor de ese código en todo el mundo?',
    trickTrapDescription:
      'Ambigüedad entre la autoría algorítmica y la doctrina universal de autoría humana.',
    expectedForensicAnswer:
      'FALSO/AMBIGUO. Bajo la mayoría de las doctrinas internacionales de propiedad intelectual (incluyendo la OMPI), el derecho de autor protege la creación humana. El contenido o código generado 100% por algoritmos sin aportación humana sustancial suele considerarse de dominio público o carente de protección de autoría tradicional.',
    legalBasis: 'Convenio de Berna y Directrices OMPI sobre Inteligencia Artificial.',
    difficulty: 'AVANZADO',
    options: [
      {
        id: 'opt-a',
        text: 'Sí, porque quien escribió el prompt es considerado automáticamente el programador del código ejecutable compilado.',
        isCorrect: false,
        explanation: 'Falso. Un prompt no otorga automáticamente autoría del código generado si no hay aportación creativa sustancial.',
      },
      {
        id: 'opt-b',
        text: 'FALSO/AMBIGUO. Bajo la doctrina internacional de la OMPI y el Convenio de Berna, el derecho de autor protege la creación humana. El código generado 100% por algoritmos sin aportación humana sustancial suele considerarse de dominio público o carente de autoría tradicional.',
        isCorrect: true,
        explanation: '¡Excelente! Dictamen técnico alineado con las resoluciones internacionales de propiedad intelectual en materia de IA.',
      },
      {
        id: 'opt-c',
        text: 'El dueño exclusivo pasa a ser el fabricante del procesador gráfico GPU donde se ejecutó el modelo.',
        isCorrect: false,
        explanation: 'Completamente erróneo.',
      },
    ],
  },

  // =========================================================================
  // CASO 3: OPERACIÓN PORTAL-ESTATAL
  // =========================================================================
  {
    id: 'sim-5',
    caseCode: 'CIB-2026-003-PE',
    operationCodename: 'Operación Portal-Estatal',
    questionNumber: 1,
    scenarioContext: 'Interpelación Técnica en la Comisión de Seguridad Estatal:',
    questionText: 'Si el fabricante del software tardó meses en liberar el parche de seguridad y el sistema es para atender ciudadanos, ¿la institución pública puede mantener la plataforma operando en Internet sin problemas legales argumentando que la culpa es del fabricante?',
    trickTrapDescription:
      'Trampa de justificación por retardo de terceros proveedores en la cadena de suministro.',
    expectedForensicAnswer:
      'FALSO. La Resolución AIG No. 18-2026 establece de forma imperativa la prohibición estricta de poner o mantener en producción plataformas estatales con interacción ciudadana que contengan vulnerabilidades críticas no mitigadas, exigiendo controles compensatorios o la suspensión del servicio.',
    legalBasis: 'Resolución AIG No. 18-2026 (Capítulo IV, Artículo 11 - Prohibición de Vulnerabilidades Críticas).',
    difficulty: 'AVANZADO',
    options: [
      {
        id: 'opt-a',
        text: 'Cierto, las entidades públicas están exentas de cumplir directrices técnicas cuando los proveedores tienen demoras comprobables en soporte.',
        isCorrect: false,
        explanation: 'Falso. No existe tal excepción en la normativa técnica estatal panameña.',
      },
      {
        id: 'opt-b',
        text: 'FALSO. La Resolución AIG No. 18-2026 establece la prohibición estricta de mantener en producción plataformas estatales con interacción ciudadana que contengan vulnerabilidades críticas no mitigadas, exigiendo controles compensatorios o la suspensión del servicio.',
        isCorrect: true,
        explanation: '¡Correcto! La Resolución AIG 18-2026 es de orden público vinculante y prioriza la seguridad del ciudadano.',
      },
      {
        id: 'opt-c',
        text: 'Solo se requiere colocar una advertencia en la página principal indicando a los ciudadanos que naveguen bajo su propio riesgo.',
        isCorrect: false,
        explanation: 'Inadmisible y violatorio de los principios de seguridad de la información del Estado.',
      },
    ],
  },
  {
    id: 'sim-6',
    caseCode: 'CIB-2026-003-PE',
    operationCodename: 'Operación Portal-Estatal',
    questionNumber: 2,
    scenarioContext: 'Audiencia de Control Tutelar ante la ANTAI:',
    questionText: 'Si ocurre un hackeo a la base de datos a través de la cuenta del proveedor externo, ¿la responsabilidad legal ante la ANTAI y los ciudadanos recae únicamente sobre el proveedor y no sobre la institución pública?',
    trickTrapDescription:
      'Intento de trasladar la figura de Responsable del Tratamiento al Encargado/Custodio.',
    expectedForensicAnswer:
      'FALSO. Bajo la Ley 81 de 2019, la institución pública es el Responsable del Tratamiento y tiene la obligación legal custodia. El proveedor actúa como Custodio/Encargado. La institución es legalmente responsable por la falta de supervisión y control de acceso sobre sus terceros.',
    legalBasis: 'Ley 81 de 2019 (Responsable vs. Custodio del Tratamiento de Datos).',
    difficulty: 'CRITICO',
    options: [
      {
        id: 'opt-a',
        text: 'Cierto, el contrato de servicios informáticos traslada automáticamente toda la titularidad y responsabilidad legal a la empresa consultora privada.',
        isCorrect: false,
        explanation: 'Falso. El orden público de la Ley 81 no puede ser derogado por cláusulas privadas entre partes.',
      },
      {
        id: 'opt-b',
        text: 'FALSO. Bajo la Ley 81 de 2019, la institución pública es el Responsable del Tratamiento y mantiene la obligación legal de custodia. El proveedor actúa como Custodio/Encargado. La institución es responsable por la falta de supervisión y control de acceso sobre sus terceros.',
        isCorrect: true,
        explanation: '¡Excelente! Distinción jurídica clave entre Responsable del Tratamiento y Encargado de Custodia bajo la Ley 81.',
      },
      {
        id: 'opt-c',
        text: 'Ninguno es responsable si el atacante utilizó una dirección IP extranjera no rastreable.',
        isCorrect: false,
        explanation: 'Falso. La brecha de deber de cuidado subsiste independientemente del origen del atacante.',
      },
    ],
  },
];

export default function SimuladorPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showTrapDetails, setShowTrapDetails] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totalQuestions = SIMULATOR_QUESTIONS.length;
  const currentQ = SIMULATOR_QUESTIONS[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerSubmitted(true);
    const chosen = currentQ.options.find((o) => o.id === selectedOption);
    if (chosen?.isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowTrapDetails(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowTrapDetails(false);
    setCorrectCount(0);
    setCompleted(false);
  };

  const chosenOptionData = currentQ?.options.find((o) => o.id === selectedOption);
  const calculatedScore = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Academia Forense del CIB • Capacitación Táctica de Cadetes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            SIMULADOR DE INTERROGATORIO & PREGUNTAS CAPCIOSAS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Entrenamiento especializado en defensa pericial ante tribunales de justicia y refutación de trampas inductivas bajo la Ley 51 de 2008, Ley 81 de 2019 y Resolución AIG 18-2026.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#090e1a] border border-cyan-900/60 font-mono">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Aciertos Periciales</div>
            <div className="text-base font-bold text-amber-300">
              {correctCount} / {totalQuestions} ({calculatedScore}%)
            </div>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1a] border border-cyan-900/60 shadow-2xl space-y-6 font-mono">
          {/* Barra de Progreso */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-cyan-950 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                Reactivo {currentIdx + 1} de {totalQuestions}
              </span>
              <span className="text-slate-300 font-semibold">{currentQ.operationCodename} ({currentQ.caseCode})</span>
            </div>
            <span className="text-amber-400 font-bold">Dificultad: {currentQ.difficulty}</span>
          </div>

          {/* Contexto del Escenario */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-950 text-xs text-slate-400">
            <span className="text-cyan-400 font-bold block mb-1">Escenario Procesal Forense:</span>
            {currentQ.scenarioContext}
          </div>

          {/* Pregunta Capciosa del Litigante */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">
              Pregunta Capciosa Formulada:
            </p>
            <p className="text-base font-bold text-white leading-snug">
              &ldquo;{currentQ.questionText}&rdquo;
            </p>
          </div>

          {/* Opciones de Respuesta Pericial */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Seleccione la respuesta técnicamente admisible y defensible en estrado:
            </p>

            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle = 'bg-black/30 border-cyan-950/80 hover:border-cyan-700 text-slate-300';

                if (isAnswerSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyan-950/60 border-cyan-400 text-white font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs transition-all cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {opt.id.split('-')[1]?.toUpperCase()}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de Enviar o Siguiente */}
          <div className="flex items-center justify-between pt-4 border-t border-cyan-950">
            <button
              onClick={() => setShowTrapDetails(!showTrapDetails)}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{showTrapDetails ? 'Ocultar Trampa' : 'Ver Trampa Oculta en la Pregunta'}</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Asentar Respuesta Pericial
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{currentIdx + 1 < totalQuestions ? 'Siguiente Pregunta' : 'Ver Dictamen Final'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Retroalimentación tras enviar */}
          {isAnswerSubmitted && chosenOptionData && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in-50 ${
              chosenOptionData.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {chosenOptionData.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>DICTAMEN PERICIAL CORRECTO (RESPUESTA SÓLIDA)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>DICTAMEN PERICIAL DEFICIENTE (TRAMPA NO DETECTADA)</span>
                  </>
                )}
              </div>
              <p>{chosenOptionData.explanation}</p>
            </div>
          )}

          {/* Explicación de la Trampa Capciosa */}
          {showTrapDetails && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 space-y-2">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Análisis Forense de la Trampa Inductiva:
              </p>
              <p>{currentQ.trickTrapDescription}</p>
              <div className="text-[11px] text-slate-300 pt-1 border-t border-amber-900/60">
                <strong>Fundamento Legal Oficial:</strong> {currentQ.legalBasis}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pantalla de Resultados y Certificación */
        <div className="p-8 rounded-2xl bg-[#090e1a] border border-cyan-900/60 shadow-2xl text-center space-y-6 font-mono">
          <div className="w-20 h-20 rounded-2xl bg-cyan-950 border border-cyan-500 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-950/80">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">EVALUACIÓN PERICIAL COMPLETADA</h2>
            <p className="text-xs text-slate-400 mt-1">
              Buró Cibernético de Investigación • República de Panamá
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-cyan-950 max-w-sm mx-auto">
            <div className="text-xs text-slate-400 uppercase">Calificación Final Obtenida</div>
            <div className={`text-4xl font-black my-2 ${calculatedScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {calculatedScore}%
            </div>
            <p className="text-xs text-slate-300">
              {correctCount} de {totalQuestions} preguntas respondidas correctamente.
            </p>
            <p className="text-xs text-slate-300 mt-2">
              {calculatedScore >= 80
                ? '¡APROBADO CON HONORES! El oficial demuestra solvencia técnica y destreza jurídica para testificar en juicio oral conforme a la Ley 51 y Ley 81.'
                : 'REQUIERE REFUERZO. Repase la Resolución AIG 18-2026 y los principios de responsabilidad institucional de la Ley 64 de 2012.'}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs uppercase transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Simulación</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
