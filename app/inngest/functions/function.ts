import prisma from "@/lib/db";
import { inngest } from "../client";
import { getRepoFileContents } from "@/modules/github/lib/github";

export const indexRepo = inngest.createFunction(
  { id: "index-repo", triggers: { event: "repository.connected" } },
  async ({ event, step }) => {



    const { owner, repo, userId } = event.data

    // step1 get the file from the repo

    const files = await step.run("fetch-files", async () => {

      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github"
        }
      })

      if (!account?.accessToken) {
        throw new Error("No Github Access Token Found")
      }

      return await getRepoFileContents(account.accessToken, owner, repo)

    })



    //step2: Index the codebase/repo

    const index = await step.run("index-codebase", async () => {
      // await indexCodebase
    })
  }


) 