import { motion, AnimatePresence } from 'framer-motion';
import { STACK_BOTTOM } from '@/lib/pda-types';

interface Props {
  stack: string[];
  highlightTop?: boolean;
}

export function StackVisualization({ stack, highlightTop = true }: Props) {
  const reversed = [...stack].reverse();

  return (
    <div className="flex flex-col items-center gap-0">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <div className="text-xs text-foreground uppercase tracking-[0.2em] font-bold">Stack</div>
      </div>
      <div className="text-[10px] text-primary font-semibold mb-2 tracking-widest">↑ TOP</div>
      <div className="relative w-full max-w-[140px]">
        <div className="flex flex-col gap-1.5 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {reversed.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground text-center py-4 italic"
              >
                Empty
              </motion.div>
            ) : (
              reversed.map((item, i) => (
                <motion.div
                  key={`${item}-${stack.length - 1 - i}`}
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`
                    stack-item font-mono text-sm
                    ${i === 0 && highlightTop
                      ? 'border-primary glow-primary text-primary font-bold'
                      : ''
                    }
                    ${item === STACK_BOTTOM
                      ? 'border-accent/50 text-accent'
                      : ''
                    }
                  `}
                >
                  {item}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        <div className="section-divider mt-3" />
        <div className="text-[10px] text-muted-foreground text-center mt-1.5 tracking-widest">BOTTOM</div>
      </div>
    </div>
  );
}
