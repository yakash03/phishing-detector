import{useState,useEffect,useRef}from"react"
import axios from"axios"

function MatrixRain(){
const canvasRef=useRef(null)
useEffect(()=>{
const canvas=canvasRef.current
const ctx=canvas.getContext("2d")
const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resize()
const cols=Math.floor(canvas.width/16)
const drops=Array(cols).fill(1)
const chars="アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF><{}[]"
const draw=()=>{
ctx.fillStyle="rgba(5,10,5,0.06)"
ctx.fillRect(0,0,canvas.width,canvas.height)
drops.forEach((y,i)=>{
const char=chars[Math.floor(Math.random()*chars.length)]
ctx.font=`${Math.random()>0.98?16:13}px monospace`
ctx.fillStyle=Math.random()>0.97?"#aaffcc":Math.random()>0.9?"#00ff88":"#00aa55"
ctx.globalAlpha=Math.random()*0.6+0.4
ctx.fillText(char,i*16,y*16)
ctx.globalAlpha=1
if(y*16>canvas.height&&Math.random()>0.975)drops[i]=0
drops[i]++
})}
const iv=setInterval(draw,45)
window.addEventListener("resize",resize)
return()=>{clearInterval(iv);window.removeEventListener("resize",resize)}
},[])
return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,zIndex:0,opacity:0.35}}/>
}

function Hacker(){
const[frame,setFrame]=useState(0)
const[screenText,setScreenText]=useState(["SCANNING...","READY"])
const texts=[
["SCANNING URL...","CHECKING DNS...","VERIFYING SSL...","ANALYZING..."],
["THREAT FOUND!","HIGH RISK","BLOCKING...","ALERT!!!"],
["ALL CLEAR","SAFE URL","NO THREAT","VERIFIED"],
["RUNNING...","DEEP SCAN","CHECKING...","PATTERNS..."]
]
useEffect(()=>{
const t=setInterval(()=>{
setFrame(f=>{
const nf=(f+1)%60
setScreenText(texts[Math.floor(nf/15)%4])
return nf
})
},120)
return()=>clearInterval(t)
},[])

const armY=frame%8<4?-3:3
const fingerOffset=frame%4<2?0:2
const eyeAnim=frame%30===0?4:3
const screenGlow=frame%8<4?"#00ff88":"#00cc66"

return(
<svg viewBox="0 0 220 300" style={{width:260,filter:`drop-shadow(0 0 25px #00ff88) drop-shadow(0 0 50px #00ff8844)`}}>
<defs>
<radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
<stop offset="0%" stopColor="#00ff88" stopOpacity="0.15"/>
<stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
</radialGradient>
<radialGradient id="screenGlow" cx="50%" cy="40%" r="60%">
<stop offset="0%" stopColor="#00ff88" stopOpacity="0.4"/>
<stop offset="100%" stopColor="#003322" stopOpacity="1"/>
</radialGradient>
</defs>

<ellipse cx="110" cy="290" rx="70" ry="8" fill="#00ff88" opacity="0.1"/>

<rect x="70" y="40" width="80" height="75" rx="14" fill="#0a1a0a" stroke="#00ff88" strokeWidth="1.5"/>
<rect x="76" y="46" width="68" height="63" rx="10" fill="#050f05"/>
<ellipse cx="110" cy="77" rx="34" ry="31" fill="#071207"/>

<ellipse cx="93" cy="70" rx={eyeAnim} ry="4" fill="#00ff88" opacity="0.95"/>
<ellipse cx="127" cy="70" rx={eyeAnim} ry="4" fill="#00ff88" opacity="0.95"/>
<ellipse cx="93" cy="70" rx="2" ry="2" fill="#ffffff" opacity="0.8"/>
<ellipse cx="127" cy="70" rx="2" ry="2" fill="#ffffff" opacity="0.8"/>

{frame%30<3&&<>
<ellipse cx="93" cy="70" rx="8" ry="1" fill="#0a1a0a"/>
<ellipse cx="127" cy="70" rx="8" ry="1" fill="#0a1a0a"/>
</>}

<path d="M98 88 Q110 95 122 88" stroke="#00ff88" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>

<rect x="76" y="46" width="68" height="3" rx="1" fill="#00ff8811"/>
<circle cx="138" cy="49" r="2" fill="#00ff88" opacity="0.5"/>
<circle cx="132" cy="49" r="2" fill="#ffaa00" opacity="0.5"/>
<circle cx="126" cy="49" r="2" fill="#ff3333" opacity="0.5"/>

<rect x="85" y="115" width="50" height="8" rx="4" fill="#0a1a0a" stroke="#00ff8833" strokeWidth="1"/>

<rect x="55" y="123" width="110" height="80" rx="6" fill="#0a1a0a" stroke="#00ff88" strokeWidth="1.5"/>
<rect x="59" y="127" width="102" height="72" rx="4" fill="url(#screenGlow)"/>
{screenText.map((t,i)=>(
<text key={i} x="110" y={140+i*14} fontSize="7" fill={i===2?"#ffaa00":screenGlow} textAnchor="middle" fontFamily="monospace" opacity={0.9-i*0.1}>
{i===frame%4?"▶ ":"> "}{t}
</text>
))}
<rect x="59" y={190+fingerOffset} width="102" height="2" rx="1" fill="#00ff8844"/>

<rect x="55" y="200" width="110" height="10" rx="3" fill="#071207" stroke="#00ff8822" strokeWidth="0.5"/>
{[0,1,2,3,4,5,6,7,8,9].map(i=>(
<rect key={i} x={57+i*11} y={201+(i%2===0?fingerOffset:-fingerOffset)} width="9" height="7" rx="2" fill="#00ff8808" stroke="#00ff8822" strokeWidth="0.5"/>
))}

<g style={{transform:`translateY(${armY}px)`}}>
<path d="M55 140 Q35 155 30 175" stroke="#0a1a0a" strokeWidth="14" fill="none" strokeLinecap="round"/>
<path d="M55 140 Q35 155 30 175" stroke="#00ff8822" strokeWidth="1" fill="none" strokeLinecap="round"/>
<ellipse cx="29" cy="178" rx="7" ry="5" fill="#0a1a0a" stroke="#00ff8822" strokeWidth="1"/>
</g>
<g style={{transform:`translateY(${-armY}px)`}}>
<path d="M165 140 Q185 155 190 175" stroke="#0a1a0a" strokeWidth="14" fill="none" strokeLinecap="round"/>
<path d="M165 140 Q185 155 190 175" stroke="#00ff8822" strokeWidth="1" fill="none" strokeLinecap="round"/>
<ellipse cx="191" cy="178" rx="7" ry="5" fill="#0a1a0a" stroke="#00ff8822" strokeWidth="1"/>
</g>

<rect x="85" y="203" width="50" height="70" rx="4" fill="#071207" stroke="#00ff8811" strokeWidth="1"/>
<rect x="85" y="203" width="50" height="70" rx="4" fill="url(#bodyGlow)"/>

<rect x="75" y="268" width="70" height="20" rx="4" fill="#0a1a0a" stroke="#00ff8822" strokeWidth="1"/>
<ellipse cx="95" cy="278" rx="8" ry="4" fill="#071207" stroke="#00ff8833" strokeWidth="1"/>
<ellipse cx="125" cy="278" rx="8" ry="4" fill="#071207" stroke="#00ff8833" strokeWidth="1"/>
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
const t=setInterval(()=>{setTyped(title.slice(0,i+1));i++;if(i===title.length)clearInterval(t)},70)
return()=>clearInterval(t)
},[])

useEffect(()=>{
if(!loading)return
const t=setInterval(()=>setScanLine(p=>(p+2)%100),15)
return()=>clearInterval(t)
},[loading])

const analyze=async()=>{
if(!url.trim())return
setLoading(true);setError("");setResult(null)
try{const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url})
setResult(res.data)}catch{setError("Connection failed.")}
setLoading(false)}

const vc=result?.verdict==="Dangerous"?"#ff3333":result?.verdict==="Suspicious"?"#ffaa00":"#00ff88"

return(
<div style={{minHeight:"100vh",background:"#030803",color:"#00ff88",fontFamily:"'Courier New',monospace",position:"relative",overflow:"hidden"}}>
<style>{`
@keyframes flicker{0%,100%{opacity:1}92%{opacity:.8}95%{opacity:.4}97%{opacity:.9}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes scanpulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
@keyframes glowpulse{0%,100%{filter:drop-shadow(0 0 20px #00ff88) drop-shadow(0 0 40px #00ff8844)}50%{filter:drop-shadow(0 0 35px #00ff88) drop-shadow(0 0 70px #00ff8866)}}
.inp:focus{outline:none;border-color:#00ff88!important;box-shadow:0 0 20px rgba(0,255,136,.3)!important}
.scanbtn:hover{background:#00ff88!important;color:#030803!important;box-shadow:0 0 30px #00ff88,0 0 60px #00ff8844!important}
.flag:hover{transform:translateX(5px);border-left-width:4px!important}
`}</style>

<MatrixRain/>

<div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",alignItems:"stretch"}}>

  <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 48px",maxWidth:700}}>

    <div style={{marginBottom:32}}>
      <div style={{fontSize:10,color:"#00ff8844",letterSpacing:5,marginBottom:10}}>[ SECURITY SYSTEM v2.4 ]</div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke="#00ff88" strokeWidth="1.5" fill="rgba(0,255,136,0.1)"/>
          <path d="M9 12l2 2 4-4" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <h1 style={{fontSize:"clamp(20px,3.5vw,36px)",fontWeight:700,letterSpacing:5,color:"#00ff88",animation:"flicker 5s infinite",margin:0,textShadow:"0 0 30px #00ff88,0 0 60px #00ff8844"}}>
          {typed}<span style={{animation:"blink 1s infinite"}}>_</span>
        </h1>
      </div>
      <p style={{fontSize:12,color:"#00ff8855",letterSpacing:3,margin:"0 0 0 36px"}}>Analyze URLs for threats in real-time</p>
    </div>

    <div style={{background:"rgba(0,255,136,0.03)",border:"1px solid #00ff8833",borderRadius:6,padding:24,marginBottom:20,position:"relative",overflow:"hidden"}}>
      {loading&&<div style={{position:"absolute",left:0,top:`${scanLine}%`,width:"100%",height:"2px",background:"linear-gradient(90deg,transparent 0%,#00ff88 50%,transparent 100%)",animation:"scanpulse .5s infinite",transition:"top .015s linear",zIndex:2}}/>}
      <div style={{fontSize:10,color:"#00ff8844",letterSpacing:4,marginBottom:14}}>[ ENTER TARGET URL ]</div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
          <circle cx="11" cy="11" r="7" stroke="#00ff8866" strokeWidth="1.5"/>
          <path d="m21 21-4-4" stroke="#00ff8866" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input className="inp" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()}
          placeholder="https://suspicious-site.com"
          style={{flex:1,padding:"12px 16px",background:"rgba(0,255,136,0.04)",border:"1px solid #00ff8833",borderRadius:4,color:"#00ff88",fontSize:13,fontFamily:"'Courier New',monospace",transition:"all .3s",letterSpacing:1}}
        />
      </div>
      <button className="scanbtn" onClick={analyze} disabled={loading}
        style={{width:"100%",padding:"14px",background:"rgba(0,255,136,0.08)",color:"#00ff88",border:"1px solid #00ff8866",borderRadius:4,fontSize:13,fontFamily:"'Courier New',monospace",letterSpacing:4,cursor:"pointer",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        <span style={{fontSize:18}}>⚡</span>{loading?"SCANNING TARGET...":"SCAN NOW"}
      </button>
      {loading&&<div style={{marginTop:10,fontSize:10,color:"#00ff8855",letterSpacing:3,display:"flex",alignItems:"center",gap:6}}>
        <span style={{animation:"blink .6s infinite",fontSize:14}}>▶</span> RUNNING DEEP THREAT ANALYSIS...
      </div>}
    </div>

    {error&&<div style={{background:"rgba(255,51,51,0.07)",border:"1px solid #ff333333",borderLeft:"3px solid #ff3333",borderRadius:4,padding:"12px 16px",fontSize:11,color:"#ff3333",letterSpacing:2,marginBottom:16,animation:"slideIn .3s ease"}}>⚠ ERROR: {error}</div>}

    {result&&<div style={{animation:"slideIn .4s ease"}}>
      <div style={{background:"rgba(0,255,136,0.03)",border:`1px solid ${vc}33`,borderLeft:`4px solid ${vc}`,borderRadius:6,padding:20,marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,width:`${result.score}%`,height:"2px",background:`linear-gradient(90deg,#00ff88,${vc})`,transition:"width 1.2s ease"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" stroke={vc} strokeWidth="1.5" fill={`${vc}22`}/>
            </svg>
            <div style={{fontSize:20,fontWeight:700,color:vc,letterSpacing:4,textShadow:`0 0 20px ${vc}`}}>{result.verdict.toUpperCase()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#00ff8844",letterSpacing:3}}>THREAT SCORE</div>
            <div style={{fontSize:32,fontWeight:700,color:vc,textShadow:`0 0 15px ${vc}`}}>{result.score}<span style={{fontSize:14,opacity:.5}}>/100</span></div>
          </div>
        </div>
        <div style={{background:"rgba(0,0,0,0.4)",borderRadius:3,height:6,overflow:"hidden"}}>
          <div style={{width:`${result.score}%`,height:"100%",background:`linear-gradient(90deg,#00ff44,${vc})`,borderRadius:3,transition:"width 1.2s ease",boxShadow:`0 0 10px ${vc}`}}/>
        </div>
      </div>

      {result.virustotal?.total_engines>0&&<div style={{background:"rgba(0,0,0,0.3)",border:"1px solid #00ff8822",borderRadius:4,padding:"10px 16px",marginBottom:12,fontSize:11,letterSpacing:1,display:"flex",gap:16,flexWrap:"wrap"}}>
        <span style={{color:"#00ff8866"}}>VIRUSTOTAL:</span>
        <span style={{color:"#ff3333"}}>{result.virustotal.malicious_engines} MALICIOUS</span>
        <span style={{color:"#ffaa00"}}>{result.virustotal.suspicious_engines} SUSPICIOUS</span>
        <span style={{color:"#00ff8844"}}>{result.virustotal.total_engines} ENGINES</span>
      </div>}

      <div style={{fontSize:10,color:"#00ff8844",letterSpacing:4,marginBottom:10}}>[ FLAGS DETECTED: {result.flags.length} ]</div>
      {result.flags.length===0&&<div style={{background:"rgba(0,255,136,0.05)",border:"1px solid #00ff8822",borderLeft:"3px solid #00ff88",borderRadius:4,padding:"10px 16px",fontSize:11,color:"#00ff88",letterSpacing:2}}>✓ NO THREATS DETECTED — URL IS CLEAN</div>}
      {result.flags.map((f,i)=><div key={i} className="flag" style={{background:f.risk==="high"?"rgba(255,51,51,.07)":"rgba(255,170,0,.07)",border:`1px solid ${f.risk==="high"?"#ff333322":"#ffaa0022"}`,borderLeft:`3px solid ${f.risk==="high"?"#ff3333":"#ffaa00"}`,borderRadius:4,padding:"10px 14px",marginBottom:8,transition:"all .2s"}}>
        <div style={{fontSize:11,fontWeight:700,color:f.risk==="high"?"#ff3333":"#ffaa00",letterSpacing:2,marginBottom:3}}>{f.risk==="high"?"⚠":"◆"} {f.check.toUpperCase()}</div>
        <div style={{fontSize:10,color:"#00ff8855",letterSpacing:1}}>{f.detail}</div>
      </div>)}
    </div>}

    <div style={{marginTop:24,display:"flex",gap:20,flexWrap:"wrap"}}>
      {["HTTPS CHECK","WHOIS LOOKUP","VIRUSTOTAL","PATTERN SCAN","DNS VERIFY"].map(t=>(
        <div key={t} style={{fontSize:9,color:"#00ff8822",letterSpacing:2}}>[ {t} ]</div>
      ))}
    </div>

  </div>

  <div style={{width:320,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 20px 20px 0",position:"relative"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,255,136,0.06) 0%,transparent 65%)",pointerEvents:"none"}}/>
    <div style={{animation:"float 3.5s ease-in-out infinite",position:"relative",zIndex:1,animation:"float 3.5s ease-in-out infinite, glowpulse 3s ease-in-out infinite"}}>
      <Hacker/>
    </div>
    <div style={{marginTop:20,width:"90%",background:"rgba(0,0,0,0.5)",border:"1px solid #00ff8818",borderRadius:4,padding:"12px 14px"}}>
      {["DNS: SPOOFED","PING: REJECTED","SYN FLOOD DETECTED","MALWARE SIGNATURE"].map((t,i)=>(
        <div key={i} style={{fontSize:9,color:"#00ff8833",letterSpacing:2,marginBottom:5,display:"flex",gap:6,alignItems:"center"}}>
          <span style={{color:"#00ff8855",animation:`blink ${1.2+i*.3}s infinite ${i*.15}s`}}>▶</span>{t}
        </div>
      ))}
    </div>
  </div>

</div>
</div>
)}
