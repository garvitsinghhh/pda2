import { PDAConfig, SimulationStep, SimulationResult, Transition, STACK_BOTTOM } from './pda-types';

interface PDAState {
  currentState: string;
  remainingInput: string;
  stack: string[];
  steps: SimulationStep[];
}

function findTransitions(config: PDAConfig, state: string, input: string, stackTop: string): Transition[] {
  return config.transitions.filter(t => {
    const stateMatch = t.fromState === state;
    const inputMatch = t.inputSymbol === input || t.inputSymbol === '';
    const stackMatch = t.stackTop === stackTop || t.stackTop === '';
    return stateMatch && inputMatch && stackMatch;
  });
}

function applyTransition(pda: PDAState, transition: Transition): PDAState {
  const newStack = [...pda.stack];

  // Pop stack top if transition specifies a stack top
  if (transition.stackTop !== '') {
    newStack.pop();
  }

  // Push new symbols (in reverse so first element ends on top)
  for (let i = 0; i < transition.stackPush.length; i++) {
    newStack.push(transition.stackPush[i]);
  }

  const consumedInput = transition.inputSymbol !== '';
  const newRemaining = consumedInput ? pda.remainingInput.slice(1) : pda.remainingInput;

  const stackOpDesc = transition.stackPush.length === 0
    ? `POP ${transition.stackTop}`
    : transition.stackTop === '' && transition.stackPush.length > 0
    ? `PUSH ${transition.stackPush.join(',')}`
    : `Replace ${transition.stackTop} → ${transition.stackPush.join(',')}`;

  const step: SimulationStep = {
    stepNumber: pda.steps.length + 1,
    currentState: transition.toState,
    remainingInput: newRemaining,
    stack: [...newStack],
    transitionApplied: transition,
    description: `δ(${transition.fromState}, ${transition.inputSymbol || 'ε'}, ${transition.stackTop || 'ε'}) → (${transition.toState}, ${stackOpDesc})`,
  };

  return {
    currentState: transition.toState,
    remainingInput: newRemaining,
    stack: newStack,
    steps: [...pda.steps, step],
  };
}

function isAccepted(config: PDAConfig, state: PDAState): boolean {
  if (state.remainingInput.length > 0) return false;

  switch (config.acceptanceMode) {
    case 'finalState':
      return config.acceptStates.includes(state.currentState);
    case 'emptyStack':
      return state.stack.length === 0;
    case 'both':
      return config.acceptStates.includes(state.currentState) || state.stack.length === 0;
  }
}

// DFS-based simulation for non-deterministic PDA
function simulate(config: PDAConfig, state: PDAState, depth: number = 0): PDAState | null {
  if (depth > 200) return null; // prevent infinite loops

  if (isAccepted(config, state)) return state;

  const inputChar = state.remainingInput.length > 0 ? state.remainingInput[0] : '';
  const stackTop = state.stack.length > 0 ? state.stack[state.stack.length - 1] : '';

  // Try transitions that consume input first, then epsilon transitions
  const transitions = findTransitions(config, state.currentState, inputChar, stackTop);

  // Sort: input-consuming first, epsilon last
  transitions.sort((a, b) => {
    if (a.inputSymbol !== '' && b.inputSymbol === '') return -1;
    if (a.inputSymbol === '' && b.inputSymbol !== '') return 1;
    return 0;
  });

  for (const t of transitions) {
    // Only try input-consuming transitions if there's input left
    if (t.inputSymbol !== '' && state.remainingInput.length === 0) continue;

    const newState = applyTransition(state, t);
    const result = simulate(config, newState, depth + 1);
    if (result) return result;
  }

  return null;
}

export function runPDA(config: PDAConfig, input: string): SimulationResult {
  const initialStack = [STACK_BOTTOM];
  const initialStep: SimulationStep = {
    stepNumber: 0,
    currentState: config.startState,
    remainingInput: input,
    stack: [...initialStack],
    transitionApplied: null,
    description: `Start: state=${config.startState}, input="${input}", stack=[${STACK_BOTTOM}]`,
  };

  const initialState: PDAState = {
    currentState: config.startState,
    remainingInput: input,
    stack: initialStack,
    steps: [initialStep],
  };

  const result = simulate(config, initialState);

  if (result) {
    return { accepted: true, steps: result.steps };
  }

  // If rejected, do a greedy run to show what happened
  let state = initialState;
  let maxSteps = input.length * 3 + 5;
  while (maxSteps-- > 0) {
    const inputChar = state.remainingInput.length > 0 ? state.remainingInput[0] : '';
    const stackTop = state.stack.length > 0 ? state.stack[state.stack.length - 1] : '';
    const transitions = findTransitions(config, state.currentState, inputChar, stackTop);

    if (transitions.length === 0) break;

    const t = transitions[0];
    if (t.inputSymbol !== '' && state.remainingInput.length === 0) break;

    state = applyTransition(state, t);
  }

  return { accepted: false, steps: state.steps };
}

export function validatePDA(config: PDAConfig): string[] {
  const errors: string[] = [];
  if (config.states.length === 0) errors.push('At least one state is required');
  if (!config.startState) errors.push('Start state is required');
  if (!config.states.includes(config.startState)) errors.push('Start state must be in states list');
  for (const s of config.acceptStates) {
    if (!config.states.includes(s)) errors.push(`Accept state "${s}" not in states list`);
  }
  for (const t of config.transitions) {
    if (!config.states.includes(t.fromState)) errors.push(`Transition from unknown state "${t.fromState}"`);
    if (!config.states.includes(t.toState)) errors.push(`Transition to unknown state "${t.toState}"`);
  }
  return errors;
}
