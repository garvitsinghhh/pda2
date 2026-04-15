import { SimulationStep } from '@/lib/pda-types';
import { motion } from 'framer-motion';

interface Props {
  steps: SimulationStep[];
  currentStepIndex: number;
}

export function ExecutionTrace({ steps, currentStepIndex }: Props) {
  return (
    <div className="space-y-1 relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-warning" />
        <div className="text-xs text-foreground uppercase tracking-[0.2em] font-bold">
          Execution Trace
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
        {steps.slice(0, currentStepIndex + 1).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              glass rounded-xl p-2.5 text-xs font-mono transition-all duration-200
              ${i === currentStepIndex ? 'border-primary/50 glow-primary' : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-md px-2 py-0.5 font-bold text-[10px]">
                #{i + 1}
              </span>
              <span className="text-foreground font-semibold">{step.currentState}</span>
            </div>
            <div className="text-muted-foreground space-y-0.5">
              <div>Input: <span className="text-foreground">{step.remainingInput || '(empty)'}</span></div>
              <div>Stack: <span className="text-foreground">[{step.stack.join(', ')}]</span></div>
              <div className="text-primary/80">{step.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
