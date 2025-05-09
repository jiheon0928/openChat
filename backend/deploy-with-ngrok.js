const ngrok = require('ngrok');
const axios = require('axios');

// === 사용자 설정 ===
const VERCEL_TOKEN = 'kjarTKu2aSvkW4zHy6l7EKSL';
const VERCEL_PROJECT_ID = 'prj_h4Y8yLgGyzBpVEoXVRSmPM34xyNT';
const NGROK_AUTH_TOKEN = '2wnvkERPkzCL0STwP7VckUtoYEn_pYaEcTzNuFCkg6YrMAhx';
// =======================

async function main() {
  try {
    // 1. ngrok 실행
    const url = await ngrok.connect({
      addr: 3031,
      authtoken: NGROK_AUTH_TOKEN,
    });
    console.log('ngrok HTTPS URL:', url);

    // 2. Vercel 환경 변수 목록 조회
    const envs = await axios.get(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
    );
    const envVar = envs.data.envs.find((e) => e.key === 'NEXT_PUBLIC_API_URL');

    // 3. 환경 변수 업데이트(있으면 PATCH, 없으면 POST)
    if (envVar) {
      await axios.patch(
        `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env/${envVar.id}`,
        { value: url, target: ['production', 'preview', 'development'] },
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
      );
      console.log('Vercel 환경 변수 PATCH 완료');
    } else {
      await axios.post(
        `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env`,
        {
          key: 'NEXT_PUBLIC_API_URL',
          value: url,
          target: ['production', 'preview', 'development'],
          type: 'plain',
        },
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
      );
      console.log('Vercel 환경 변수 POST 완료');
    }

    // 4. Vercel 재배포 트리거 (gitSource 없이)
    const deployRes = await axios.post(
      `https://api.vercel.com/v13/deployments`,
      {
        name: 'production',
        project: VERCEL_PROJECT_ID,
        target: 'production',
      },
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } },
    );
    console.log(
      'Vercel 재배포가 시작되었습니다. Deployment ID:',
      deployRes.data.id,
    );
  } catch (err) {
    if (err.response && err.response.data) {
      console.error('Vercel API 에러 응답:', err.response.data);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
