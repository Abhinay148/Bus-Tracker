 "use client";
import { useEffect, useState } from "react";

type S={id:string,name:string,status:string,notifications:number};
const initial:S[]=[
{id:"1",name:"Aarav Sharma",status:"ARRIVED",notifications:1},
{id:"2",name:"Ananya Gupta",status:"DELAYED",notifications:1},
{id:"3",name:"Riya Verma",status:"PENDING",notifications:0}
];

const label=(s:string)=>({ARRIVED:"Arrived",DELAYED:"1 min delay",LEAVING:"Leaving",NO_SHOW:"No-show",PENDING:"Pending"}[s]||s);
const cls=(s:string)=>s==="ARRIVED"||s==="LEAVING"?"greenText":s==="DELAYED"?"yellowText":s==="NO_SHOW"?"redText":"grayText";

export default function DriverPage(){
 const [students,setStudents]=useState(initial);
 const [stop,setStop]=useState("Sector 21 Market");
 const [tick,setTick]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),3000);return()=>clearInterval(t)},[]);
 const confirmed=students.filter(s=>["ARRIVED","DELAYED","LEAVING"].includes(s.status)).length;
 function resend(id:string){
   setStudents(a=>a.map(s=>s.id===id&&s.notifications<2?{...s,notifications:s.notifications+1}:s));
 }
 function noShow(id:string){setStudents(a=>a.map(s=>s.id===id?{...s,status:"NO_SHOW"}:s))}
 return <div>
   <section className="hero"><span className="pill">DRIVER · LIVE</span><h1>Route 12</h1><p style={{opacity:.75}}>Next stop · {stop} · GPS connected · realtime #{tick}</p></section>
   <div className="grid">
    <section className="card">
      <div className="row"><div><h2 style={{margin:"0 0 4px"}}>{stop}</h2><span className="muted">ETA 3 minutes</span></div><strong>{confirmed}/{students.length} confirmed</strong></div>
      <div className="students" style={{marginTop:16}}>
       {students.map(s=><div className="student" key={s.id}>
        <div className="avatar">{s.name.split(" ").map(x=>x[0]).join("")}</div>
        <div><strong>{s.name}</strong><div className={cls(s.status)}>{label(s.status)}</div></div>
        <div className="status">Notif {s.notifications}/2</div>
        <button className="action secondary" disabled={s.notifications>=2} onClick={()=>resend(s.id)}>Resend</button>
        <button className="action secondary" onClick={()=>noShow(s.id)}>No-show</button>
       </div>)}
      </div>
    </section>
    <section className="card">
      <h3>Stops</h3>
      {["Sector 21 Market","Green Park","City Hospital","School Gate"].map((x,i)=>
       <button key={x} onClick={()=>setStop(x)} style={{display:"block",width:"100%",textAlign:"left",border:0,background:stop===x?"#eef2ff":"transparent",padding:"13px",borderRadius:10,marginBottom:5}}>
        <strong>{i+1}. {x}</strong><div className="muted">{i===0?"Current":i===1?"4 min":"8 min"}</div>
       </button>)}
    </section>
   </div>
 </div>
}
