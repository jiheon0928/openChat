# 1) 빌드 스테이지
FROM node:18-alpine AS builder
WORKDIR /app

# package-lock.json 기준으로 의존성 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 소스 복사 + 빌드
COPY . .
RUN npm run build

# 2) 런타임 스테이지
FROM node:18-alpine AS runner
WORKDIR /app

# 빌드 결과물과 node_modules 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
