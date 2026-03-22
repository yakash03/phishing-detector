import{useState,useEffect}from"react"
import axios from"axios"

export default function App(){
const[url,setUrl]=useState("")
const[result,setResult]=useState(null)
const[loading,setLoading]=useState(false)
const[error,setError]=useState("")
const[scanLine,setScanLine]=useState(0)
const[typed,setTyped]=useState("")

const title="PHISHING URL DETECTOR"
useEffect(()=>{
let i=0
const t=setInterval(()=>{
setTyped(title.slice(0,i+1))
i++
if(i===title.length)clearInterval(t)
},60)
return()=>clearInterval(t)
},[])

useEffect(()=>{
if(!loading)return
const t=setInterval(()=>setScanLine(p=>(p+2)%100),16)
return()=>clearInterval(t)
},[loading])

const analyze=async()=>{
if(!url.trim())return
setLoading(true);setError("");setResult(null)
try{const res=await axios.post("https://phishing-predictor.up.railway.app/analyze",{url})
setResult(res.data)}catch{setError("Connection failed. Check backend.")}
setLoading(false)}

const vc=result?.verdict==="Dangerous"?"#ff3333":result?.verdict==="Suspicious"?"#ffaa00":"#00ff88"
const riskColor=(r)=>r==="high"?"#ff3333":r==="medium"?"#ffaa00":"#00ff88"
const riskBg=(r)=>r==="high"?"rgba(255,51,51,0.1)":r==="medium"?"rgba(255,170,0,0.1)":"rgba(0,255,136,0.1)"

return(
<div style={{minHeight:"100vh",background:"#050a05",color:"#00ff88",fontFamily:"'Courier New',monospace",padding:"0"}}>

<style>{`
@keyframes flicker{0%,100%{opacity:1}92%{opacity:0.8}95%{opacity:0.6}97%{opacity:0.9}}
@keyframes pulse{0%,100%{box-shadow:0 0 5px #00ff88,0 0 10px #00ff88}50%{box-shadow:0 0 20px #00ff88,0 0 40px #00ff88,0 0 60px #00ff88}}
@keyframes gridmove{0%{background-position:0 0}100%{background-position:0 40px}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes scanpulse{0%,100%{opacity:0.6}50%{opacity:1}}
.scan-input:focus{outline:none!important;box-shadow:0 0 0 1px #00ff88,0 0 20px rgba(0,255,136,0.3)!important}
.analyze-btn:hover{background:#00ff88!important;color:#050a05!important;box-shadow:0 0 20px #00ff88!important}
.flag-card:hover{border-color:#00ff88!important;transform:translateX(4px)}
`}</style>

<div style={{background:"linear-gradient(180deg,#0a1a0a 0%,#050a05 100%)",borderBottom:"1px solid #00ff8833",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
    <div style={{width:10,height:10,borderRadius:"50%",background:"#00ff88",animation:"pulse 2s infinite"}}/>
    <span style={{fontSize:11,color:"#00ff8866",letterSpacing:3}}>SYSTEM ONLINE</span>
  </div>
  <div style={{fontSize:11,color:"#00ff8844",letterSpacing:2}}>v2.4.1 // SECURE</div>
</div>

<div style={{
  backgroundImage:"linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px)",
  backgroundSize:"40px 40px",
  animation:"gridmove 4s linear infinite",
  padding:"60px 24px 40px",
  textAlign:"center"
}}>
  <div style={{fontSize:11,color:"#00ff8866",letterSpacing:6,marginBottom:16}}>[ CYBER SECURITY TOOL ]</div>
  <h1 style={{
    fontSize:"clamp(20px,4vw,36px)",
    fontWeight:700,
    letterSpacing:4,
    color:"#00ff88",
    animation:"flicker 4s infinite",
    margin:"0 0 8px",
    textShadow:"0 0 20px #00ff88"
  }}>{typed}<span style={{animation:"blink 1s infinite"}}>_</span></h1>
  <p style={{fontSize:13,color:"#00ff8877",letterSpacing:2,margin:0}}>ANALYZE · DETECT · PROTECT</p>
</div>

<div style={{maxWidth:680,margin:"0 auto",padding:"0 24px 60px"}}>

  <div style={{
    background:"rgba(0,255,136,0.03)",
    border:"1px solid #00ff8833",
    borderRadius:4,
    padding:24,
    marginBottom:24,
    position:"relative",
    overflow:"hidden"
  }}>
    {loading&&<div style={{
      position:"absolute",left:0,top:`${scanLine}%`,
      width:"100%",height:2,
      background:"linear-gradient(90deg,transparent,#00ff88,transparent)",
      animation:"scanpulse 0.5s infinite",
      transition:"top 0.016s linear"
    }}/>}

    <div style={{fontSize:11,color:"#00ff8866",letterSpacing:3,marginBottom:12}}>[ TARGET URL ]</div>
    <div style={{display:"flex",gap:8}}>
      <input
        className="scan-input"
        value={url}
        onChange={e=>setUrl(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&analyze()}
        placeholder="https://enter-target-url.com"
        style={{
          flex:1,padding:"12px 16px",
          background:"rgba(0,255,136,0.05)",
          border:"1px solid #00ff8844",
          borderRadius:4,color:"#00ff88",
          fontSize:13,fontFamily:"'Courier New',monospace",
          transition:"all 0.3s"
        }}
      />
      <button
        className="analyze-btn"
        onClick={analyze}
        disabled={loading}
        style={{
          padding:"12px 24px",
          background:"transparent",
          color:"#00ff88",
          border:"1px solid #00ff88",
          borderRadius:4,
          fontSize:12,
          fontFamily:"'Courier New',monospace",
          letterSpacing:2,
          cursor:"pointer",
          transition:"all 0.3s",
          whiteSpace:"nowrap"
        }}
      >{loading?"SCANNING...":"[ SCAN ]"}</button>
    </div>

    {loading&&<div style={{marginTop:16,fontSize:11,color:"#00ff8877",letterSpacing:2}}>
      <span style={{animation:"blink 0.5s infinite"}}>▶</span> RUNNING THREAT ANALYSIS...
    </div>}
  </div>

  {error&&<div style={{
    background:"rgba(255,51,51,0.1)",border:"1px solid #ff333344",
    borderRadius:4,padding:"12px 16px",fontSize:12,
    color:"#ff3333",letterSpacing:1,marginBottom:16,
    animation:"slideIn 0.3s ease"
  }}>⚠ {error}</div>}

  {result&&<div style={{animation:"slideIn 0.4s ease"}}>

    <div style={{
      background:"rgba(0,255,136,0.03)",
      border:`1px solid ${vc}44`,
      borderRadius:4,padding:24,marginBottom:16,
      position:"relative",overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",top:0,left:0,width:`${result.score}%`,height:2,
        background:`linear-gradient(90deg,transparent,${vc})`,
        transition:"width 1s ease"
      }}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:10,color:"#00ff8866",letterSpacing:3,marginBottom:4}}>THREAT SCORE</div>
          <div style={{fontSize:48,fontWeight:700,color:vc,textShadow:`0 0 20px ${vc}`,lineHeight:1}}>
            {result.score}<span style={{fontSize:18,opacity:0.6}}>/100</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"#00ff8866",letterSpacing:3,marginBottom:4}}>STATUS</div>
          <div style={{
            fontSize:20,fontWeight:700,color:vc,
            letterSpacing:3,textShadow:`0 0 15px ${vc}`,
            border:`1px solid ${vc}44`,
            padding:"6px 14px",borderRadius:2
          }}>{result.verdict.toUpperCase()}</div>
        </div>
      </div>

      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:2,height:6,overflow:"hidden"}}>
        <div style={{
          width:`${result.score}%`,height:"100%",
          background:`linear-gradient(90deg,#00ff88,${vc})`,
          borderRadius:2,transition:"width 1s ease"
        }}/>
      </div>
    </div>

    {result.virustotal?.total_engines>0&&<div style={{
      background:"rgba(0,255,136,0.03)",border:"1px solid #00ff8822",
      borderRadius:4,padding:"12px 16px",marginBottom:16,
      fontSize:12,color:"#00ff8899",letterSpacing:1
    }}>
      <span style={{color:"#00ff88"}}>[ VIRUSTOTAL ]</span> &nbsp;
      <span style={{color:"#ff3333"}}>{result.virustotal.malicious_engines} MALICIOUS</span> ·&nbsp;
      <span style={{color:"#ffaa00"}}>{result.virustotal.suspicious_engines} SUSPICIOUS</span> ·&nbsp;
      {result.virustotal.total_engines} ENGINES SCANNED
    </div>}

    <div style={{fontSize:11,color:"#00ff8866",letterSpacing:3,marginBottom:10}}>
      [ THREAT FLAGS — {result.flags.length} DETECTED ]
    </div>

    {result.flags.length===0&&<div style={{
      background:"rgba(0,255,136,0.05)",border:"1px solid #00ff8833",
      borderRadius:4,padding:"12px 16px",fontSize:12,
      color:"#00ff88",letterSpacing:1
    }}>✓ NO THREATS DETECTED — TARGET APPEARS CLEAN</div>}

    {result.flags.map((f,i)=><div key={i} className="flag-card" style={{
      background:riskBg(f.risk),
      border:`1px solid ${riskColor(f.risk)}33`,
      borderLeft:`3px solid ${riskColor(f.risk)}`,
      borderRadius:4,padding:"12px 16px",marginBottom:8,
      transition:"all 0.2s"
    }}>
      <div style={{fontSize:12,fontWeight:700,color:riskColor(f.risk),letterSpacing:2,marginBottom:4}}>
        {f.risk==="high"?"⚠":"●"} {f.check.toUpperCase()}
      </div>
      <div style={{fontSize:11,color:"#00ff8877",letterSpacing:1}}>{f.detail}</div>
    </div>)}

  </div>}

  <div style={{
    marginTop:40,borderTop:"1px solid #00ff8811",
    paddingTop:20,display:"flex",justifyContent:"center",gap:24
  }}>
    {["HTTPS CHECK","WHOIS LOOKUP","VIRUSTOTAL","PATTERN SCAN"].map(t=>(
      <div key={t} style={{fontSize:9,color:"#00ff8833",letterSpacing:2}}>{t}</div>
    ))}
  </div>

</div>
</div>
)}
