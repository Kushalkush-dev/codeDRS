"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";


export const getReviews = async () => {

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }


        const reviews = await prisma.review.findMany({
            where: {
                repository: {
                    userId: session.user.id
                }

            },
            include: {
                repository: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        })
        return reviews
    } catch (error) {

        console.error("Failed to Fetch Reviews", error);
        
    }

}