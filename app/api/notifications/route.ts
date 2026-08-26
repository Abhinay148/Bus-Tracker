import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { MAX_NOTIFICATIONS, notificationExpiresAt } from "@/lib/notification";

const schema=z.object({
 tripId:z.string(),studentId:z.string(),stopId:z.string(),type:z.enum(["AUTOMATIC","MANUAL"])
});

export async function POST(req:Request){
 const body=schema.parse(await req.json());
 const count=await db.notification.count({where:{tripId:body.tripId,studentId:body.studentId,stopId:body.stopId}});
 if(count>=MAX_NOTIFICATIONS)return NextResponse.json({error:"Notification limit reached (2/2)"},{status:409});
 const n=await db.notification.create({
   data:{...body,number:count+1,expiresAt:notificationExpiresAt()}
 });
 return NextResponse.json(n,{status:201});
}
