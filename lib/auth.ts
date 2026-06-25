import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { polarClient } from "@/modules/subscription/config/polar";
import { updatePolarCustomerId, updateUserTier } from "@/modules/subscription/lib/subscription";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["repo"]
    },
  },
  trustedOrigins: ["http://localhost:3000", process.env.NEXT_PUBLIC_APP_BASE_URL!],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5d273672-ae52-406f-8293-0f6a849c3793", // ID of Product from Polar Dashboard
              slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000/dashboard/subscription?success=true",
          authenticatedUsersOnly: true
        }),
        portal({
          returnUrl: process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000/dashboard"
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,

          onSubscriptionActive: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId
              }
            })

            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id)
            }
          },


          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId
              }
            })

            if (user) {
              const tier = user.subscriptionTier === "PRO" ? "PRO" : "FREE";
              await updateUserTier(user.id, tier, "CANCELED", payload.data.id)
            }
          },


          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId
              }
            })

            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED", payload.data.id)
            }
          },



          onOrderPaid: async () => { },
          onCustomerCreated: async (payload) => {

            const user = await prisma.user.findUnique({
              where: {
                email: payload.data.email!
              }
            })

            if (user) {
              await updatePolarCustomerId(user.id, payload.data.id)
            }
          }
        })

      ],
    })

  ]

});
