import Dashboard from '../../lib-ui/dashboard/dashboard'

function AppDashboard() {
  return (
    <Dashboard cols={4} rows={4} flow="row">
      <Dashboard.Item id="1" colSpan={2}>
        1 Juan 1
      </Dashboard.Item>
      <Dashboard.Item id="2" rowSpan={2}>
        2 Paco 2
      </Dashboard.Item>
      <Dashboard.Item id="3" colSpan={2}>
        3 Maria 3
      </Dashboard.Item>
      <Dashboard.Item id="4">4 Ana 4</Dashboard.Item>
      <Dashboard.Item id="5" rowSpan={2} colSpan={2}>
        5 John 5
      </Dashboard.Item>
    </Dashboard>
  )
}

export default AppDashboard
