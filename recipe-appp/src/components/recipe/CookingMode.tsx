import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { ConfirmDialog } from '@/components/common/States';

function StepTimer({ minutes }: { minutes: number }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3 bg-ink-900/5 dark:bg-cream-100/10 rounded-full px-4 py-2">
      <TimerIcon size={16} />
      <span className="font-mono text-sm w-14">{mm}:{ss}</span>
      <button onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pause timer' : 'Start timer'}>
        {running ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <button
        onClick={() => {
          setSecondsLeft(minutes * 60);
          setRunning(false);
        }}
        aria-label="Reset timer"
      >
        <RotateCcw size={15} />
      </button>
    </div>
  );
}

export function CookingMode({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const steps = recipe.instructions;
  const step = steps[stepIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setStepIndex((i) => Math.max(i - 1, 0));
      if (e.key === 'Escape') setConfirmExit(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-[70] bg-surface-dark text-cream-100 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100/10">
        <div>
          <p className="text-xs uppercase tracking-wide text-saffron-300 font-semibold">Cooking mode</p>
          <h2 className="font-display text-lg font-semibold">{recipe.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline !border-cream-100/20 !text-cream-100" onClick={() => setShowIngredients((s) => !s)}>
            Ingredients
          </button>
          <button onClick={() => setConfirmExit(true)} aria-label="Exit cooking mode" className="btn-ghost !text-cream-100 !px-2">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="h-1.5 rounded-full bg-cream-100/10 overflow-hidden">
          <motion.div
            className="h-full bg-saffron-500"
            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-cream-300 mt-2">Step {stepIndex + 1} of {steps.length}</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-16 text-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl"
          >
            <p className="font-display text-2xl sm:text-4xl leading-snug mb-6">{step.text}</p>
            {step.timerMinutes && <div className="flex justify-center"><StepTimer minutes={step.timerMinutes} /></div>}
          </motion.div>
        </AnimatePresence>

        {showIngredients && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 top-4 bottom-4 w-64 bg-surface-darkcard rounded-2xl p-4 overflow-y-auto text-left hidden md:block"
          >
            <h3 className="font-semibold mb-2 text-sm">Ingredients</h3>
            <ul className="space-y-1.5 text-sm text-cream-200">
              {recipe.ingredients.map((ing) => (
                <li key={ing.id}>{ing.amount} {ing.name}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-5 border-t border-cream-100/10">
        <button
          className="btn-outline !border-cream-100/20 !text-cream-100"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => i - 1)}
        >
          <ChevronLeft size={16} /> Previous
        </button>
        {stepIndex === steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setConfirmExit(true)}>
            Finish cooking
          </button>
        ) : (
          <button className="btn-primary" onClick={() => setStepIndex((i) => i + 1)}>
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmExit}
        onClose={() => setConfirmExit(false)}
        onConfirm={onClose}
        title="Exit cooking mode?"
        description="Your progress on this session won't be saved."
        confirmLabel="Exit"
      />
    </div>
  );
}
