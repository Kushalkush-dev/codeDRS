"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GitCommit, GitPullRequest, GitBranch, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getMonthlyActivity } from '@/modules/dashboard/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContributionGraph from "@/modules/dashboard/components/ContributionGraph";
const MainPage = () => {

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => await getDashboardStats(),
    refetchOnWindowFocus: false
  })


  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false
  })



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your coding activity and AI reviews</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? " ... " : stats?.totalRepos || 0}</div>
            <p className="text-xs text-muted-foreground">Connected repositories</p>
          </CardContent>
        </Card >

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? " ... " : stats?.totalCommits || 0}</div>
            <p className="text-xs text-muted-foreground">Total commits made</p>
          </CardContent>
        </Card >

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
            <CardTitle className="text-sm font-medium">Total Prs</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? " ... " : stats?.totalPRs || 0}</div>
            <p className="text-xs text-muted-foreground">Total PRs made</p>
          </CardContent>
        </Card >

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
            <CardTitle className="text-sm font-medium">Ai Reviews</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? " ... " : stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">Total Ai Reviews</p>
          </CardContent>
        </Card >
      </div >

      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
          <CardDescription>Visualizing your coding frequency over the last year</CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionGraph />
        </CardContent>
      </Card>
    </div>

  )

}

export default MainPage
