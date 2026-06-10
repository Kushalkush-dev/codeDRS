import {PrismaClient} from "./generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg"

const adapter= new PrismaPg({
    connectionString:process.env.DATABASE_URL
})

const PrismaSingleton=()=>{
    return new PrismaClient({adapter})
}

declare const globalThis:{
    prismaGlobal:ReturnType<typeof PrismaSingleton>
} & typeof global;


const prisma=globalThis.prismaGlobal || PrismaSingleton()

if(process.env.NODE_ENV!=="production") globalThis.prismaGlobal=prisma

export default prisma