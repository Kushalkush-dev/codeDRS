import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { Octokit } from "octokit"



export const getGithubAccessToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized Access")
    }

    const account = await prisma.account.findFirst({

        where: {
            userId: session.user.id,
            providerId: "github"
        }
    })


    if (!account?.accessToken) {
        throw new Error("No Github Access Token Found")
    }

    return account?.accessToken
}


export const fetchUserContribution = async (token: string, userName: string) => {
    const octokit = new Octokit({ auth: token })

    const query = `
    query($username:String!){
         user(login:$username){
            contributionsCollection{
                contributionCalendar{
                    weeks{
                        contributionDays{
                           contributionCount
                           date
                           color
                           }
                       }
                    }
               }
            }
     }
    `

    // interface contributionData{
    // }
    try {
        const response: any = await octokit.graphql(query, {
            username: userName
        })

        const coll = response?.user?.contributionsCollection

        if (!coll) return null

        const weeks = coll.contributionCalendar?.weeks || []

        const totalContributions = weeks.reduce((sum: number, week: any) => {
            const days = week.contributionDays || []
            return sum + days.reduce((s: number, d: any) => s + (d.contributionCount || 0), 0)
        }, 0)

        return {
            totalContributions,
            weeks
        }

    } catch (error) {
        console.error("Error fetching user contribution data:", error);
        return null;
    }

}