import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){

    try {
        const body=req.json()
        const event=req.headers.get("x-github-event")

        console.log("Received Github event",event);

        if (event=="ping") {

         return   NextResponse.json({message:"PONG"},{status:200})
         
        }
        
        return   NextResponse.json({message:"Event Successfull"},{status:200})
    } catch (error) {
        console.error("Error processing webhook",error);
        NextResponse.json({error:"Internal Server Error"},{status:500})
        
    }

}
