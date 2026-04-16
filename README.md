# PDA Simulator

An interactive Pushdown Automaton simulator built as a single-file web app. It combines formal language theory with a visual step-through interface, making it useful for learning, teaching, demos, and quick experimentation.

## Overview

This project helps users understand how a PDA processes input, changes state, and manipulates its stack over time. It includes:

- a simulation workspace for building and testing automata
- a theory section with core PDA concepts
- example machines for common context-free languages
- a visual state graph with transition highlighting
- a step trace and live stack view

Everything runs in the browser with no build step required.

## Features

- Interactive PDA simulation
- Step-by-step execution trace
- Stack visualization
- Input tape highlighting
- Zoomable and pannable state diagram
- Clickable transition legend
- Editable states, transitions, and acceptance modes
- Built-in examples such as `aⁿbⁿ`, balanced parentheses, and palindromes
- Single HTML file for easy sharing and deployment

## How It Works

A Pushdown Automaton extends a finite automaton with a stack.

In this simulator, each transition is defined by:

- current state
- input symbol
- stack top
- next state
- stack replacement

The simulator evaluates transitions, updates the remaining input, modifies the stack, and records every step so the full run can be inspected visually.

## Acceptance Modes

The simulator supports three styles of acceptance:

- `finalState`
- `emptyStack`
- `both`

This makes it easier to test different PDA constructions without rewriting the machine.

## Project Structure

This project is intentionally simple.

- `index.html`  
  Contains the complete UI, styles, simulation engine, examples, and rendering logic.

Because the app is self-contained, it can be opened directly in a browser or hosted as a static file.

## Running Locally

1. Save the project as an `.html` file.
2. Open it in any modern browser.

That is enough to start using the simulator.

## Example Use Cases

- classroom demonstrations of PDA execution
- self-study for automata theory
- testing small context-free language recognizers
- visualizing stack behavior during transitions
- explaining acceptance by final state vs. empty stack

## Notes

- The simulator is designed for clarity and interactivity rather than formal verification tooling.
- Non-deterministic behavior is supported through recursive exploration of valid transitions.
- Very large or highly branching machines may be harder to visualize cleanly in a single diagram.

