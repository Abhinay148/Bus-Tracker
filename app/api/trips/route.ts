import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(){
 const trip=await db.trip.findFirst({include:{route:{include:{stops:true}},students:{include:{student:{include:{user:true}}}}},orderBy:{createdAt:"desc"}});
 if(!trip)return NextResponse.json({error:"No trip found"},{status:404});
 return NextResponse.json(trip);
}
