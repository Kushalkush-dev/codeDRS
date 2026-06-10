"use client"

import { useState } from 'react'

import { signIn } from '@/lib/auth-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaGithub } from "react-icons/fa";



const LoginUI = () => {

    const [isLoading, setIsLoading] = useState(false)

    const handleGithubSignin = async () => {
        setIsLoading(true)
        try {
            await signIn.social({

                provider: "github"
            })
        } catch (error) {
            console.log("Login Error", error)
            setIsLoading(false)
        }
    }

    return (
        <main className="dark min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.06fr_0.94fr]">
        <section className="relative flex min-h-[50vh] flex-col justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:px-14 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_88%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_30%),linear-gradient(115deg,color-mix(in_oklch,var(--foreground)_3%,transparent),transparent_36%)]" />

          <div className="relative max-w-[680px]">
            <Link href="/" className="mb-16 inline-flex items-center gap-3 lg:mb-20">
              <span className="grid size-9 place-items-center rounded-full border border-border bg-primary text-[10px] font-black text-primary-foreground shadow-[0_0_30px_color-mix(in_oklch,var(--primary)_20%,transparent)]">
                CH
              </span>
              <span className="text-2xl font-black tracking-normal">
                CodeHorse
              </span>
            </Link>

            <h1 className="max-w-[640px] text-4xl font-black leading-[1.18] tracking-normal text-foreground sm:text-5xl lg:text-[56px] xl:text-[62px]">
              Cut Code Review Time &amp; Bugs in Half. Instantly.
            </h1>

            <p className="mt-8 max-w-[660px] text-lg font-semibold leading-8 text-muted-foreground sm:text-xl">
              Supercharge your team to ship faster with the most advanced AI
              code reviews.
            </p>
          </div>
        </section>

        <section className="relative flex min-h-[50vh] items-center justify-center px-6 py-12 sm:px-10 lg:min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,transparent_0%,transparent_45%,color-mix(in_oklch,var(--foreground)_6%,transparent)_100%)]" />

          <div className="relative w-full max-w-[480px]">
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-normal text-foreground">
                Welcome Back
              </h2>
              <p className="mt-3 text-base font-semibold text-muted-foreground">
                Login using the following providers:
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGithubSignin}
              disabled={isLoading}
              className="h-14 w-full rounded-lg cursor-pointer border border-border bg-card text-base font-semibold text-card-foreground shadow-[0_22px_70px_color-mix(in_oklch,var(--foreground)_5%,transparent)] hover:bg-secondary"
            >
              <FaGithub className="mr-3 size-5" aria-hidden="true" />
              {isLoading ? "Signing in..." : "GitHub"}
            </Button>
            

            <div className="mt-10 space-y-5 text-center text-sm font-semibold">
              <p className="text-muted-foreground">
                New to CodeRabbit?{" "}
                <Link href="/sign-up" className="text-primary hover:text-foreground">
                  Sign Up
                </Link>
              </p>
              <Link href="#" className="block text-primary hover:text-foreground">
                Self-Hosted Services
              </Link>
            </div>

            <div className="my-14 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex items-center justify-center gap-6 text-xs font-semibold text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Terms of Use
              </Link>
              <span>and</span>
              <Link href="#" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
    )
}

export default LoginUI
