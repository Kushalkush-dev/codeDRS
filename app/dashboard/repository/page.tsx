"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useRepositories from '@/modules/repository/hooks/use-repositories'
import { ExternalLink, Search } from 'lucide-react'
import React, { useState } from 'react'


const RepositoryPage = () => {

    interface Repository {
        id: number
        name: string
        full_name: string
        description: string | null
        html_url: string
        stargazers_count: number
        language: string | null
        topics: string[]
        isConnected?: boolean
    }


    const [searchQuery, setsearchQuery] = useState('')
    
    const [localConnectingId, setlocalConnectingId] = useState<number | null>(null)

    const handleConnectRepo=()=>{
        
    }
1

    const {
        data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage
    } = useRepositories()


    const allRepositories = data?.pages.flatMap((page) => page) || []

    const filteredRepos = allRepositories.filter((repo: Repository) =>
        repo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )


    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3x1 font-bold tracking-tight">Repositories</h1>
                <p className="text-muted-foreground">Manage and view all your GitHub repositories</p>
            </div>




            <div className='relative'>
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder='Search Repositories'
                    className='pl-8'
                    value={searchQuery}
                    onChange={(e) => setsearchQuery(e?.target?.value)} />

            </div>


            <div className='grid gap-4'>
                {filteredRepos.map((repo: Repository) => (

                    <Card key={repo.id} className="hover :shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-1g">{repo.name}</CardTitle>
                                        <Badge variant="outline">{repo.language || "Unknown"}</Badge>
                                        {repo.isConnected && <Badge variant="secondary">Connected</Badge>}
                                    </div>
                                    <CardDescription>{repo.description}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>

                                    <Button
                                    disabled={localConnectingId ==repo.id || repo.isConnected}
                                    onClick={()=>handleConnectRepo()}
                                    variant={repo.isConnected ? "outline" :"default"}>
                                        {localConnectingId === repo.id ? "Connecting ..." : repo.isConnected ? "Connected" : "Connect"}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                ))}
            </div>


        </div>
    )
}
export default RepositoryPage