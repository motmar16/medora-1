import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const args=process.argv.slice(2),portIndex=args.indexOf('--port'),port=portIndex>=0?Number(args[portIndex+1]):4173,root=join(process.cwd(),'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.csv':'text/csv; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
createServer((request,response)=>{const pathname=decodeURIComponent(new URL(request.url,'http://local').pathname),requested=pathname==='/'?'/index.html':pathname,filePath=normalize(join(root,requested));if(!filePath.startsWith(root)){response.writeHead(403).end('Forbidden');return}try{const target=statSync(filePath).isDirectory()?join(filePath,'index.html'):filePath;response.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream'});createReadStream(target).pipe(response)}catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found')}}).listen(port,'0.0.0.0',()=>console.log(`Medora preview running on port ${port}`));
