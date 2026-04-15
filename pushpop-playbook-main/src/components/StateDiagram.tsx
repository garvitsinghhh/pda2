import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PDAConfig, Transition } from '@/lib/pda-types';

interface Props {
  config: PDAConfig;
  currentState?: string;
  activeTransition?: Transition | null;
}

function StateNode({ data }: { data: { label: string; isStart: boolean; isAccept: boolean; isActive: boolean } }) {
  return (
    <div
      className={`
        flex items-center justify-center rounded-full w-16 h-16 font-mono font-bold text-sm border-2 transition-all duration-300
        ${data.isActive
          ? 'border-primary bg-primary/20 glow-primary text-primary shadow-lg scale-110'
          : data.isAccept
          ? 'border-success/60 bg-success/10 text-success'
          : 'border-border bg-card text-foreground'
        }
        ${data.isAccept ? 'ring-2 ring-offset-2 ring-offset-card ring-success/40' : ''}
      `}
    >
      {data.isStart && <span className="absolute -left-6 text-primary text-lg">→</span>}
      {data.label}
    </div>
  );
}

const nodeTypes = { state: StateNode };

export function StateDiagram({ config, currentState, activeTransition }: Props) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const angleStep = (2 * Math.PI) / Math.max(config.states.length, 1);
    const radius = 150;
    const cx = 250;
    const cy = 200;

    const nodes: Node[] = config.states.map((s, i) => ({
      id: s,
      type: 'state',
      position: {
        x: cx + radius * Math.cos(i * angleStep - Math.PI / 2),
        y: cy + radius * Math.sin(i * angleStep - Math.PI / 2),
      },
      data: {
        label: s,
        isStart: s === config.startState,
        isAccept: config.acceptStates.includes(s),
        isActive: s === currentState,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    // Group transitions by from-to pair
    const grouped = new Map<string, Transition[]>();
    for (const t of config.transitions) {
      const key = `${t.fromState}-${t.toState}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(t);
    }

    const edges: Edge[] = [];
    grouped.forEach((transitions, key) => {
      const label = transitions.map(t =>
        `${t.inputSymbol || 'ε'}, ${t.stackTop || 'ε'} → ${t.stackPush.length ? t.stackPush.join(',') : 'ε'}`
      ).join('\n');

      const isActive = activeTransition && transitions.some(t => t.id === activeTransition.id);

      edges.push({
        id: key,
        source: transitions[0].fromState,
        target: transitions[0].toState,
        label,
        type: 'default',
        animated: !!isActive,
        style: {
          stroke: isActive ? 'hsl(25, 95%, 55%)' : 'hsl(15, 10%, 30%)',
          strokeWidth: isActive ? 2.5 : 1.5,
        },
        labelStyle: {
          fontSize: 10,
          fill: isActive ? 'hsl(25, 95%, 55%)' : 'hsl(25, 10%, 50%)',
          fontFamily: "'JetBrains Mono', monospace",
        },
        labelBgStyle: {
          fill: 'hsl(15, 12%, 10%)',
          fillOpacity: 0.9,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? 'hsl(25, 95%, 55%)' : 'hsl(15, 10%, 30%)',
          width: 15,
          height: 15,
        },
      });
    });

    return { nodes, edges };
  }, [config, currentState, activeTransition]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodesWithState = useMemo(() =>
    initialNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isActive: n.id === currentState,
      },
    })),
    [initialNodes, currentState]
  );

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden glass">
      <ReactFlow
        nodes={nodesWithState}
        edges={initialEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        className="bg-card"
      >
        <Background color="hsl(15, 10%, 15%)" gap={20} size={1} />
        <Controls className="!bg-secondary !border-border" />
      </ReactFlow>
    </div>
  );
}
