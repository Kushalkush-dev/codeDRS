"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { createWebHook, getRepositories } from "@/modules/github/lib/github";
import { inngest } from "@/app/inngest/client";
import { canConnectRepository, incrementRepositoryCount, decrementRepositoryCount } from "@/modules/subscription/lib/subscription";

export const fetchRepositories = async (page: number = 1, perPage: number = 10) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    const githubRepos = await getRepositories(page, perPage)

    const dbRepos = await prisma.repository.findMany({
        where: {
            userId: session.user.id
        }
    })

    const connectedRepos = new Set(dbRepos.map((repo) => repo.githubId.toString()))

    return githubRepos.map((repo: any) => (
        {
            ...repo,
            isConnected: connectedRepos.has(repo.id.toString())
        }
    ))


}



export const connectRepository = async (owner: string, repo: string, githubId: number) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    // Todo: check if the user can connect more repos based on the subscription

    const canConnect = await canConnectRepository(session.user.id)


    if (!canConnect) {
        throw new Error("Repository limit reached .Upgrade To Pro for Unlimited Repositories")
    }

    const webHook = await createWebHook(owner, repo)

    if (webHook) {
        await prisma.repository.create({
            data: {
                githubId: BigInt(githubId),
                name: repo,
                url: `https://github.com/${owner}/${repo}`,
                owner: owner,
                fullName: `${owner}/${repo}`,
                userId: session.user.id,
            }
        })


    }


    // TODO: Increase Connected Repository Count For Tracking
    await incrementRepositoryCount(session.user.id)
    // TODO:Triggering Repo Indexing for Rag 

    try {

        await inngest.send({
            name: "repository.connected",
            data: {
                owner,
                repo,
                userId: session.user.id
            }
        })

    } catch (error) {
        console.error("Failed trigger repository indexing", error);

    }


    return webHook

}