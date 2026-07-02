FROM node:24

WORKDIR /app

COPY . .

RUN npm install -g pnpm@9
RUN pnpm config set ignore-scripts false
RUN pnpm install --no-frozen-lockfile

#RUN pnpm install --ignore-scripts=false
#RUN pnpm install
#RUN pnpm install -g serve

RUN pnpm run build

CMD ["pnpm", "build"]
