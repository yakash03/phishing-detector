import{useState,useCallback,useEffect,useRef}from"react"
import axios from"axios"
import{auth,googleProvider,signInWithPopup,signInWithPhoneNumber,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,RecaptchaVerifier}from"./firebase"

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

const sendNotification=(verdict,score,url)=>{
if(!("Notification" in window))return
const fire=()=>{
new Notification(
verdict==="Dangerous"?"🚫 DANGEROUS URL DETECTED!":"⚠️ Suspicious URL Detected",
{body:`Risk Score: ${score}/100\n${url}`,tag:"phishing-alert",requireInteraction:verdict==="Dangerous"}
)}
if(Notification.permission==="granted")fire()
else if(Notification.permission!=="denied"){
Notification.requestPermission().then(p=>{if(p==="granted")fire()})
}
}

const NotificationButton=()=>{
const[perm,setPerm]=useState(typeof Notification!=="undefined"?Notification.permission:"denied")
if(perm==="granted")return(
<div style={{marginLeft:44,marginTop:6,display:"flex",alignItems:"center",gap:6,fontSize:11,color:"rgba(0,255,159,0.5)"}}>
<span style={{width:6,height:6,borderRadius:"50%",background:"#00ff9f",display:"inline-block",animation:"pulse 2s infinite"}}/>
<span>Threat alerts enabled</span>
</div>
)
if(perm==="denied")return null
return(
<button onClick={()=>Notification.requestPermission().then(p=>setPerm(p))}
style={{marginLeft:44,marginTop:6,padding:"4px 12px",background:"transparent",border:"1px solid #00ff9f44",borderRadius:4,color:"rgba(0,255,159,0.6)",fontSize:11,fontFamily:"monospace",cursor:"pointer",letterSpacing:1}}>
🔔 ENABLE THREAT ALERTS
</button>
)}

function extractUrls(text){
const regex=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
return[...new Set(text.match(regex)||[])]
}

const EmailChecker=({emailHistory,setEmailHistory})=>{
const[emailText,setEmailText]=useState("")
const[scanning,setScanning]=useState(false)
const[results,setResults]=useState([])
const[error,setError]=useState("")
const[progress,setProgress]=useState(0)
const[summary,setSummary]=useState("")
const[showEmailHistory,setShowEmailHistory]=useState(false)

const scanEmail=async()=>{
const urls=extractUrls(emailText)
if(urls.length===0){setError("No URLs found in the email text.");return}
setScanning(true);setResults([]);setError("");setSummary("");setProgress(0)
const scanned=[]
for(let i=0;i<urls.length;i++){
const url=urls[i]
setProgress(Math.round(((i+1)/urls.length)*100))
try{
const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url},{timeout:30000})
scanned.push({url,score:res.data.score,verdict:res.data.verdict,flags:res.data.flags||[],ai:res.data.ai_analysis})
}catch{scanned.push({url,score:0,verdict:"Error",flags:[],ai:null})}
setResults([...scanned])
}
setScanning(false)
const dangerous=scanned.filter(r=>r.verdict==="Dangerous").length
const suspicious=scanned.filter(r=>r.verdict==="Suspicious"||r.verdict==="Low Risk").length
const total=scanned.length
let summaryText=""
if(dangerous>0)summaryText=`⚠ HIGH RISK — ${dangerous}/${total} URLs are DANGEROUS. Do NOT click any links!`
else if(suspicious>0)summaryText=`⚡ SUSPICIOUS — ${suspicious}/${total} URLs look suspicious. Verify the sender.`
else summaryText=`✓ SAFE — All ${total} URLs scanned clean. No phishing detected.`
setSummary(summaryText)
const newEntry={id:Date.now(),timestamp:new Date().toLocaleString(),totalUrls:total,dangerous,suspicious,safe:total-dangerous-suspicious,summary:summaryText}
const updated=[newEntry,...emailHistory].slice(0,15)
setEmailHistory(updated)
try{localStorage.setItem("emailHistory",JSON.stringify(updated))}catch(e){}
}

const urls=extractUrls(emailText)
const dangerCount=results.filter(r=>r.verdict==="Dangerous").length
const overallColor=dangerCount>0?"#ff4444":results.some(r=>r.verdict==="Suspicious"||r.verdict==="Low Risk")?"#ffcc00":"#00ff9f"

return(
<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div style={{background:"rgba(0,255,159,0.03)",border:"1px solid #00ff9f22",borderRadius:8,padding:16}}>
<div style={{fontSize:10,color:"rgba(0,255,159,0.5)",letterSpacing:3,marginBottom:10,fontFamily:"monospace"}}>[ PASTE EMAIL CONTENT BELOW ]</div>
<textarea value={emailText} onChange={e=>setEmailText(e.target.value)}
placeholder="Paste the full email text here including all links..."
style={{width:"100%",minHeight:160,padding:"12px",background:"#121212",border:"1px solid #1a3a2a",borderRadius:6,fontFamily:"monospace",fontSize:12,color:"#00ff9f",resize:"vertical",outline:"none",lineHeight:1.6}}/>
{emailText&&<div style={{marginTop:8,fontSize:11,color:"rgba(0,255,159,0.5)",fontFamily:"monospace"}}>
{urls.length>0?`${urls.length} URL${urls.length>1?"s":""} detected`:"No URLs detected yet"}
</div>}
</div>
<button onClick={scanEmail} disabled={scanning||!emailText.trim()||urls.length===0}
style={{width:"100%",padding:14,borderRadius:8,border:"none",fontFamily:"monospace",fontWeight:700,fontSize:14,letterSpacing:"0.2em",cursor:scanning||!emailText.trim()||urls.length===0?"not-allowed":"pointer",transition:"all .3s",background:scanning||!emailText.trim()||urls.length===0?"#1a1a1a":"#00ff9f",color:scanning||!emailText.trim()||urls.length===0?"rgba(0,255,159,.3)":"#0a0a0a",animation:scanning||!emailText.trim()||urls.length===0?"none":"pulseNeon 2s ease-in-out infinite"}}>
{scanning?`⟳ Scanning... ${progress}%`:`⚡ Scan Email (${urls.length} URL${urls.length!==1?"s":""})`}
</button>
{scanning&&<div style={{background:"rgba(0,0,0,0.4)",border:"1px solid #00ff9f22",borderRadius:8,padding:14}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:11,color:"rgba(0,255,159,0.6)",fontFamily:"monospace"}}>
<span>SCANNING URLS...</span><span>{progress}%</span>
</div>
<div style={{background:"#1a1a1a",borderRadius:999,height:6,overflow:"hidden"}}>
<div style={{width:`${progress}%`,height:"100%",background:"#00ff9f",borderRadius:999,transition:"width .3s ease"}}/>
</div>
</div>}
{error&&<div style={{border:"1px solid #ff444433",borderLeft:"3px solid #ff4444",borderRadius:4,padding:"11px 14px",fontSize:12,color:"#ff4444",fontFamily:"monospace"}}>{error}</div>}
{summary&&<div style={{border:`1px solid ${overallColor}44`,borderRadius:8,padding:"14px 16px",background:`${overallColor}0a`,fontSize:13,color:overallColor,fontFamily:"monospace",fontWeight:700,letterSpacing:1,textAlign:"center",boxShadow:`0 0 20px ${overallColor}22`}}>{summary}</div>}
{results.length>0&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
<div style={{fontSize:10,color:"rgba(0,255,159,0.4)",letterSpacing:3,fontFamily:"monospace"}}>URL RESULTS — {results.length} SCANNED</div>
{results.map((r,i)=>{
const vk=r.verdict==="Dangerous"?"dangerous":r.verdict==="Suspicious"||r.verdict==="Low Risk"?"suspicious":"safe"
const v=verdictConfig[vk]||verdictConfig.safe
return(
<div key={i} style={{border:`1px solid ${v.color}22`,borderLeft:`3px solid ${v.color}`,borderRadius:8,padding:"12px 14px",background:`${v.color}08`}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
<span style={{fontSize:16}}>{v.icon}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,color:"rgba(0,255,159,0.7)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.url}</div>
</div>
<div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
<span style={{fontSize:13,fontWeight:700,color:v.color,fontFamily:"monospace"}}>{r.score}/100</span>
<span style={{fontSize:11,color:v.color,border:`1px solid ${v.color}44`,padding:"1px 8px",borderRadius:20,fontFamily:"monospace"}}>{r.verdict.toUpperCase()}</span>
</div>
</div>
<div style={{background:"#1a1a1a",borderRadius:999,height:5,overflow:"hidden",marginBottom:8}}>
<div style={{width:`${r.score}%`,height:"100%",background:v.color,borderRadius:999,transition:"width 1s ease"}}/>
</div>
{r.ai&&<div style={{fontSize:12,color:"rgba(0,255,159,0.6)",lineHeight:1.6,padding:"8px 10px",background:"rgba(0,0,0,0.3)",borderRadius:4,borderLeft:"2px solid #00ff9f22"}}>
<span style={{color:"#00ff9f",fontWeight:700}}>AI: </span>{r.ai.explanation}
</div>}
{r.flags.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
{r.flags.slice(0,3).map((f,j)=><span key={j} style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:f.risk==="high"?"rgba(255,68,68,0.15)":"rgba(255,204,0,0.1)",color:f.risk==="high"?"#ff4444":"#ffcc00",fontFamily:"monospace"}}>{f.check}</span>)}
{r.flags.length>3&&<span style={{fontSize:10,color:"rgba(0,255,159,0.4)",padding:"2px 8px"}}>+{r.flags.length-3} more</span>}
</div>}
</div>
)})}
</div>}

{emailHistory.length>0&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(0,255,159,0.04)",border:"1px solid #00ff9f33",borderRadius:showEmailHistory?"8px 8px 0 0":"8px",cursor:"pointer"}} onClick={()=>setShowEmailHistory(s=>!s)}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:10,color:"#00ff9f"}}>{showEmailHistory?"▲":"▼"}</span>
<span style={{fontSize:11,color:"rgba(0,255,159,0.8)",fontFamily:"monospace",letterSpacing:2}}>EMAIL SCAN HISTORY — {emailHistory.length}</span>
</div>
<button onClick={e=>{e.stopPropagation();setEmailHistory([]);localStorage.removeItem("emailHistory");setShowEmailHistory(false)}}
style={{background:"transparent",border:"1px solid #ff444433",borderRadius:3,color:"#ff4444",fontSize:10,padding:"2px 8px",cursor:"pointer",fontFamily:"monospace"}}>
CLEAR
</button>
</div>
{showEmailHistory&&<div style={{border:"1px solid #00ff9f22",borderTop:"none",borderRadius:"0 0 8px 8px",background:"rgba(0,0,0,0.6)",maxHeight:280,overflowY:"auto"}}>
{emailHistory.map(h=>(
<div key={h.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #00ff9f0a"}}>
<div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:h.dangerous>0?"#ff4444":h.suspicious>0?"#ffcc00":"#00ff9f"}}/>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,color:"rgba(0,255,159,0.85)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.summary}</div>
<div style={{fontSize:9,color:"rgba(0,255,159,0.3)",marginTop:2,letterSpacing:1}}>{h.timestamp}</div>
</div>
<div style={{display:"flex",gap:6,flexShrink:0}}>
{h.dangerous>0&&<span style={{fontSize:10,color:"#ff4444",fontFamily:"monospace",border:"1px solid #ff444433",padding:"1px 6px",borderRadius:10}}>{h.dangerous} 🚫</span>}
{h.suspicious>0&&<span style={{fontSize:10,color:"#ffcc00",fontFamily:"monospace",border:"1px solid #ffcc0033",padding:"1px 6px",borderRadius:10}}>{h.suspicious} ⚠</span>}
<span style={{fontSize:10,color:"rgba(0,255,159,0.5)",fontFamily:"monospace",border:"1px solid #00ff9f22",padding:"1px 6px",borderRadius:10}}>{h.totalUrls} URLs</span>
</div>
</div>
))}
</div>}
</div>}
</div>
)}

const QRScanner=({onURLFound})=>{
const[dragging,setDragging]=useState(false)
const[qrError,setQrError]=useState("")
const[qrLoading,setQrLoading]=useState(false)
const[qrSuccess,setQrSuccess]=useState("")
const fileRef=useRef(null)

const scanQR=async(file)=>{
if(!file)return
setQrLoading(true);setQrError("");setQrSuccess("")
const img=new Image()
const objectUrl=URL.createObjectURL(file)
img.onload=async()=>{
const canvas=document.createElement("canvas")
canvas.width=img.width;canvas.height=img.height
const ctx=canvas.getContext("2d")
ctx.drawImage(img,0,0)
const imageData=ctx.getImageData(0,0,canvas.width,canvas.height)
try{
const jsQR=(await import("jsqr")).default
const code=jsQR(imageData.data,imageData.width,imageData.height)
if(code&&code.data){
setQrSuccess("✅ QR decoded: "+code.data.slice(0,40)+(code.data.length>40?"...":""))
onURLFound(code.data)
}else{setQrError("⚠ No QR code detected. Try a clearer image.")}
}catch(e){setQrError("⚠ QR scan failed.")}
setQrLoading(false);URL.revokeObjectURL(objectUrl)
}
img.onerror=()=>{setQrError("⚠ Could not read image file.");setQrLoading(false)}
img.src=objectUrl
}

const handleDrop=e=>{
e.preventDefault();setDragging(false)
const file=e.dataTransfer.files[0]
if(file&&file.type.startsWith("image/"))scanQR(file)
else setQrError("⚠ Please drop an image file.")
}

const handleFile=e=>{
const file=e.target.files[0]
if(file)scanQR(file)
e.target.value=""
}

return(
<div style={{animation:"slideIn .4s ease"}}>
<p style={{fontSize:11,color:"rgba(0,255,159,0.4)",fontFamily:"monospace",letterSpacing:2,marginBottom:8}}>▣ OR SCAN A QR CODE</p>
<div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop} onClick={()=>fileRef.current.click()}
style={{border:`2px dashed ${dragging?"#00ff9f":"#1a3a2a"}`,borderRadius:8,padding:"20px 16px",textAlign:"center",cursor:"pointer",background:dragging?"rgba(0,255,159,0.07)":"rgba(0,0,0,0.2)",transition:"all .3s"}}>
<input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
{qrLoading?(
<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
<div style={{width:10,height:10,borderRadius:"50%",background:"#00ff9f",animation:"pulse 1s infinite"}}/>
<span style={{fontSize:12,color:"rgba(0,255,159,0.6)",fontFamily:"monospace",letterSpacing:2}}>DECODING QR...</span>
</div>
):(
<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
<svg width="36" height="36" viewBox="0 0 24 24" fill="none">
<rect x="3" y="3" width="7" height="7" rx="1" stroke="#00ff9f" strokeWidth="1.5" strokeOpacity="0.6"/>
<rect x="14" y="3" width="7" height="7" rx="1" stroke="#00ff9f" strokeWidth="1.5" strokeOpacity="0.6"/>
<rect x="3" y="14" width="7" height="7" rx="1" stroke="#00ff9f" strokeWidth="1.5" strokeOpacity="0.6"/>
<rect x="5" y="5" width="3" height="3" fill="#00ff9f" fillOpacity="0.5"/>
<rect x="16" y="5" width="3" height="3" fill="#00ff9f" fillOpacity="0.5"/>
<rect x="5" y="16" width="3" height="3" fill="#00ff9f" fillOpacity="0.5"/>
<rect x="14" y="14" width="3" height="3" rx="0.5" fill="#00ff9f" fillOpacity="0.4"/>
<rect x="18" y="14" width="3" height="3" rx="0.5" fill="#00ff9f" fillOpacity="0.4"/>
<rect x="14" y="18" width="3" height="3" rx="0.5" fill="#00ff9f" fillOpacity="0.4"/>
<rect x="18" y="18" width="3" height="3" rx="0.5" fill="#00ff9f" fillOpacity="0.4"/>
</svg>
<span style={{fontSize:13,color:"rgba(0,255,159,0.7)",fontFamily:"monospace",letterSpacing:1}}>DROP QR IMAGE HERE</span>
<span style={{fontSize:10,color:"rgba(0,255,159,0.3)",fontFamily:"monospace"}}>or click to upload · PNG JPG WEBP</span>
</div>
)}
</div>
{qrSuccess&&<div style={{marginTop:8,border:"1px solid #00ff9f33",borderLeft:"3px solid #00ff9f",borderRadius:4,padding:"8px 12px",fontSize:11,color:"#00ff9f",fontFamily:"monospace"}}>{qrSuccess}</div>}
{qrError&&<div style={{marginTop:8,border:"1px solid #ff444433",borderLeft:"3px solid #ff4444",borderRadius:4,padding:"8px 12px",fontSize:11,color:"#ff4444",fontFamily:"monospace"}}>{qrError}</div>}
</div>
)}

const AuthScreen=({onLogin})=>{
const[mode,setMode]=useState("login")
const[email,setEmail]=useState("")
const[password,setPassword]=useState("")
const[phone,setPhone]=useState("")
const[otp,setOtp]=useState("")
const[otpSent,setOtpSent]=useState(false)
const[confirmObj,setConfirmObj]=useState(null)
const[loading,setLoading]=useState(false)
const[error,setError]=useState("")

const inputStyle={width:"100%",padding:"14px 18px",background:"#121212",border:"2px solid #1a3a2a",borderRadius:8,fontFamily:"monospace",fontSize:14,color:"#00ff9f",transition:"all .3s",marginBottom:12,outline:"none"}
const btnStyle={width:"100%",padding:14,borderRadius:8,border:"none",fontFamily:"monospace",fontWeight:700,fontSize:13,letterSpacing:"0.15em",cursor:"pointer",transition:"all .3s",background:"#00ff9f",color:"#0a0a0a",marginTop:4}
const ghostBtn={width:"100%",padding:12,borderRadius:8,border:"1px solid #00ff9f44",background:"transparent",fontFamily:"monospace",fontSize:12,color:"rgba(0,255,159,0.7)",cursor:"pointer",transition:"all .3s",letterSpacing:"0.1em"}

const handleEmailAuth=async()=>{
if(!email||!password){setError("⚠ Fill in email and password");return}
setLoading(true);setError("")
try{
if(mode==="register"){await createUserWithEmailAndPassword(auth,email,password)}
else{await signInWithEmailAndPassword(auth,email,password)}
onLogin(auth.currentUser)
}catch(e){setError("⚠ "+e.message.replace("Firebase: ","").replace(/\(auth.*\)/,"").trim())}
setLoading(false)
}

const handleGoogle=async()=>{
setLoading(true);setError("")
try{await signInWithPopup(auth,googleProvider);onLogin(auth.currentUser)}
catch(e){setError("⚠ Google sign-in failed. "+e.message.replace("Firebase: ",""))}
setLoading(false)
}

const setupRecaptcha=()=>{
try{
if(window.recaptchaVerifier){window.recaptchaVerifier.clear();window.recaptchaVerifier=null}
window.recaptchaVerifier=new RecaptchaVerifier(auth,"recaptcha-container",{size:"invisible"})
}catch(e){window.recaptchaVerifier=null}
}

const handleSendOTP=async()=>{
if(!phone){setError("⚠ Enter a valid phone number with country code");return}
setLoading(true);setError("")
try{
setupRecaptcha()
const confirmation=await signInWithPhoneNumber(auth,phone,window.recaptchaVerifier)
setConfirmObj(confirmation);setOtpSent(true)
}catch(e){
setError("⚠ "+e.message.replace("Firebase: ","").replace(/\(auth.*\)/,"").trim())
try{if(window.recaptchaVerifier){window.recaptchaVerifier.clear();window.recaptchaVerifier=null}}catch(_){}
}
setLoading(false)
}

const handleVerifyOTP=async()=>{
if(!otp){setError("⚠ Enter the OTP");return}
setLoading(true);setError("")
try{await confirmObj.confirm(otp);onLogin(auth.currentUser)}
catch(e){setError("⚠ Invalid OTP. Try again.")}
setLoading(false)
}

return(
<div style={{position:"relative",zIndex:10,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px"}}>
<div id="recaptcha-container"/>
<div style={{width:"100%",maxWidth:420,animation:"slideIn .6s ease"}}>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32,justifyContent:"center"}}>
<svg width="36" height="36" viewBox="0 0 24 24" fill="none">
<path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#00ff9f" strokeWidth="1.5" fill="rgba(0,255,159,0.1)"/>
<path d="M9 12l2 2 4-4" stroke="#00ff9f" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
<h1 style={{fontSize:"1.8rem",fontWeight:700,color:"#00ff9f",letterSpacing:"0.1em",textShadow:"0 0 7px rgba(0,255,159,.8),0 0 20px rgba(0,255,159,.4)",fontFamily:"monospace"}}>AI Phishing Detector</h1>
</div>
<div style={{border:"1px solid #1a3a2a",borderRadius:12,padding:32,background:"rgba(12,18,14,0.85)",backdropFilter:"blur(12px)",boxShadow:"0 0 40px rgba(0,255,159,0.06)"}}>
{mode!=="phone"&&(
<div style={{display:"flex",gap:0,marginBottom:28,border:"1px solid #1a3a2a",borderRadius:6,overflow:"hidden"}}>
{["login","register"].map(m=>(
<button key={m} onClick={()=>{setMode(m);setError("")}}
style={{flex:1,padding:"10px 0",background:mode===m?"rgba(0,255,159,0.1)":"transparent",border:"none",fontFamily:"monospace",fontSize:12,color:mode===m?"#00ff9f":"rgba(0,255,159,0.4)",cursor:"pointer",letterSpacing:2,transition:"all .2s",borderBottom:mode===m?"2px solid #00ff9f":"2px solid transparent"}}>
{m.toUpperCase()}
</button>
))}
</div>
)}
{mode==="phone"&&(
<div style={{marginBottom:24}}>
<button onClick={()=>{setMode("login");setOtpSent(false);setError("")}} style={{background:"transparent",border:"none",color:"rgba(0,255,159,0.5)",fontFamily:"monospace",fontSize:12,cursor:"pointer",padding:0,letterSpacing:1}}>← BACK</button>
<p style={{fontSize:16,fontWeight:700,color:"#00ff9f",fontFamily:"monospace",marginTop:8,letterSpacing:2}}>PHONE LOGIN</p>
</div>
)}
{mode!=="phone"&&(
<>
<input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleEmailAuth()} style={inputStyle}/>
<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleEmailAuth()} style={{...inputStyle,marginBottom:20}}/>
<button onClick={handleEmailAuth} disabled={loading} className="scanbtn" style={{...btnStyle,opacity:loading?.6:1,animation:loading?"none":"pulseNeon 2s ease-in-out infinite"}}>
{loading?"⟳  Please wait...":(mode==="register"?"⚡  CREATE ACCOUNT":"⚡  LOGIN")}
</button>
<div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
<div style={{flex:1,height:1,background:"#1a3a2a"}}/>
<span style={{fontSize:11,color:"rgba(0,255,159,0.3)",fontFamily:"monospace",letterSpacing:2}}>OR</span>
<div style={{flex:1,height:1,background:"#1a3a2a"}}/>
</div>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
<button onClick={handleGoogle} disabled={loading} className="gbtn" style={ghostBtn}><span style={{marginRight:8}}>G</span> CONTINUE WITH GOOGLE</button>
<button onClick={()=>{setMode("phone");setError("")}} style={ghostBtn}>📱 CONTINUE WITH PHONE</button>
</div>
</>
)}
{mode==="phone"&&!otpSent&&(
<>
<p style={{fontSize:11,color:"rgba(0,255,159,0.4)",fontFamily:"monospace",marginBottom:12,letterSpacing:1}}>Enter number with country code (e.g. +91XXXXXXXXXX)</p>
<input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSendOTP()} style={inputStyle}/>
<button onClick={handleSendOTP} disabled={loading} className="scanbtn" style={{...btnStyle,animation:loading?"none":"pulseNeon 2s ease-in-out infinite",opacity:loading?.6:1}}>
{loading?"⟳  Sending OTP...":"📨  SEND OTP"}
</button>
</>
)}
{mode==="phone"&&otpSent&&(
<>
<p style={{fontSize:11,color:"rgba(0,255,159,0.5)",fontFamily:"monospace",marginBottom:12,letterSpacing:1}}>OTP sent to {phone}</p>
<input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleVerifyOTP()} style={inputStyle} maxLength={6}/>
<button onClick={handleVerifyOTP} disabled={loading} className="scanbtn" style={{...btnStyle,animation:loading?"none":"pulseNeon 2s ease-in-out infinite",opacity:loading?.6:1}}>
{loading?"⟳  Verifying...":"✅  VERIFY OTP"}
</button>
<button onClick={()=>{setOtpSent(false);setOtp("")}} style={{...ghostBtn,marginTop:8}}>↩ RESEND OTP</button>
</>
)}
{error&&(
<div style={{marginTop:16,border:"1px solid #ff444433",borderLeft:"3px solid #ff4444",borderRadius:4,padding:"10px 14px",fontSize:12,color:"#ff4444",fontFamily:"monospace",animation:"slideIn .3s ease"}}>{error}</div>
)}
</div>
<p style={{textAlign:"center",marginTop:16,fontSize:10,color:"rgba(0,255,159,0.2)",fontFamily:"monospace",letterSpacing:1}}>SECURED BY FIREBASE AUTH · END-TO-END ENCRYPTED</p>
</div>
</div>
)}

export default function App(){
const[user,setUser]=useState(undefined)
const[tab,setTab]=useState("url")
const[url,setUrl]=useState("")
const[scanning,setScanning]=useState(false)
const[result,setResult]=useState(null)
const[error,setError]=useState("")
const[logsComplete,setLogsComplete]=useState(false)
const[history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("scanHistory"))||[]}catch{return[]}})
const[showHistory,setShowHistory]=useState(false)
const[emailHistory,setEmailHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("emailHistory"))||[]}catch{return[]}})
const pendingResult=useRef(null)
const terminalDone=useRef(false)
const backendDone=useRef(false)

useEffect(()=>{
const unsub=auth.onAuthStateChanged(u=>setUser(u||null))
return unsub
},[])

const handleLogout=async()=>{
await signOut(auth)
setResult(null);setUrl("");setHistory([]);setEmailHistory([])
}

const showResult=useCallback((res,hist)=>{
setScanning(false)
if(!res||res==="error"){setError("Connection failed. Try again.");return}
setResult(res)
const newScan={url:res.url||"unknown",score:res.score,verdict:res.verdict,timestamp:new Date().toLocaleString(),id:Date.now()}
const updated=[newScan,...hist].slice(0,20)
setHistory(updated)
try{localStorage.setItem("scanHistory",JSON.stringify(updated))}catch(e){console.log(e)}
if(res.verdict==="Dangerous"||res.verdict==="Suspicious"){sendNotification(res.verdict,res.score,res.url||url)}
},[url])

const handleScan=useCallback(async()=>{
if(!url.trim())return
const trimmed=url.trim()
const isJustNumbers=new RegExp("^\\d+$").test(trimmed)
const isJustWords=new RegExp("^[a-zA-Z\\s]+$").test(trimmed)
const hasProtocol=trimmed.startsWith("http://")||trimmed.startsWith("https://")
const hasDot=trimmed.includes(".")
if(isJustNumbers||isJustWords||(!hasProtocol&&!hasDot)){
setError("⚠ Invalid input! Please enter a valid URL like https://example.com")
setResult(null);return
}
setResult(null);setError("");setLogsComplete(false);setScanning(true)
pendingResult.current=null;terminalDone.current=false;backendDone.current=false
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

if(user===undefined){
return(
<>
<style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#0a0a0a;color:#00ff9f;font-family:monospace}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
<div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}>
<MatrixRain/>
<div style={{zIndex:10,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
<div style={{width:12,height:12,borderRadius:"50%",background:"#00ff9f",animation:"pulse 1s infinite"}}/>
<span style={{fontFamily:"monospace",color:"rgba(0,255,159,0.5)",letterSpacing:3,fontSize:12}}>AUTHENTICATING...</span>
</div>
</div>
</>
)
}

if(!user){
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
.scanbtn:hover{background:#00cc7a!important}
.gbtn:hover{background:rgba(0,255,159,0.08)!important;border-color:#00ff9f88!important;color:#00ff9f!important}
`}</style>
<div style={{position:"relative",minHeight:"100vh",overflow:"hidden",background:"#0a0a0a"}}>
<MatrixRain/>
<div className="scanline" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1}}/>
<AuthScreen onLogin={u=>setUser(u)}/>
</div>
</>
)
}

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
input::placeholder,textarea::placeholder{color:rgba(0,255,159,.3)}
input:focus,textarea:focus{outline:none;border-color:#00ff9f!important;box-shadow:0 0 10px rgba(0,255,159,.5),0 0 40px rgba(0,255,159,.2),inset 0 0 20px rgba(0,255,159,.05)!important}
.scanbtn:hover{background:#00ff9f!important;color:#0a0a0a!important}
.histrow:hover{background:rgba(0,255,159,0.06)!important}
@media(max-width:1023px){.desktop-hacker{display:none!important}}
@media(min-width:1024px){.mobile-hacker{display:none!important}}
`}</style>
<div style={{position:"relative",minHeight:"100vh",overflow:"hidden",background:"#0a0a0a"}}>
<MatrixRain/>
<div className="scanline" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1}}/>

<div style={{position:"fixed",top:16,right:20,zIndex:20,display:"flex",alignItems:"center",gap:10,padding:"6px 14px",background:"rgba(0,0,0,0.6)",border:"1px solid #1a3a2a",borderRadius:20,backdropFilter:"blur(8px)"}}>
{user.photoURL&&<img src={user.photoURL} style={{width:22,height:22,borderRadius:"50%",border:"1px solid #00ff9f44"}} alt="avatar"/>}
<span style={{fontSize:11,color:"rgba(0,255,159,0.7)",fontFamily:"monospace",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
{user.displayName||user.email||user.phoneNumber||"USER"}
</span>
<button onClick={handleLogout} style={{background:"transparent",border:"1px solid #ff444433",borderRadius:4,color:"#ff4444",fontSize:10,padding:"2px 8px",cursor:"pointer",fontFamily:"monospace",letterSpacing:1}}>LOGOUT</button>
</div>

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
<p style={{color:"rgba(0,255,159,.4)",fontSize:14,marginLeft:44}}>Analyze URLs and emails for threats in real-time</p>
<NotificationButton/>
</div>

<div style={{display:"flex",borderBottom:"1px solid #00ff9f22",gap:0}}>
{[["url","🔗 URL Scanner"],["email","📧 Email Checker"]].map(([key,label])=>(
<button key={key} onClick={()=>setTab(key)}
style={{padding:"10px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===key?"#00ff9f":"transparent"}`,color:tab===key?"#00ff9f":"rgba(0,255,159,0.4)",fontFamily:"monospace",fontSize:11,letterSpacing:2,cursor:"pointer",transition:"all .2s"}}>
{label}
</button>
))}
</div>

{tab==="url"&&<>
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

<QRScanner onURLFound={u=>{setUrl(u);setResult(null);setError("")}}/>

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
</>}

{tab==="email"&&<EmailChecker emailHistory={emailHistory} setEmailHistory={setEmailHistory}/>}

</div>
</div>
<div className="desktop-hacker" style={{flex:1,maxWidth:480,display:"flex",alignItems:"center",justifyContent:"center"}}><HackerScene/></div>
</div>
</div>
</div>
</>
)}
