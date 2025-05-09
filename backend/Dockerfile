# 1) 빌드 스테이지: Node.js로 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성만 먼저 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 소스 복사하고 빌드
COPY . .
RUN npm run build

# 2) 런타임 스테이지: 빌드 결과물만 가져옴
FROM node:18-alpine AS runner
WORKDIR /app

# node_modules와 dist 폴더만 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# (필요하면) 포트 노출
EXPOSE 3000

# 실제 실행 커맨드
CMD ["node", "dist/main.js"]
