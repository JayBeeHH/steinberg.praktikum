const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(rootDir, 'content');
const uploadsDir = path.join(rootDir, 'uploads');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sanitizeFileName(name) {
  return path.basename(name).replace(/\.+/g, '.').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function parseMarkdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = '';
  let paragraph = [];
  let listItems = [];
  let inList = false;

  function flushParagraph() {
    if (paragraph.length) {
      html += `<p>${parseInlineMarkdown(paragraph.join(' '))}</p>`;
      paragraph = [];
    }
  }

  function flushList() {
    if (listItems.length) {
      html += `<ul>${listItems.map((item) => `<li>${parseInlineMarkdown(item)}</li>`).join('')}</ul>`;
      listItems = [];
    }
    inList = false;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      if (inList) {
        flushList();
      }
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      if (inList) {
        flushList();
      }
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      html += `<h${level}>${parseInlineMarkdown(text)}</h${level}>`;
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();
      inList = true;
      listItems.push(trimmed.replace(/^-\s+/, ''));
      continue;
    }

    if (inList) {
      flushList();
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  if (inList) {
    flushList();
  }

  return html;
}

function parseFrontmatter(text) {
  const trimmed = text.trimStart();
  if (!trimmed.startsWith('---')) {
    return { metadata: {}, body: text.trim() };
  }

  const endIndex = trimmed.indexOf('\n---', 4);
  if (endIndex === -1) {
    return { metadata: {}, body: text.trim() };
  }

  const frontmatter = trimmed.slice(4, endIndex);
  const body = trimmed.slice(endIndex + 4).trim();
  const metadata = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['\"]|['\"]$/g, '');
    metadata[key] = value;
  }

  return { metadata, body };
}

function getFileEntries(folderPath, type) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const files = [];
  const walk = (currentPath) => {
    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(md|txt)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  };

  walk(folderPath);

  const entries = files.map((filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { metadata, body } = parseFrontmatter(fileContent);
      const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
      const title = metadata.title || path.basename(filePath, path.extname(filePath));
      const date = metadata.date || '';
      const image = metadata.image || '';
      const summary = metadata.summary || body.split(/\n{2,}/)[0].slice(0, 180);

      return {
        id: relativePath,
        title,
        date,
        type,
        summary,
        image,
        bodyHtml: parseMarkdownToHtml(body),
        source: relativePath
      };
  });

  // normalize dates and sort chronologically (oldest first)
  entries.forEach((e) => {
    e._ts = Date.parse(e.date || '1970-01-01');
    if (isNaN(e._ts)) e._ts = 0;
  });

  entries.sort((a, b) => a._ts - b._ts);

  // For diary entries, ensure a consistent title format: "Woche N: <Wochentag>"
  if (type === 'diary' && entries.length) {
    const germanWeekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const firstTs = entries[0]._ts || 0;
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    entries.forEach((e) => {
      const ts = e._ts || 0;
      const weekIndex = firstTs ? Math.floor((ts - firstTs) / weekMs) + 1 : 1;
      const weekday = ts ? germanWeekday[new Date(ts).getDay()] : '';
      e.title = `Woche ${weekIndex}: ${weekday}`;
    });
  }

  // remove internal helper fields
  return entries.map(({ _ts, ...rest }) => rest);
}

function getDocuments() {
  if (!fs.existsSync(uploadsDir)) {
    return [];
  }

  return fs.readdirSync(uploadsDir)
    .filter((name) => !name.startsWith('.'))
    .map((name) => ({
      name,
      type: path.extname(name).toLowerCase(),
      url: `/uploads/${encodeURIComponent(name)}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function readContentData() {
  return {
    diary: getFileEntries(path.join(contentDir, 'diary'), 'diary'),
    interviews: getFileEntries(path.join(contentDir, 'interviews'), 'interview'),
    glossary: getFileEntries(path.join(contentDir, 'glossary'), 'glossary'),
    documents: getDocuments()
  };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function parseMultipart(req, callback) {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const bodyBuffer = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);

    if (!boundaryMatch) {
      callback(null, null);
      return;
    }

    const boundary = `--${boundaryMatch[1]}`;
    const bodyText = bodyBuffer.toString('latin1');
    const parts = bodyText.split(boundary).slice(1, -1);
    let uploadedFile = null;

    for (const part of parts) {
      const [rawHeaders, rawData] = part.split('\r\n\r\n');
      if (!rawHeaders || !rawData) continue;

      if (!rawHeaders.includes('filename=')) continue;

      const filenameMatch = rawHeaders.match(/filename="([^\"]+)"/i);
      if (!filenameMatch) continue;

      const filename = sanitizeFileName(filenameMatch[1]);
      const dataBody = rawData.replace(/\r\n$/, '');
      const buffer = Buffer.from(dataBody, 'latin1');

      uploadedFile = { name: filename, buffer };
      break;
    }

    callback(null, uploadedFile);
  });
}

function createServer() {
  ensureDirectory(contentDir);
  ensureDirectory(path.join(contentDir, 'diary'));
  ensureDirectory(path.join(contentDir, 'interviews'));
  ensureDirectory(path.join(contentDir, 'glossary'));
  ensureDirectory(uploadsDir);

  const buildDir = path.join(rootDir, 'dist');
  const publicDirExists = path.join(rootDir, 'public');

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (pathname === '/api/content' && req.method === 'GET') {
      sendJson(res, 200, readContentData());
      return;
    }

    if (pathname === '/api/upload' && req.method === 'POST') {
      parseMultipart(req, (error, uploadedFile) => {
        if (error || !uploadedFile) {
          sendJson(res, 400, { ok: false, message: 'Upload fehlgeschlagen.' });
          return;
        }

        const targetPath = path.join(uploadsDir, uploadedFile.name);
        fs.writeFileSync(targetPath, uploadedFile.buffer);
        sendJson(res, 200, { ok: true, file: uploadedFile.name, url: `/uploads/${encodeURIComponent(uploadedFile.name)}` });
      });
      return;
    }

    if (pathname.startsWith('/uploads/')) {
      const fileName = decodeURIComponent(pathname.replace('/uploads/', ''));
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        serveStaticFile(res, filePath);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Datei nicht gefunden');
      }
      return;
    }

    const assetPath = path.join(buildDir, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
      serveStaticFile(res, assetPath);
      return;
    }

    const publicPath = path.join(publicDirExists, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      serveStaticFile(res, publicPath);
      return;
    }

    const fallback = path.join(buildDir, 'index.html');
    if (fs.existsSync(fallback)) {
      serveStaticFile(res, fallback);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Nicht gefunden');
  });

  return server;
}

const server = createServer();
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Praktikums-Portal läuft auf http://localhost:${port}`);
});
