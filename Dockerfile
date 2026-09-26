# syntax=docker/dockerfile:1

# ---- Builder: export the Expo web bundle -----------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Which dotenv file (already present in the build context) to bake into the
# web bundle. EXPO_PUBLIC_* vars are inlined at export time, so this must be
# set correctly per environment: .env.uat or .env.prod.
ARG ENV_FILE=.env.uat
ENV EXPO_NO_DOTENV=1
ENV DOTENV_FILE=${ENV_FILE}

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN test -f "${ENV_FILE}" || (echo "Missing ${ENV_FILE} in build context" && exit 1)
RUN npx expo export --platform web --clear --output-dir dist

# ---- Runtime: serve the static bundle with Nginx ----------------------------
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

EXPOSE 80
