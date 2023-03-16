# 1. Install node.js
FROM node:16-alpine3.16

# 2. Prepare the project folder
WORKDIR /container_tutorial

# 3. Initialize project using npm init. This will create package.json
COPY package.json package.json

# 4. Install library based on package.json
RUN npm install

# 5. Create data.json
COPY data.json data.json

# 6. Create index.js
COPY index.js index.js

ENV PORT=3000
EXPOSE 3000

# 7. Run the application using command node index.js
CMD ["node", "index.js"]