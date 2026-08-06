const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'submissions_db.json');
const VOTERS_FILE = path.join(__dirname, 'voters_db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(VOTERS_FILE)) {
  fs.writeFileSync(VOTERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

function processSubmissionsVideoSave(submissions) {
  return submissions.map(item => {
    const copy = { ...item };
    if (copy.videoData && copy.videoData.startsWith('data:video/')) {
      try {
        const matches = copy.videoData.match(/^data:video\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          let ext = matches[1].toLowerCase();
          if (ext === 'quicktime') ext = 'mov';
          const base64Data = matches[2];
          const filename = `video_${copy.id}.${ext}`;
          const filePath = path.join(UPLOADS_DIR, filename);

          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
          copy.videoUrl = `/uploads/${filename}`;
          copy.videoData = '';
          console.log(`🎬 핸드폰 시연 동영상 파일 저장 완료: ${filename}`);
        }
      } catch (e) {
        console.error('Video save error:', e);
      }
    }
    return copy;
  });
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
        const rawSubmissions = JSON.parse(body);
        const processed = processSubmissionsVideoSave(rawSubmissions);
        fs.writeFileSync(DATA_FILE, JSON.stringify(processed, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Saved and processed video files' }));
      } catch (e) {
        console.error('API Error:', e);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (cleanUrl === '/api/voters' && req.method === 'GET') {
    const data = fs.readFileSync(VOTERS_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(data);
  } else if (cleanUrl === '/api/voters' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const voters = JSON.parse(body);
        fs.writeFileSync(VOTERS_FILE, JSON.stringify(voters, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Saved voters list' }));
      } catch (e) {
        console.error('API Voters Error:', e);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (cleanUrl === '/api/upload-video' && req.method === 'POST') {
    const filename = `video_${Date.now()}_${Math.floor(Math.random()*1000)}.mp4`;
    const filePath = path.join(UPLOADS_DIR, filename);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);
    req.on('end', () => {
      console.log(`📱 핸드폰 시연 영상 스트림 업로드 완료: ${filename}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, videoUrl: `/uploads/${filename}` }));
    });
    req.on('error', (err) => {
      console.error('Upload stream error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Upload failed' }));
    });
  } else {
    let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.webm': 'video/webm',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.m4v': 'video/mp4'
    };

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }

      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mov' || ext === '.m4v')) {
        const fileSize = stats.size;
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentTypeMap[ext] || 'video/mp4',
        });
        file.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': contentTypeMap[ext] || 'text/plain'
        });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  }
});

const localIp = getLocalIpAddress();

server.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('🚀 바이브코딩 동영상 스트리밍 서버가 실행되었습니다!');
  console.log('==================================================');
  console.log(`💻 PC 접속 주소: http://localhost:${PORT}`);
  console.log(`📱 핸드폰 접속 주소: http://${localIp}:${PORT}`);
  console.log('==================================================\n');
});
