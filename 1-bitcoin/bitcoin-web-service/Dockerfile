FROM node:8

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY app/package*.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install

# Bundle app source
COPY app/ /app/
RUN ls -la /app/*

EXPOSE 5000
CMD [ "npm", "start" ]
