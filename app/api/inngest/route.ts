// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/app/inngest/client";
import { indexRepo, processTask } from "@/app/inngest/functions/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo],
});