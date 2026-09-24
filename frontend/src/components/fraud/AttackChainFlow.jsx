import { useMemo } from 'react'
import ReactFlow, { Background, Controls, MarkerType, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { getRiskColor, getRiskLevel } from '../../lib/risk'
import { LogIn, Smartphone, UserPlus, Zap, ArrowRightLeft } from 'lucide-react'
import RiskBar from '../ui/RiskBar'

const ICON_MAP = {
  login: LogIn,
  device: Smartphone,
  beneficiary: UserPlus,
  burst: Zap,
  transfer: ArrowRightLeft,
}

// Custom node for attack steps
const AttackStepNode = ({ data }) => {
  const Icon = ICON_MAP[data.icon] || Zap
  const color = getRiskColor(data.riskScore)

  return (
    <div className="bg-surface border border-border-default rounded-lg p-3 min-w-[180px] shadow-sm">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="p-1.5 rounded bg-inset border border-border-subtle">
            <Icon size={14} strokeWidth={1.75} className="text-text-secondary" />
          </div>
          <span className="text-xs font-mono tabular text-text-tertiary">{data.timestamp}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-text-primary">{data.title}</span>
        </div>
        <div className="pt-1 mt-1 border-t border-border-subtle">
          <RiskBar score={data.riskScore} height="xs" />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  )
}

const nodeTypes = {
  attackStep: AttackStepNode,
}

export function AttackChainFlow({ steps = [] }) {
  const nodes = useMemo(() => {
    return steps.map((step, idx) => ({
      id: `step-${idx}`,
      type: 'attackStep',
      position: { x: 0, y: idx * 140 },
      data: step,
    }))
  }, [steps])

  const edges = useMemo(() => {
    return steps.slice(0, -1).map((_, idx) => ({
      id: `e-${idx}-${idx + 1}`,
      source: `step-${idx}`,
      target: `step-${idx + 1}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#38BDF8', strokeWidth: 1.5, strokeDasharray: '5 5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8', width: 20, height: 20 },
    }))
  }, [steps])

  return (
    <div className="w-full h-[500px] bg-canvas rounded-lg border border-border-default overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2A2A35" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-surface border-border-default fill-text-primary" />
      </ReactFlow>
    </div>
  )
}
