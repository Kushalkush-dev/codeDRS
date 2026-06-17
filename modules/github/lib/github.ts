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



export const getRepositories = async (page: number = 1, perPage: number = 10) => {
    const token = await getGithubAccessToken()

    const octokit = new Octokit({ auth: token })
    try {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: "updated",
            direction: "desc",
            visibility: "all",
            per_page: perPage,
            page: page
        })

        return data

    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }

}


export const createWebHook=async(owner:string,repo:string)=>{
    const token=await getGithubAccessToken()
    const octokit=new  Octokit({auth:token})

    const webHookUrl=`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`
    const {data:hooks}= await octokit.rest.repos.listWebhooks({
        owner:owner,
        repo:repo
    })
    const existingWebHook=hooks.find((hook)=>hook.config.url===webHookUrl)
    if (existingWebHook) {
        return existingWebHook
    }

    const {data}=await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config:{
            url:webHookUrl,
            content_type:"json"
        },
        events:["pull_request"]
    })

    return data
}