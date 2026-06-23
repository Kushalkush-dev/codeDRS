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


export const createWebHook = async (owner: string, repo: string) => {
    const token = await getGithubAccessToken()
    const octokit = new Octokit({ auth: token })

    const webHookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
        owner: owner,
        repo: repo
    })
    const existingWebHook = hooks.find((hook) => hook.config.url === webHookUrl)
    if (existingWebHook) {
        return existingWebHook
    }

    const { data } = await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
            url: webHookUrl,
            content_type: "json"
        },
        events: ["pull_request"]
    })

    return data
}


export const deleteWebhook = async (owner: string, repo: string) => {
    const token = await getGithubAccessToken()
    const octokit = new Octokit({ auth: token })
    const webHookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`

    try {
        const { data: hooks } = await octokit.rest.repos.listWebhooks({
            owner,
            repo
        })
        const hookToDelete = hooks.find((hook) => hook.config.url === webHookUrl)

        if (hookToDelete) {
            await octokit.rest.repos.deleteWebhook({
                owner,
                repo,
                hook_id: hookToDelete.id
            })

            return true;
        }

        return false;
    } catch (error) {
        console.error("Failed to Delete Webhook", error);
        return false

    }
}


export const getRepoFileContents = async (
    token: string, owner: string, repo: string, path: string = ""
): Promise<{ path: string, content: string }[]> => {

    const octokit = new Octokit({ auth: token })

    const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
    })

    if (!Array.isArray(data)) {
        // if it's a single file
        if (data.type === "file" && data.content) {
            return [{
                path: data.path,
                content: Buffer.from(data.content, "base64").toString("utf-8")
            }];
        }

        return [];
    }

    const files: { path: string, content: string }[] = [];

    for (const item of data) {
        if (item.type === "file") {
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: item.path
            })


            if (!Array.isArray(fileData) && fileData.type === "file" && fileData.content) {

                if (!item.path.match(/\.(png|jpg|svg|gif|mp4|ico|jpeg|pdf|zip|tar|gz|webp|avif|mp3|mkv)$/i)) {
                    files.push({
                        path: item.path,
                        content: Buffer.from(fileData.content, "base64").toString("utf-8")
                    })
                }

            }
        }
        else if (item.type === "dir") {

            const subFiles = await getRepoFileContents(token, owner, repo, item.path)

            if (Array.isArray(subFiles) && subFiles.length > 0) {
                files.push(...subFiles);
            }


        }
    }

    return files
}


export const getPullRequestDiff = async (token: string, owner: string, repo: string, prNumber: number) => {

    const octokit = new Octokit({ auth: token })

    const { data: pr } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber
    })

    const { data: diff } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
        mediaType: {
            format: "diff"
        }
    })

    return {
        diff: diff as unknown as string,
        title: pr?.title,
        description: pr?.body || ""
    }
}


export const postReviewComment = async (
    token: string,
    owner: string,
    repo: string,
    prNumber: number,
    review: string
) => {

    try {
        const octokit = new Octokit({ auth: token })

        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: prNumber,
            body: `##🤖🔎CodeDRS Review \n\n${review}\n\n---\n*Powered By CodeDRS `
        })

    } catch (error) {

        console.error("Failed To Post Ai Review Comment to Github", error)

    }
}