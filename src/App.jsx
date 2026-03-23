import{useState,useEffect,useRef,useCallback}from"react"
import axios from"axios"

const MatrixRain=()=>{
const c=useRef(null)
useEffect(()=>{
const cv=c.current;if(!cv)return
const ctx=cv.getContext("2d")
const r=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight}
r();window.addEventListener("resize",r)
const ch="01アイウエオカキクケコサシスセソタチツテトナニヌネノ"
const fs=14,cols=Math.floor(cv.width/fs)
const dr=Array(cols).fill(1).map(()=>Math.random()*-100)
const draw=()=>{
ctx.fillStyle="rgba(10,10,10,0.05)";ctx.fillRect(0,0,cv.width,cv.height)
ctx.fillStyle="#00ff9f";ctx.font=`${fs}px monospace`
dr.forEach((y,i)=>{
ctx.globalAlpha=Math.random()*0.5+0.1
ctx.fillText(ch[Math.floor(Math.random()*ch.length)],i*fs,y*fs)
ctx.globalAlpha=1
if(y*fs>cv.height&&Math.random()>0.975)dr[i]=0
dr[i]++
})}
const iv=setInterval(draw,50)
return()=>{clearInterval(iv);window.removeEventListener("resize",r)}
},[])
return <canvas ref={c} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:0.3}}/>
}

const HackerScene=()=>{
const[t,setT]=useState("")
const lines=["> scanning...",">> analyzing...",">> checking SSL...",">> AI model...",">> threat check!",">> secure.",">> _"]
useEffect(()=>{
let li=0,ci=0,cur=""
const iv=setInterval(()=>{
if(li>=lines.length){li=0;cur=""}
const l=lines[li]
if(ci<=l.length){setT(cur+l.slice(0,ci)+"█");ci++}
else{cur+=l+"\n";li++;ci=0}
},80)
return()=>clearInterval(iv)
},[])
return(
<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400,position:"relative"}}>
<div style={{animation:"float 3s ease-in-out infinite"}}>
<svg viewBox="0 0 300 350" style={{width:"clamp(14rem,18vw,18rem)",filter:"drop-shadow(0 0 20px rgba(0,255,159,0.4))"}}>
<ellipse cx="150" cy="320" rx="80" ry="30" fill="#111"/>
<path d="M90 200 Q90 320 150 320 Q210 320 210 200 Z" fill="#111" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3"/>
<path d="M85 200 Q85 120 150 100 Q215 120 215 200 Z" fill="#0d0d0d" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3"/>
<ellipse cx="150" cy="170" rx="35" ry="40" fill="#0a0a0a"/>
<ellipse cx="138" cy="162" rx="5" ry="3" fill="#00ff9f" style={{animation:"eyePulse 2s infinite"}}/>
<ellipse cx="162" cy="162" rx="5" ry="3" fill="#00ff9f" style={{animation:"eyePulse 2s infinite .3s"}}/>
<rect x="110" y="220" width="80" height="42" rx="3" fill="#0a1a0f" stroke="#00ff9f" strokeWidth="1" strokeOpacity="0.6"/>
<foreignObject x="114" y="224" width="72" height="34">
<div style={{fontSize:4,fontFamily:"monospace",color:"#00ff9f",lineHeight:"6px",overflow:"hidden",whiteSpace:"pre-wrap"}}>{t}</div>
</foreignObject>
<ellipse cx="125" cy="258" rx="10" ry="5" fill="#0d0d0d" style={{animation:"armFloat 0.3s ease-in-out infinite"}}/>
<ellipse cx="175" cy="258" rx="10" ry="5" fill="#0d0d0d" style={{animation:"armFloat 0.3s ease-in-out infinite .15s"}}/>
</svg>
</div>
</div>
)}

const msgs=["[SYS] Initializing AI scanner...","[NET] Resolving DNS records...","[SSL] Checking certificate validity...","[AI ] Running phishing detection model...","[DB ] Cross-referencing threat database...","[NET] Analyzing redirect chain...","[AI ] Extracting URL features...","[AI ] Computing risk vector...","[SYS] Generating threat report..."]

const Terminal=({onDone})=>{
const[lines,setLines]=useState([])
const[cur,setCur]=useState("")
const[idx,setIdx]=useState(0)
useEffect(()=>{
if(idx>=msgs.length){onDone();return}
const m=msgs[idx];let ci=0
const iv=setInterval(()=>{
if(ci<=m.length)setCur(m.slice(0,ci++))
else{setLines(p=>[...p,m]);setCur("");setIdx(p=>p+1);clearInterval(iv)}
},22)
return()=>clearInterval(iv)
},[idx])
return(
<div style={{border:"1px solid #1a3a2a",borderRadius:8,padding:14,background:"rgba(18,18,18,0.6)",fontFamily:"monospace",fontSize:12,maxHeight:220,overflowY:"auto"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,color:"rgba(0,255,159,0.5)"}}>
<div style={{width:8,height:8,borderRadius:"50%",background:"#00ff9f",animation:"pulse 2s infinite"}}/>
<span>AI SCANNER TERMINAL</span>
</div>
{lines.map((l,i)=><div key={i} style={{color:"rgba(0,255,159,0.4)",lineHeight:"22px"}}>{l}</div>)}
{cur&&<div style={{color:"#00ff9f",lineHeight:"22px"}}>{cur}<span style={{display:"inline-block",width:7,height:14,background:"#00ff9f",marginLeft:2,animation:"blink 1s step-end infinite"}}/></div>}
</div>
)}

const VC={
safe:{c:"#00ff9f",g:"rgba(0,255,159,0.2)",i:"🛡️"},
suspicious:{c:"#ffcc00",g:"rgba(255,204,0,0.2)",i:"⚠️"},
dangerous:{c:"#ff4444",g:"rgba(255,68,68,0.2)",i:"🚫"},
}

const Results=({r})=>{
const vk=r.verdict==="Dangerous"?"dangerous":r.verdict==="Suspicious"||r.verdict==="Low Risk"?"suspicious":"safe"
const v=VC[vk]
const ai=r.ai_analysis
const flags=r.flags||[]
return(
<div style={{display:"flex",flexDirection:"column",gap:14}}>
<div style={{border:`1px solid ${v.c}33`,borderRadius:8,padding:20,background:`${v.c}0a`,boxShadow:`0 0 15px ${v.g}`}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
<span style={{fontSize:26}}>{v.i}</span>
<span style={{fontSize:22,fontWeight:700,color:v.c,textShadow:`0 0 10px ${v.c}`}}>{r.verdict.toUpperCase()}</span>
<span style={{marginLeft:"auto",fontSize:26,fontWeight:700,color:v.c}}>{r.score}<span style={{fontSize:13,opacity:.5}}>/100</span></span>
</div>
<div style={{background:"#1a1a1a",borderRadius:999,height:10,overflow:"hidden"}}>
<div style={{width:`${r.score}%`,height:"100%",background:v.c,boxShadow:`0 0 8px ${v.g}`,borderRadius:999,transition:"width 1.5s ease"}}/>
</div>
{r.virustotal?.total_engines>0&&<div style={{marginTop:10,fontSize:11,color:"rgba(0,255,159,0.5)",fontFamily:"monospace",padding:"7px 10px",background:"rgba(0,0,0,0.3)",borderRadius:4}}>
VT: <span style={{color:"#ff4444"}}>{r.virustotal.malicious_engines} malicious</span> · <span style={{color:"#ffcc00"}}>{r.virustotal.suspicious_engines} suspicious</span> / {r.virustotal.total_engines} engines
</div>}
</div>
{ai&&<div style={{border:"1px solid #00ff9f33",borderRadius:8,padding:16,background:"rgba(0,255,159,0.03)"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00ff9f" strokeWidth="1.5" strokeLinecap="round"/></svg>
<span style={{fontSize:12,fontWeight:700,color:"#00ff9f",letterSpacing:2}}>GROQ AI ANALYSIS</span>
<span style={{marginLeft:"auto",fontSize:10,color:"rgba(0,255,159,0.4)",border:"1px solid #00ff9f22",padding:"2px 7px",borderRadius:20}}>{ai.confidence}% CONFIDENCE</span>
</div>
<div style={{fontSize:13,color:"rgba(0,255,159,0.8)",lineHeight:1.7,padding:"10px 12px",background:"rgba(0,0,0,0.2)",borderRadius:5,borderLeft:"3px solid #00ff9f44",marginBottom:10}}>{ai.explanation}</div>
{ai.additional_threats&&ai.additional_threats!=="None detected"&&<div style={{fontSize:12,color:"#ffcc00",marginBottom:8,padding:"7px 10px",background:"rgba(255,204,0,0.05)",borderRadius:4,borderLeft:"2px solid #ffcc0044"}}><span style={{fontWeight:700}}>⚠ ADDITIONAL: </span>{ai.additional_threats}</div>}
<div style={{fontSize:12,color:"rgba(0,255,159,0.6)",padding:"7px 10px",background:"rgba(0,255,159,0.04)",borderRadius:4,borderLeft:"2px solid #00ff9f33"}}><span style={{fontWeight:700}}>RECOMMENDATION: </span>{ai.recommendation}</div>
</div>}
{flags.length>0&&<div style={{border:"1px solid #ffffff0f",borderRadius:8,padding:14,background:"rgba(0,0,0,0.2)"}}>
<p style={{fontSize:10,color:"rgba(0,255,159,0.4)",marginBottom:8,letterSpacing:3}}>FLAGS — {flags.length} DETECTED</p>
{flags.map((f,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,marginBottom:7,padding:"7px 10px",background:f.risk==="high"?"rgba(255,68,68,0.07)":f.risk==="medium"?"rgba(255,204,0,0.05)":"rgba(0,255,159,0.04)",borderLeft:`2px solid ${f.risk==="high"?"#ff4444":f.risk==="medium"?"#ffcc00":"#00ff9f"}`,borderRadius:3}}>
<span style={{color:f.risk==="high"?"#ff4444":f.risk==="medium"?"#ffcc00":"#00ff9f",flexShrink:0}}>{f.risk==="high"?"⚠":"◆"}</span>
<div><span style={{fontWeight:700,color:f.risk==="high"?"#ff4444":f.risk==="medium"?"#ffcc00":"#00ff9f"}}>{f.check}</span><span style={{color:"rgba(255,255,255,0.25)",marginLeft:5}}>— {f.detail}</span></div>
</div>)}
</div>}
</div>
)}

const History=({history,setHistory,onSelect,show,setShow})=>{
if(history.length===0)return null
return(
<div>
<div onClick={()=>setShow(s=>!s)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(0,255,159,0.05)",border:"1px solid #00ff9f33",borderRadius:show?"8px 8px 0 0":"8px",cursor:"pointer",userSelect:"none"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:11,color:"#00ff9f"}}>{show?"▲":"▼"}</span>
<span style={{fontSize:12,color:"rgba(0,255,159,0.9)",letterSpacing:2,fontFamily:"monospace"}}>SCAN HISTORY ({history.length})</span>
</div>
<button onClick={e=>{e.stopPropagation();setHistory([]);localStorage.removeItem("scanHistory");setShow(false)}}
style={{background:"transparent",border:"1px solid #ff444444",borderRadius:3,color:"#ff4444",fontSize:10,padding:"2px 8px",cursor:"pointer",fontFamily:"monospace"}}>CLEAR</button>
</div>
{show&&<div style={{border:"1px solid #00ff9f22",borderTop:"none",borderRadius:"0 0 8px 8px",background:"rgba(0,0,0,0.7)",maxHeight:250,overflowY:"auto"}}>
{history.map(h=>(
<div key={h.id} onClick={()=>{onSelect(h.url);setShow(false)}}
style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #00ff9f08",cursor:"pointer",transition:"background .15s"}}
onMouseEnter={e=>e.currentTarget.style.background="rgba(0,255,159,0.06)"}
onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
<div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f"}}/>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,color:"rgba(0,255,159,0.85)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.url}</div>
<div style={{fontSize:9,color:"rgba(0,255,159,0.3)",marginTop:2,letterSpacing:1}}>{h.timestamp}</div>
</div>
<div style={{flexShrink:0,textAlign:"right"}}>
<div style={{fontSize:12,fontWeight:700,color:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f",fontFamily:"monospace"}}>{h.score}/100</div>
<div style={{fontSize:9,color:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f",letterSpacing:1}}>{h.verdict.toUpperCase()}</div>
</div>
</div>
))}
</div>}
</div>
)}

export default function App(){
const[url,setUrl]=useState("")
const[scanning,setScanning]=useState(false)
const[result,setResult]=useState(null)
const[error,setError]=useState("")
const[history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("scanHistory"))||[]}catch{return[]}})
const[showHist,setShowHist]=useState(false)
const apiResult=useRef(null)
const termDone=useRef(false)
const apiDone=useRef(false)
const currentUrl=useRef("")

const finish=useCallback(()=>{
const res=apiResult.current
setScanning(false)
if(!res||res==="error"){setError("Connection failed. Try again.");return}
setResult(res)
const scan={url:currentUrl.current,score:res.score,verdict:res.verdict,timestamp:new Date().toLocaleString(),id:Date.now()}
setHistory(prev=>{
const updated=[scan,...prev].slice(0,20)
localStorage.setItem("scanHistory",JSON.stringify(updated))
return updated
})
},[])

const handleScan=useCallback(async()=>{
if(!url.trim()||scanning)return
const trimmed=url.trim()
if(/^\d+$/.test(trimmed)||/^[a-zA-Z\s]+$/.test(trimmed)||(!trimmed.includes(".")&&!trimmed.startsWith("http"))){
setError("⚠ Invalid URL! Enter something like https://example.com")
setResult(null)
return
}
currentUrl.current=trimmed
setResult(null)
setError("")
setScanning(true)
apiResult.current=null
termDone.current=false
apiDone.current=false
try{
const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url:trimmed},{timeout:90000})
apiResult.current=res.data
}catch{apiResult.current="error"}
apiDone.current=true
if(termDone.current)finish()
},[url,scanning,finish])

const onTermDone=useCallback(()=>{
termDone.current=true
if(apiDone.current)finish()
},[finish])

return(
<>
<style>{`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0a;color:#00ff9f;font-family:monospace}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes eyePulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes armFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseNeon{0%,100%{box-shadow:0 0 10px rgba(0,255,159,.5),0 0 40px rgba(0,255,159,.2)}50%{box-shadow:0 0 20px rgba(0,255,159,.8),0 0 60px rgba(0,255,159,.4)}}
.scanline{background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,159,.03) 2px,rgba(0,255,159,.03) 4px)}
input::placeholder{color:rgba(0,255,159,.3)}
input:focus{outline:none;border-color:#00ff9f!important;box-shadow:0 0 15px rgba(0,255,159,.3)!important}
.scanbtn:hover:not(:disabled){background:#00ff9f!important;color:#0a0a0a!important}
@media(max-width:1023px){.dh{display:none!important}}
@media(min-width:1024px){.mh{display:none!important}}
`}</style>
<div style={{position:"relative",minHeight:"100vh",overflow:"hidden",background:"#0a0a0a"}}>
<MatrixRain/>
<div className="scanline" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1}}/>
<div style={{position:"relative",zIndex:10,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px"}}>
<div className="mh" style={{width:"100%",maxWidth:320,marginBottom:32}}><HackerScene/></div>
<div style={{display:"flex",gap:64,width:"100%",maxWidth:1200,alignItems:"center",justifyContent:"center"}}>

<div style={{flex:1,maxWidth:560,display:"flex",flexDirection:"column",gap:18}}>

<div>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
<svg width="30" height="30" viewBox="0 0 24 24" fill="none">
<path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#00ff9f" strokeWidth="1.5" fill="rgba(0,255,159,0.1)"/>
<path d="M9 12l2 2 4-4" stroke="#00ff9f" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
<h1 style={{fontSize:"clamp(1.4rem,3.5vw,2.1rem)",fontWeight:700,color:"#00ff9f",letterSpacing:"0.1em",textShadow:"0 0 20px rgba(0,255,159,.5)"}}>AI Phishing Detector</h1>
</div>
<p style={{color:"rgba(0,255,159,.4)",fontSize:13,marginLeft:42}}>Analyze URLs for threats in real-time</p>
</div>

<div style={{position:"relative"}}>
<input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleScan()}
placeholder="Enter suspicious URL..."
style={{width:"100%",padding:"14px 44px 14px 18px",background:"#121212",border:"2px solid #1a3a2a",borderRadius:8,fontFamily:"monospace",fontSize:15,color:"#00ff9f",transition:"all .3s"}}/>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)"}}>
<circle cx="11" cy="11" r="7" stroke="rgba(0,255,159,.3)" strokeWidth="1.5"/>
<path d="m21 21-4-4" stroke="rgba(0,255,159,.3)" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
</div>

<button className="scanbtn" onClick={handleScan} disabled={scanning||!url.trim()}
style={{width:"100%",padding:14,borderRadius:8,border:"none",fontFamily:"monospace",fontWeight:700,fontSize:14,letterSpacing:"0.2em",cursor:scanning||!url.trim()?"not-allowed":"pointer",transition:"all .3s",background:scanning||!url.trim()?"#1a1a1a":"#00ff9f",color:scanning||!url.trim()?"rgba(0,255,159,.3)":"#0a0a0a",animation:scanning||!url.trim()?"none":"pulseNeon 2s ease-in-out infinite"}}>
{scanning?"⟳  Scanning...":"⚡  Scan Now"}
</button>

<History history={history} setHistory={setHistory} onSelect={setUrl} show={showHist} setShow={setShowHist}/>

{scanning&&<Terminal onDone={onTermDone}/>}

{error&&<div style={{border:"1px solid #ff444433",borderLeft:"3px solid #ff4444",borderRadius:4,padding:"11px 14px",fontSize:12,color:"#ff4444",fontFamily:"monospace"}}>{error}</div>}

{result&&!scanning&&<Results r={result}/>}

</div>

<div className="dh" style={{flex:1,maxWidth:460,display:"flex",alignItems:"center",justifyContent:"center"}}><HackerScene/></div>

</div>
</div>
</div>
</>
)}
