const StepNavigation = ({ steps, currentStep, goToStep, handleKeyDown }) => {
  return (
    <div className="flex items-center justify-between mb-10 relative">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center z-10 group">
          <button
            onClick={() => goToStep(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-xs transition-all duration-300 ${
              currentStep === index
                ? "bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2"
                : currentStep > index
                ? "bg-teal-600 text-white"
                : "bg-slate-700 text-white"
            } stepper-dot hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`}
            aria-current={currentStep === index ? "step" : undefined}
            aria-label={`Go to ${step}`}
          >
            {index + 1}
          </button>
          <span
            className={`mt-2 text-xs font-bold text-black tracking-tight transition-all duration-300 group-hover:scale-105 ${
              currentStep === index ? "scale-105 text-teal-600" : "text-slate-700"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700 z-0">
        <div
          className="h-full bg-teal-600 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepNavigation;