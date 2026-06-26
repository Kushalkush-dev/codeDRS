"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { BrainCircuit, CheckCircle2, GitBranch, GitPullRequestArrow, ShieldCheck } from "lucide-react"

const BrandMark = ({ className = "" }: { className?: string }) => (
  <Link href="/" className={`inline-flex w-fit items-center gap-3 ${className}`}>
    <Image
      src="/icon0.svg"
      alt="codeDRS logo"
      width={44}
      height={44}
      className="size-11 rounded-lg shadow-[0_10px_30px_rgb(176_44_48_/_0.28)]"
      priority
    />
    <span className="text-2xl font-black tracking-normal">
      <span className="text-white">code</span>
      <span className="bg-gradient-to-r from-[#D84A4E] to-[#7042C7] bg-clip-text text-transparent">
        DRS
      </span>
    </span>
  </Link>
)

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
    <main className="dark min-h-screen overflow-hidden bg-[#09080d] font-sans text-foreground">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(176_44_48_/_0.22),transparent_28%,rgb(65_28_131_/_0.20)_72%,transparent),linear-gradient(0deg,rgb(255_255_255_/_0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.035)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />

        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px]">
          <section className="hidden min-h-screen px-12 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16">
            <BrandMark />

            <div className="max-w-[720px]">
              <h1 className="max-w-[680px] text-5xl font-black leading-[1.05] tracking-normal text-white xl:text-6xl">
                See the whole story behind every line of code.
              </h1>
              
            </div>

            <div className="login-feature-stack max-w-[720px]">
            
              <div className="login-feature-card flex items-start gap-3">
                <BrainCircuit className="mt-0.5 size-5 text-[#8f6bed]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white">Repository intelligence</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Relevant files and project structure are pulled into every review.
                  </p>
                </div>
              </div>
              <div className="login-feature-card flex items-start gap-3">
                <GitPullRequestArrow className="mt-0.5 size-5 text-[#D84A4E]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white">Webhook driven reviews</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Pull requests are reviewed as soon as they open or update.
                  </p>
                </div>
              </div>
              <div className="login-feature-card flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-[#8f6bed]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white">Safer review comments</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Suggestions stay focused, traceable, and ready for your team.
                  </p>
                </div>
              </div>
            
            </div>
          </section>

          <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:border-l lg:border-white/10 lg:bg-black/18">
            <div className="w-full max-w-[410px]">
              <BrandMark className="mb-10 lg:hidden" />

              <div className="rounded-lg border border-white/10 bg-[#11101a]/88 p-6 shadow-2xl shadow-black/35 backdrop-blur sm:p-8">
                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-normal text-[#D84A4E]">
                    Secure sign in
                  </p>
                  <h2 className="mt-3 text-4xl font-black tracking-normal text-white">
                    Welcome back
                  </h2>
                  <p className="mt-4 text-base font-semibold leading-7 text-white/58">
                    Continue with GitHub to open your code review workspace.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleGithubSignin}
                  disabled={isLoading}
                  className="h-14 w-full cursor-pointer rounded-lg border border-white/10 bg-gradient-to-r from-[#D84A4E] to-[#7042C7] text-base font-black text-white shadow-lg shadow-[#411C83]/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaGithub className="mr-3 size-5" aria-hidden="true" />
                  {isLoading ? "Connecting..." : "Continue with GitHub"}
                </Button>

                <div className="mt-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
                  <ShieldCheck className="size-5 shrink-0 text-[#D84A4E]" aria-hidden="true" />
                  <p className="text-sm font-semibold leading-6 text-white/58">
                    GitHub access powers repository sync, webhooks, and review comments.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-5 text-xs font-semibold text-white/42">
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                  <span className="size-1 rounded-full bg-white/18" />
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default LoginUI
