import { useState } from "react";

const StepNavigation = ({ steps, currentStep, goToStep, handleKeyDown }) => {
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="relative mb-6 sm:mb-8 md:mb-10 w-full">
      <button
        className="sm:hidden mb-4 text-sm text-teal-600 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
        onClick={() => setShowLabels(!showLabels)}
        aria-label={showLabels ? "Hide step labels" : "Show step labels"}
      >
        {showLabels ? "Hide Labels" : "Show Labels"}
      </button>

      <div
        className="
          flex items-center justify-between relative 
          overflow-x-auto sm:overflow-visible no-scrollbar
          h-20 sm:h-24 md:h-auto
          space-x-6 sm:space-x-0
        "
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0 z-10 group"
          >
            {/* Step dot */}
            <button
              onClick={() => goToStep(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                flex items-center justify-center rounded-full font-semibold transition-all duration-300
                w-8 h-8 text-sm sm:w-10 sm:h-10 sm:text-base
                ${
                  currentStep === index
                    ? "bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2"
                    : currentStep > index
                    ? "bg-teal-600 text-white"
                    : "bg-slate-700 text-white"
                } 
                hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2
              `}
              aria-current={currentStep === index ? "step" : undefined}
              aria-label={`Go to ${step}`}
            >
              {index + 1}
            </button>

            {/* Step label */}
            {showLabels && (
              <span
                className={`
                  mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-bold tracking-tight
                  transition-all duration-300 group-hover:scale-105 text-center
                  ${currentStep === index ? "scale-105 text-teal-600" : "text-slate-700"}
                `}
              >
                {step}
              </span>
            )}
          </div>
        ))}

        {/* Progress bar */}
        <div className="absolute top-7 sm:top-8 md:top-5 left-0 right-0 h-0.5 bg-slate-700 z-0 sm:h-1">
          <div
            className="h-full bg-teal-600 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
