// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/app/inngest/client";
import { indexRepo } from "@/app/inngest/functions/function";
import { generateReview } from "@/app/inngest/functions/review";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo,generateReview],
});