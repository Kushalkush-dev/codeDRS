"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GitCommit, GitPullRequest, GitBranch, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getMonthlyActivity } from '@/modules/dashboard/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContributionGraph from "@/modules/dashboard/components/ContributionGraph";
import { Spinner } from "@/components/ui/spinner";
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


      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Monthly breakdown of commits, PRs, and reviews (last 6 months)</CardDescription>
          </CardHeader>

          <CardContent>

            {isLoadingActivity ? (
              <div className="h-80 w-full flex items-center justify-center">
                <Spinner />
              </div>) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyActivity || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend />
                  <Bar dataKey="commits" name="Commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="prs" name="Pull Requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" name="AI Reviews" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

          </CardContent>

        </Card>

      </div>
    </div>

  )

}

export default MainPage
