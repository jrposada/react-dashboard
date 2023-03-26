type DashboardState = {
  items: { colStart: number; rowStart: number; rowSpan: number; colSpan: number; id: string }[]
}

type DashboardFlow = 'column' | 'row'
