import prisma from "@/lib/db";
import { inngest } from "../client";
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { getPullRequestDiff, postReviewComment } from "@/modules/github/lib/github";
import { retriveContext } from "@/modules/ai/lib/rag";
import { buildReviewPrompt } from "@/modules/ai/lib/review-presets";


export const generateReview = inngest.createFunction(
    {
        id: "generate-review", concurrency: 5,
        triggers: {
            event: "pr.review.requested"
        }
    },

    async ({ event, step }) => {
        const { owner, repo, prNumber, userId } = event.data

        const { diff, title, description, token, reviewPreset } = await step.run("fecth-pr-data", async () => {

            const account = await prisma.account.findFirst({
                where: {
                    userId: userId,
                    providerId: "github"
                }
            })

            if (!account?.accessToken) {
                throw new Error("No Github access Token")
            }

            const data = await getPullRequestDiff(account.accessToken, owner, repo, prNumber);

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    reviewPreset: true
                }
            })

            return {
                ...data,
                token: account.accessToken,
                reviewPreset: user?.reviewPreset
            }
        })


        const context = await step.run("retrieve-context", async () => {
            const query = `${title}\n${description}`;
            return await retriveContext(query, `${owner}/${repo}`)
        }) ?? []

        const reviewContext = context.filter((item): item is string => typeof item === "string")

        const AiReview = await step.run("generate-review", async () => {
            const prompt = buildReviewPrompt(reviewPreset, {
                title,
                description,
                context: reviewContext,
                diff
            })


            const { text } = await generateText({
                model: google("gemini-2.5-flash"),
                prompt
            })

            return text


        })


        await step.run("post-comment", async () => {
            await postReviewComment(token, owner, repo, prNumber, AiReview)
        })


        await step.run("save-review-db", async () => {
            const repository = await prisma.repository.findFirst({
                where: {
                    owner,
                    name: repo,
                }
            })

            if (repository) {
                await prisma.review.create({
                    data: {
                        repositoryId: repository.id,
                        prNumber,
                        prTitle: title,
                        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
                        review: AiReview,
                        status: "completed"
                    }
                })
            }
        })

        return { success: true }
    }


)



