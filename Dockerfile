FROM node:20-alpine
ARG DISABLE_ESLINT_PLUGIN=true
WORKDIR /react-app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm","run","build"]

