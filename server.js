const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'submissions_db.json');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const cleanUrl = req.url.split('?')[0];

  if (cleanUrl === '/api/submissions' && req.method === 'GET') {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(data);
  } else if (cleanUrl === '/api/submissions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const newSubmissions = JSON.parse(body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(newSubmissions, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Saved to central DB' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
    const ext = path.extname(filePath);
    const contentTypeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.webm': 'video/webm',
      '.mp4': 'video/mp4'
    };

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentTypeMap[ext] || 'text/plain' });
        res.end(content);
      }
    });
  }
});

const localIp = getLocalIpAddress();

server.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('🚀 바이브코딩 멀티기기 중앙 데이터베이스 서버가 실행되었습니다!');
  console.log('==================================================');
  console.log(`💻 PC 접속 주소: http://localhost:${PORT}`);
  console.log(`📱 핸드폰 접속 주소: http://${localIp}:${PORT}`);
  console.log('==================================================\n');
});
