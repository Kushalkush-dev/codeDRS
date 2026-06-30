"use client"
import ProfileForm from '@/modules/settings/components/profile-form'
import RepositoryList from '@/modules/settings/components/repository-list'
import ReviewPreferences from '@/modules/settings/components/review-preferences'
import React from 'react'

const settingPage = () => {
    return (

        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
                <p className='text-muted-foreground'>Manage your Settings and connected accounts</p>
            </div>

            <ProfileForm/>
            <ReviewPreferences/>
            <RepositoryList/>
        </div>
    )
}

export default settingPage
