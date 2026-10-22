FROM node:20-alpine
WORKDIR /app
COPY mcp/second-key-mcp.built.js ./second-key-mcp.built.js
CMD ["node", "second-key-mcp.built.js"]
