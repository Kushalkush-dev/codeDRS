"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getUserProfile, updateUSerProfile } from "../actions"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



const ProfileForm = () => {

    const queryClient = useQueryClient()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")

    const { data: profile, isLoading } = useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => await getUserProfile(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (profile) {
            setname(profile.name || "")
            setemail(profile.email || "")
        }
    }, [profile])

    const updateMutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            return await updateUSerProfile(data)
        },

        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["user-profile"] })
                toast.success("Profile Updated Successfully")
            }
        },
        onError: (error) => {
            toast.error("Failed to Update User Profile")

        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateMutation.mutate({ name, email })
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Upate your profile Information</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-muted rounded"></div>
                        <div className="h-10 bg-muted rounded"></div>
                    </div>
                </CardContent>

            </Card>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Upate your profile Information</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            disabled={updateMutation.isPending} />

                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            disabled={updateMutation.isPending} />

                    </div>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving ... " : "Save Changes"}
                    </Button>



                </form>
            </CardContent>

        </Card>
    )
}

export default ProfileForm