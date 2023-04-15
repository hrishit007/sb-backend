FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

ENV CONNECTION_URL=mongodb+srv://userone:userone123@cluster0.q7bh51w.mongodb.net/?retryWrites=true&w=majority

ENV CLIENT_ID_FOR_EMAIL=184311768075-dt1iersc2h4ctev0eh06347fmakpa912.apps.googleusercontent.com

ENV CLIENT_SECRET_FOR_EMAIL=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

ENV REDIRECT_URI=https://developers.google.com/oauthplayground

ENV REFRESH_TOKEN=1//04qf-4JfQEUePCgYIARAAGAQSNwF-L9IrAWeB-HsdgM3AxnpTrAROIMg0IeFvRQlDKMKLC_BJDouinf26vEbgW5uFXOU70_UcuHo

EXPOSE 5000

CMD ["npm","start"]