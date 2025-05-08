# 1. Node.js 설치된 환경에서 시작
FROM node:18

# 2. 작업할 디렉토리 만들기 (컨테이너 안에서 /app 폴더로 이동)
WORKDIR /app

# 3. package.json만 먼저 복사 (의존성 설치용)
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 전체 프로젝트 복사 (소스코드, 설정파일 등)
COPY . .

# 6. 열어줄 포트 (네 서버가 3000에서 실행된다고 가정)
EXPOSE 3000

# 7. 서버 실행 명령어
CMD ["npm", "run", "start"]
