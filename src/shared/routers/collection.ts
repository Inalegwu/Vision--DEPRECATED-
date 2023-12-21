import { publicProcedure, router } from "@src/trpc";
import { z } from "zod";



export const collectionRouter=router({
    getIssuesInCollection:publicProcedure.input(z.object({
        id:z.string().refine((v)=>v.trim),
    })).query(async({ctx,input})=>{

       try{
         const collection=await ctx.db.query.collections.findFirst({
            where:(collections,{eq})=>eq(collections.id,input.id),
            with:{
                issues:true,
            }
        })


        return {
            collection
        }
       }catch(e){
        console.log(e)
       }

    })
})