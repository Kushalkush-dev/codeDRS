"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { GitPullRequestArrow, ShieldCheck } from "lucide-react"

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGithubSignin = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "github",
      })
    } catch (error) {
      console.log("Login Error", error)
      setIsLoading(false)
    }
  }

  return (
    <main className="dark h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_460px]">
        <section className="relative hidden h-full border-r border-border px-12 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_34%),linear-gradient(0deg,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />

          <Link href="/" className="relative inline-flex w-fit items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
              CD
            </span>
            <span className="text-2xl font-black tracking-normal">codeDRS</span>
          </Link>

          <div className="relative max-w-[620px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2 text-sm font-semibold text-muted-foreground">
              <GitPullRequestArrow className="size-4 text-primary" aria-hidden="true" />
              GitHub pull request reviews
            </p>
            <h1 className="text-5xl font-black leading-[1.1] tracking-normal">
              Ship code with cleaner AI review context.
            </h1>
            <p className="mt-6 max-w-[560px] text-lg font-semibold leading-8 text-muted-foreground">
              Connect a repository, index the codebase, and let codeDRS review pull requests with the context your team needs.
            </p>
          </div>

          <div className="relative grid max-w-[620px] grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card/70 p-4">
              <GitPullRequestArrow className="mb-3 size-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold">Webhook driven</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Reviews run when pull requests open or update.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/70 p-4">
              <ShieldCheck className="mb-3 size-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-bold">RAG powered</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Suggestions use related codebase context.
              </p>
            </div>
          </div>
        </section>

        <section className="flex h-full items-center justify-center px-6 py-6 sm:px-10">
          <div className="w-full max-w-[390px]">
            <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
                CD
              </span>
              <span className="text-2xl font-black tracking-normal">codeDRS</span>
            </Link>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-normal text-primary">
                Secure sign in
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-normal">
                Welcome back
              </h2>
              <p className="mt-4 text-base font-semibold leading-7 text-muted-foreground">
                Continue with GitHub to manage repositories and AI reviews.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGithubSignin}
              disabled={isLoading}
              className="h-14 w-full cursor-pointer rounded-lg border border-border bg-card text-base font-bold text-card-foreground shadow-lg hover:bg-secondary"
            >
              <FaGithub className="mr-3 size-5" aria-hidden="true" />
              {isLoading ? "Connecting..." : "Continue with GitHub"}
            </Button>

            <p className="mt-5 text-center text-sm font-semibold leading-6 text-muted-foreground">
              codeDRS uses GitHub access to list repositories, create webhooks, and post review comments.
            </p>

            <div className="mt-8 flex items-center justify-center gap-5 text-xs font-semibold text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <span className="size-1 rounded-full bg-border" />
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginUI
