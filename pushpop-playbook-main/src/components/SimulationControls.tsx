import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, SkipForward, RotateCcw, Pause, Zap } from 'lucide-react';

interface Props {
  inputString: string;
  onInputChange: (value: string) => void;
  onRun: () => void;
  onStep: () => void;
  onAutoRun: () => void;
  onPause: () => void;
  onReset: () => void;
  isRunning: boolean;
  simulationDone: boolean;
  speed: number;
  onSpeedChange: (value: number) => void;
}

export function SimulationControls({
  inputString,
  onInputChange,
  onRun,
  onStep,
  onAutoRun,
  onPause,
  onReset,
  isRunning,
  simulationDone,
  speed,
  onSpeedChange,
}: Props) {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
            Input String
          </Label>
          <Input
            value={inputString}
            onChange={e => onInputChange(e.target.value)}
            placeholder="e.g. aabb"
            className="mt-1.5 font-mono text-sm bg-background/50 border-border/60 focus:border-primary/60 h-10"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <Button
          onClick={onRun}
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-primary to-warning text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Zap className="w-3.5 h-3.5" /> Run All
        </Button>
        <Button
          onClick={onStep}
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/60 hover:border-primary/40 hover:bg-primary/5"
          disabled={simulationDone}
        >
          <SkipForward className="w-3.5 h-3.5" /> Step
        </Button>
        {isRunning ? (
          <Button
            onClick={onPause}
            variant="outline"
            size="sm"
            className="gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
          >
            <Pause className="w-3.5 h-3.5" /> Pause
          </Button>
        ) : (
          <Button
            onClick={onAutoRun}
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/60 hover:border-success/40 hover:bg-success/5"
            disabled={simulationDone}
          >
            <Play className="w-3.5 h-3.5" /> Auto
          </Button>
        )}
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </Button>

        <div className="flex items-center gap-2.5 ml-auto">
          <Label className="text-[10px] text-muted-foreground whitespace-nowrap uppercase tracking-wider font-semibold">
            Speed
          </Label>
          <Slider
            value={[1000 - speed]}
            onValueChange={([v]) => onSpeedChange(1000 - v)}
            min={0}
            max={900}
            step={100}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
