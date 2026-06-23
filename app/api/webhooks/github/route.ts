import { reviewPullRequest } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const event = req.headers.get("x-github-event");

        console.log("Received Github event", event);

        if (event === "ping") {
            return NextResponse.json({ message: "PONG" }, { status: 200 });
        }

        if (event === "pull_request") {
            const action = body?.action;
            const repo = body?.repository?.full_name ?? body?.full_name;
            const prNumber = body?.pull_request?.number ?? body?.number;

            if (!repo) {
                console.error("Missing repository full_name in webhook payload", body);
                return NextResponse.json({ error: "Missing repository" }, { status: 400 });
            }

            if (!prNumber) {
                console.error("Missing PR number in webhook payload", body);
                return NextResponse.json({ error: "Missing pull request number" }, { status: 400 });
            }

            const [owner, repoName] = repo.split("/");
            if (!owner || !repoName) {
                console.error("Invalid repository full_name format", repo);
                return NextResponse.json({ error: "Invalid repository format" }, { status: 400 });
            }

            if (action === "opened" || action === "synchronize") {
                reviewPullRequest(owner, repoName, prNumber)
                    .then(() => {
                        console.log(`Review Completed for repo ${repo} #pr:${prNumber}`);
                    })
                    .catch((err) => {
                        console.error(`Failed to complete review for repo ${repo} PR:${prNumber}`, err);
                    });
            }
        }

        return NextResponse.json({ message: "Event Successful" }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
