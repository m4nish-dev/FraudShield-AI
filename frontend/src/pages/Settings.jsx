import { useState } from 'react'
import { Settings as SettingsIcon, Monitor, Sliders, Scale, Bell, Key, Users, Info, ShieldAlert } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { cn } from '../lib/cn'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Detection Thresholds')

  const TABS = [
    { id: 'Profile', icon: Users },
    { id: 'Appearance', icon: Monitor },
    { id: 'Detection Thresholds', icon: Sliders },
    { id: 'Model Weights', icon: Scale },
    { id: 'Notifications', icon: Bell },
    { id: 'API Keys', icon: Key },
    { id: 'Team', icon: Users },
    { id: 'About', icon: Info },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Appearance':
        return (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-medium text-text-primary mb-4">Appearance Settings</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-4 bg-surface border border-border-default rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">Theme</h3>
                    <p className="text-sm text-text-tertiary">Select your preferred color theme.</p>
                  </div>
                  <div className="flex bg-inset p-1 rounded-md border border-border-default">
                    <button className="px-4 py-1.5 rounded bg-surface border border-border-strong text-sm text-text-primary shadow-sm">Dark</button>
                    <button className="px-4 py-1.5 rounded text-sm text-text-tertiary hover:text-text-secondary">System</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-surface border border-border-default rounded-lg">
                  <div>
                    <h3 className="font-medium text-text-primary">Data Density</h3>
                    <p className="text-sm text-text-tertiary">Adjust padding in tables and lists.</p>
                  </div>
                  <div className="flex bg-inset p-1 rounded-md border border-border-default">
                    <button className="px-4 py-1.5 rounded text-sm text-text-tertiary hover:text-text-secondary">Comfortable</button>
                    <button className="px-4 py-1.5 rounded bg-surface border border-border-strong text-sm text-text-primary shadow-sm">Compact</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'Detection Thresholds':
        return (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-medium text-text-primary mb-1">Detection Thresholds</h2>
              <p className="text-sm text-text-tertiary mb-6">Configure the risk score boundaries that trigger specific operational workflows.</p>
              
              <div className="flex flex-col gap-6">
                {[
                  { label: 'Critical Threshold', value: 80, color: 'text-risk-critical', bg: 'accent-risk-critical' },
                  { label: 'High Threshold', value: 60, color: 'text-risk-high', bg: 'accent-risk-high' },
                  { label: 'Medium Threshold', value: 40, color: 'text-risk-medium', bg: 'accent-risk-medium' },
                ].map(t => (
                  <div key={t.label} className="bg-surface border border-border-default rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-text-primary">{t.label}</span>
                      <span className={cn("font-mono text-xl tabular", t.color)}>{t.value}</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue={t.value} className={cn("w-full", t.bg)} />
                  </div>
                ))}
              </div>
            </div>
            <Button variant="primary" className="w-fit mt-2">Save Thresholds</Button>
          </div>
        )

      case 'Model Weights':
        return (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-medium text-text-primary mb-1">Ensemble Model Weights</h2>
              <p className="text-sm text-text-tertiary mb-6">Adjust the relative influence of each model in the final Fusion Score calculation. Must sum to 1.0</p>
              
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Transaction', weight: 0.25 },
                  { name: 'Behaviour', weight: 0.25 },
                  { name: 'Anomaly', weight: 0.15 },
                  { name: 'Temporal', weight: 0.15 },
                  { name: 'Graph', weight: 0.20 },
                ].map(m => (
                  <div key={m.name} className="flex items-center gap-6 p-4 bg-surface border border-border-default rounded-lg">
                    <span className="w-24 font-medium text-sm text-text-primary">{m.name}</span>
                    <input type="range" min="0" max="100" defaultValue={m.weight * 100} className="flex-1 accent-accent" />
                    <span className="font-mono text-sm text-text-secondary w-12 text-right">{m.weight.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 p-4 bg-inset border border-border-default rounded-lg">
              <span className="text-sm font-medium text-text-primary">Total Weight</span>
              <span className="font-mono text-lg text-risk-low">1.00</span>
            </div>
            <Button variant="primary" className="w-fit">Update Weights</Button>
          </div>
        )

      case 'About':
        return (
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="bg-surface border border-border-default rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 mb-2">
                <ShieldAlert size={32} className="text-accent" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-text-primary">FraudShield AI</h2>
              <Badge variant="neutral" className="font-mono">v0.1.0-beta</Badge>
              
              <div className="mt-4 p-4 bg-inset border border-border-subtle rounded-lg text-sm text-text-secondary leading-relaxed">
                <p className="font-medium text-text-primary mb-2">BTP Research Prototype</p>
                <p>This is a research-grade AI fraud investigation platform built for a university major project.</p>
                <p className="mt-2 text-risk-medium font-medium flex items-center justify-center gap-1.5">
                  <ShieldAlert size={14} /> Not connected to real payment rails.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-text-tertiary flex items-center justify-center h-64 border border-dashed border-border-default rounded-lg">
            Select a category on the left to manage settings.
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Settings"
        subtitle="Manage your platform configuration and user preferences"
      />
      <div className="flex-1 flex overflow-hidden border-t border-border-default">
        {/* Left Tabs Rail */}
        <div className="w-64 bg-surface border-r border-border-default p-4 flex flex-col shrink-0 gap-1 overflow-y-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-inset text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-inset/50"
                )}
              >
                <Icon size={16} className={isActive ? "text-accent" : "text-text-tertiary"} />
                {tab.id}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-canvas p-8 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
