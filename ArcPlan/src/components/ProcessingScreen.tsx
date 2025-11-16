import { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const steps = [
  'Analyzing room path...',
  'Detecting wall elements...',
  'Identifying outlets and fixtures...',
  'Assembling final plan...',
];

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = 2000;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 border-2 border-blueprint-cyan/30 rounded-lg">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-blueprint-cyan/10"
                  style={{
                    animation: `glow ${2 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blueprint-cyan to-transparent animate-scan opacity-60" />
            </div>

            <svg
              className="absolute inset-0 w-full h-full p-8"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="40"
                y="40"
                width="120"
                height="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blueprint-cyan"
                strokeDasharray="480"
                strokeDashoffset="480"
                style={{
                  animation: 'draw 3s ease-out infinite',
                }}
              />
              <circle
                cx="60"
                cy="60"
                r="5"
                fill="currentColor"
                className="text-blueprint-cyan animate-glow"
              />
              <circle
                cx="140"
                cy="60"
                r="5"
                fill="currentColor"
                className="text-blueprint-cyan animate-glow"
                style={{ animationDelay: '0.5s' }}
              />
              <circle
                cx="60"
                cy="140"
                r="5"
                fill="currentColor"
                className="text-blueprint-cyan animate-glow"
                style={{ animationDelay: '1s' }}
              />
              <circle
                cx="140"
                cy="140"
                r="5"
                fill="currentColor"
                className="text-blueprint-cyan animate-glow"
                style={{ animationDelay: '1.5s' }}
              />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg font-bold text-blueprint-cyan tracking-wider">
            STATUS: GENERATING BLUEPRINT...
          </p>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`
                  text-lg transition-all duration-500
                  ${
                    index === currentStep
                      ? 'text-white font-semibold scale-105'
                      : index < currentStep
                      ? 'text-green-400'
                      : 'text-white/30'
                  }
                `}
              >
                <span className="inline-block w-24 text-left">
                  Step {index + 1}/{steps.length}:
                </span>
                <span>{step}</span>
                {index < currentStep && (
                  <span className="ml-2 text-green-400">✓</span>
                )}
                {index === currentStep && (
                  <span className="ml-2 inline-block animate-glow">⚡</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
