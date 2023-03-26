import { createRef, PropsWithChildren, useId, useRef } from 'react'

import DashboardItem from './item/dashboard-item'
import useDashboard, { DashboardRefreshParams } from './use-dashboard'

import './dashboard.scss'

interface DashboardProps extends Omit<DashboardRefreshParams, 'container'> {}

function Dashboard({ children, ...restProps }: PropsWithChildren<DashboardProps>) {
  const previewId = useId()
  const { refresh, setPreview } = useDashboard({ previewId })

  const updateContainerRef = (ref: HTMLDivElement | null) => {
    try {
      refresh({ ...restProps, container: ref })
    } catch (error) {
      console.error(error)
    }
  }

  const updatePreviewRef = (ref: HTMLDivElement | null) => {
    setPreview({ preview: ref })
  }

  return (
    <div ref={updateContainerRef} className="dashboard">
      <div ref={updatePreviewRef} id={previewId} className="dashboard__preview" />
      {children}
    </div>
  )
}

Dashboard.Item = DashboardItem

export default Dashboard
