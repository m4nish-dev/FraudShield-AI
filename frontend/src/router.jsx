import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/layout/AppShell'

// Pages — lazy-loadable in the future, inline for Phase 2
import Dashboard       from './pages/Dashboard'
import DesignSystem    from './pages/DesignSystem'
import Transactions    from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import Cases           from './pages/Cases'
import CaseDetail      from './pages/CaseDetail'
import AttackChains    from './pages/AttackChains'
import FraudNetwork    from './pages/FraudNetwork'
import Campaigns       from './pages/Campaigns'
import CampaignDetail  from './pages/CampaignDetail'
import RiskTimeline    from './pages/RiskTimeline'
import Investigations  from './pages/Investigations'
import Analytics       from './pages/Analytics'
import Settings        from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,                       element: <Dashboard /> },
      { path: 'transactions',              element: <Transactions /> },
      { path: 'transactions/:id',          element: <TransactionDetail /> },
      { path: 'alerts',                    element: <Cases /> },
      { path: 'cases',                     element: <Cases /> },
      { path: 'cases/:id',                 element: <CaseDetail /> },
      { path: 'attack-chains',             element: <AttackChains /> },
      { path: 'fraud-network',             element: <FraudNetwork /> },
      { path: 'campaigns',                 element: <Campaigns /> },
      { path: 'campaigns/:id',             element: <CampaignDetail /> },
      { path: 'risk-timeline',             element: <RiskTimeline /> },
      { path: 'investigations',            element: <Investigations /> },
      { path: 'analytics',                 element: <Analytics /> },
      { path: 'settings',                  element: <Settings /> },
    ],
  },
  // Design system QA page — standalone (no shell) for full-width rendering
  { path: '/design-system', element: <DesignSystem /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
