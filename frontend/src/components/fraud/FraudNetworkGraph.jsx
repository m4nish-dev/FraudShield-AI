import { useMemo } from 'react'
import ReactFlow, { Background, Controls, MarkerType, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { getRiskColor } from '../../lib/risk'
import { User, Wallet, Smartphone, Globe, Store, AlertOctagon } from 'lucide-react'

const ICON_MAP = {
  user: User,
  account: Wallet,
  device: Smartphone,
  ip: Globe,
  merchant: Store,
  mule: AlertOctagon,
}

const EntityNode = ({ data }) => {
  const Icon = ICON_MAP[data.type] || User
  const color = getRiskColor(data.riskScore)

  return (
    <div
      className="bg-surface border rounded-lg p-2 shadow-sm flex items-center gap-2"
      style={{ borderColor: `${color}66` }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${color}15` }}>
        <Icon size={14} strokeWidth={2} style={{ color }} />
      </div>
      <div className="flex flex-col pr-2">
        <span className="text-xs font-mono text-text-primary">{data.label}</span>
      </div>
    </div>
  )
}

const nodeTypes = {
  entity: EntityNode,
}

export function FraudNetworkGraph({ nodesData = [], edgesData = [] }) {
  const nodes = useMemo(() => {
    return nodesData.map(node => ({
      id: node.id,
      type: 'entity',
      position: node.position || { x: Math.random() * 400, y: Math.random() * 300 },
      data: node,
    }))
  }, [nodesData])

  const edges = useMemo(() => {
    return edgesData.map(edge => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: edge.animated || false,
      style: { stroke: '#71717A', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#71717A', width: 15, height: 15 },
    }))
  }, [edgesData])

  return (
    <div className="w-full h-[500px] bg-canvas rounded-lg border border-border-default overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2A2A35" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-surface border-border-default fill-text-primary" />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-surface border border-border-default rounded-md p-2 flex flex-col gap-2 shadow-md text-xs">
        {Object.entries(ICON_MAP).map(([key, Icon]) => (
          <div key={key} className="flex items-center gap-2">
            <Icon size={12} className="text-text-tertiary" />
            <span className="capitalize text-text-secondary">{key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
