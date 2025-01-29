FROM node:18

# Install libvips for image processing
RUN apt-get update && apt-get install libvips-dev -y

# Set environment variables
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /shipitlive_strapi/

# Copy dependency files
COPY ./package.json ./package-lock.json ./

# Install dependencies
ENV PATH /shipitlive_strapi/node_modules/.bin:$PATH
RUN npm install

# Build the project
RUN npm run build

# Expose the development server port
EXPOSE 1337

# Start the development server
CMD ["npm", "run", "develop"]
