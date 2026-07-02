# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app

# ── Dependencies ────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Build ───────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time,
# so they must be supplied as build args, not just runtime env.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CDN_URL
ARG NEXT_PUBLIC_CLINIC_NAME
ARG NEXT_PUBLIC_TAGLINE
ARG NEXT_PUBLIC_LOGO_URL
ARG NEXT_PUBLIC_PHONE
ARG NEXT_PUBLIC_EMAIL
ARG NEXT_PUBLIC_ADDRESS
ARG NEXT_PUBLIC_LOGO_BG_COLOR
ARG NEXT_PUBLIC_THEME_PRIMARY
ARG NEXT_PUBLIC_THEME_SECONDARY
ARG NEXT_PUBLIC_BOOKING_LOGO_URL
ARG NEXT_PUBLIC_BOOKING_PANEL_FROM
ARG NEXT_PUBLIC_BOOKING_PANEL_TO
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL \
    NEXT_PUBLIC_CLINIC_NAME=$NEXT_PUBLIC_CLINIC_NAME \
    NEXT_PUBLIC_TAGLINE=$NEXT_PUBLIC_TAGLINE \
    NEXT_PUBLIC_LOGO_URL=$NEXT_PUBLIC_LOGO_URL \
    NEXT_PUBLIC_PHONE=$NEXT_PUBLIC_PHONE \
    NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL \
    NEXT_PUBLIC_ADDRESS=$NEXT_PUBLIC_ADDRESS \
    NEXT_PUBLIC_LOGO_BG_COLOR=$NEXT_PUBLIC_LOGO_BG_COLOR \
    NEXT_PUBLIC_THEME_PRIMARY=$NEXT_PUBLIC_THEME_PRIMARY \
    NEXT_PUBLIC_THEME_SECONDARY=$NEXT_PUBLIC_THEME_SECONDARY \
    NEXT_PUBLIC_BOOKING_LOGO_URL=$NEXT_PUBLIC_BOOKING_LOGO_URL \
    NEXT_PUBLIC_BOOKING_PANEL_FROM=$NEXT_PUBLIC_BOOKING_PANEL_FROM \
    NEXT_PUBLIC_BOOKING_PANEL_TO=$NEXT_PUBLIC_BOOKING_PANEL_TO

RUN pnpm build

# ── Runtime ─────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
