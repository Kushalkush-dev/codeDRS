"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { connectRepository } from "../actions"
import { toast } from "sonner"




export const useConnectRepository=()=>{

    const queryClient=useQueryClient()

    return useMutation({
        mutationFn:async({owner,repo,githubId}:{owner:string,repo:string,githubId:number})=>{
            return await connectRepository(owner,repo,githubId)
        },

        onSuccess:()=>{
            toast.success("Repo Connected Successfully")
            queryClient.invalidateQueries({queryKey:["repositories"]})
        },
        onError:(error)=>{
            toast.error("Failed to connect the Repo")
            console.log(error);
        }
    })
}