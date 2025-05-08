# backend/Dockerfile

FROM node:18

WORKDIR /app

# 1) 의존성만 먼저 복사·설치
COPY package*.json ./
RUN npm install

# 2) 소스 전체 복사
COPY . .

# 3) TypeScript 컴파일
RUN npm run build

# 4) production 실행
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
