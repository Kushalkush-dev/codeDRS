"use server"

import { inngest } from "@/app/inngest/client"
import prisma from "@/lib/db"
import { canCreateReview, incrementReviewCount } from "@/modules/subscription/lib/subscription"


export const reviewPullRequest = async (
    owner: string,
    repo: string,
    prNumber: number
) => {

    try {

        const repository = await prisma.repository.findFirst({
            where: {
                owner,
                name: repo
            },
            include: {
                user: {
                    include: {
                        accounts: {
                            where: {
                                providerId: "github"
                            }
                        }
                    }
                }
            }
        })

        if (!repository) {
            throw new Error(`Repository  ${owner}/${repo} not found in the Database .Try Reconnecting the Repo.`)
        }

        const canReview = await canCreateReview(repository.user.id, repository.id)

        if (!canReview) {
            throw new Error("Reviews limit reached for this repository.Upgrade To Pro for Unlimited Reviews")
        }

        const githubAccount = repository?.user?.accounts[0];

        if (!githubAccount?.accessToken) {
            throw new Error(`No github access token found found for the Repository owner ${owner}/${repo}`)

        }

        const token = githubAccount?.accessToken;

        await inngest.send({
            name: "pr.review.requested",
            data: {
                owner,
                repo,
                prNumber,
                userId: repository.user.id
            }
        })

        await incrementReviewCount(repository.user.id, repository.id)

        return { success: true, message: "Review Queued" }

    } catch (error) {

        try {
            const repository = await prisma.repository.findFirst({
                where: {
                    owner,
                    name: repo
                }
            })

            if (repository) {
                await prisma.review.create({
                    data: {
                        repositoryId: repository.id,
                        prNumber,
                        prTitle: "Failed to fetch PR",
                        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
                        review: `Error : ${error instanceof Error ? error.message : "Unknown Error"}`,
                        status: "failed"
                    }
                })
            }
        } catch (dbError) {
            console.error("Failed to save error to Databasse.", dbError)
        }
    }

}
