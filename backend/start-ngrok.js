const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// ngrok에서 주소 가져오기
const getNgrokUrl = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
    const url = res.data.tunnels.find((t) => t.proto === "https").public_url;
    return url;
  } catch (err) {
    console.error("❌ ngrok 주소 가져오기 실패:", err.message);
    return null;
  }
};

// .env 파일 안의 VITE_API_URL을 새 주소로 바꾸기
const updateEnv = (url) => {
  const envPath = path.join(__dirname, ".env");

  // 파일이 없으면 새로 생성
  let env = "";
  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, "utf-8");
  }

  // VITE_API_URL 줄 찾고 교체 또는 추가
  if (env.includes("VITE_API_URL=")) {
    env = env.replace(/VITE_API_URL=.*/g, `VITE_API_URL=${url}`);
  } else {
    env += `\nVITE_API_URL=${url}`;
  }

  fs.writeFileSync(envPath, env);
  console.log(`✅ .env 파일이 업데이트됨: ${url}`);
};

// ngrok 실행 + 주소 수집 + .env 갱신
const start = () => {
  const ngrokProcess = exec("ngrok http 3000", (err) => {
    if (err) console.error("❌ ngrok 실행 에러:", err.message);
  });

  // ngrok 주소가 뜰 때까지 대기 후 처리
  setTimeout(async () => {
    const url = await getNgrokUrl();
    if (url) {
      updateEnv(url);
    } else {
      console.error("❌ ngrok 주소를 가져오지 못했어요.");
    }
  }, 3000);
};

start();
