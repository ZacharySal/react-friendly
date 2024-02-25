FROM node:18

WORKDIR /api

COPY package*.json  ./

RUN npm install

COPY . .

ENV port=6001
ENV MONGO_URL=mongodb+srv://zachsalvaggio:wAecRcLv1u6h53nU@cluster0.bltlq5z.mongodb.net/?retryWrites=true&w=majority
ENV AWS_BUCKET_NAME=twitter-clone-image-storage-zrs
ENV AWS_BUCKET_REGION=us-east-2
ENV AWS_ACCESS_KEY=AKIAVTABGMQ3JX55Y5JW
ENV AWS_SECRET_KEY=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
ENV JWT_SECRET=p23@13

EXPOSE 6001

CMD [ "npm", "start" ]