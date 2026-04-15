export interface Transition {
  id: string;
  fromState: string;
  inputSymbol: string; // '' for epsilon
  stackTop: string;    // '' for epsilon
  toState: string;
  stackPush: string[]; // what to push (empty = pop only, stackTop = no-op)
}

export interface PDAConfig {
  states: string[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  startState: string;
  acceptStates: string[];
  transitions: Transition[];
  acceptanceMode: 'finalState' | 'emptyStack' | 'both';
}

export interface SimulationStep {
  stepNumber: number;
  currentState: string;
  remainingInput: string;
  stack: string[];
  transitionApplied: Transition | null;
  description: string;
}

export interface SimulationResult {
  accepted: boolean;
  steps: SimulationStep[];
}

export const EPSILON = 'ε';
export const STACK_BOTTOM = 'Z₀';

export const DEFAULT_PDA: PDAConfig = {
  states: ['q0', 'q1', 'q2'],
  inputAlphabet: ['a', 'b'],
  stackAlphabet: ['Z₀', 'A'],
  startState: 'q0',
  acceptStates: ['q2'],
  transitions: [
    { id: '1', fromState: 'q0', inputSymbol: 'a', stackTop: 'Z₀', toState: 'q0', stackPush: ['Z₀', 'A'] },
    { id: '2', fromState: 'q0', inputSymbol: 'a', stackTop: 'A', toState: 'q0', stackPush: ['A', 'A'] },
    { id: '3', fromState: 'q0', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
    { id: '4', fromState: 'q1', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
    { id: '5', fromState: 'q1', inputSymbol: '', stackTop: 'Z₀', toState: 'q2', stackPush: [] },
  ],
  acceptanceMode: 'finalState',
};

export const EXAMPLE_PDAS: { name: string; description: string; config: PDAConfig; testInputs: string[] }[] = [
  {
    name: 'aⁿbⁿ',
    description: 'Accepts strings with equal number of a\'s followed by b\'s',
    config: DEFAULT_PDA,
    testInputs: ['aabb', 'aaabbb', 'ab', 'aab', 'abab'],
  },
  {
    name: 'Balanced Parentheses',
    description: 'Accepts strings of balanced parentheses',
    config: {
      states: ['q0', 'q1'],
      inputAlphabet: ['(', ')'],
      stackAlphabet: ['Z₀', '('],
      startState: 'q0',
      acceptStates: ['q1'],
      transitions: [
        { id: '1', fromState: 'q0', inputSymbol: '(', stackTop: 'Z₀', toState: 'q0', stackPush: ['Z₀', '('] },
        { id: '2', fromState: 'q0', inputSymbol: '(', stackTop: '(', toState: 'q0', stackPush: ['(', '('] },
        { id: '3', fromState: 'q0', inputSymbol: ')', stackTop: '(', toState: 'q0', stackPush: [] },
        { id: '4', fromState: 'q0', inputSymbol: '', stackTop: 'Z₀', toState: 'q1', stackPush: [] },
      ],
      acceptanceMode: 'finalState',
    },
    testInputs: ['(())', '()()', '((()))', '(()', '())'],
  },
  {
    name: 'ww^R',
    description: 'Accepts palindromes of even length (non-deterministic, uses guess)',
    config: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z₀', 'a', 'b'],
      startState: 'q0',
      acceptStates: ['q2'],
      transitions: [
        { id: '1', fromState: 'q0', inputSymbol: 'a', stackTop: 'Z₀', toState: 'q0', stackPush: ['Z₀', 'a'] },
        { id: '2', fromState: 'q0', inputSymbol: 'b', stackTop: 'Z₀', toState: 'q0', stackPush: ['Z₀', 'b'] },
        { id: '3', fromState: 'q0', inputSymbol: 'a', stackTop: 'a', toState: 'q0', stackPush: ['a', 'a'] },
        { id: '4', fromState: 'q0', inputSymbol: 'a', stackTop: 'b', toState: 'q0', stackPush: ['b', 'a'] },
        { id: '5', fromState: 'q0', inputSymbol: 'b', stackTop: 'a', toState: 'q0', stackPush: ['a', 'b'] },
        { id: '6', fromState: 'q0', inputSymbol: 'b', stackTop: 'b', toState: 'q0', stackPush: ['b', 'b'] },
        { id: '7', fromState: 'q0', inputSymbol: '', stackTop: 'a', toState: 'q1', stackPush: ['a'] },
        { id: '8', fromState: 'q0', inputSymbol: '', stackTop: 'b', toState: 'q1', stackPush: ['b'] },
        { id: '9', fromState: 'q1', inputSymbol: 'a', stackTop: 'a', toState: 'q1', stackPush: [] },
        { id: '10', fromState: 'q1', inputSymbol: 'b', stackTop: 'b', toState: 'q1', stackPush: [] },
        { id: '11', fromState: 'q1', inputSymbol: '', stackTop: 'Z₀', toState: 'q2', stackPush: [] },
      ],
      acceptanceMode: 'finalState',
    },
    testInputs: ['abba', 'aabbaa', 'abab', 'aa', 'aba'],
  },
];
