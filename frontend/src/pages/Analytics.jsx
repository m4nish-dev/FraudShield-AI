import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Activity, Clock, Zap } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

const MODEL_METRICS = [
  { name: 'Transaction', precision: 0.9412, recall: 0.8845, f1: 0.9119, roc_auc: 0.9654, pr_auc: 0.9231 },
  { name: 'Behaviour', precision: 0.9105, recall: 0.9230, f1: 0.9167, roc_auc: 0.9712, pr_auc: 0.9405 },
  { name: 'Anomaly', precision: 0.8955, recall: 0.8540, f1: 0.8742, roc_auc: 0.9540, pr_auc: 0.8990 },
  { name: 'Temporal', precision: 0.9520, recall: 0.8210, f1: 0.8816, roc_auc: 0.9488, pr_auc: 0.9102 },
  { name: 'Graph', precision: 0.9780, recall: 0.9650, f1: 0.9714, roc_auc: 0.9910, pr_auc: 0.9855 },
  { name: 'Ensemble Fusion', precision: 0.9850, recall: 0.9780, f1: 0.9814, roc_auc: 0.9960, pr_auc: 0.9912 },
]

const DETECTION_RATE_DATA = [
  { date: 'Sep 18', rate: 94.2, fpr: 0.12 },
  { date: 'Sep 19', rate: 95.1, fpr: 0.11 },
  { date: 'Sep 20', rate: 94.8, fpr: 0.13 },
  { date: 'Sep 21', rate: 96.0, fpr: 0.09 },
  { date: 'Sep 22', rate: 97.2, fpr: 0.08 },
  { date: 'Sep 23', rate: 97.5, fpr: 0.08 },
  { date: 'Sep 24', rate: 98.1, fpr: 0.07 },
]

const FRAUD_CATEGORIES = [
  { name: 'Account Takeover', value: 45, color: '#F43F5E' },
  { name: 'Mule Network', value: 25, color: '#FB923C' },
  { name: 'Card Fraud', value: 15, color: '#FACC15' },
  { name: 'Synthetic Identity', value: 10, color: '#4ADE80' },
  { name: 'AML', value: 5, color: '#38BDF8' },
]

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Model Metrics')
  const TABS = ['Model Metrics', 'Detection Rates', 'Fraud Categories', 'System Health']

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Model Metrics':
        return (
          <div className="flex flex-col gap-6">
            <Card>
              <Card.Header title="Performance Benchmarks" />
              <Card.Body className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface border-b border-border-default">
                    <tr>
                      <th className="px-4 py-3 font-medium text-text-tertiary">Model</th>
                      <th className="px-4 py-3 font-medium text-text-tertiary">Precision</th>
                      <th className="px-4 py-3 font-medium text-text-tertiary">Recall</th>
                      <th className="px-4 py-3 font-medium text-text-tertiary">F1 Score</th>
                      <th className="px-4 py-3 font-medium text-text-tertiary">ROC-AUC</th>
                      <th className="px-4 py-3 font-medium text-text-tertiary">PR-AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODEL_METRICS.map(m => (
                      <tr key={m.name} className="border-b border-border-subtle last:border-0 hover:bg-inset">
                        <td className="px-4 py-3 font-medium text-text-primary">{m.name}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{m.precision.toFixed(4)}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{m.recall.toFixed(4)}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-text-primary">{m.f1.toFixed(4)}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{m.roc_auc.toFixed(4)}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{m.pr_auc.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header title="F1 Score Comparison" />
              <Card.Body>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MODEL_METRICS} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0.8, 1]} tick={{ fill: '#71717A', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#2A2A35' }}
                        contentStyle={{ backgroundColor: '#17171A', borderColor: '#2A2A35', borderRadius: 8 }}
                        itemStyle={{ fontFamily: 'monospace' }}
                      />
                      <Bar dataKey="f1" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </div>
        )
      
      case 'Detection Rates':
        return (
          <div className="flex flex-col gap-6">
            <Card>
              <Card.Header title="True Positive Detection Rate (%)" subtitle="Trailing 7 days" />
              <Card.Body>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DETECTION_RATE_DATA} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                      <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[90, 100]} tick={{ fill: '#71717A', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#17171A', borderColor: '#2A2A35', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="rate" stroke="#4ADE80" strokeWidth={3} dot={{ r: 4, fill: '#4ADE80', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header title="False Positive Rate (%)" subtitle="Trailing 7 days" />
              <Card.Body>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DETECTION_RATE_DATA} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                      <XAxis dataKey="date" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 0.2]} tick={{ fill: '#71717A', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#17171A', borderColor: '#2A2A35', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="fpr" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4, fill: '#F43F5E', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </div>
        )

      case 'Fraud Categories':
        return (
          <Card>
            <Card.Header title="Distribution of Confirmed Cases" />
            <Card.Body>
              <div className="flex items-center gap-12">
                <div className="h-[400px] w-[400px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={FRAUD_CATEGORIES}
                        cx="50%" cy="50%"
                        innerRadius={120} outerRadius={160}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {FRAUD_CATEGORIES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#17171A', borderColor: '#2A2A35', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  {FRAUD_CATEGORIES.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between p-3 bg-inset border border-border-default rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium text-text-primary">{cat.name}</span>
                      </div>
                      <span className="font-mono text-lg font-semibold text-text-secondary">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        )

      case 'System Health':
        return (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-3">
              <span className="text-sm text-text-tertiary flex items-center gap-2"><Clock size={16}/> Inference Latency (p99)</span>
              <span className="text-3xl font-display font-semibold text-text-primary tabular">42<span className="text-lg text-text-tertiary">ms</span></span>
              <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden"><div className="w-[42%] h-full bg-accent" /></div>
            </div>
            <div className="bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-3">
              <span className="text-sm text-text-tertiary flex items-center gap-2"><Activity size={16}/> API Latency</span>
              <span className="text-3xl font-display font-semibold text-text-primary tabular">124<span className="text-lg text-text-tertiary">ms</span></span>
              <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden"><div className="w-[60%] h-full bg-risk-low" /></div>
            </div>
            <div className="bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-3">
              <span className="text-sm text-text-tertiary flex items-center gap-2"><Zap size={16}/> Throughput</span>
              <span className="text-3xl font-display font-semibold text-text-primary tabular">14.2<span className="text-lg text-text-tertiary">k/s</span></span>
              <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden"><div className="w-[85%] h-full bg-accent" /></div>
            </div>
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="Analytics & Model Performance"
        subtitle="Real-time monitoring of detection models and system health"
      />
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="flex border-b border-border-default w-full">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-strong'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
