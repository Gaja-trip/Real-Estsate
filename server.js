const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function sendFile(filePath, response) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("파일을 찾을 수 없습니다.");
      return;
    }
    response.writeHead(200, { "Content-Type": type });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  let safePath;
  try {
    safePath = decodeURIComponent(request.url.split("?")[0]);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("잘못된 요청 주소입니다.");
    return;
  }

  const requestedPath = safePath === "/" ? "/index.html" : safePath;
  const fullPath = path.resolve(ROOT, requestedPath.replace(/^[/\\]+/, ""));
  const relativePath = path.relative(ROOT, fullPath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("접근이 허용되지 않습니다.");
    return;
  }

  fs.stat(fullPath, (error, stat) => {
    if (!error && stat.isFile()) {
      sendFile(fullPath, response);
      return;
    }
    sendFile(path.join(ROOT, "index.html"), response);
  });
});

server.listen(PORT, () => {
  console.log(`공인중개사 민법 기출 CBT 서버 실행: http://127.0.0.1:${PORT}`);
});
