"use client"

import { useQuery } from "@tanstack/react-query"
import { getContributionStats } from "../actions"
import { useTheme } from "next-themes"
import { ActivityCalendar } from "react-activity-calendar"

const ContributionGraph = () => {

    const { theme } = useTheme()

    const { data, isLoading } = useQuery({
        queryKey: ["contribution-graph"],
        queryFn: () => getContributionStats(),
        staleTime: 1000 * 60 * 5
    })


    if (isLoading) {
        return (
            <div className=" w-full flex flex-col items-center justify-center p-8">
                <div className="animate-pulse text-muted-foreground">Loading Contribution Graph...</div>
            </div>
        )
    }

    if (!data || !data.contributions.length) {
        return (
            <div className=" w-full flex flex-col items-center justify-center p-8">
                <div className="animate-pulse text-muted-foreground">No Contribution Data Available</div>
            </div>
        )
    }


    return (
        <div className="w-full flex flex-col items-center gap-4 p-4">
            <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground m-1">
                    {data.totalContributions}
                </span>
                Contributions in last Year
            </div>

            <div className="w-full overflow-x-auto">
                <div className="flex items-center justify-center min-w-max px-4">
                    <ActivityCalendar 
                    data={data.contributions}
                    colorScheme={theme==="dark"?"dark":"light"}
                    blockSize={13}
                    blockMargin={5}
                    fontSize={14}
                    showMonthLabels
                    showWeekdayLabels
                    theme={
                        {
                            light: ['hsl(0,0%,90%)', 'hsl(142,71%,45%)'],
                            dark: ['#161b22', 'hsl(142,71%,45%)']
                        }
                    }/>

                </div>
            </div>
        </div>
    )
}

export default ContributionGraph