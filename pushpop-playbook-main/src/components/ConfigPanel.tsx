import { useState } from 'react';
import { PDAConfig, Transition, EXAMPLE_PDAS } from '@/lib/pda-types';
import { validatePDA } from '@/lib/pda-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  config: PDAConfig;
  onChange: (config: PDAConfig) => void;
}

export function ConfigPanel({ config, onChange }: Props) {
  const [newState, setNewState] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const addState = () => {
    const s = newState.trim();
    if (s && !config.states.includes(s)) {
      onChange({ ...config, states: [...config.states, s] });
      setNewState('');
    }
  };

  const removeState = (state: string) => {
    onChange({
      ...config,
      states: config.states.filter(s => s !== state),
      acceptStates: config.acceptStates.filter(s => s !== state),
      transitions: config.transitions.filter(t => t.fromState !== state && t.toState !== state),
      startState: config.startState === state ? '' : config.startState,
    });
  };

  const toggleAcceptState = (state: string) => {
    const isAccept = config.acceptStates.includes(state);
    onChange({
      ...config,
      acceptStates: isAccept
        ? config.acceptStates.filter(s => s !== state)
        : [...config.acceptStates, state],
    });
  };

  const addTransition = () => {
    const id = String(Date.now());
    const t: Transition = {
      id,
      fromState: config.states[0] || '',
      inputSymbol: '',
      stackTop: '',
      toState: config.states[0] || '',
      stackPush: [],
    };
    onChange({ ...config, transitions: [...config.transitions, t] });
  };

  const updateTransition = (id: string, updates: Partial<Transition>) => {
    onChange({
      ...config,
      transitions: config.transitions.map(t => t.id === id ? { ...t, ...updates } : t),
    });
  };

  const removeTransition = (id: string) => {
    onChange({ ...config, transitions: config.transitions.filter(t => t.id !== id) });
  };

  const loadExample = (index: number) => {
    onChange({ ...EXAMPLE_PDAS[index].config });
  };

  const validate = () => {
    setErrors(validatePDA(config));
  };

  return (
    <div className="space-y-5">
      {/* Examples */}
      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Load Example</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLE_PDAS.map((ex, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(i)}
                  className="text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  {ex.name}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{ex.description}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* States */}
      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">States</Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <AnimatePresence>
            {config.states.map(s => (
              <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Badge
                  variant={config.startState === s ? 'default' : config.acceptStates.includes(s) ? 'secondary' : 'outline'}
                  className="cursor-pointer group relative pr-6 transition-all hover:scale-105"
                  onClick={() => toggleAcceptState(s)}
                >
                  {s}
                  {config.startState === s && <span className="ml-1 text-[10px]">→</span>}
                  {config.acceptStates.includes(s) && <span className="ml-1 text-[10px]">✓</span>}
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); removeState(s); }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={newState}
            onChange={e => setNewState(e.target.value)}
            placeholder="New state"
            className="h-8 text-sm bg-background/50"
            onKeyDown={e => e.key === 'Enter' && addState()}
          />
          <Button size="sm" variant="outline" onClick={addState} className="hover:bg-primary/5 hover:border-primary/40">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Start State */}
      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Start State</Label>
        <Select value={config.startState} onValueChange={v => onChange({ ...config, startState: v })}>
          <SelectTrigger className="h-8 text-sm mt-1.5 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Acceptance Mode */}
      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Acceptance Mode</Label>
        <Select value={config.acceptanceMode} onValueChange={(v: PDAConfig['acceptanceMode']) => onChange({ ...config, acceptanceMode: v })}>
          <SelectTrigger className="h-8 text-sm mt-1.5 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="finalState">Final State</SelectItem>
            <SelectItem value="emptyStack">Empty Stack</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="section-divider" />

      {/* Transitions */}
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">Transitions</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addTransition}
            className="h-6 text-xs hover:bg-primary/5 hover:border-primary/40"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
          {config.transitions.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-2.5 text-xs space-y-1"
            >
              <div className="flex gap-1.5 items-center flex-wrap">
                <Select value={t.fromState} onValueChange={v => updateTransition(t.id, { fromState: v })}>
                  <SelectTrigger className="h-6 w-16 text-xs bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>{config.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-muted-foreground">,</span>
                <Input
                  value={t.inputSymbol}
                  onChange={e => updateTransition(t.id, { inputSymbol: e.target.value })}
                  placeholder="ε"
                  className="h-6 w-10 text-xs text-center bg-background/50"
                  maxLength={1}
                />
                <span className="text-muted-foreground">,</span>
                <Input
                  value={t.stackTop}
                  onChange={e => updateTransition(t.id, { stackTop: e.target.value })}
                  placeholder="ε"
                  className="h-6 w-14 text-xs text-center bg-background/50"
                />
                <span className="text-primary font-bold">→</span>
                <Select value={t.toState} onValueChange={v => updateTransition(t.id, { toState: v })}>
                  <SelectTrigger className="h-6 w-16 text-xs bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>{config.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-muted-foreground">,</span>
                <Input
                  value={t.stackPush.join(',')}
                  onChange={e => updateTransition(t.id, { stackPush: e.target.value ? e.target.value.split(',') : [] })}
                  placeholder="ε (pop)"
                  className="h-6 w-20 text-xs bg-background/50"
                />
                <Button size="sm" variant="ghost" onClick={() => removeTransition(t.id)} className="h-6 w-6 p-0">
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Validate */}
      <Button
        variant="outline"
        size="sm"
        onClick={validate}
        className="w-full border-warning/30 text-warning hover:bg-warning/5 hover:border-warning/50"
      >
        <AlertCircle className="w-3 h-3 mr-1" /> Validate PDA
      </Button>
      {errors.length > 0 && (
        <div className="text-xs text-destructive space-y-1">
          {errors.map((e, i) => <p key={i}>• {e}</p>)}
        </div>
      )}
    </div>
  );
}
