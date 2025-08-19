import StatsOverviewRibbon from '@/features/statistics/components/stats-overview-ribbon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/statistics/')({
  component: StatistisPage,
})

function StatistisPage() {
  return (
    <StatsOverviewRibbon/>
  )
}
