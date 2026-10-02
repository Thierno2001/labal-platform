"use client";

import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Check, ChevronLeft, ChevronRight, Send, Sparkles } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
  sectionLabels: readonly string[];
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  completedSteps: Set<number>;
  children: ReactNode;
}

export function FormStepper({
  currentStep,
  totalSteps,
  sectionLabels,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting = false,
  completedSteps,
  children,
}: FormStepperProps) {
  const progress = useMemo(
    () => Math.round(((currentStep + 1) / totalSteps) * 100),
    [currentStep, totalSteps]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowRight" && currentStep < totalSteps - 1) {
        onNext();
      }
      if (e.altKey && e.key === "ArrowLeft" && currentStep > 0) {
        onPrev();
      }
    },
    [currentStep, totalSteps, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Header Info & Progress Bar */}
      <div className="bg-white border border-labal-deep/10 rounded-2xl p-4 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-labal-lime/15 text-labal-deep border border-labal-lime/30">
                Étape {currentStep + 1} sur {totalSteps}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-labal-deep truncate">
                {sectionLabels[currentStep] || `Section ${currentStep + 1}`}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-labal-gray-dark">
              Avancement
            </span>
            <span className="text-sm font-black text-labal-lime bg-labal-lime/10 px-2.5 py-1 rounded-lg">
              {progress}%
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-labal-gray-medium/60 rounded-full overflow-hidden p-0.5 border border-labal-deep/5">
          <div
            className="h-full bg-gradient-to-r from-labal-deep to-labal-lime rounded-full transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stepper Dots (Desktop Scrollable) */}
        <div className="stepper-container mt-4 pt-2 border-t border-labal-deep/5 justify-start sm:justify-center">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="stepper-step">
              <div
                className={`stepper-circle cursor-pointer ${
                  i === currentStep
                    ? "stepper-circle--active"
                    : completedSteps.has(i)
                      ? "stepper-circle--completed"
                      : "stepper-circle--pending"
                }`}
                title={sectionLabels[i]}
              >
                {completedSteps.has(i) && i !== currentStep ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`stepper-line ${
                    completedSteps.has(i)
                      ? "stepper-line--completed"
                      : "stepper-line--pending"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Section Content */}
      <div className="animate-slide-up">{children}</div>

      {/* Navigation Footer Buttons (Touch Targets >= 48px) */}
      <div className="mt-8 flex items-center justify-between gap-3 bg-white border border-labal-deep/10 rounded-2xl p-4 shadow-xs">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-labal-deep/15 text-labal-deep font-bold hover:bg-labal-gray-light disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-target text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-labal-lime text-white font-bold hover:bg-labal-lime/90 shadow-sm hover:shadow-md transition-all touch-target text-sm"
          >
            Suivant
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-labal-deep to-labal-deep/90 text-white font-black hover:from-labal-deep/95 hover:to-labal-deep shadow-md hover:shadow-lg disabled:opacity-50 transition-all touch-target text-sm border border-labal-lime/30"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Soumission...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-labal-lime" />
                Soumettre l&apos;enquête
                <Send className="w-4 h-4 ml-1" />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
