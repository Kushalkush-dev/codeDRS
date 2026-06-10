import React from 'react'
import LoginUI from '@/modules/auth/components/Login'
import { requireUnAuth } from '@/modules/auth/utils/auth-utils'

const LoginPage = async () => {

    await requireUnAuth()
    return (
        <div>
            <LoginUI />
        </div>
    )
}

export default LoginPage