import { useState, useCallback, useRef, useEffect } from 'react';
import { PDAConfig, SimulationStep, DEFAULT_PDA, STACK_BOTTOM } from '@/lib/pda-types';
import { runPDA } from '@/lib/pda-engine';
import { ConfigPanel } from '@/components/ConfigPanel';
import { StackVisualization } from '@/components/StackVisualization';
import { StateDiagram } from '@/components/StateDiagram';
import { ExecutionTrace } from '@/components/ExecutionTrace';
import { AcceptanceDisplay } from '@/components/AcceptanceDisplay';
import { EducationalPanel } from '@/components/EducationalPanel';
import { SimulationControls } from '@/components/SimulationControls';
import { ParticleBackground } from '@/components/ParticleBackground';
import { motion } from 'framer-motion';

const Index = () => {
  const [config, setConfig] = useState<PDAConfig>({ ...DEFAULT_PDA });
  const [inputString, setInputString] = useState('aabb');
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState(500);
  const [simulationDone, setSimulationDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length
    ? steps[currentStepIndex]
    : null;

  const currentStack = currentStep ? currentStep.stack : [STACK_BOTTOM];

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setAccepted(null);
    setSimulationDone(false);
  }, []);

  const runSimulation = useCallback(() => {
    reset();
    const result = runPDA(config, inputString);
    setSteps(result.steps);
    setAccepted(result.accepted);
    setCurrentStepIndex(0);
    setSimulationDone(false);
  }, [config, inputString, reset]);

  const stepForward = useCallback(() => {
    if (steps.length === 0) {
      runSimulation();
      return;
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setSimulationDone(true);
    }
  }, [steps, currentStepIndex, runSimulation]);

  const autoRun = useCallback(() => {
    if (steps.length === 0) {
      runSimulation();
    }
    setIsRunning(true);
  }, [steps, runSimulation]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isRunning && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsRunning(false);
            setSimulationDone(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isRunning, steps.length, speed]);

  useEffect(() => {
    reset();
  }, [config, reset]);

  return (
    <div className="min-h-screen bg-background warm-glow relative">
      <ParticleBackground />
      {/* Decorative top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-warning relative z-10" />

      <div className="p-4 lg:p-6 max-w-[1700px] mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gradient tracking-tight">
              PDA Simulator
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5 font-medium tracking-wide">
              Interactive Pushdown Automaton Visualization
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              Step {currentStepIndex >= 0 ? currentStepIndex + 1 : 0} / {steps.length}
            </span>
          </div>
        </motion.header>

        {/* Main asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left column: Config + Educational */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="glass rounded-2xl p-5 overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">
                  Configuration
                </h2>
              </div>
              <ConfigPanel config={config} onChange={setConfig} />
            </div>

            <div className="hidden lg:block">
              <EducationalPanel />
            </div>
          </motion.aside>

          {/* Center: Controls + Diagram */}
          <motion.main
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-6 space-y-4"
          >
            {/* Controls */}
            <SimulationControls
              inputString={inputString}
              onInputChange={setInputString}
              onRun={runSimulation}
              onStep={stepForward}
              onAutoRun={autoRun}
              onPause={pause}
              onReset={reset}
              isRunning={isRunning}
              simulationDone={simulationDone}
              speed={speed}
              onSpeedChange={setSpeed}
            />

            <AcceptanceDisplay
              accepted={accepted}
              visible={simulationDone || (steps.length > 0 && currentStepIndex === steps.length - 1)}
            />

            {/* State Diagram */}
            <div className="h-[350px] lg:h-[420px] rounded-2xl overflow-hidden">
              <StateDiagram
                config={config}
                currentState={currentStep?.currentState}
                activeTransition={currentStep?.transitionApplied}
              />
            </div>

            {/* Educational on mobile */}
            <div className="lg:hidden">
              <EducationalPanel />
            </div>
          </motion.main>

          {/* Right column: Stack + Trace - stacked asymmetrically */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Stack with visual accent */}
            <div className="glass rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
              <StackVisualization stack={currentStack} />
            </div>

            {/* Execution Trace */}
            <div className="glass rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full" />
              <ExecutionTrace steps={steps} currentStepIndex={currentStepIndex} />
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
