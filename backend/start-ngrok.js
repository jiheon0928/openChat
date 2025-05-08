const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ngrok = require('ngrok');

async function start() {
  // 1) ngrok 터널 열기
  const url = await ngrok.connect({
    addr: process.env.PORT || 3000,
    authtoken: process.env.NGROK_AUTH_TOKEN,
  });
  console.log('Ngrok URL:', url);

  // 2) 백엔드 .env 업데이트
  const backendEnv = path.join(__dirname, '.env');
  updateEnv(backendEnv, 'NGROK_URL', url);
  updateEnv(backendEnv, 'FRONTEND_URL', url);

  // 3) 프론트엔드 .env.local 업데이트
  const frontEnv = path.join(__dirname, '../frontend/.env.local');
  updateEnv(frontEnv, 'NEXT_PUBLIC_API_URL', url);
}

function updateEnv(filePath, key, value) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=.*$`, 'm').test(content)) {
    content = content.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  } else {
    if (content && !content.endsWith('\n')) content += '\n';
    content += line + '\n';
  }
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${path.basename(filePath)} 업데이트: ${line}`);
}

start().catch((err) => console.error(err));
