"use client"
import React from 'react'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/dist/client/components/navigation';


const Logout = ({ children, className }: {
    children: React.ReactNode,
    className?: string
}) => {

    const router = useRouter();
    return (
        <span onClick={() => signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                }
            }
        })}>
            {children}
        </span>
    )
}

export default Logout