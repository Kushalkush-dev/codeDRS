"use server"

import { auth } from "@/lib/auth";
import { getRemainingLimits, updatePolarCustomerId, updateUserTier } from "@/modules/subscription/lib/subscription";
import { headers } from "next/headers";
import { polarClient } from "@/modules/subscription/config/polar";
import prisma from "@/lib/db";

type PolarSubscription = {
    id: string;
    status: string;
    customerId: string;
    createdAt: Date;
    modifiedAt: Date | null;
};

export interface SubscriptionData {
    user: {
        id: string;
        name: string;
        email: string;
        subscriptionTier: string;
        subscriptionStatus: string | null;
        polarCustomerId: string | null;
        polarSubscriptionId: string | null;
    } | null;
    limits: {
        tier: "FREE" | "PRO";
        repositories: {
            current: number;
            limit: number | null;
            canAdd: boolean;
        };
        reviews: {
            [repositoryId: string]: {
                current: number;
                limit: number | null;
                canAdd: boolean;
            };
        };
    } | null;
}

export async function getSubscriptionData(): Promise<SubscriptionData> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { user: null, limits: null };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return { user: null, limits: null };
    }

    const limits = await getRemainingLimits(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscriptionTier: user.subscriptionTier || "FREE",
            subscriptionStatus: user.subscriptionStatus || null,
            polarCustomerId: user.polarCustomerId || null,
            polarSubscriptionId: user.polarSubscriptionId || null,
        },
        limits,
    };
}

export async function syncSubscriptionStatus() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    try {
        // Better Auth creates Polar customers with externalId = user.id. Using it
        // lets sync recover even if the customer-created webhook was missed.
        const result = await polarClient.subscriptions.list({
            ...(user.polarCustomerId
                ? { customerId: user.polarCustomerId }
                : { externalCustomerId: user.id }),
            sorting: ["-started_at"],
            limit: 10,
        });

        const subscriptions = (result.result?.items || []) as PolarSubscription[];

        // Find the most relevant subscription (active or most recent)
        const activeSub = subscriptions.find((sub) => sub.status === "active" || sub.status === "trialing");
        const latestSub = [...subscriptions].sort((a, b) => {
            const aDate = a.modifiedAt ?? a.createdAt;
            const bDate = b.modifiedAt ?? b.createdAt;
            return bDate.getTime() - aDate.getTime();
        })[0];
        const relevantSub = activeSub ?? latestSub;

        if (relevantSub?.customerId && relevantSub.customerId !== user.polarCustomerId) {
            await updatePolarCustomerId(user.id, relevantSub.customerId);
        }

        if (activeSub) {
            await updateUserTier(user.id, "PRO", "ACTIVE", activeSub.id);
            return { success: true, status: "ACTIVE" };
        } else if (latestSub) {
            const status = latestSub.status === 'canceled' ? 'CANCELED' : 'EXPIRED';
            await updateUserTier(user.id, "FREE", status, latestSub.id);
            return { success: true, status };
        }

        await updateUserTier(user.id, "FREE", "EXPIRED", null);
        return { success: true, status: "NO_SUBSCRIPTION" };
    } catch (error) {
        console.error("Failed to sync subscription:", error);   
        return { success: false, error: "Failed to sync with Polar" };
    }
}
