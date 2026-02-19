import { useState, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW COMMAND CENTER v4
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════════════ */

const WN={c1:"#C41DF2",c2:"#5241BF",c3:"#5A278C",c4:"#1E0E40",c5:"#0C0826",glow:"rgba(196,29,242,0.2)"};
const WD={c1:"#D5D7F2",c2:"#9C9AD9",c3:"#555BD9",c4:"#6273D9",c5:"#2540D9",glow:"rgba(85,91,217,0.2)"};
const PK="#FF69B4";
const FN="'Josefin Sans',-apple-system,BlinkMacSystemFont,sans-serif";
const MN="'JetBrains Mono',monospace";
const E="0.25s cubic-bezier(0.4,0,0.2,1)";

const T=(n)=>({bg:n?WN.c5:"#F0F1F8",surface:n?WN.c4:"#FFFFFF",primary:n?WN.c1:WD.c3,mid:n?WN.c2:WD.c4,deep:n?WN.c3:WD.c5,glow:n?WN.glow:WD.glow,accent:PK,tx:n?"rgba(255,255,255,0.88)":"rgba(12,8,38,0.88)",tx2:n?"rgba(255,255,255,0.5)":"rgba(12,8,38,0.5)",tx3:n?"rgba(255,255,255,0.25)":"rgba(12,8,38,0.25)",bd:n?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",bd2:n?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)",gl:n?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.55)",gl2:n?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.35)",red:"#D93644",amber:"#D4A034",green:"#34B87A"});

const G=(t)=>({p:{background:t.gl,backdropFilter:"blur(24px) saturate(1.3)",WebkitBackdropFilter:"blur(24px) saturate(1.3)",border:`1px solid ${t.bd}`,borderRadius:12,boxShadow:`0 8px 32px rgba(0,0,0,0.25)`},s:{background:t.gl2,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${t.bd2}`,borderRadius:10},c:{background:t.gl2,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${t.bd2}`,borderRadius:8}});

const STEPS=["REQUEST","TRIAGE","BRIEF","ASSIGN","CREATE","REVIEW","REVISE","APPROVE","DELIVER","ARCHIVE"];
const ADOBE={Ai:"#FF9A00",Ps:"#31A8FF",Id:"#FF3366",Lr:"#31A8FF",Pr:"#9999FF"};
const M365={W:"#2B579A",X:"#217346",P:"#B7472A",O:"#D83B01",T:"#6264A7"};

const TEAM=[
  {id:"tracy",init:"TR",name:"Tracy",role:"Admin / Coordinator",color:"#555BD9"},
  {id:"shawn",init:"SH",name:"Shawn",role:"Graphic Designer",color:"#C41DF2"},
  {id:"johnathon",init:"JM",name:"Johnathon",role:"Photographer",color:"#5A278C"},
  {id:"cat",init:"CT",name:"Cat",role:"Writer",color:"#FF69B4"},
  {id:"audry",init:"AU",name:"Audry",role:"Comm. Specialist",color:"#6273D9"},
  {id:"narciso",init:"NA",name:"Narciso",role:"Director",color:"#2540D9"},
];

const COLS=[
  {id:"new",title:"New",color:PK,desc:"Auto from portal"},
  {id:"intake",title:"Intake",color:"#555BD9",desc:"Tracy verifies"},
  {id:"active",title:"Active",color:"#C41DF2",desc:"In progress"},
  {id:"review",title:"Review",color:"#5241BF",desc:"Approval"},
  {id:"distribute",title:"Distribute",color:"#5A278C",desc:"Publishing"},
  {id:"complete",title:"Complete",color:"#9C9AD9",desc:"Archived"},
];

const CARDS=[
  {id:1,cid:"WF-2026-0412",title:"New Hire — Maria Gonzalez",dept:"Human Resources",req:"Donna P.",label:"Stationery",lc:"#555BD9",assignee:"tracy",list:"active",step:4,due:"Feb 14",pri:"standard",adobe:[],m365:["W"],size:"XS"},
  {id:2,cid:"WF-2026-0398",title:"Tax Workshop Reminder",dept:"Finance",req:"Linda R.",label:"Social",lc:"#5A278C",assignee:"audry",list:"review",step:5,due:"Feb 12",pri:"rush",adobe:["Ps"],m365:["W"],size:"S"},
  {id:3,cid:"WF-2026-1847",title:"Community Health Fair",dept:"Health Services",req:"Sandra M.",label:"Event",lc:"#C41DF2",team:["shawn","cat","johnathon","audry","tracy","narciso"],list:"active",step:4,due:"Mar 14",pri:"standard",adobe:["Ai","Ps"],m365:["W","X"],size:"M"},
  {id:4,cid:"WF-QTP-2026-FALL",title:"QTP — Fall 2026 Edition",dept:"Communications",req:"Narciso",label:"Newsletter",lc:"#5241BF",team:["cat","audry","johnathon","shawn","tracy","narciso"],list:"active",step:4,due:"Sep 15",pri:"standard",adobe:["Id","Ai","Ps","Lr"],m365:["W","X"],size:"L"},
  {id:5,cid:"WF-2026-0420",title:"Wellness Open House Flyer",dept:"Wellness",req:"Dr. Adams",label:"Flyer",lc:"#6273D9",assignee:null,list:"new",step:0,due:"Mar 22",pri:"standard",adobe:[],m365:[],size:"S"},
  {id:6,cid:"WF-2026-0421",title:"Spring Pow Wow Coverage",dept:"Cultural",req:"Elder Council",label:"Event",lc:"#C41DF2",assignee:null,list:"new",step:0,due:"Apr 15",pri:"rush",adobe:[],m365:["X"],size:"L"},
  {id:7,cid:"WF-2026-0415",title:"Elder Language Circle Poster",dept:"Language Dept",req:"Mike T.",label:"Flyer",lc:"#6273D9",assignee:"shawn",list:"active",step:4,due:"Feb 20",pri:"standard",adobe:["Ai"],m365:["W"],size:"S"},
  {id:8,cid:"WF-2026-0390",title:"Youth Basketball Photos",dept:"Recreation",req:"Jake W.",label:"Photo",lc:"#5A278C",assignee:"johnathon",list:"review",step:5,due:"Feb 13",pri:"rush",adobe:["Lr"],m365:["X"],size:"S"},
  {id:9,cid:"WF-2026-0388",title:"Council Meeting Recap",dept:"Tribal Council",req:"Chief Harris",label:"Writing",lc:"#FF69B4",assignee:"cat",list:"review",step:5,due:"Feb 13",pri:"urgent",adobe:["Id"],m365:["W","P"],size:"M"},
  {id:10,cid:"WF-2026-0375",title:"Website Banner — March",dept:"Communications",req:"Narciso",label:"Web",lc:"#9C9AD9",assignee:"shawn",list:"distribute",step:8,due:"Done",pri:"standard",adobe:["Ps"],m365:["W"],size:"S"},
  {id:11,cid:"WF-2026-0370",title:"Diabetes Awareness Campaign",dept:"Health Services",req:"Sandra M.",label:"Social",lc:"#5A278C",assignee:"audry",list:"distribute",step:8,due:"Done",pri:"standard",adobe:["Ai","Ps"],m365:["W"],size:"M"},
  {id:12,cid:"WF-2026-0340",title:"Valentine's Day Social Post",dept:"Communications",req:"Internal",label:"Social",lc:"#5241BF",assignee:"audry",list:"complete",step:9,due:"Done",pri:"standard",adobe:["Ps"],m365:[],size:"XS"},
];

const EVENTS=[
  {date:"Feb 12",hr:17,title:"Tax Workshop Reminder due",color:"#5A278C",type:"due",cid:2},
  {date:"Feb 13",hr:9,title:"Team Standup",color:"#555BD9",type:"meeting",cid:null},
  {date:"Feb 13",hr:14,title:"Youth Basketball Photos due",color:"#5A278C",type:"due",cid:8},
  {date:"Feb 13",hr:16,title:"Council Recap due",color:"#FF69B4",type:"due",cid:9},
  {date:"Feb 14",hr:12,title:"Maria Gonzalez Cards due",color:"#555BD9",type:"due",cid:1},
  {date:"Feb 18",hr:17,title:"AR2026 Submissions Due",color:"#D93644",type:"deadline",cid:null},
  {date:"Feb 20",hr:15,title:"Elder Language Poster due",color:"#6273D9",type:"due",cid:7},
  {date:"Mar 14",hr:10,title:"Community Health Fair",color:"#C41DF2",type:"event",cid:3},
  {date:"Apr 1",hr:17,title:"AR2026 Upload to River Run",color:"#D93644",type:"deadline",cid:null},
  {date:"Sep 15",hr:17,title:"QTP Fall Upload Deadline",color:"#5241BF",type:"deadline",cid:4},
];

const SERVICES=[
  {name:"Digital Flyer",active:true,vol:"117/yr",auto:true},{name:"Business Cards",active:true,vol:"51/yr",auto:true},
  {name:"Social Media Post",active:true,vol:"96/yr",auto:false},{name:"Photography Request",active:true,vol:"60/yr",auto:false},
  {name:"Event Coverage",active:true,vol:"24/yr",auto:false},{name:"Writing / Article",active:true,vol:"36/yr",auto:false},
  {name:"Headshot Session",active:true,vol:"40/yr",auto:true},{name:"Website Update",active:true,vol:"18/yr",auto:false},
];

/* ─── Monogram ─── */
function Mono({init,color,sz=28,fs=9}){
  return(<div style={{width:sz,height:sz,borderRadius:sz*0.28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:fs,fontWeight:700,fontFamily:MN,letterSpacing:"0.04em",color,background:`${color}10`,border:`1px solid ${color}18`,flexShrink:0}}>{init}</div>);
}

/* ─── Track ─── */
function Track({step,t}){
  return(<div style={{display:"flex",gap:1}}>{STEPS.map((s,i)=>(<div key={i} title={s} style={{flex:1,height:2,borderRadius:1,background:i<step?`${t.primary}60`:i===step?t.primary:t.bd,transition:`background ${E}`}}/>))}</div>);
}

/* ─── Glass Morphism Toggle ─── */
function GlassToggle({on,onToggle,labelOn,labelOff,iconOn,iconOff,t,open}){
  return(
    <button onClick={onToggle} style={{width:"100%",display:"flex",alignItems:"center",gap:open?8:0,padding:open?"5px 8px":"5px 0",borderRadius:6,border:"none",cursor:"pointer",fontFamily:FN,background:"transparent",justifyContent:open?"flex-start":"center",transition:`all ${E}`}}>
      <div style={{width:open?36:28,height:open?18:16,borderRadius:10,position:"relative",cursor:"pointer",flexShrink:0,background:on?`linear-gradient(135deg, ${t.primary}50, ${t.primary}25)`:`linear-gradient(135deg, ${t.bd}, ${t.bd2})`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${on?`${t.primary}30`:t.bd}`,boxShadow:on?`0 0 12px ${t.glow}, inset 0 1px 1px rgba(255,255,255,0.08)`:`inset 0 1px 1px rgba(255,255,255,0.04)`,transition:`all 0.3s cubic-bezier(0.4,0,0.2,1)`,overflow:"hidden"}}>
        {/* Glass shimmer */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)",borderRadius:"10px 10px 0 0",pointerEvents:"none"}}/>
        {/* Knob */}
        <div style={{position:"absolute",top:open?2:1.5,left:on?(open?18:13):(open?2:1.5),width:open?14:13,height:open?14:13,borderRadius:"50%",background:on?`linear-gradient(135deg, #fff, ${t.primary}30)`:"linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",boxShadow:on?`0 1px 4px ${t.primary}40, 0 0 8px ${t.glow}`:"0 1px 3px rgba(0,0,0,0.15)",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:open?7:6,lineHeight:1,opacity:0.7}}>{on?iconOn:iconOff}</span>
        </div>
      </div>
      {open&&<span style={{fontSize:9,fontWeight:on?500:400,color:on?t.tx:t.tx3,transition:`color ${E}`,whiteSpace:"nowrap"}}>{on?labelOn:labelOff}</span>}
    </button>
  );
}

/* ─── Glass Service Toggle (Admin) ─── */
function GlassServiceToggle({active,onToggle,t}){
  return(
    <div onClick={onToggle} style={{width:32,height:16,borderRadius:8,position:"relative",cursor:"pointer",flexShrink:0,background:active?`linear-gradient(135deg, ${t.primary}60, ${t.primary}30)`:`linear-gradient(135deg, ${t.bd}, ${t.bd2})`,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",border:`1px solid ${active?`${t.primary}25`:t.bd}`,boxShadow:active?`0 0 10px ${t.glow}`:"none",transition:`all 0.3s cubic-bezier(0.4,0,0.2,1)`,overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",borderRadius:"8px 8px 0 0",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:1.5,left:active?16:1.5,width:13,height:13,borderRadius:"50%",background:active?"linear-gradient(135deg, #fff, rgba(255,255,255,0.8))":"linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",boxShadow:active?`0 1px 4px ${t.primary}30`:"0 1px 2px rgba(0,0,0,0.1)",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)"}}/>
    </div>
  );
}


function CCard({card,active,onClick,t,g}){
  const a=card.assignee?TEAM.find(m=>m.id===card.assignee):null;
  const isDue=card.due==="Feb 13"||card.due==="Today";
  const base=active?`${t.primary}40`:isDue?`${t.red}30`:t.bd2;
  return(
    <div onClick={onClick} style={{...g.c,position:"relative",cursor:"pointer",overflow:"hidden",borderColor:base,transition:`border-color ${E}, box-shadow ${E}`}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,0,0,0.2)`;e.currentTarget.style.borderColor=`${t.primary}30`;}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=base;}}>
      <div style={{height:2,background:`linear-gradient(90deg,${card.lc}80,${card.lc}20)`}}/>
      <div style={{padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:9,fontWeight:600,fontFamily:FN,color:card.lc,letterSpacing:"0.04em",textTransform:"uppercase"}}>{card.label}</span>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            {card.pri==="urgent"&&<div style={{width:6,height:6,borderRadius:"50%",background:t.red}} title="Urgent"/>}
            {card.pri==="rush"&&<div style={{width:6,height:6,borderRadius:"50%",background:t.amber}} title="Rush"/>}
            <span style={{fontSize:8,fontWeight:600,fontFamily:MN,color:t.tx3}}>{card.size}</span>
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:600,fontFamily:FN,color:t.tx,lineHeight:1.35,marginBottom:4}}>{card.title}</div>
        <div style={{fontSize:9,fontFamily:FN,color:t.tx3,marginBottom:8}}>{card.dept} · {card.req}</div>
        <Track step={card.step} t={t}/>
        {(card.adobe?.length>0||card.m365?.length>0)&&(
          <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap"}}>
            {card.adobe?.map((x,i)=><span key={`a${i}`} style={{fontSize:7,fontWeight:700,fontFamily:MN,padding:"1px 4px",borderRadius:3,color:ADOBE[x],background:`${ADOBE[x]}12`}}>{x}</span>)}
            {card.m365?.map((x,i)=><span key={`m${i}`} style={{fontSize:7,fontWeight:700,fontFamily:MN,padding:"1px 4px",borderRadius:3,color:M365[x],background:`${M365[x]}10`}}>{x}</span>)}
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {a?<Mono init={a.init} color={a.color} sz={20} fs={7}/>:card.team?(
              <div style={{display:"flex"}}>{card.team.slice(0,3).map((id,i)=>{const m=TEAM.find(x=>x.id===id);return m?<div key={i} style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,fontFamily:MN,color:m.color,background:`${m.color}10`,border:`1px solid ${m.color}15`,marginLeft:i>0?-3:0,zIndex:3-i}}>{m.init}</div>:null;})}{card.team.length>3&&<span style={{fontSize:8,fontFamily:MN,color:t.tx3,marginLeft:4}}>+{card.team.length-3}</span>}</div>
            ):<div style={{width:20,height:20,borderRadius:5,background:t.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,color:t.tx3}}>—</span></div>}
            <span style={{fontSize:7,color:t.tx3,fontFamily:MN}}>{card.cid}</span>
          </div>
          <span style={{fontSize:9,fontWeight:500,fontFamily:FN,color:isDue?t.red:t.tx3}}>{card.due}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */
function Detail({card,t,g,onClose}){
  const[tab,setTab]=useState("overview");
  const a=card.assignee?TEAM.find(m=>m.id===card.assignee):null;
  const members=card.team?card.team.map(id=>TEAM.find(m=>m.id===id)).filter(Boolean):a?[a]:[];
  const tabs=["Overview","Brief","Checklist","Outreach","Activity"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px 18px 10px",borderBottom:`1px solid ${t.bd}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <span style={{fontSize:9,fontWeight:600,fontFamily:FN,color:card.lc,letterSpacing:"0.04em",textTransform:"uppercase"}}>{card.label}</span>
            <div style={{fontSize:15,fontWeight:600,fontFamily:FN,color:t.tx,lineHeight:1.3,marginTop:4}}>{card.title}</div>
            <div style={{fontSize:9,fontFamily:MN,color:t.tx3,marginTop:4}}>{card.cid}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.tx3,fontSize:14,cursor:"pointer",padding:4,fontFamily:FN,fontWeight:300}}>×</button>
        </div>
        <div style={{display:"flex",gap:1,background:t.bd,borderRadius:6,padding:1}}>
          {tabs.map(tb=>(<button key={tb} onClick={()=>setTab(tb.toLowerCase())} style={{flex:1,padding:"5px 0",borderRadius:5,fontSize:9,fontWeight:tab===tb.toLowerCase()?600:400,fontFamily:FN,cursor:"pointer",border:"none",background:tab===tb.toLowerCase()?t.gl:"transparent",color:tab===tb.toLowerCase()?t.tx:t.tx3,transition:`all ${E}`}}>{tb}</button>))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
        {tab==="overview"&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[["Department",card.dept],["Requester",card.req],["Due",card.due],["Priority",card.pri],["Size",card.size]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:10,fontFamily:FN}}>
              <span style={{color:t.tx3}}>{k}</span>
              <span style={{color:k==="Due"&&v==="Feb 13"?t.red:t.tx,fontWeight:500}}>{v}</span>
            </div>
          ))}
          <div>
            <div style={{fontSize:9,fontFamily:FN,color:t.tx3,marginBottom:6}}>Progress</div>
            <Track step={card.step} t={t}/>
            <div style={{fontSize:8,fontFamily:MN,color:t.tx3,marginTop:3}}>{card.step}/{STEPS.length} — {STEPS[card.step]||"DONE"}</div>
          </div>
          <div>
            <div style={{fontSize:9,fontFamily:FN,color:t.tx3,marginBottom:8}}>Team</div>
            {members.map(m=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 8px",borderRadius:6,marginBottom:3,background:`${m.color}06`}}>
                <Mono init={m.init} color={m.color} sz={24} fs={8}/>
                <div>
                  <div style={{fontSize:10,fontWeight:600,fontFamily:FN,color:t.tx}}>{m.name}</div>
                  <div style={{fontSize:8,fontFamily:FN,color:m.color}}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
          {(card.adobe?.length>0||card.m365?.length>0)&&(
            <div>
              <div style={{fontSize:9,fontFamily:FN,color:t.tx3,marginBottom:6}}>Deliverables</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {card.adobe?.map((x,i)=><span key={i} style={{fontSize:9,fontWeight:600,fontFamily:MN,padding:"3px 8px",borderRadius:4,color:ADOBE[x],background:`${ADOBE[x]}10`}}>{x}</span>)}
                {card.m365?.map((x,i)=><span key={i} style={{fontSize:9,fontWeight:600,fontFamily:MN,padding:"3px 8px",borderRadius:4,color:M365[x],background:`${M365[x]}08`}}>{x}</span>)}
              </div>
            </div>
          )}
          <button style={{width:"100%",padding:"9px",borderRadius:8,fontSize:11,fontWeight:600,fontFamily:FN,border:"none",cursor:"pointer",background:t.primary,color:"#fff",marginTop:4,transition:`opacity ${E}`}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Pass Baton</button>
        </div>)}
        {tab==="brief"&&(<div style={{fontSize:10,fontFamily:FN,color:t.tx2,lineHeight:1.8}}>
          <p>Brief for <strong style={{color:t.tx}}>{card.title}</strong></p>
          <p style={{marginTop:8}}>By {card.req}, {card.dept}. Service: {card.label}. Priority: {card.pri}. Due: {card.due}.</p>
          <div style={{marginTop:14,padding:10,borderRadius:6,background:t.bd}}>
            <div style={{fontSize:8,fontWeight:600,color:t.tx3,letterSpacing:"0.1em",marginBottom:4}}>NOTES</div>
            <div style={{fontSize:9,color:t.tx3,fontStyle:"italic"}}>No notes yet</div>
          </div>
        </div>)}
        {tab==="checklist"&&(<div style={{display:"flex",flexDirection:"column",gap:4}}>
          {["Receive request","Verify requirements","Assign team","Create draft","Internal review","Revisions","Final approval","Distribute"].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:5,background:i<card.step?`${t.green}06`:t.bd}}>
              <div style={{width:14,height:14,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,fontFamily:MN,background:i<card.step?`${t.green}15`:t.bd2,color:i<card.step?t.green:t.tx3}}>{i<card.step?"✓":""}</div>
              <span style={{fontSize:10,fontFamily:FN,color:i<card.step?t.tx3:t.tx,textDecoration:i<card.step?"line-through":"none"}}>{item}</span>
            </div>
          ))}
        </div>)}
        {tab==="outreach"&&(<div style={{fontSize:10,fontFamily:FN,color:t.tx2,lineHeight:1.8}}>
          <p>Channels appear at Distribute phase.</p>
          <div style={{marginTop:12,padding:10,borderRadius:6,background:`${t.primary}06`}}>
            <div style={{fontSize:8,fontWeight:600,color:t.primary,letterSpacing:"0.1em"}}>CHANNELS</div>
            <div style={{fontSize:9,color:t.tx3,marginTop:4}}>Not configured</div>
          </div>
        </div>)}
        {tab==="activity"&&(<div style={{display:"flex",flexDirection:"column"}}>
          {[{tm:"2h ago",u:a?.name||"System",ac:`moved to ${card.list}`},{tm:"1d ago",u:"Tracy",ac:"verified requirements"},{tm:"2d ago",u:"System",ac:"created from Portal"}].map((act,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<2?`1px solid ${t.bd}`:"none"}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:t.primary,marginTop:6,flexShrink:0}}/>
              <div>
                <div style={{fontSize:10,fontFamily:FN,color:t.tx}}><span style={{fontWeight:600}}>{act.u}</span> {act.ac}</div>
                <div style={{fontSize:8,fontFamily:MN,color:t.tx3,marginTop:1}}>{act.tm}</div>
              </div>
            </div>
          ))}
        </div>)}
      </div>
    </div>
  );
}

/* ─── Workspace ─── */
function Workspace({member,cards,t,g,onCard,sel}){
  const mc=cards.filter(c=>c.assignee===member.id||c.team?.includes(member.id));
  const active=mc.filter(c=>c.list!=="complete");
  const due=mc.filter(c=>c.due==="Feb 13"||c.due==="Today");
  const done=mc.filter(c=>c.list==="complete");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto",paddingBottom:16}}>
      <div style={{...g.p,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
        <Mono init={member.init} color={member.color} sz={44} fs={14}/>
        <div>
          <div style={{fontSize:18,fontWeight:300,fontFamily:FN,color:t.tx}}>{member.name}</div>
          <div style={{fontSize:10,fontFamily:FN,color:member.color,fontWeight:500}}>{member.role}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {[[active.length,"Active",t.primary],[due.length,"Due Today",due.length>0?t.red:t.green],[done.length,"Done",t.green]].map(([v,l,c],i)=>(
          <div key={i} style={{...g.s,padding:"12px 14px",flex:1,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:200,fontFamily:FN,color:c}}>{v}</div>
            <div style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.06em",marginTop:2,textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{fontSize:9,fontWeight:600,color:t.tx3,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:FN,marginBottom:8}}>Queue</div>
        {active.length===0&&<div style={{padding:16,textAlign:"center",borderRadius:8,border:`1px dashed ${t.bd}`,fontSize:10,fontFamily:FN,color:t.tx3}}>No active cards</div>}
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {active.map(c=><CCard key={c.id} card={c} active={sel===c.id} onClick={()=>onCard(c.id)} t={t} g={g}/>)}
        </div>
      </div>
      {due.length>0&&(
        <div>
          <div style={{fontSize:9,fontWeight:600,color:t.red,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:FN,marginBottom:8}}>Due Today</div>
          {due.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:6,marginBottom:3,borderLeft:`2px solid ${t.red}`,background:`${t.red}06`}}>
              <div style={{fontSize:10,fontWeight:500,fontFamily:FN,color:t.tx}}>{c.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Calendar ─── */
function Cal({t,g,events,onCard}){
  const HRS=Array.from({length:11},(_,i)=>i+8);
  const DAYS=[{l:"Mon",d:"Feb 10"},{l:"Tue",d:"Feb 11"},{l:"Wed",d:"Feb 12"},{l:"Thu",d:"Feb 13"},{l:"Fri",d:"Feb 14"}];
  const today="Feb 13";
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:10,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {["‹","›"].map((a,i)=><button key={i} style={{background:t.bd,border:"none",borderRadius:4,padding:"4px 8px",color:t.tx2,cursor:"pointer",fontSize:12,fontFamily:FN}}>{a}</button>)}
          <span style={{fontSize:16,fontWeight:300,fontFamily:FN,color:t.tx}}>February 2026</span>
        </div>
        <button style={{fontSize:9,fontWeight:600,fontFamily:FN,color:t.primary,background:`${t.primary}08`,border:`1px solid ${t.primary}15`,borderRadius:5,padding:"4px 12px",cursor:"pointer"}}>Today</button>
      </div>
      <div style={{display:"flex",marginLeft:52,flexShrink:0}}>
        {DAYS.map(d=>(
          <div key={d.l} style={{flex:1,textAlign:"center",padding:"8px 0",borderBottom:`1px solid ${t.bd}`}}>
            <div style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.1em"}}>{d.l.toUpperCase()}</div>
            <div style={{fontSize:18,fontWeight:d.d===today?600:200,fontFamily:FN,color:d.d===today?t.primary:t.tx,marginTop:2}}>{d.d.split(" ")[1]}</div>
            {d.d===today&&<div style={{width:4,height:4,borderRadius:"50%",background:t.primary,margin:"3px auto 0"}}/>}
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{display:"flex",minHeight:HRS.length*48}}>
          <div style={{width:52,flexShrink:0}}>
            {HRS.map(h=>(
              <div key={h} style={{height:48,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:8,paddingTop:1}}>
                <span style={{fontSize:8,fontFamily:MN,color:t.tx3}}>{h>12?h-12:h}{h>=12?"p":"a"}</span>
              </div>
            ))}
          </div>
          {DAYS.map(d=>{
            const de=events.filter(e=>e.date===d.d);
            return(
              <div key={d.l} style={{flex:1,position:"relative",borderLeft:`1px solid ${t.bd2}`,background:d.d===today?`${t.primary}03`:"transparent"}}>
                {HRS.map(h=><div key={h} style={{height:48,borderBottom:`1px solid ${t.bd2}`}}/>)}
                {de.map((ev,i)=>(
                  <div key={i} onClick={()=>ev.cid&&onCard(ev.cid)} style={{
                    position:"absolute",top:(ev.hr-8)*48+3,left:3,right:3,minHeight:36,padding:"5px 7px",
                    borderRadius:6,cursor:ev.cid?"pointer":"default",
                    borderLeft:`2px solid ${ev.color}`,background:`${ev.color}08`,
                    transition:`box-shadow 0.15s`
                  }}
                  onMouseEnter={e=>{if(ev.cid)e.currentTarget.style.boxShadow=`0 2px 12px ${ev.color}20`;}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                    <div style={{fontSize:9,fontWeight:600,fontFamily:FN,color:t.tx,lineHeight:1.3}}>{ev.title}</div>
                    <div style={{fontSize:7,fontFamily:MN,color:ev.color,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:1}}>{ev.type}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Week Strip ─── */
function WeekStrip({t,g,events,onClick}){
  const DAYS=[{l:"M",d:"Feb 10"},{l:"T",d:"Feb 11"},{l:"W",d:"Feb 12"},{l:"T",d:"Feb 13"},{l:"F",d:"Feb 14"}];
  const today="Feb 13";
  return(
    <div style={{...g.c,display:"flex",alignItems:"center",padding:"6px 10px",gap:2}}>
      <span style={{fontSize:8,fontWeight:600,fontFamily:MN,color:t.tx3,marginRight:6}}>W08</span>
      {DAYS.map(d=>{
        const ct=events.filter(e=>e.date===d.d).length;
        const is=d.d===today;
        return(
          <button key={d.d} onClick={onClick} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 0",borderRadius:6,border:"none",cursor:"pointer",fontFamily:FN,background:is?`${t.primary}10`:"transparent"}}>
            <span style={{fontSize:8,fontWeight:500,color:is?t.primary:t.tx3}}>{d.l}</span>
            <span style={{fontSize:12,fontWeight:is?600:300,color:is?t.primary:t.tx}}>{d.d.split(" ")[1]}</span>
            {ct>0&&<div style={{display:"flex",gap:1}}>{Array.from({length:Math.min(ct,3)}).map((_,i)=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:t.primary}}/>)}</div>}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Copilot ─── */
function Copilot({open,onClose,msgs,input,setInput,onSend,t,g}){
  const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  if(!open) return null;
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:90,backdropFilter:"blur(2px)"}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:360,zIndex:100,...g.p,borderRadius:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,fontFamily:FN,color:t.tx}}>Co-Pilot</div>
            <div style={{fontSize:8,fontFamily:FN,color:t.tx3}}>Projects · Schedule · Team</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.tx3,fontSize:14,cursor:"pointer",fontFamily:FN,fontWeight:300}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"82%",padding:"8px 12px",borderRadius:m.role==="user"?"10px 10px 3px 10px":"10px 10px 10px 3px",fontSize:11,fontFamily:FN,lineHeight:1.6,whiteSpace:"pre-wrap",background:m.role==="user"?`${t.primary}10`:t.bd,color:m.role==="user"?t.tx:t.tx2}}>{m.text}</div>
            </div>
          ))}
          <div ref={ref}/>
        </div>
        <div style={{padding:12,borderTop:`1px solid ${t.bd}`,flexShrink:0}}>
          <div style={{display:"flex",gap:6}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSend()} placeholder="Ask something..." style={{flex:1,background:t.bd,border:"none",borderRadius:6,padding:"8px 12px",fontSize:11,color:t.tx,outline:"none",fontFamily:FN,caretColor:t.primary}}/>
            <button onClick={onSend} style={{padding:"8px 12px",borderRadius:6,border:"none",background:t.primary,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:FN}}>Send</button>
          </div>
          <div style={{display:"flex",gap:3,marginTop:6}}>
            {["My schedule","Team load","Overdue?"].map(q=>(
              <button key={q} onClick={()=>setInput(q)} style={{padding:"3px 6px",borderRadius:4,fontSize:8,color:t.tx3,background:t.bd,border:"none",cursor:"pointer",fontFamily:FN}}>{q}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Quick Create ─── */
function QCreate({open,onClose,onSubmit,t,g}){
  const[title,setTitle]=useState("");
  const[svc,setSvc]=useState("Digital Flyer");
  const[dept,setDept]=useState("");
  const[req,setReq]=useState("");
  const[pri,setPri]=useState("standard");
  if(!open) return null;
  const submit=()=>{
    if(!title.trim()) return;
    onSubmit({title:title.trim(),svc,dept:dept.trim()||"Communications",req:req.trim()||"Portal",pri});
    setTitle("");setDept("");setReq("");setPri("standard");onClose();
  };
  const inp={width:"100%",background:t.bd,border:"none",borderRadius:6,padding:"8px 10px",fontSize:11,color:t.tx,outline:"none",fontFamily:FN,caretColor:t.primary,boxSizing:"border-box"};
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:90,backdropFilter:"blur(3px)"}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,zIndex:100,...g.p,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:300,fontFamily:FN,color:t.tx}}>New Card</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.tx3,fontSize:14,cursor:"pointer",fontFamily:FN,fontWeight:300}}>×</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <label style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.08em",display:"block",marginBottom:3}}>TITLE</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Card title" style={inp}/>
          </div>
          <div>
            <label style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.08em",display:"block",marginBottom:3}}>SERVICE</label>
            <select value={svc} onChange={e=>setSvc(e.target.value)} style={{...inp,cursor:"pointer"}}>{SERVICES.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}</select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}>
              <label style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.08em",display:"block",marginBottom:3}}>DEPT</label>
              <input value={dept} onChange={e=>setDept(e.target.value)} style={inp}/>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.08em",display:"block",marginBottom:3}}>REQUESTER</label>
              <input value={req} onChange={e=>setReq(e.target.value)} style={inp}/>
            </div>
          </div>
          <div>
            <label style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.08em",display:"block",marginBottom:4}}>PRIORITY</label>
            <div style={{display:"flex",gap:4}}>
              {["standard","rush","urgent"].map(p=>(
                <button key={p} onClick={()=>setPri(p)} style={{flex:1,padding:"6px 0",borderRadius:5,fontSize:9,fontWeight:pri===p?600:400,fontFamily:FN,cursor:"pointer",border:pri===p?`1px solid ${p==="urgent"?t.red:p==="rush"?t.amber:t.primary}30`:`1px solid ${t.bd}`,background:pri===p?`${p==="urgent"?t.red:p==="rush"?t.amber:t.primary}08`:"transparent",color:pri===p?(p==="urgent"?t.red:p==="rush"?t.amber:t.primary):t.tx3,textTransform:"capitalize",transition:`all ${E}`}}>{p}</button>
              ))}
            </div>
          </div>
          <button onClick={submit} style={{width:"100%",padding:"9px",borderRadius:6,fontSize:11,fontWeight:600,fontFamily:FN,border:"none",cursor:"pointer",background:t.primary,color:"#fff",marginTop:2,transition:`opacity ${E}`}} onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Create</button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════ */
export default function CommandCenter(){
  const[loggedIn,setLoggedIn]=useState(false);
  const[me,setMe]=useState("narciso");
  const[night,setNight]=useState(true);
  const[view,setView]=useState("command");
  const[ws,setWs]=useState(null);
  const[cards,setCards]=useState(CARDS);
  const[sel,setSel]=useState(null);
  const[showDone,setShowDone]=useState(false);
  const[pinned,setPinned]=useState(false);
  const[hover,setHover]=useState(false);
  const[copilot,setCopilot]=useState(false);
  const[msgs,setMsgs]=useState([]);
  const[cInput,setCInput]=useState("");
  const[qc,setQc]=useState(false);
  const[detail,setDetail]=useState(false);

  const t=useMemo(()=>T(night),[night]);
  const g=useMemo(()=>G(t),[t]);
  const user=TEAM.find(m=>m.id===me);
  const wsUser=ws?TEAM.find(m=>m.id===ws):null;
  const open=pinned||hover;

  const getList=(id)=>{
    if(ws) return cards.filter(c=>(c.assignee===ws||c.team?.includes(ws))&&c.list===id);
    return cards.filter(c=>c.list===id);
  };

  const sendCo=()=>{
    if(!cInput.trim()) return;
    setMsgs(p=>[...p,{role:"user",text:cInput.trim()}]);
    setCInput("");
    const mc=cards.filter(c=>c.assignee===me||c.team?.includes(me));
    setTimeout(()=>{
      setMsgs(p=>[...p,{role:"assistant",text:`${user.name}: ${mc.filter(c=>c.list!=="complete").length} active, ${mc.filter(c=>c.due==="Feb 13").length} due today. Prioritize urgent items.`}]);
    },500);
  };

  const clickCard=(id)=>{setSel(sel===id?null:id);setDetail(sel!==id);};

  const createCard=(d)=>{
    setCards(p=>[...p,{id:p.length+1,cid:`WF-2026-${String(p.length+400).padStart(4,"0")}`,title:d.title,dept:d.dept,req:d.req,label:d.svc.split(" ")[0],lc:PK,assignee:null,list:"new",step:0,due:"TBD",pri:d.pri,adobe:[],m365:[],size:"S"}]);
  };

  /* ─── LOGIN ─── */
  if(!loggedIn){
    return(
      <div style={{minHeight:"100vh",fontFamily:FN,color:"rgba(255,255,255,0.88)",display:"flex",alignItems:"center",justifyContent:"center",background:WN.c5}}>
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        {/* BG — production: replace with bg-night.png */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(145deg, ${WN.c5} 0%, ${WN.c4}80 40%, ${WN.c5} 100%)`}}/>
          <div style={{position:"absolute",bottom:"8%",left:"12%",width:"50%",height:"50%",opacity:0.12,background:`radial-gradient(ellipse, ${WN.c1}, transparent 70%)`,filter:"blur(100px)"}}/>
          <div style={{position:"absolute",top:"12%",right:"8%",width:"40%",height:"40%",opacity:0.08,background:`radial-gradient(ellipse, ${WN.c3}, transparent 70%)`,filter:"blur(100px)"}}/>
        </div>
        <div style={{position:"relative",...g.p,padding:"40px 36px",width:420,textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:12,background:WN.c1,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <span style={{fontSize:16,fontWeight:700,fontFamily:MN,color:"#fff",letterSpacing:"0.08em"}}>W</span>
          </div>
          <div style={{fontSize:22,fontWeight:200,fontFamily:FN,marginBottom:2}}>Command Center</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",letterSpacing:"0.3em",fontWeight:600,fontFamily:FN,marginBottom:24}}>WOLF FLOW SOLUTIONS</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:14,fontFamily:FN}}>Select workspace</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {TEAM.map(m=>(
              <button key={m.id} onClick={()=>{setMe(m.id);setLoggedIn(true);setMsgs([{role:"assistant",text:`${m.name}, you have ${CARDS.filter(c=>c.assignee===m.id||c.team?.includes(m.id)).length} active projects.`}]);}}
                style={{...g.s,display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:`border-color ${E}`}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${m.color}30`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.bd2;}}>
                <Mono init={m.init} color={m.color} sz={28} fs={9}/>
                <div>
                  <div style={{fontSize:12,fontWeight:500,fontFamily:FN,color:"rgba(255,255,255,0.88)"}}>{m.name}</div>
                  <div style={{fontSize:8,fontFamily:FN,color:m.color}}>{m.role}</div>
                </div>
              </button>
            ))}
          </div>
          <div style={{marginTop:20,fontSize:7,color:"rgba(255,255,255,0.15)",fontFamily:FN,letterSpacing:"0.06em"}}>Created and Authored by Johnathon Moulds © 2026</div>
        </div>
      </div>
    );
  }

  const selCard=cards.find(c=>c.id===sel);
  const tot=cards.filter(c=>c.list!=="complete").length;
  const dueN=cards.filter(c=>c.due==="Feb 13"||c.due==="Today").length;

  /* ─── DASHBOARD ─── */
  return(
    <div style={{height:"100vh",display:"flex",fontFamily:FN,color:t.tx,overflow:"hidden",background:t.bg,transition:`background 0.5s`}}>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* BG — Day/Night atmospheric imagery */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",transition:"opacity 0.7s"}}>
        {/* Base gradient */}
        <div style={{position:"absolute",inset:0,background:night?`linear-gradient(145deg, ${WN.c5} 0%, ${WN.c4}80 40%, ${WN.c5} 100%)`:`linear-gradient(145deg, #E8EAF6 0%, #F5F5FC 30%, #E3E6F0 60%, #F0F1F8 100%)`,transition:"all 0.7s"}}/>
        {/* Night: stars */}
        {night&&<div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 45% 8%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 65% 22%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 80% 42%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 90% 12%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.18) 0%, transparent 100%), radial-gradient(1px 1px at 55% 48%, rgba(255,255,255,0.12) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 35% 62%, rgba(255,255,255,0.22) 0%, transparent 100%), radial-gradient(1px 1px at 72% 58%, rgba(255,255,255,0.16) 0%, transparent 100%)`,opacity:0.6,transition:"opacity 0.7s"}}/>}
        {/* Day: soft cloud layers */}
        {!night&&<>
          <div style={{position:"absolute",top:"5%",right:"10%",width:"35%",height:"18%",background:"radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",filter:"blur(30px)",opacity:0.7}}/>
          <div style={{position:"absolute",top:"15%",left:"15%",width:"25%",height:"12%",background:"radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 70%)",filter:"blur(25px)",opacity:0.5}}/>
          <div style={{position:"absolute",top:"8%",left:"45%",width:"20%",height:"10%",background:"radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 60%)",filter:"blur(20px)",opacity:0.4}}/>
        </>}
        {/* Night: moon glow */}
        {night&&<div style={{position:"absolute",top:"6%",right:"12%",width:"80px",height:"80px",borderRadius:"50%",background:`radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,boxShadow:"0 0 60px rgba(255,255,255,0.04)",transition:"opacity 0.7s"}}/>}
        {/* Day: sun glow */}
        {!night&&<div style={{position:"absolute",top:"3%",right:"8%",width:"120px",height:"120px",borderRadius:"50%",background:`radial-gradient(circle, rgba(255,200,50,0.12) 0%, rgba(255,200,50,0.04) 40%, transparent 65%)`,boxShadow:"0 0 80px rgba(255,200,50,0.06)",transition:"opacity 0.7s"}}/>}
        {/* Primary ambient glow */}
        <div style={{position:"absolute",bottom:"5%",left:"8%",width:"50%",height:"50%",opacity:night?0.1:0.05,background:`radial-gradient(ellipse, ${night?WN.c1:WD.c3}, transparent 70%)`,filter:"blur(100px)",transition:"all 0.7s"}}/>
        <div style={{position:"absolute",top:"8%",right:"5%",width:"45%",height:"45%",opacity:night?0.07:0.04,background:`radial-gradient(ellipse, ${night?WN.c3:WD.c4}, transparent 70%)`,filter:"blur(100px)",transition:"all 0.7s"}}/>
        {/* Day: horizon warmth */}
        {!night&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"25%",background:"linear-gradient(180deg, transparent 0%, rgba(98,115,217,0.03) 60%, rgba(85,91,217,0.06) 100%)"}}/>}
      </div>

      {/* ─── LEFT RAIL ─── */}
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{position:"relative",zIndex:30,width:open?200:56,flexShrink:0,display:"flex",flexDirection:"column",padding:"8px 6px",transition:`width 0.25s cubic-bezier(0.4,0,0.2,1)`,overflow:"hidden"}}>
        <div style={{...g.p,flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Logo */}
          <div style={{padding:open?"12px 14px 8px":"12px 0 8px",display:"flex",alignItems:"center",gap:8,justifyContent:open?"flex-start":"center",flexShrink:0}}>
            <div style={{width:28,height:28,borderRadius:7,background:t.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:700,fontFamily:MN,color:"#fff"}}>W</span>
            </div>
            {open&&<div style={{whiteSpace:"nowrap"}}>
              <div style={{fontSize:12,fontWeight:500,color:t.tx}}>Wolf Flow</div>
              <div style={{fontSize:7,color:t.tx3,letterSpacing:"0.15em",fontWeight:600}}>COMMAND CENTER</div>
            </div>}
          </div>

          {/* Nav */}
          <div style={{display:"flex",flexDirection:"column",gap:1,padding:"6px 6px"}}>
            {[{id:"command",l:"Command"},{id:"calendar",l:"Calendar"},{id:"admin",l:"Admin"}].map(n=>{
              const ac=view===n.id&&!ws;
              return(
                <button key={n.id} onClick={()=>{setView(n.id);setWs(null);setSel(null);setDetail(false);}}
                  style={{display:"flex",alignItems:"center",gap:8,padding:open?"7px 10px":"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontFamily:FN,background:ac?`${t.primary}10`:"transparent",color:ac?t.primary:t.tx2,justifyContent:open?"flex-start":"center",transition:`all ${E}`,position:"relative"}}
                  onMouseEnter={e=>{if(!ac)e.currentTarget.style.background=`${t.primary}05`;}}
                  onMouseLeave={e=>{if(!ac)e.currentTarget.style.background="transparent";}}>
                  {ac&&<div style={{position:"absolute",left:0,top:"25%",bottom:"25%",width:2,borderRadius:"0 2px 2px 0",background:t.primary}}/>}
                  <span style={{fontSize:10,fontWeight:600,fontFamily:MN,width:18,textAlign:"center",flexShrink:0,color:ac?t.primary:t.tx3}}>{n.id[0].toUpperCase()}</span>
                  {open&&<span style={{fontSize:10,fontWeight:ac?600:400,whiteSpace:"nowrap"}}>{n.l}</span>}
                </button>
              );
            })}
          </div>

          <div style={{height:1,margin:"4px 12px",background:t.bd}}/>

          {/* Team */}
          <div style={{padding:"4px 6px",flex:1,overflowY:"auto"}}>
            {open&&<div style={{fontSize:7,fontWeight:600,color:t.tx3,letterSpacing:"0.12em",padding:"0 4px 5px"}}>TEAM</div>}
            {TEAM.map(m=>{
              const ac=ws===m.id;
              return(
                <button key={m.id} onClick={()=>{setWs(ac?null:m.id);setView("command");setSel(null);setDetail(false);}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:open?"5px 8px":"5px 0",borderRadius:5,border:"none",cursor:"pointer",fontFamily:FN,background:ac?`${m.color}10`:"transparent",justifyContent:open?"flex-start":"center",transition:`all ${E}`,marginBottom:1}}
                  onMouseEnter={e=>{if(!ac)e.currentTarget.style.background=`${m.color}05`;}}
                  onMouseLeave={e=>{if(!ac)e.currentTarget.style.background=ac?`${m.color}10`:"transparent";}}>
                  <Mono init={m.init} color={m.color} sz={22} fs={7}/>
                  {open&&<div style={{textAlign:"left",overflow:"hidden",whiteSpace:"nowrap"}}>
                    <div style={{fontSize:10,fontWeight:ac?600:400,color:ac?t.tx:t.tx2}}>{m.name}{m.id===me?" ·":""}</div>
                  </div>}
                </button>
              );
            })}
            {[0,1].map(i=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:open?"5px 8px":"5px 0",justifyContent:open?"flex-start":"center",opacity:0.2,marginBottom:1}}>
                <div style={{width:22,height:22,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontFamily:MN,color:t.tx3,background:t.bd}}>+</div>
                {open&&<span style={{fontSize:9,color:t.tx3}}>Open seat</span>}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{padding:"8px 6px",borderTop:`1px solid ${t.bd}`,flexShrink:0}}>
            <GlassToggle on={night} onToggle={()=>setNight(!night)} labelOn="Night" labelOff="Day" iconOn="☾" iconOff="☀" t={t} open={open}/>
            {open&&<div style={{marginTop:4}}><GlassToggle on={pinned} onToggle={()=>setPinned(!pinned)} labelOn="Pinned" labelOff="Pin" iconOn="◉" iconOff="○" t={t} open={open}/></div>}
          </div>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",zIndex:10}}>

        {/* TOP BAR */}
        <header style={{padding:"8px 14px 0",flexShrink:0}}>
          <div style={{...g.p,padding:"8px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:13,fontWeight:300,fontFamily:FN,color:t.tx}}>{ws?wsUser?.name:view==="command"?"Command Center":view==="calendar"?"Calendar":"Admin"}</span>
                {ws&&<button onClick={()=>setWs(null)} style={{fontSize:8,fontFamily:MN,color:t.tx3,background:t.bd,border:"none",borderRadius:4,padding:"2px 8px",cursor:"pointer"}}>← all</button>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{display:"flex",gap:3}}>
                  <div style={{display:"flex",alignItems:"center",gap:2,padding:"2px 6px",borderRadius:4,background:"rgba(0,120,212,0.06)",border:"1px solid rgba(0,120,212,0.1)"}}>
                    <svg width="8" height="8" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>
                    <span style={{fontSize:8,fontWeight:600,fontFamily:MN,color:"#0078D4"}}>365</span>
                  </div>
                  <div style={{padding:"2px 6px",borderRadius:4,background:"rgba(255,0,0,0.04)",border:"1px solid rgba(255,0,0,0.08)",fontSize:8,fontWeight:700,fontFamily:MN,color:"#FF0000"}}>Cc</div>
                </div>
                <button onClick={()=>setCopilot(true)} style={{fontSize:9,fontWeight:600,fontFamily:FN,color:t.primary,background:`${t.primary}06`,border:`1px solid ${t.primary}12`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>Co-Pilot</button>
                <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px 3px 3px",borderRadius:6,background:`${user.color}06`,border:`1px solid ${user.color}12`}}>
                  <Mono init={user.init} color={user.color} sz={22} fs={7}/>
                  <span style={{fontSize:10,fontWeight:500,fontFamily:FN,color:t.tx}}>{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div style={{flex:1,display:"flex",overflow:"hidden",padding:"8px 14px 8px",gap:8}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,overflow:"hidden",minWidth:0}}>

            {/* WORKSPACE */}
            {ws&&<Workspace member={wsUser} cards={cards} t={t} g={g} onCard={clickCard} sel={sel}/>}

            {/* COMMAND */}
            {!ws&&view==="command"&&(<>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                {[[tot,"Active",t.primary],[dueN,"Due Today",dueN>0?t.red:t.green],[cards.filter(c=>c.list==="new").length,"New",PK],[cards.filter(c=>c.list==="review").length,"Review",WN.c2],[cards.filter(c=>c.list==="distribute").length,"Publish",WN.c3]].map(([v,l,c],i)=>(
                  <div key={i} style={{...g.s,padding:"12px 14px",flex:1}}>
                    <div style={{fontSize:24,fontWeight:200,fontFamily:FN,color:c,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.tx3,letterSpacing:"0.06em",marginTop:3,textTransform:"uppercase"}}>{l}</div>
                  </div>
                ))}
              </div>
              <WeekStrip t={t} g={g} events={EVENTS} onClick={()=>{setView("calendar");setWs(null);}}/>
              <div style={{flex:1,display:"flex",gap:6,overflow:"hidden"}}>
                {COLS.filter(l=>l.id!=="complete"||showDone).map(col=>{
                  const lc=getList(col.id);
                  const done=col.id==="complete";
                  return(
                    <div key={col.id} style={{flex:done?"0 0 180px":1,display:"flex",flexDirection:"column",gap:4,overflow:"hidden",minWidth:155,opacity:done?0.5:1}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:8,borderBottom:`2px solid ${col.color}20`,flexShrink:0}}>
                        <div>
                          <div style={{fontSize:11,fontWeight:600,fontFamily:FN,color:t.tx}}>{col.title}</div>
                          <div style={{fontSize:8,fontFamily:FN,color:t.tx3}}>{col.desc}</div>
                        </div>
                        <span style={{fontSize:9,fontWeight:600,fontFamily:MN,color:col.color}}>{lc.length}</span>
                      </div>
                      <div style={{flex:1,display:"flex",flexDirection:"column",gap:4,overflowY:"auto"}}>
                        {lc.map(c=><CCard key={c.id} card={c} active={sel===c.id} onClick={()=>clickCard(c.id)} t={t} g={g}/>)}
                        {lc.length===0&&<div style={{padding:"24px 0",textAlign:"center",borderRadius:6,border:`1px dashed ${t.bd}`,fontSize:9,fontFamily:FN,color:t.tx3}}>Empty</div>}
                      </div>
                    </div>
                  );
                })}
                {!showDone&&(
                  <button onClick={()=>setShowDone(true)} style={{writingMode:"vertical-rl",padding:"10px 8px",borderRadius:6,background:`${t.green}06`,border:`1px solid ${t.green}10`,color:t.green,fontSize:9,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:FN,letterSpacing:"0.06em"}}>Done ({getList("complete").length})</button>
                )}
              </div>
            </>)}

            {/* CALENDAR */}
            {!ws&&view==="calendar"&&<Cal t={t} g={g} events={EVENTS} onCard={clickCard}/>}

            {/* ADMIN */}
            {!ws&&view==="admin"&&(
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontSize:9,fontWeight:600,color:t.tx3,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:FN}}>Portal Admin</div>
                <div style={{...g.p,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:500,fontFamily:FN,color:t.tx}}>Service Types</div>
                    <button style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.primary,background:`${t.primary}06`,border:`1px solid ${t.primary}12`,borderRadius:4,padding:"3px 10px",cursor:"pointer"}}>+ Add</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {SERVICES.map((s,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:8,background:t.bd,border:`1px solid ${t.bd2}`}}>
                        <div>
                          <div style={{fontSize:11,fontWeight:500,fontFamily:FN,color:t.tx}}>{s.name}</div>
                          <div style={{fontSize:8,fontFamily:FN,color:t.tx3}}>{s.vol} · {s.auto?"Auto":"Manual"}</div>
                        </div>
                        <GlassServiceToggle active={s.active} onToggle={()=>{}} t={t}/>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{...g.p,padding:18}}>
                  <div style={{fontSize:12,fontWeight:500,fontFamily:FN,color:t.tx,marginBottom:12}}>Recent Submissions</div>
                  {cards.filter(c=>c.list==="new"||c.list==="intake").map(c=>(
                    <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",marginBottom:4,borderRadius:6,background:t.bd}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:8,fontWeight:600,fontFamily:FN,color:c.lc,textTransform:"uppercase",letterSpacing:"0.04em"}}>{c.label}</span>
                        <div>
                          <div style={{fontSize:10,fontWeight:500,fontFamily:FN,color:t.tx}}>{c.title}</div>
                          <div style={{fontSize:8,fontFamily:FN,color:t.tx3}}>{c.dept}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:3}}>
                        <button style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.primary,background:`${t.primary}06`,border:`1px solid ${t.primary}12`,borderRadius:4,padding:"3px 8px",cursor:"pointer"}}>Accept</button>
                        <button style={{fontSize:8,fontWeight:600,fontFamily:FN,color:t.amber,background:`${t.amber}06`,border:`1px solid ${t.amber}12`,borderRadius:4,padding:"3px 8px",cursor:"pointer"}}>Route</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{...g.p,padding:18}}>
                  <div style={{fontSize:12,fontWeight:500,fontFamily:FN,color:t.tx,marginBottom:12}}>Integrations</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                    {[{n:"Microsoft 365",s:"Connected",c:"#0078D4"},{n:"Adobe CC",s:"Connected",c:"#FF0000"},{n:"Supabase",s:"19 tables",c:t.green},{n:"Vercel",s:"Deployed",c:t.tx2},{n:"WordPress",s:"v2 planned",c:t.tx3},{n:"River Run",s:"Print",c:t.amber}].map((int,i)=>(
                      <div key={i} style={{padding:"10px 12px",borderRadius:6,background:t.bd}}>
                        <div style={{fontSize:10,fontWeight:500,fontFamily:FN,color:t.tx}}>{int.n}</div>
                        <div style={{fontSize:8,fontFamily:FN,color:int.c,fontWeight:500,marginTop:2}}>{int.s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT DETAIL */}
          {detail&&selCard&&(
            <div style={{width:340,flexShrink:0,...g.p,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <Detail card={selCard} t={t} g={g} onClose={()=>{setDetail(false);setSel(null);}}/>
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div style={{padding:"0 14px 8px",flexShrink:0}}>
          <div style={{...g.p,borderRadius:8,padding:"6px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:8,fontFamily:MN,color:t.tx3}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span>220 req/mo</span><span style={{opacity:0.2}}>·</span>
                <span style={{color:t.primary}}>$0 licensing</span><span style={{opacity:0.2}}>·</span>
                <span>6 team · 2 open</span><span style={{opacity:0.2}}>·</span>
                <span>Supabase 19t</span><span style={{opacity:0.2}}>·</span>
                <span style={{color:t.primary}}>Portal: LIVE</span>
              </div>
              <div style={{display:"flex",gap:2}}>
                {TEAM.map(m=><Mono key={m.id} init={m.init} color={m.color} sz={18} fs={6}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button onClick={()=>setQc(true)} style={{position:"fixed",bottom:22,right:22,zIndex:50,width:40,height:40,borderRadius:10,border:"none",cursor:"pointer",background:t.primary,color:"#fff",fontSize:16,fontWeight:300,fontFamily:FN,display:"flex",alignItems:"center",justifyContent:"center",transition:`opacity ${E}`}}
        onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>+</button>

      <Copilot open={copilot} onClose={()=>setCopilot(false)} msgs={msgs} input={cInput} setInput={setCInput} onSend={sendCo} t={t} g={g}/>
      <QCreate open={qc} onClose={()=>setQc(false)} onSubmit={createCard} t={t} g={g}/>
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
