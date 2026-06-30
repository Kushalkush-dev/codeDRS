export const REVIEW_PRESET_IDS = ["balanced", "security", "performance", "concise"] as const;

export type ReviewPresetId = (typeof REVIEW_PRESET_IDS)[number];

type BuildPromptInput = {
    title: string;
    description?: string | null;
    context: string[];
    diff: string;
};

type ReviewPreset = {
    id: ReviewPresetId;
    label: string;
    description: string;
    instructions: string;
};

export const REVIEW_PRESETS: ReviewPreset[] = [
    {
        id: "balanced",
        label: "Balanced",
        description: "A thorough review with walkthrough, summary, strengths, issues, and suggestions.",
        instructions: `Please provide:
1. **Walkthrough**: A file-by-file explanation of the changes.
2. **Sequence Diagram**: A Mermaid JS sequence diagram visualizing the flow of the changes (if applicable). Use \`\`\`mermaid ... \`\`\` block. **IMPORTANT**: Ensure the Mermaid syntax is valid. Do not use special characters (like quotes, braces, parentheses) inside Note text or labels as it breaks rendering. Keep the diagram simple.
3. **Summary**: Brief overview.
4. **Strengths**: What's done well.
5. **Issues**: Bugs, security concerns, code smells.
6. **Suggestions**: Specific code improvements.`
    },
    {
        id: "security",
        label: "Security",
        description: "Prioritizes vulnerabilities, auth, data access, secrets, validation, and dependency risk.",
        instructions: `Focus the review on security and risk.

Please provide:
1. **Security Summary**: The main risk profile of the pull request.
2. **Critical Findings**: Vulnerabilities, auth or authorization gaps, data-access issues, secret handling problems, unsafe input handling, dependency risks, or exploit paths.
3. **Severity and Impact**: Label meaningful issues as critical, high, medium, or low with practical impact.
4. **Required Fixes**: Specific changes needed before merge.
5. **Hardening Suggestions**: Defensive improvements that are useful but not blockers.

Avoid long walkthroughs unless they clarify a security issue.`
    },
    {
        id: "performance",
        label: "Performance",
        description: "Looks for query cost, render cost, memory, network, scalability, and simpler alternatives.",
        instructions: `Focus the review on performance and scalability.

Please provide:
1. **Performance Summary**: The likely runtime, database, rendering, memory, and network impact.
2. **Hot Spots**: Unnecessary work, expensive queries, repeated calls, inefficient rendering, memory pressure, slow loops, or scalability limits.
3. **Impact**: Explain when each issue matters and how severe it is.
4. **Optimizations**: Specific, practical improvements with tradeoffs.
5. **Regression Risks**: Areas that should be load-tested, benchmarked, or monitored.

Avoid broad style feedback unless it affects performance.`
    },
    {
        id: "concise",
        label: "Concise",
        description: "A short review for quick PRs with summary, top issues, and actionable suggestions.",
        instructions: `Keep the review concise and action-oriented.

Please provide:
1. **Summary**: Two or three sentences at most.
2. **Top Issues**: Only the most important bugs, risks, or blockers.
3. **Suggestions**: Short, specific improvements.

Avoid long walkthroughs and diagrams unless they are essential to understand a high-impact issue.`
    }
];

export function isReviewPresetId(value: unknown): value is ReviewPresetId {
    return typeof value === "string" && REVIEW_PRESET_IDS.includes(value as ReviewPresetId);
}

export function resolveReviewPresetId(value: unknown): ReviewPresetId {
    return isReviewPresetId(value) ? value : "balanced";
}

export function getReviewPreset(value: unknown): ReviewPreset {
    const presetId = resolveReviewPresetId(value);
    return REVIEW_PRESETS.find((preset) => preset.id === presetId) ?? REVIEW_PRESETS[0];
}

export function buildReviewPrompt(presetId: unknown, input: BuildPromptInput) {
    const preset = getReviewPreset(presetId);

    return `You are an expert code reviewer. Analyze the following pull request and provide a constructive code review.

PR Title: ${input.title}
PR Description: ${input.description || "No description provided"}

Context from Codebase:
${input.context.join("\n\n")}

Code Changes:
\`\`\`diff
${input.diff}
\`\`\`

${preset.instructions}

Format your response in markdown.`;
}
