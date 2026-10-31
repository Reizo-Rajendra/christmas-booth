const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'photostrips');
const DB_FILE = path.join(DATA_DIR, 'photostrips.json');

// Ensure database and uploads directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function getSubmissions() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveSubmissions(list) {
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(urlObj.pathname);

  // --------------------------------------------------------------------------
  // API ROUTES (DATABASE STORAGE)
  // --------------------------------------------------------------------------
  if (pathname === '/api/submissions' && req.method === 'GET') {
    const data = getSubmissions();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: data.length, data }));
    return;
  }

  if (pathname === '/api/submissions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) { // 25MB limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { imageBase64, name, message, layout, theme } = payload;

        if (!imageBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'imageBase64 is required' }));
          return;
        }

        const id = 'strip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const filename = `${id}.png`;
        const filepath = path.join(UPLOADS_DIR, filename);

        fs.writeFileSync(filepath, base64Data, 'base64');

        const newRecord = {
          id,
          createdAt: new Date().toISOString(),
          name: name ? String(name).slice(0, 80) : 'Holiday Friend',
          message: message ? String(message).slice(0, 200) : 'Merry Christmas 2026!',
          layout: layout || 'layout-3cut',
          theme: theme || 'crimson',
          imageUrl: `/uploads/photostrips/${filename}`
        };

        const list = getSubmissions();
        list.unshift(newRecord);
        saveSubmissions(list);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newRecord }));
      } catch (err) {
        console.error('API Save Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to save submission' }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/submissions/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/submissions/', '');
    let list = getSubmissions();
    const item = list.find(x => x.id === id);
    if (item) {
      const filename = path.basename(item.imageUrl);
      const filepath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filepath)) {
        try { fs.unlinkSync(filepath); } catch (e) {}
      }
      list = list.filter(x => x.id !== id);
      saveSubmissions(list);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // --------------------------------------------------------------------------
  // STATIC FILES SERVING (including uploads/photostrips/)
  // --------------------------------------------------------------------------
  let reqPath = pathname;
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;

    // Prevent browser caching for code & markup during development
    const headers = {
      'Content-Length': totalSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    };
    if (['.html', '.js', '.css', '.json'].includes(ext)) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    // Handle Range Requests for smooth audio streaming/seeking on mobile, Mac & PC
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      const chunksize = (end - start) + 1;

      headers['Content-Range'] = `bytes ${start}-${end}/${totalSize}`;
      headers['Content-Length'] = chunksize;
      res.writeHead(206, headers);
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎄 Merry Christmas Photobooth running at http://localhost:${PORT}`);
});
