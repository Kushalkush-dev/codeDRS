import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"




export const  getGithubAccessToken=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })

    if(!session){
        throw new Error("Unauthorized Access")
    }

    const account= await prisma.account.findFirst({

        where:{
            userId:session.user.id,
            providerId:"github"
        }
    })


    if(!account?.accessToken){
        throw new Error("No Github Access Token Found")
    }

    return account?.accessToken
}


