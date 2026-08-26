import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";

const schema=z.object({
 tripId:z.string(),studentId:z.string(),stopId:z.string(),
 status:z.enum(["LEAVING","ARRIVED","DELAYED"])
});

export async function POST(req:Request){
 const b=schema.parse(await req.json());
 const latest=await db.notification.findFirst({where:{tripId:b.tripId,studentId:b.studentId,stopId:b.stopId},orderBy:{number:"desc"}});
 if(!latest)return NextResponse.json({error:"No active notification"},{status:409});
 if(latest.expiresAt && latest.expiresAt < new Date())return NextResponse.json({error:"Notification expired"},{status:409});
 await db.$transaction([
  db.tripStudent.update({where:{tripId_studentId:{tripId:b.tripId,studentId:b.studentId}},data:{status:b.status}}),
  db.notification.update({where:{id:latest.id},data:{status:"RESPONDED",respondedAt:new Date()}}),
  db.responseLog.create({data:{...b,notificationNumber:latest.number}})
 ]);
 return NextResponse.json({ok:true,status:b.status});
}
