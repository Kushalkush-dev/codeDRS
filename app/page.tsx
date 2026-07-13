"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, ChevronDown, Clock3, Code2, Database, FileSearch, GitPullRequest, MessageSquare, Server, Webhook } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { signIn, useSession } from "@/lib/auth-client";
import Image from "next/image";

const pricingRows = [
  ["Repositories", "5", "Unlimited"],
  ["AI reviews", "5 per repository", "Unlimited"],
  ["RAG codebase context", "Basic", "Full repository context"],
  ["Review focus", "Correctness", "Security, performance, correctness"],
  ["Priority processing", "—", "Included"],
  ["Dashboard review history", "Included", "Included"],
];
const heatmap = Array.from({ length: 364 }, (_, index) => {
  const week = Math.floor(index / 7);
  const day = index % 7;
  const active = (week * 13 + day * 7) % 19;
  return active < 2 ? 4 : active < 5 ? 3 : active < 9 ? 2 : active < 13 ? 1 : 0;
});

const capabilities = [
  ["[01]", "Repository memory", "Indexes codebase context so review suggestions understand architecture, helpers, and surrounding patterns."],
  ["[02]", "Security review focus", "Flag risky access control, exposed secrets, unsafe inputs, and security-sensitive changes before merge."],
  ["[03]", "Performance signals", "Surface expensive queries, unnecessary work, and scale concerns hidden inside pull request changes."],
  ["[04]", "Custom review focus", "Prioritize performance, security, correctness, or maintainability to match each repository's needs."],
  ["[05]", "Async reliability", "Inngest queues indexing and reviews so repository work stays dependable and does not block your team."],
  ["[06]", "GitHub-native automation", "React to opened and synchronized pull requests, then post structured AI feedback directly to GitHub."],
];
const faqs = [
  ["What does CodeDRS review?", "CodeDRS reviews new and updated GitHub pull requests. It reads the diff and retrieves relevant repository context before writing its feedback."],
  ["Will it comment on every line of my PR?", "No. Reviews are designed for signal over noise, focused on bugs, risky changes, missing edge cases, and meaningful implementation details."],
  ["Is my source code stored?", "Repository content is indexed only to provide relevant review context. Your repository access stays scoped to the GitHub connection you authorize."],
  ["Can I change or cancel my plan?", "Yes. You can upgrade, downgrade, or cancel your subscription from the dashboard whenever you need to."],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);

  const handleGithubSignup = async () => {
    setIsSigningIn(true);
    try {
      await signIn.social({ provider: "github" });
    } catch {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    document.querySelectorAll(".terminal-scroll").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <main className="terminal-site min-h-screen bg-[#f4f0e8] text-[#1b1a17]">
    <nav className={`sticky z-50 mx-auto max-sm:fixed flex max-w-[1400px] items-center w-full justify-between  border-[#24221d]/25 bg-[#f4f0e8]/95 px-6 py-3 font-mono text-xs font-bold uppercase tracking-tight backdrop-blur-md transition-[border-radius,box-shadow,top] duration-300 lg:px-10 ${navScrolled ? "top-2 rounded-2xl shadow-[0_12px_30px_rgba(27,26,23,0.12)]" : "top-0 rounded-none"}`}><Link href="/" className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center border border-[#1b1a17] bg-[#ebe6da]"><Image src="./icon0.svg" alt="logo" width={5} height={10} className="h-3.5 w-3.5" /></span> CodeDRS</Link><div className="hidden items-center gap-8 md:flex"><a href="#product">[01] PRODUCT</a><a href="#workflow">[02] WORKFLOW</a><a href="#pricing">[03] PRICING</a><a href="#faq">[04] FAQ</a></div>{isSignedIn ? <Link href="/dashboard" className="border border-[#1b1a17] bg-[#1b1a17] px-3 py-2 text-[11px] text-[#f4f0e8]">DASHBOARD <ArrowRight className="ml-1 inline h-3 w-3" /></Link> : <button type="button" onClick={handleGithubSignup} disabled={isSigningIn} className="border border-[#1b1a17] bg-[#1b1a17] px-3 py-2 text-[11px] text-[#f4f0e8] disabled:opacity-60">{isSigningIn ? "CONNECTING..." : "SIGN UP"} <FaGithub className="ml-1 inline h-3 w-3" /></button>}</nav>

    <section className="mx-auto grid max-w-[1400px] gap-6 px-6 py-8 lg:grid-cols-[1.12fr_.88fr] lg:px-10">
      <div className="terminal-panel terminal-reveal p-7 sm:p-10"><div className="mb-10 flex gap-2"><i /><i /><i /></div><h1 className="terminal-title mt-7 text-5xl leading-[.95] sm:text-7xl">See the whole story behind every line of code<br /></h1><p className="mt-9 max-w-md font-mono text-sm leading-6 text-[#5f5a51]">Context-aware AI code reviews for GitHub. Understand every change, catch the important issues, and give your team time back.</p><div className="mt-10 flex flex-wrap gap-3">{isSignedIn ? <Link href="/dashboard" className="terminal-button terminal-button-dark">OPEN DASHBOARD <ArrowRight className="h-4 w-4" /></Link> : <button type="button" onClick={handleGithubSignup} disabled={isSigningIn} className="terminal-button terminal-button-dark disabled:opacity-60">{isSigningIn ? "CONNECTING..." : "CONNECT GITHUB"} <FaGithub className="h-4 w-4" /></button>}<a href="#product" className="terminal-button">EXPLORE PRODUCT <ArrowRight className="h-4 w-4" /></a></div></div>
      <div className="space-y-6"><div className="terminal-panel terminal-reveal heatmap-panel p-6" style={{ animationDelay: "80ms" }}><div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs font-bold"><span>&gt; GITHUB CONTRIBUTIONS</span><span>143 CONTRIBUTIONS THIS YEAR</span></div><div className="overflow-x-auto pb-2"><div className="min-w-[650px]"><div className="mb-2 ml-9 grid grid-cols-12 font-mono text-[10px] text-[#777268]"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span></div><div className="flex gap-2"><div className="grid h-[91px] grid-rows-7 gap-[3px] pt-[1px] font-mono text-[9px] leading-[10px] text-[#777268]"><span>MON</span><span></span><span>WED</span><span></span><span>FRI</span><span></span><span></span></div><div className="grid grid-flow-col grid-rows-7 gap-[3px]">{heatmap.map((level, index) => <span key={index} aria-label={`${level} contributions`} className={`block h-[10px] w-[10px] rounded-[2px] border border-[#1b1a17]/10 heat-${level}`} />)}</div></div></div></div><div className="mt-4 flex items-center justify-end gap-1 font-mono text-[10px] text-[#777268]">LESS <i className="block h-[10px] w-[10px] rounded-[2px] heat-0" /><i className="block h-[10px] w-[10px] rounded-[2px] heat-1" /><i className="block h-[10px] w-[10px] rounded-[2px] heat-2" /><i className="block h-[10px] w-[10px] rounded-[2px] heat-3" /><i className="block h-[10px] w-[10px] rounded-[2px] heat-4" /> MORE</div></div>
        <div className="terminal-panel terminal-reveal workflow-preview p-6" style={{ animationDelay: "160ms" }}><div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs font-bold"><span>&gt; REVIEW WORKFLOW</span><span className="workflow-running">PROCESSING</span></div><div className="workflow-snake" aria-label="CodeDRS review processing flow"><div className="workflow-node snake-one"><span className="workflow-icon"><FaGithub className="h-4 w-4" /></span><b>GITHUB PR</b><p>Event received</p></div><span className="flow-link snake-link-a"><i /><i className="flow-signal-delay" /></span><div className="workflow-node snake-two"><span className="workflow-icon"><Webhook className="h-4 w-4" /></span><b>WEBHOOK</b><p>Payload arrives</p></div><span className="flow-link snake-link-b"><i /><i className="flow-signal-delay" /></span><div className="workflow-node snake-three"><span className="workflow-icon"><Server className="h-4 w-4" /></span><b>API ROUTE</b><p>Validates event</p></div><span className="flow-link snake-turn"><i /><i className="flow-signal-delay" /></span><div className="workflow-node snake-four"><span className="workflow-icon"><Clock3 className="h-4 w-4" /></span><b>INNGEST</b><p>Job queued</p></div><span className="flow-link snake-link-c"><i /><i className="flow-signal-delay" /></span><div className="workflow-node snake-five"><span className="workflow-icon"><Database className="h-4 w-4" /></span><b>RAG CONTEXT</b><p>Pinecone search</p></div><span className="flow-link snake-link-d"><i /><i className="flow-signal-delay" /></span><div className="workflow-node snake-six"><span className="workflow-icon"><BrainCircuit className="h-4 w-4" /></span><b>AI REVIEW</b><p>Comment posted</p></div></div><div className="mt-5 border-t border-dashed border-[#24221d]/30 pt-3 font-mono text-[10px] text-[#777268]">WEBHOOK → DIFF + CONTEXT → REVIEW HISTORY</div></div></div>
    </section>

    <section id="product" className="terminal-scroll mx-auto max-w-[1400px] px-6 pb-20 lg:px-10"><p className="section-label">&gt; PRODUCT CAPABILITIES</p><div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{capabilities.map(([number, title, copy]) => <article className="terminal-card" key={title}><p className="font-mono text-xs text-[#777268]">{number}</p><h2 className="mt-4 font-mono text-lg font-bold">{title}</h2><p className="mt-3 font-mono text-xs leading-5 text-[#5f5a51]">{copy}</p><span className="mt-7 inline-flex border border-[#1b1a17] p-2"><ArrowRight className="h-4 w-4" /></span></article>)}</div></section>

    <section id="workflow" className="border-y border-[#24221d]/20 bg-[#ebe6da]"><div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10"><div className="max-w-2xl"><p className="section-label">&gt; HOW CODEDRS REVIEWS A PULL REQUEST</p><h2 className="terminal-title mt-4 text-4xl sm:text-5xl">From change to<br />clear feedback.</h2><p className="mt-5 font-mono text-sm leading-6 text-[#5f5a51]">A context-aware review that follows the work from a GitHub pull request through retrieval to a useful comment.</p></div><div className="story-rail mt-12 space-y-6"><article className="story-stage terminal-scroll"><div className="story-index">01 / PULL REQUEST</div><div className="story-body"><div><p className="story-kicker"><GitPullRequest className="h-4 w-4" /> CHANGE DETECTED</p><h3 className="terminal-title mt-4 text-3xl">A pull request<br />introduces a risk.</h3><p className="mt-4 font-mono text-xs leading-5 text-[#5f5a51]">A GitHub opened or synchronized event reaches the CodeDRS webhook and API route, then starts a reliable Inngest review job.</p></div><div className="story-screen"><div className="story-screen-bar"><span>apps/billing/create-invoice.ts</span><span>PR #482</span></div><pre className="story-code">{`  const customer = await db.customer
    .findUnique({ where: { id } });

- if (!customer) return null;
+ if (!customer) throw new NotFoundError();

  return invoice.create({ amount });`}</pre><p className="story-alert">! CHANGE NEEDS CONTEXT BEFORE REVIEW</p></div></div></article>

      <article className="story-stage terminal-scroll"><div className="story-index">02 / RAG RETRIEVAL</div><div className="story-body"><div><p className="story-kicker"><FileSearch className="h-4 w-4" /> REPOSITORY MEMORY</p><h3 className="terminal-title mt-4 text-3xl">The relevant code<br />comes into view.</h3><p className="mt-4 font-mono text-xs leading-5 text-[#5f5a51]">CodeDRS retrieves related patterns from Pinecone using the pull request intent, so the model sees more than a diff.</p></div><div className="story-screen story-context"><div className="context-file"><span>src/services/checkout.ts</span><b>match</b></div><div className="context-file"><span>src/errors/not-found.ts</span><b>match</b></div><div className="context-file"><span>src/lib/stripe.ts</span><b>match</b></div><div className="context-core"><Database className="h-5 w-5" /><span>PINECONE</span><small>4 RELATED FILES RETRIEVED</small></div></div></div></article>

      <article className="story-stage terminal-scroll"><div className="story-index">03 / AI REVIEW</div><div className="story-body"><div><p className="story-kicker"><MessageSquare className="h-4 w-4" /> STRUCTURED FEEDBACK</p><h3 className="terminal-title mt-4 text-3xl">A clear review lands<br />in GitHub.</h3><p className="mt-4 font-mono text-xs leading-5 text-[#5f5a51]">The AI reviewer combines the diff with repository context, writes a focused note, and saves the review history for the dashboard.</p></div><div className="story-screen story-comment"><div className="comment-head"><span className="comment-avatar"><BrainCircuit className="h-4 w-4" /></span><span><b>CodeDRS</b> reviewed 1 minute ago</span><em>HIGH CONFIDENCE</em></div><p className="comment-text">This error path now matches the checkout service convention. Preserve the customer ID in error metadata so failed invoice attempts remain traceable.</p><div className="comment-footer"><span>SECURITY + RELIABILITY</span><span>4 FILES USED AS CONTEXT</span></div></div></div></article></div></div></section>

    <section id="pricing" className="terminal-scroll mx-auto max-w-[1400px] px-6 py-20 lg:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-label">&gt; PRICING</p><h2 className="terminal-title mt-4 text-4xl sm:text-5xl">Pick your review<br />runtime.</h2></div><p className="max-w-xs font-mono text-xs leading-5 text-[#5f5a51]">Start with your first repositories, then unlock unlimited context-aware review when your team is ready.</p></div><div className="pricing-console mt-10"><div className="pricing-console-head"><div className="pricing-blank"><span>&gt; PLAN COMPARISON</span></div><div className="pricing-plan-head"><span className="pricing-plan-label">[ FREE ]</span><strong>$0</strong><small>FOR PERSONAL REPOSITORIES</small>{isSignedIn ? <Link href="/dashboard" className="pricing-cta">OPEN DASHBOARD <ArrowRight className="h-3.5 w-3.5" /></Link> : <button type="button" onClick={handleGithubSignup} disabled={isSigningIn} className="pricing-cta disabled:opacity-60">{isSigningIn ? "CONNECTING..." : "START FREE"} <FaGithub className="h-3.5 w-3.5" /></button>}</div><div className="pricing-plan-head pricing-plan-pro"><span className="pricing-plan-label">[ PRO ] <em>RECOMMENDED</em></span><strong>$19<small>/MO</small></strong><small>PER DEVELOPER / MONTH</small>{isSignedIn ? <Link href="/dashboard/subscription" className="pricing-cta pricing-cta-pro">MANAGE PLAN <ArrowRight className="h-3.5 w-3.5" /></Link> : <button type="button" onClick={handleGithubSignup} disabled={isSigningIn} className="pricing-cta pricing-cta-pro disabled:opacity-60">{isSigningIn ? "CONNECTING..." : "CHOOSE PRO"} <FaGithub className="h-3.5 w-3.5" /></button>}</div></div><div className="pricing-rows">{pricingRows.map(([feature, free, pro]) => <div className="pricing-row" key={feature}><span className="pricing-feature">{feature}</span><span className="pricing-value">{free}</span><span className="pricing-value pricing-value-pro">{pro}</span></div>)}</div><div className="pricing-console-foot"><span>ALL PLANS INCLUDE GITHUB OAUTH + PR WEBHOOK SETUP</span><span>UPGRADE OR CANCEL ANYTIME</span></div></div></section>

    <section id="faq" className="terminal-scroll border-t border-[#24221d]/20 bg-[#ebe6da]"><div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-10"><div><p className="section-label">&gt; FAQ</p><h2 className="terminal-title mt-4 text-4xl">Questions,<br />answered.</h2><p className="mt-5 font-mono text-xs leading-5 text-[#5f5a51]">Still need help? Reach us from your dashboard.</p></div><div className="border-t border-[#24221d]/40">{faqs.map(([question, answer], index) => <button key={question} className="block w-full border-b border-[#24221d]/30 py-5 text-left font-mono" onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="flex items-center justify-between gap-5 text-sm font-bold">{question}<ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></span>{openFaq === index && <span className="mt-4 block max-w-2xl text-xs leading-5 text-[#5f5a51]">{answer}</span>}</button>)}</div></div></section>
    <footer className="terminal-footer"><div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10"><div className="footer-grid"><div className="footer-brand"><Link href="/" className="flex items-center gap-3 font-mono text-sm font-bold"><span className="grid h-8 w-8 place-items-center border border-[#1b1a17]"><Image src="./icon0.svg" alt="logo" width={5} height={5} className="h-4 w-4" /></span> CodeDRS</Link><p>Context-aware AI reviews for GitHub pull requests. Built to help teams ship with confidence.</p></div><div><p className="footer-label">PRODUCT</p><a href="#product">Capabilities</a><a href="#workflow">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div><div><p className="footer-label">RESOURCES</p><a href="https://github.com/Kushalkush-dev/codeDRS" target="_blank" rel="noreferrer">GitHub repository ↗</a>{isSignedIn ? <Link href="/dashboard">Dashboard</Link> : <button type="button" onClick={handleGithubSignup} disabled={isSigningIn}>Sign up with GitHub</button>}{!isSignedIn && <button type="button" onClick={handleGithubSignup} disabled={isSigningIn}>Connect GitHub</button>}</div></div><div className="footer-status"><span>© 2026 CODEDRS</span><span>Developed by Kushalkush-dev</span><span>BUILT FOR PULL REQUESTS</span></div></div></footer>
  </main>;
}


















