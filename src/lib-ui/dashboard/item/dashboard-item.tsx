import { PropsWithChildren } from 'react'

import './dashboard-item.scss'

interface DashboardItemProps {
  id?: string
  colSpan?: number
  rowSpan?: number
}

function DashboardItem({
  id,
  colSpan = 1,
  rowSpan = 1,
  children,
}: PropsWithChildren<DashboardItemProps>) {
  return (
    <div id={id} className="dashboard-item" data-rowspan={rowSpan} data-colspan={colSpan}>
      {children}
    </div>
  )
}

export default DashboardItem
