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
    query($Username:String!){
         user(login:$username){
             contributionCollection{
                 contributionCalendar{
                     weeks{
                         contributionDays{
                            contributionCount
                            data
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

        return response.user.contributionCollection.contributionCalender

    } catch (error) {
        console.error("Error fetching user contribution data:", error);
        return null;
    }

}