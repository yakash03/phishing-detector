import{useState,useEffect,useRef}from"react"
import axios from"axios"

function MatrixRain(){
const canvasRef=useRef(null)
useEffect(()=>{
const canvas=canvasRef.current
const ctx=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=window.innerHeight
const cols=Math.floor(canvas.width/18)
const drops=Array(cols).fill(1)
const chars="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF"
const draw=()=>{
ctx.fillStyle="rgba(5,10,5,0.05)"
ctx.fillRect(0,0,canvas.width,canvas.height)
ctx.fillStyle="#00ff88"
ctx.font="14px monospace"
drops.forEach((y,i)=>{
const char=chars[Math.floor(Math.random()*chars.length)]
const x=i*18
ctx.fillStyle=Math.random()>0.95?"#ffffff":"#00ff88"
ctx.globalAlpha=Math.random()*0.5+0.5
ctx.fillText(char,x,y*18)
ctx.globalAlpha=1
if(y*18>canvas.height&&Math.random()>0.975)drops[i]=0
drops[i]++
})}
const interval=setInterval(draw,50)
const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
window.addEventListener("resize",resize)
return()=>{clearInterval(interval);window.removeEventListener("resize",resize)}
},[])
return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,zIndex:0,opacity:0.4}}/>
}

function HackerAnimation(){
const[frame,setFrame]=useState(0)
useEffect(()=>{
const t=setInterval(()=>setFrame(f=>(f+1)%4),400)
return()=>clearInterval(t)
},[])
const fingerY=frame%2===0?2:0
return(
<svg viewBox="0 0 200 260" style={{width:"100%",maxWidth:280,filter:"drop-shadow(0 0 20px #00ff88)"}}>
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3"/>
    <stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
  </radialGradient>
</defs>
<ellipse cx="100" cy="240" rx="60" ry="8" fill="url(#glow)"/>
<rect x="30" y="160" width="140" height="90" rx="6" fill="#0a1a0a" stroke="#00ff88" strokeWidth="1.5" opacity="0.9"/>
<rect x="35" y="165" width="130" height="78" rx="4" fill="#050f05"/>
<rect x="38" y="168" width="124" height="72" rx="3" fill="#071207"/>
{[0,1,2,3,4].map(i=>(
<text key={i} x="42" y={178+i*13} fontSize="6" fill="#00ff88" opacity={0.4+Math.random()*0.4} fontFamily="monospace">
{frame===i%4?"█":">"} {["SCANNING...","ANALYZING..","CHECKING..","DETECTED!","SAFE??"][i]}
</text>
))}
<rect x="38" y={228+fingerY} width="124" height="3" rx="1" fill="#00ff8833"/>
<rect x="60" y="248" width="80" height="6" rx="3" fill="#0a1a0a" stroke="#00ff8833" strokeWidth="1"/>
<ellipse cx="100" cy="100" rx="32" ry="35" fill="#0d0d0d" stroke="#00ff8844" strokeWidth="1"/>
<ellipse cx="100" cy="95" rx="28" ry="28" fill="#111"/>
<rect x="72" y="60" width="56" height="10" rx="5" fill="#0a0a0a"/>
<ellipse cx="88" cy="90" rx="5" ry="3" fill="#00ff88" opacity="0.9"/>
<ellipse cx="112" cy="90" rx="5" ry="3" fill="#00ff88" opacity="0.9"/>
<ellipse cx="88" cy="90" rx="2" ry="2" fill="#fff" opacity="0.5"/>
<ellipse cx="112" cy="90" rx="2" ry="2" fill="#fff" opacity="0.5"/>
<path d="M92 104 Q100 109 108 104" stroke="#00ff8866" strokeWidth="1.5" fill="none"/>
<rect x="68" y="128" width="64" height="40" rx="4" fill="#0d0d0d" stroke="#00ff8822" strokeWidth="1"/>
<rect x="70" y="130" width="60" height="36" rx="3" fill="#111"/>
<path d="M75 135 Q100 125 125 135" stroke="#00ff8822" strokeWidth="1" fill="none"/>
<rect x="74" y="165" width="20" height="40" rx="3" fill="#0d0d0d" stroke="#00ff8822" strokeWidth="1"/>
<rect x="106" y="165" width="20" height="40" rx="3" fill="#0d0d0d" stroke="#00ff8822" strokeWidth="1"/>
<rect x="60" y="200" width="80" height="8" rx="2" fill="#0a1a0a" stroke="#00ff8822" strokeWidth="0.5"/>
{[0,1,2,3,4,5,6,7].map(i=>(
<rect key={i} x={62+i*10} y={201+fingerY*(i%2===0?1:-1)} width="8" height="5" rx="1" fill="#00ff8811" stroke="#00ff8833" strokeWidth="0.5"/>
))}
<circle cx="40" cy="60" r="3" fill="#00ff88" opacity={frame===0?0.9:0.2}/>
<circle cx="160" cy="60" r="3" fill="#00ff88" opacity={frame===1?0.9:0.2}/>
<circle cx="40" cy="200" r="3" fill="#00ff88" opacity={frame===2?0.9:0.2}/>
<circle cx="160" cy="200" r="3" fill="#00ff88" opacity={frame===3?0.9:0.2}/>
</svg>
)}

export default function App(){
const[url,setUrl]=useState("")
const[result,setResult]=useState(null)
const[loading,setLoading]=useState(false)
const[error,setError]=useState("")
const[typed,setTyped]=useState("")
const[scanLine,setScanLine]=useState(0)
const title="AI PHISHING DETECTOR"

useEffect(()=>{
let i=0
const t=setInterval(()=>{setTyped(title.slice(0,i+1));i++;if(i===title.length)clearInterval(t)},80)
return()=>clearInterval(t)
},[])

useEffect(()=>{
if(!loading)return
const t=setInterval(()=>setScanLine(p=>(p+3)%100),20)
return()=>clearInterval(t)
},[loading])

const analyze=async()=>{
if(!url.trim())return
setLoading(true);setError("");setResult(null)
try{const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url})
setResult(res.data)}catch{setError("Connection failed. Check backend.")}
setLoading(false)}

const vc=result?.verdict==="Dangerous"?"#ff3333":result?.verdict==="Suspicious"?"#ffaa00":"#00ff88"

return(
<div style={{minHeight:"100vh",background:"#050a05",color:"#00ff88",fontFamily:"'Courier New',monospace",position:"relative",overflow:"hidden"}}>
<style>{`
@keyframes flicker{0%,100%{opacity:1}92%{opacity:.8}95%{opacity:.5}97%{opacity:.9}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes scanpulse{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes termBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
.inp:focus{outline:none;border-color:#00ff88!important;box-shadow:0 0 15px rgba(0,255,136,.25)!important}
.scanbtn:hover{background:#00ff88!important;color:#050a05!important;box-shadow:0 0 25px #00ff88!important}
.flag:hover{transform:translateX(4px);border-left-width:4px!important}
`}</style>

<MatrixRain/>

<div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex"}}>

  <div style={{flex:1,padding:"32px 32px 32px 40px",display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:680}}>

    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)"/>
        </svg>
        <h1 style={{fontSize:"clamp(18px,3vw,30px)",fontWeight:700,letterSpacing:3,color:"#00ff88",animation:"flicker 4s infinite",margin:0,textShadow:"0 0 20px #00ff88"}}>
          {typed}<span style={{animation:"blink 1s infinite"}}>_</span>
        </h1>
      </div>
      <p style={{fontSize:12,color:"#00ff8866",letterSpacing:2,margin:0,paddingLeft:32}}>Analyze URLs for threats in real-time</p>
    </div>

    <div style={{background:"rgba(0,255,136,0.04)",border:"1px solid #00ff8833",borderRadius:6,padding:20,marginBottom:16,position:"relative",overflow:"hidden"}}>
      {loading&&<div style={{position:"absolute",left:0,top:`${scanLine}%`,width:"100%",height:2,background:"linear-gradient(90deg,transparent,#00ff88,transparent)",animation:"scanpulse .5s infinite",transition:"top .02s linear"}}/>}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
          <circle cx="11" cy="11" r="7" stroke="#00ff88" strokeWidth="1.5"/>
          <path d="m21 21-4-4" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input className="inp" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder="Enter URL to scan..."
          style={{flex:1,padding:"10px 12px",background:"rgba(0,255,136,0.05)",border:"1px solid #00ff8833",borderRadius:4,color:"#00ff88",fontSize:13,fontFamily:"'Courier New',monospace",transition:"all .3s"}}/>
      </div>
      <button className="scanbtn" onClick={analyze} disabled={loading}
        style={{width:"100%",marginTop:12,padding:"12px",background:"rgba(0,255,136,0.1)",color:"#00ff88",border:"1px solid #00ff88",borderRadius:4,fontSize:13,fontFamily:"'Courier New',monospace",letterSpacing:3,cursor:"pointer",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <span style={{fontSize:16}}>⚡</span>{loading?"SCANNING...":"SCAN NOW"}
      </button>
      {loading&&<div style={{marginTop:10,fontSize:10,color:"#00ff8866",letterSpacing:2,animation:"blink .8s infinite"}}>▶ RUNNING DEEP THREAT ANALYSIS...</div>}
    </div>

    {error&&<div style={{background:"rgba(255,51,51,0.08)",border:"1px solid #ff333333",borderLeft:"3px solid #ff3333",borderRadius:4,padding:"10px 14px",fontSize:11,color:"#ff3333",letterSpacing:1,marginBottom:12,animation:"slideIn .3s ease"}}>⚠ {error}</div>}

    {result&&<div style={{animation:"slideIn .4s ease",background:"rgba(0,255,136,0.03)",border:`1px solid ${vc}33`,borderRadius:6,padding:20}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke={vc} strokeWidth="1.5" fill={`${vc}22`}/>
        </svg>
        <div style={{fontSize:18,fontWeight:700,color:vc,letterSpacing:3,textShadow:`0 0 15px ${vc}`}}>{result.verdict.toUpperCase()}</div>
        <div style={{marginLeft:"auto",fontSize:28,fontWeight:700,color:vc}}>{result.score}<span style={{fontSize:13,opacity:.6}}>/100</span></div>
      </div>
      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:3,height:6,overflow:"hidden",marginBottom:16}}>
        <div style={{width:`${result.score}%`,height:"100%",background:`linear-gradient(90deg,#00ff88,${vc})`,borderRadius:3,transition:"width 1s ease"}}/>
      </div>
      {result.virustotal?.total_engines>0&&<div style={{fontSize:11,color:"#00ff8877",marginBottom:12,letterSpacing:1}}>
        <span style={{color:"#00ff88"}}>VIRUSTOTAL:</span> <span style={{color:"#ff3333"}}>{result.virustotal.malicious_engines} malicious</span> · <span style={{color:"#ffaa00"}}>{result.virustotal.suspicious_engines} suspicious</span> / {result.virustotal.total_engines} engines
      </div>}
      <div style={{fontSize:10,color:"#00ff8855",letterSpacing:3,marginBottom:8}}>FLAGS DETECTED — {result.flags.length}</div>
      {result.flags.length===0&&<div style={{fontSize:11,color:"#00ff88",letterSpacing:1}}>✓ NO THREATS FOUND</div>}
      {result.flags.map((f,i)=><div key={i} className="flag" style={{background:f.risk==="high"?"rgba(255,51,51,.08)":"rgba(255,170,0,.08)",borderLeft:`3px solid ${f.risk==="high"?"#ff3333":"#ffaa00"}`,borderRadius:3,padding:"8px 12px",marginBottom:6,transition:"all .2s"}}>
        <div style={{fontSize:11,fontWeight:700,color:f.risk==="high"?"#ff3333":"#ffaa00",letterSpacing:2}}>{f.risk==="high"?"⚠":"●"} {f.check.toUpperCase()}</div>
        <div style={{fontSize:10,color:"#00ff8855",marginTop:2}}>{f.detail}</div>
      </div>)}
    </div>}

  </div>

  <div style={{width:320,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",position:"relative"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,255,136,0.05) 0%,transparent 70%)"}}/>
    <div style={{animation:"float 3s ease-in-out infinite",position:"relative",zIndex:1,width:"100%",display:"flex",justifyContent:"center"}}>
      <HackerAnimation/>
    </div>
    <div style={{marginTop:16,width:"100%",background:"rgba(0,255,136,0.03)",border:"1px solid #00ff8822",borderRadius:4,padding:"10px 14px"}}>
      {["DNS: SPOOFED","GET /api/phish","PING: REJECTED","SYN FLOOD DETECTED"].map((t,i)=>(
        <div key={i} style={{fontSize:9,color:"#00ff8844",letterSpacing:2,marginBottom:4,animation:`blink ${1+i*.3}s infinite ${i*.2}s`}}>▶ {t}</div>
      ))}
    </div>
  </div>

</div>
</div>
)}
