import React, { useState } from 'react';
import { QUIZ_QUESTIONS, SERVICIOS } from '../data';
import { Sparkles, MessageCircle, RotateCcw, CheckCircle2, Ticket } from 'lucide-react';

interface LeadQuizProps {
  onSelectService: (serviceId: string) => void;
  onOpenBooking: (prefilledServiceId: string) => void;
}

export default function LeadQuiz({ onSelectService, onOpenBooking }: LeadQuizProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to length-1, then result screen is length
  const [scores, setScores] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [recommendedId, setRecommendedId] = useState('');

  const handleAnswerSelect = (pointsFor: string) => {
    // Record score
    const newScores = { ...scores, [pointsFor]: (scores[pointsFor] || 0) + 1 };
    setScores(newScores);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner
      let winnerId = 'odontologia-general';
      let maxScore = -1;

      (Object.entries(newScores) as [string, number][]).forEach(([key, val]) => {
        if (val > maxScore) {
          maxScore = val;
          winnerId = key;
        }
      });
      
      setRecommendedId(winnerId);
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setScores({});
    setQuizFinished(false);
    setRecommendedId('');
  };

  const recommendedService = SERVICIOS.find(s => s.id === recommendedId) || SERVICIOS[1];

  // Customized pre-populated WA text
  const waMessage = encodeURIComponent(
    `¡Hola Clínica Dental Paradise! Hice el Test de Sonrisa en su web y mi tratamiento recomendado fue *${recommendedService.title}*. Me gustaría agendar una cita promocional por favor.`
  );
  const waLink = `https://wa.me/51989005627?text=${waMessage}`;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-blue-800">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-48 h-48" />
      </div>

      {!quizFinished ? (
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Progress header */}
          <div className="flex items-center justify-between text-xs text-blue-200 uppercase tracking-widest font-mono mb-4">
            <span>Pregunta {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
            <span>Triage Digital de Sonrisa</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-blue-950/80 rounded-full h-1.5 mb-8 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight text-white mb-6">
            {QUIZ_QUESTIONS[currentStep].question}
          </h3>

          {/* Options list */}
          <div className="space-y-3.5">
            {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option.pointsFor)}
                className="w-full text-left bg-blue-950/60 hover:bg-blue-800/50 border border-blue-800/40 hover:border-cyan-400 p-4 rounded-2xl transition-all duration-200 group flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-medium text-slate-100 group-hover:text-cyan-300 text-sm sm:text-base">
                    {option.text}
                  </p>
                  {option.description && (
                    <p className="text-xs text-blue-300/80 mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
                <div className="ml-3 w-6 h-6 rounded-full border border-blue-700 group-hover:border-cyan-400 flex items-center justify-center text-xs group-hover:bg-cyan-500 group-hover:text-blue-950 font-bold transition-all shrink-0">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex p-3 bg-cyan-500/20 rounded-full text-cyan-400 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>

          <p className="text-xs font-semibold tracking-widest text-cyan-300 uppercase font-mono">
            ¡Test Completado con Éxito!
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Tratamiento Recomendado:
          </h3>

          {/* Recommendation card */}
          <div className="bg-blue-950/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 my-6 text-left max-w-xl mx-auto shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-blue-900 rounded-2xl">{recommendedService.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-white leading-tight">
                  {recommendedService.title}
                </h4>
                <p className="text-xs text-cyan-300 font-medium">
                  Citas iniciales desde S/ {recommendedService.priceFrom}
                </p>
              </div>
            </div>

            <p className="text-slate-200 text-sm leading-relaxed mt-4">
              {recommendedService.shortDesc}
            </p>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest font-mono">
                Principales Beneficios:
              </p>
              {recommendedService.benefits.slice(0, 3).map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Special Gift */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600/30 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
              <Ticket className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  ¡Cupón de Diagnóstico Activo!
                </p>
                <p className="text-xs text-slate-200">
                  Evaluación gratuita + 10% de descuento en el tratamiento recomendado.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              Agendar por WhatsApp
            </a>

            <button
              onClick={() => onOpenBooking(recommendedService.id)}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-900 font-semibold px-6 py-3.5 rounded-2xl text-sm sm:text-base transition-all border border-transparent shadow-sm cursor-pointer"
            >
              Reservar en Línea
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto text-slate-300 hover:text-white inline-flex items-center justify-center gap-1.5 px-4 py-2 hover:bg-blue-900/30 rounded-xl transition-all text-xs sm:text-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Repetir Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
