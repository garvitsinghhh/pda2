import { Info, Layers, ArrowRightLeft } from 'lucide-react';

export function EducationalPanel() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4 text-sm">
      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
        <Info className="w-4 h-4" />
        What is a PDA?
      </div>
      <p className="text-muted-foreground leading-relaxed text-xs">
        A <span className="text-foreground font-medium">Pushdown Automaton</span> is a type of automaton
        that employs a stack to recognize context-free languages. Unlike finite automata, PDAs can "remember"
        unbounded information using a LIFO (Last-In, First-Out) stack.
      </p>

      <div className="section-divider" />

      <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-[0.2em]">
        <Layers className="w-4 h-4" />
        Stack Operations
      </div>
      <ul className="text-muted-foreground space-y-1.5 text-xs">
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span><span className="text-foreground font-medium">PUSH</span> — Add a symbol to the top</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-accent" />
          <span><span className="text-foreground font-medium">POP</span> — Remove the top symbol</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-warning" />
          <span><span className="text-foreground font-medium">NO-OP</span> — Leave stack unchanged</span>
        </li>
      </ul>

      <div className="section-divider" />

      <div className="flex items-center gap-2 text-warning font-bold text-xs uppercase tracking-[0.2em]">
        <ArrowRightLeft className="w-4 h-4" />
        Transitions
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Each transition reads: <span className="font-mono text-foreground">δ(state, input, stack_top) → (new_state, stack_push)</span>.
        Use <span className="font-mono text-primary">ε</span> for epsilon (no input consumed or empty stack match).
      </p>
    </div>
  );
}
