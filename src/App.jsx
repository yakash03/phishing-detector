import { useState } from "react"
import axios from "axios"
const riskColor=(r)=>r==="high"?"#A32D2D":r==="medium"?"#854F0B":"#27500A"
const riskBg=(r)=>r==="high"?"#FCEBEB":r==="medium"?"#FAEEDA":"#EAF3DE"
export default function App(){
const [url,setUrl]=useState("")
const [result,setResult]=useState(null)
const [loading,setLoading]=useState(false)
const [error,setError]=useState("")
const analyze=async()=>{
if(!url.trim())return
setLoading(true);setError("");setResult(null)
try{const res=await axios.post("http://localhost:5000/analyze",{url});setResult(res.data)}
catch{setError("Failed to analyze. Make sure backend is running.")}
setLoading(false)}
const vc=result?.verdict==="Dangerous"?"#A32D2D":result?.verdict==="Suspicious"?"#854F0B":"#27500A"
return(
<div style={{maxWidth:640,margin:"0 auto",padding:"2rem 1rem",fontFamily:"sans-serif"}}>
<h1 style={{fontSize:22,fontWeight:600,marginBottom:4}}>Phishing URL Detector</h1>
<p style={{fontSize:14,color:"#888",marginBottom:24}}>Paste any URL to check if it is a phishing site</p>
<div style={{display:"flex",gap:8,marginBottom:24}}>
<input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder="https://example.com" style={{flex:1,padding:"10px 14px",border:"1px solid #ccc",borderRadius:8,fontSize:14,outline:"none"}}/>
<button onClick={analyze} disabled={loading} style={{padding:"10px 22px",background:"#185FA5",color:"#fff",border:"none",borderRadius:8,fontSize:14,cursor:"pointer",opacity:loading?0.7:1}}>{loading?"Scanning...":"Analyze"}</button>
</div>
{error&&<p style={{color:"#A32D2D",fontSize:13}}>{error}</p>}
{result&&<div>
<div style={{background:"#f8f8f8",borderRadius:12,padding:"1.25rem",border:"1px solid #e0e0e0",marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:12,color:"#888"}}>Risk score</div>
<div style={{fontSize:38,fontWeight:600,color:vc}}>{result.score}<span style={{fontSize:16,fontWeight:400}}>/100</span></div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#888"}}>Verdict</div>
<div style={{fontSize:22,fontWeight:600,color:vc}}>{result.verdict}</div></div></div>
<div style={{background:"#e0e0e0",borderRadius:6,height:10,marginTop:16,overflow:"hidden"}}>
<div style={{width:`${result.score}%`,height:"100%",background:vc,borderRadius:6,transition:"width 0.7s ease"}}/></div></div>
{result.virustotal?.total_engines>0&&<div style={{background:"#f8f8f8",borderRadius:10,padding:"10px 14px",border:"1px solid #e0e0e0",marginBottom:14,fontSize:13}}>
<strong>VirusTotal:</strong> <span style={{color:"#A32D2D"}}>{result.virustotal.malicious_engines} malicious</span> · <span style={{color:"#854F0B"}}>{result.virustotal.suspicious_engines} suspicious</span> out of {result.virustotal.total_engines} engines</div>}
<div style={{fontSize:14,fontWeight:500,marginBottom:10}}>Flags detected ({result.flags.length})</div>
{result.flags.length===0&&<div style={{background:"#EAF3DE",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#27500A"}}>No red flags found — URL looks clean.</div>}
{result.flags.map((f,i)=><div key={i} style={{background:riskBg(f.risk),borderRadius:8,padding:"10px 14px",marginBottom:8,border:`1px solid ${riskColor(f.risk)}40`}}>
<div style={{fontSize:13,fontWeight:600,color:riskColor(f.risk)}}>{f.check}</div>
<div style={{fontSize:12,color:"#555",marginTop:3}}>{f.detail}</div></div>)}
</div>}
</div>)}