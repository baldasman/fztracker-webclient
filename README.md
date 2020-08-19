# WebClient
This is a **Angular Project**.

## Installation
Create a new file "environment.js" file in "src" directory with the content below. Attention: this is a JS file, not TS!
```
window.__env = {
  apiUrl: 'http://localhost:8000'
};
```

Run the following commands:
```bash
nvm use 10.16.3
npm install
```

## Running the app
Depending of what you need to develop, you can run both frameworks independently.
```bash
# Development mode:
npm run dev

# Build distributable:
npm run build
npm run build-documentantion
```
