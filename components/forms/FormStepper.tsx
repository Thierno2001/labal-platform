"use client";

import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Check, ChevronLeft, ChevronRight, Send, Save } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-labal-deep">
            Section {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-sm font-bold text-labal-lime">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-labal-gray-medium rounded-full overflow-hidden">
          <div
            className="h-full bg-labal-lime rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stepper Dots */}
      <div className="stepper-container mb-6 justify-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="stepper-step">
            <div
              className={`stepper-circle ${
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

      {/* Section Title */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-labal-deep">
          {sectionLabels[currentStep]}
        </h2>
        <div className="mt-1 h-0.5 w-16 bg-labal-lime mx-auto rounded-full" />
      </div>

      {/* Auto-save indicator */}
      <div className="flex items-center gap-1.5 text-xs text-labal-gray-dark mb-4 justify-end">
        <Save className="w-3 h-3" />
        <span>Sauvegarde automatique activée</span>
      </div>

      {/* Form Content */}
      <div className="animate-fade-in-up" key={currentStep}>
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-labal-gray-medium">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-labal-deep text-labal-deep font-medium text-sm hover:bg-labal-gray-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>

        <span className="text-xs text-labal-gray-dark hidden sm:block">
          Alt + ← / → pour naviguer
        </span>

        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-labal-lime text-white font-semibold text-sm hover:bg-labal-lime/90 transition-all shadow-sm hover:shadow-md"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-labal-deep text-white font-semibold text-sm hover:bg-labal-deep/90 transition-all shadow-sm hover:shadow-md disabled:opacity-60 animate-pulse-lime"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Soumettre l&apos;enquête
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
