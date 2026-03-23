import{useState,useCallback,useEffect,useRef}from"react"
import axios from"axios"

const MatrixRain=()=>{
const canvasRef=useRef(null)
useEffect(()=>{
const canvas=canvasRef.current
if(!canvas)return
const ctx=canvas.getContext("2d")
const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resize()
window.addEventListener("resize",resize)
const chars="01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
const fontSize=14
const columns=Math.floor(canvas.width/fontSize)
const drops=Array(columns).fill(1).map(()=>Math.random()*-100)
const draw=()=>{
ctx.fillStyle="rgba(10,10,10,0.05)"
ctx.fillRect(0,0,canvas.width,canvas.height)
ctx.fillStyle="#00ff9f"
ctx.font=`${fontSize}px monospace`
for(let i=0;i<drops.length;i++){
const text=chars[Math.floor(Math.random()*chars.length)]
ctx.globalAlpha=Math.random()*0.5+0.1
ctx.fillText(text,i*fontSize,drops[i]*fontSize)
ctx.globalAlpha=1
if(drops[i]*fontSize>canvas.height&&Math.random()>0.975)drops[i]=0
drops[i]++
}}
const interval=setInterval(draw,50)
return()=>{clearInterval(interval);window.removeEventListener("resize",resize)}
},[])
return <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:0.3}}/>
}

const codeSnippets=["GET /api/phish","SSL: INVALID","DNS: SPOOFED","if(url.sus)","alert('pwned')","chmod 777","nmap -sS","SELECT * FROM","DROP TABLE","0xDEADBEEF"]
const FloatingCode=({delay,x,y})=>{
const[text]=useState(codeSnippets[Math.floor(Math.random()*codeSnippets.length)])
return <span style={{position:"absolute",left:`${x}%`,top:`${y}%`,fontFamily:"monospace",fontSize:11,color:"rgba(0,255,159,0.2)",whiteSpace:"nowrap",pointerEvents:"none",animation:`floatUp 4s ease-in-out infinite`,animationDelay:`${delay}s`}}>{text}</span>
}

const HackerScene=()=>{
const[screenText,setScreenText]=useState("")
const terminalLines=["> scanning network...",">> analyzing packets...",">> checking SSL certs...",">> running AI model...",">> threat detected!",">> quarantining...",">> system secure.",">> _"]
useEffect(()=>{
let lineIdx=0,charIdx=0,current=""
const interval=setInterval(()=>{
if(lineIdx>=terminalLines.length){lineIdx=0;current=""}
const line=terminalLines[lineIdx]
if(charIdx<=line.length){setScreenText(current+line.slice(0,charIdx)+"█");charIdx++}
else{current+=line+"\n";lineIdx++;charIdx=0}
},80)
return()=>clearInterval(interval)
},[])
const floats=Array.from({length:8},(_,i)=>({delay:i*1.2,x:Math.random()*80+10,y:Math.random()*80+10}))
return(
<div style={{position:"relative",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",minHeight:400}}>
{floats.map((p,i)=><FloatingCode key={i} {...p}/>)}
<div style={{animation:"float 3s ease-in-out infinite"}}>
<svg viewBox="0 0 300 350" style={{width:"clamp(14rem,18vw,18rem)",height:"auto",filter:"drop-shadow(0 0 20px rgba(0,255,159,0.4))"}}>
<ellipse cx="150" cy="320" rx="80" ry="30" fill="#111"/>
<path d="M90 200 Q90 320 150 320 Q210 320 210 200 Z" fill="#111" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3"/>
<path d="M85 200 Q85 120 150 100 Q215 120 215 200 Z" fill="#0d0d0d" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3"/>
<ellipse cx="150" cy="170" rx="35" ry="40" fill="#0a0a0a"/>
<ellipse cx="138" cy="162" rx="5" ry="3" fill="#00ff9f" opacity="0.9" style={{animation:"eyePulse 2s infinite"}}/>
<ellipse cx="162" cy="162" rx="5" ry="3" fill="#00ff9f" opacity="0.9" style={{animation:"eyePulse 2s infinite .3s"}}/>
<rect x="100" y="260" width="100" height="6" rx="2" fill="#1a1a1a" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.4"/>
<rect x="110" y="220" width="80" height="42" rx="3" fill="#0a1a0f" stroke="#00ff9f" strokeWidth="1" strokeOpacity="0.6"/>
<rect x="112" y="222" width="76" height="38" rx="2" fill="#050f0a"/>
<foreignObject x="114" y="224" width="72" height="34">
<div style={{fontSize:4,fontFamily:"monospace",color:"#00ff9f",lineHeight:"6px",overflow:"hidden",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{screenText}</div>
</foreignObject>
<ellipse cx="125" cy="258" rx="10" ry="5" fill="#0d0d0d" style={{animation:"armFloat 0.3s ease-in-out infinite"}}/>
<ellipse cx="175" cy="258" rx="10" ry="5" fill="#0d0d0d" style={{animation:"armFloat 0.3s ease-in-out infinite .15s"}}/>
<defs><radialGradient id="sg2" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#00ff9f" stopOpacity="0.15"/><stop offset="100%" stopColor="#00ff9f" stopOpacity="0"/></radialGradient></defs>
</svg>
<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:192,height:32,background:"rgba(0,255,159,0.1)",borderRadius:"50%",filter:"blur(16px)"}}/>
</div>
</div>
)}

const logMessages=["[SYS] Initializing AI scanner...","[NET] Resolving DNS records...","[SSL] Checking certificate validity...","[AI ] Running phishing detection model v3.7...","[DB ] Cross-referencing threat database...","[NET] Analyzing redirect chain...","[AI ] Extracting URL features...","[AI ] Computing risk vector...","[SYS] Generating threat report..."]

const TerminalLogs=({onComplete})=>{
const[lines,setLines]=useState([])
const[currentLine,setCurrentLine]=useState("")
const[lineIndex,setLineIndex]=useState(0)
useEffect(()=>{
if(lineIndex>=logMessages.length){onComplete();return}
const msg=logMessages[lineIndex]
let charIdx=0
const interval=setInterval(()=>{
if(charIdx<=msg.length){setCurrentLine(msg.slice(0,charIdx));charIdx++}
else{setLines(p=>[...p,msg]);setCurrentLine("");setLineIndex(p=>p+1);clearInterval(interval)}
},25)
return()=>clearInterval(interval)
},[lineIndex,onComplete])
return(
<div style={{border:"1px solid #1a3a2a",borderRadius:8,padding:16,background:"rgba(18,18,18,0.5)",fontFamily:"monospace",fontSize:12,maxHeight:240,overflowY:"auto"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,color:"rgba(0,255,159,0.5)"}}>
<div style={{width:8,height:8,borderRadius:"50%",background:"#00ff9f",animation:"pulse 2s infinite"}}/>
<span>AI SCANNER TERMINAL</span>
</div>
{lines.map((l,i)=><div key={i} style={{color:"rgba(0,255,159,0.4)",lineHeight:"24px"}}>{l}</div>)}
{currentLine&&<div style={{color:"#00ff9f",lineHeight:"24px"}}>{currentLine}<span style={{display:"inline-block",width:8,height:16,background:"#00ff9f",marginLeft:2,animation:"blink 1s step-end infinite"}}/></div>}
</div>
)}

const verdictConfig={
safe:{label:"SAFE",color:"#00ff9f",glow:"rgba(0,255,159,0.2)",icon:"🛡️"},
suspicious:{label:"SUSPICIOUS",color:"#ffcc00",glow:"rgba(255,204,0,0.2)",icon:"⚠️"},
dangerous:{label:"DANGEROUS",color:"#ff4444",glow:"rgba(255,68,68,0.2)",icon:"🚫"},
}

const ScanResults=({result})=>{
const verdict=result.verdict==="Dangerous"?"dangerous":result.verdict==="Suspicious"?"suspicious":result.verdict==="Low Risk"?"suspicious":"safe"
const cfg=verdictConfig[verdict]
const flags=result.flags||[]
const ai=result.ai_analysis
return(
<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div style={{border:`1px solid ${cfg.color}33`,borderRadius:8,padding:24,background:`${cfg.color}0a`,boxShadow:`0 0 15px ${cfg.glow}`,animation:"slideIn .5s ease"}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
<span style={{fontSize:28}}>{cfg.icon}</span>
<span style={{fontFamily:"monospace",fontSize:24,fontWeight:700,letterSpacing:"0.1em",color:cfg.color,textShadow:`0 0 10px ${cfg.color}`}}>{result.verdict.toUpperCase()}</span>
<span style={{marginLeft:"auto",fontSize:28,fontWeight:700,color:cfg.color}}>{result.score}<span style={{fontSize:14,opacity:.5}}>/100</span></span>
</div>
<div style={{marginBottom:16}}>
<div style={{width:"100%",height:12,background:"#1a1a1a",borderRadius:999,overflow:"hidden"}}>
<div style={{height:"100%",borderRadius:999,background:cfg.color,boxShadow:`0 0 10px ${cfg.glow}`,width:`${result.score}%`,transition:"width 1.5s ease"}}/>
</div>
</div>
{result.virustotal?.total_engines>0&&(
<div style={{fontSize:11,color:"rgba(0,255,159,0.5)",fontFamily:"monospace",padding:"8px 12px",background:"rgba(0,0,0,0.3)",borderRadius:4}}>
VIRUSTOTAL: <span style={{color:"#ff4444"}}>{result.virustotal.malicious_engines} malicious</span> · <span style={{color:"#ffcc00"}}>{result.virustotal.suspicious_engines} suspicious</span> / {result.virustotal.total_engines} engines
</div>
)}
</div>
{ai&&<div style={{border:"1px solid #00ff9f33",borderRadius:8,padding:20,background:"rgba(0,255,159,0.03)",animation:"slideIn .6s ease .2s both"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00ff9f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
<span style={{fontSize:13,fontWeight:700,color:"#00ff9f",letterSpacing:2}}>GROQ AI ANALYSIS</span>
<span style={{marginLeft:"auto",fontSize:10,color:"rgba(0,255,159,0.4)",border:"1px solid #00ff9f22",padding:"2px 8px",borderRadius:20}}>{ai.confidence}% CONFIDENCE</span>
</div>
<div style={{fontSize:13,color:"rgba(0,255,159,0.8)",lineHeight:1.7,marginBottom:12,padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:6,borderLeft:"3px solid #00ff9f44"}}>{ai.explanation}</div>
{ai.additional_threats&&ai.additional_threats!=="None detected"&&(
<div style={{fontSize:12,color:"#ffcc00",marginBottom:10,padding:"8px 12px",background:"rgba(255,204,0,0.05)",borderRadius:4,borderLeft:"2px solid #ffcc0044"}}>
<span style={{fontWeight:700,letterSpacing:1}}>⚠ ADDITIONAL THREATS: </span>{ai.additional_threats}
</div>
)}
<div style={{fontSize:12,color:"rgba(0,255,159,0.6)",padding:"8px 12px",background:"rgba(0,255,159,0.04)",borderRadius:4,borderLeft:"2px solid #00ff9f33"}}>
<span style={{fontWeight:700,letterSpacing:1}}>RECOMMENDATION: </span>{ai.recommendation}
</div>
</div>}
{flags.length>0&&<div style={{border:"1px solid #ffffff11",borderRadius:8,padding:16,background:"rgba(0,0,0,0.2)",animation:"slideIn .6s ease .3s both"}}>
<p style={{fontSize:11,color:"rgba(0,255,159,0.4)",marginBottom:10,fontFamily:"monospace",letterSpacing:3}}>RULE-BASED FLAGS — {flags.length} DETECTED</p>
<ul style={{listStyle:"none",padding:0,margin:0}}>
{flags.map((flag,i)=>(
<li key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:12,fontFamily:"monospace",marginBottom:8,padding:"8px 10px",background:flag.risk==="high"?"rgba(255,68,68,0.07)":flag.risk==="medium"?"rgba(255,204,0,0.05)":"rgba(0,255,159,0.05)",borderLeft:`2px solid ${flag.risk==="high"?"#ff4444":flag.risk==="medium"?"#ffcc00":"#00ff9f"}`,borderRadius:3}}>
<span style={{color:flag.risk==="high"?"#ff4444":flag.risk==="medium"?"#ffcc00":"#00ff9f",flexShrink:0}}>{flag.risk==="high"?"⚠":"◆"}</span>
<div>
<span style={{fontWeight:700,color:flag.risk==="high"?"#ff4444":flag.risk==="medium"?"#ffcc00":"#00ff9f"}}>{flag.check}</span>
<span style={{color:"rgba(255,255,255,0.3)",marginLeft:6}}>— {flag.detail}</span>
</div>
</li>
))}
</ul>
</div>}
</div>
)}

export default function App(){
const[url,setUrl]=useState("")
const[scanning,setScanning]=useState(false)
const[result,setResult]=useState(null)
const[error,setError]=useState("")
const[logsComplete,setLogsComplete]=useState(false)
const[history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("scanHistory"))||[]}catch{return[]}})
const[showHistory,setShowHistory]=useState(false)
const pendingResult=useRef(null)
const terminalDone=useRef(false)
const backendDone=useRef(false)

const showResult=useCallback((res,hist)=>{
setScanning(false)
if(!res||res==="error"){setError("Connection failed. Try again.");return}
setResult(res)
const newScan={url:res.url||"unknown",score:res.score,verdict:res.verdict,timestamp:new Date().toLocaleString(),id:Date.now()}
const updated=[newScan,...hist].slice(0,20)
setHistory(updated)
try{localStorage.setItem("scanHistory",JSON.stringify(updated))}catch(e){console.log(e)}
},[])

const handleScan=useCallback(async()=>{
if(!url.trim())return
const trimmed=url.trim()
const isJustNumbers=/^\d+$/.test(trimmed)
const isJustWords=/^[a-zA-Z\s]+$/.test(trimmed)
const hasProtocol=trimmed.startsWith("http://")||trimmed.startsWith("https://")
const hasDot=trimmed.includes(".")
if(isJustNumbers||isJustWords||(!hasProtocol&&!hasDot)){
setError("⚠ Invalid input! Please enter a valid URL like https://example.com")
setResult(null)
return
}
setResult(null)
setError("")
setLogsComplete(false)
setScanning(true)
pendingResult.current=null
terminalDone.current=false
backendDone.current=false
const currentHistory=[...history]
try{
const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url},{timeout:90000})
pendingResult.current=res.data
}catch{pendingResult.current="error"}
backendDone.current=true
if(terminalDone.current)showResult(pendingResult.current,currentHistory)
},[url,history,showResult])

const handleLogsComplete=useCallback(()=>{
terminalDone.current=true
const currentHistory=[...history]
if(backendDone.current)showResult(pendingResult.current,currentHistory)
},[history,showResult])

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
@keyframes floatUp{0%{opacity:0;transform:translateY(10px)}50%{opacity:.6}100%{opacity:0;transform:translateY(-40px)}}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseNeon{0%,100%{box-shadow:0 0 10px rgba(0,255,159,.5),0 0 40px rgba(0,255,159,.2)}50%{box-shadow:0 0 20px rgba(0,255,159,.8),0 0 60px rgba(0,255,159,.4)}}
.scanline{background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,159,.03) 2px,rgba(0,255,159,.03) 4px)}
input::placeholder{color:rgba(0,255,159,.3)}
input:focus{outline:none;border-color:#00ff9f!important;box-shadow:0 0 10px rgba(0,255,159,.5),0 0 40px rgba(0,255,159,.2),inset 0 0 20px rgba(0,255,159,.05)!important}
.scanbtn:hover{background:#00ff9f!important;color:#0a0a0a!important}
.histrow:hover{background:rgba(0,255,159,0.06)!important}
@media(max-width:1023px){.desktop-hacker{display:none!important}}
@media(min-width:1024px){.mobile-hacker{display:none!important}}
`}</style>
<div style={{position:"relative",minHeight:"100vh",overflow:"hidden",background:"#0a0a0a"}}>
<MatrixRain/>
<div className="scanline" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1}}/>
<div style={{position:"relative",zIndex:10,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 24px",gap:32}}>
<div className="mobile-hacker" style={{width:"100%",maxWidth:320}}><HackerScene/></div>
<div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:64,width:"100%",maxWidth:1200}}>
<div style={{flex:1,maxWidth:560,width:"100%"}}>
<div style={{display:"flex",flexDirection:"column",gap:24}}>

<div style={{animation:"slideIn .6s ease"}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
<path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#00ff9f" strokeWidth="1.5" fill="rgba(0,255,159,0.1)"/>
<path d="M9 12l2 2 4-4" stroke="#00ff9f" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
<h1 style={{fontSize:"clamp(1.5rem,4vw,2.25rem)",fontWeight:700,color:"#00ff9f",letterSpacing:"0.1em",textShadow:"0 0 7px rgba(0,255,159,.8),0 0 20px rgba(0,255,159,.4)"}}>
AI Phishing Detector
</h1>
</div>
<p style={{color:"rgba(0,255,159,.4)",fontSize:14,marginLeft:44}}>Analyze URLs for threats in real-time</p>
</div>

<div style={{animation:"slideIn .5s ease .2s both"}}>
<div style={{position:"relative",marginBottom:12}}>
<input type="text" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleScan()}
placeholder="Enter suspicious URL..."
style={{width:"100%",padding:"16px 48px 16px 20px",background:"#121212",border:"2px solid #1a3a2a",borderRadius:8,fontFamily:"monospace",fontSize:16,color:"#00ff9f",transition:"all .3s"}}/>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)"}}>
<circle cx="11" cy="11" r="7" stroke="rgba(0,255,159,.3)" strokeWidth="1.5"/>
<path d="m21 21-4-4" stroke="rgba(0,255,159,.3)" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
</div>
<button className="scanbtn" onClick={handleScan} disabled={scanning||!url.trim()}
style={{width:"100%",padding:16,borderRadius:8,border:"none",fontFamily:"monospace",fontWeight:700,fontSize:14,letterSpacing:"0.2em",cursor:scanning||!url.trim()?"not-allowed":"pointer",transition:"all .3s",background:scanning||!url.trim()?"#1a1a1a":"#00ff9f",color:scanning||!url.trim()?"rgba(0,255,159,.3)":"#0a0a0a",animation:scanning||!url.trim()?"none":"pulseNeon 2s ease-in-out infinite"}}>
{scanning?"⟳  Scanning...":"⚡  Scan Now"}
</button>
</div>

{history.length>0&&<div style={{animation:"slideIn .3s ease"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(0,255,159,0.04)",border:"1px solid #00ff9f33",borderRadius:showHistory?"8px 8px 0 0":"8px",cursor:"pointer"}} onClick={()=>setShowHistory(s=>!s)}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:10,color:"#00ff9f"}}>{showHistory?"▲":"▼"}</span>
<span style={{fontSize:11,color:"rgba(0,255,159,0.8)",fontFamily:"monospace",letterSpacing:2}}>SCAN HISTORY — {history.length} SCANS</span>
</div>
<button onClick={e=>{e.stopPropagation();setHistory([]);localStorage.removeItem("scanHistory");setShowHistory(false)}}
style={{background:"transparent",border:"1px solid #ff444433",borderRadius:3,color:"#ff4444",fontSize:10,padding:"2px 8px",cursor:"pointer",fontFamily:"monospace"}}>
CLEAR
</button>
</div>
{showHistory&&<div style={{border:"1px solid #00ff9f22",borderTop:"none",borderRadius:"0 0 8px 8px",background:"rgba(0,0,0,0.6)",maxHeight:260,overflowY:"auto"}}>
{history.map(h=>(
<div key={h.id} className="histrow" onClick={()=>{setUrl(h.url);setShowHistory(false)}}
style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #00ff9f0a",cursor:"pointer",transition:"all .15s"}}>
<div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f"}}/>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,color:"rgba(0,255,159,0.85)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.url}</div>
<div style={{fontSize:9,color:"rgba(0,255,159,0.3)",marginTop:2,letterSpacing:1}}>{h.timestamp}</div>
</div>
<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0,gap:1}}>
<span style={{fontSize:11,fontWeight:700,color:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f",fontFamily:"monospace"}}>{h.score}/100</span>
<span style={{fontSize:9,color:h.verdict==="Dangerous"?"#ff4444":h.verdict==="Suspicious"||h.verdict==="Low Risk"?"#ffcc00":"#00ff9f",letterSpacing:1}}>{h.verdict.toUpperCase()}</span>
</div>
</div>
))}
</div>}
</div>}

{scanning&&<TerminalLogs onComplete={handleLogsComplete}/>}
{error&&<div style={{border:"1px solid #ff444433",borderLeft:"3px solid #ff4444",borderRadius:4,padding:"12px 16px",fontSize:12,color:"#ff4444",fontFamily:"monospace",letterSpacing:1}}>{error}</div>}
{result&&!scanning&&<ScanResults result={result}/>}

</div>
</div>
<div className="desktop-hacker" style={{flex:1,maxWidth:480,display:"flex",alignItems:"center",justifyContent:"center"}}><HackerScene/></div>
</div>
</div>
</div>
</>
)}
