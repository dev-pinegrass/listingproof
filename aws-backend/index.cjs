const {BedrockRuntimeClient,ConverseCommand}=require('@aws-sdk/client-bedrock-runtime');
const {timingSafeEqual}=require('node:crypto');
const client=new BedrockRuntimeClient({region:'us-east-1',maxAttempts:1});
const prompt=require('./prompt.json');
const reply=(statusCode,data)=>({statusCode,headers:{'content-type':'application/json','cache-control':'no-store'},body:JSON.stringify(data)});
exports.handler=async(event)=>{
 const expected=Buffer.from('Bearer '+(process.env.BACKEND_TOKEN||''));const actual=Buffer.from(event.headers?.authorization||'');
 if(!process.env.BACKEND_TOKEN||actual.length!==expected.length||!timingSafeEqual(actual,expected))return reply(401,{error:'Unauthorized'});
 if(event.requestContext?.http?.method!=='POST')return reply(405,{error:'POST required'});
 try{const body=event.isBase64Encoded?Buffer.from(event.body||'','base64').toString('utf8'):event.body||'';if(body.length>25000)return reply(413,{error:'Input too large'});const incoming=JSON.parse(body);const input=JSON.parse(incoming.messages?.[0]?.content?.[0]?.text||'{}');
 for(const [key,max] of [['claims',40],['sources',80]]){if(!Array.isArray(input[key])||input[key].length>max||input[key].some(x=>typeof x?.id!=='string'||typeof x?.text!=='string'||x.id.length>10||x.text.length>12000))return reply(400,{error:'Invalid segments'});}
 const output=await client.send(new ConverseCommand({modelId:process.env.MODEL_ID,system:[{text:prompt}],messages:[{role:'user',content:[{text:JSON.stringify(input)}]}],inferenceConfig:{maxTokens:3500,temperature:0}}),{abortSignal:AbortSignal.timeout(40000)});
 return reply(200,output);
 }catch(error){return reply(502,{error:'Analysis unavailable',kind:error.name||'ProviderError'});}
};
