FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY packages/core/package.json ./packages/core/
COPY packages/core/pnpm-lock.yaml* ./packages/core/ 2>/dev/null || true

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 8000

CMD ["pnpm", "start"]