# iDomLive GUI Tool
iDomLive GUI Tool is a **Angular** project. It is an online version of the Tool Desktop version.

## Installation

### Set environment variables file
| Name        | Required |      Default      | Possibilities                                | Description |
| ----------- | :------: | :---------------: | -------------------------------------------- | ----------- |
| BASE_HREF   |          |         /         |                                              |             |
| DOMAIN      |   Yes    |                   |                                              |             |
| API_URL     |   Yes    |                   |                                              |             |
| LOG_LEVEL   |          | ['error', 'warn'] | ['log', 'error', 'warn', 'debug', 'verbose'] |             |
| WS_PROTOCOL |          |        wss        | ws, wss                                      |             |
| WS_HOSTNAME |   Yes    |                   |                                              |             |
| WS_PORT     |   Yes    |        443        | 0 - 40000                                    |             |
| WS_PATH     |          |                   |                                              |             |
| WS_USERNAME |   Yes    |                   |                                              |             |
| WS_PASSWORD |   Yes    |                   |                                              |             |

Create a new file "environment.js" file in "src" directory with the content below. Atention: this is a JS file, not TS!
```
window.__env = {
  DOMAIN: 'fztracker.pt',
  API_URL: 'http://localhost:8000',
  LOG_LEVEL: 'TRACE',

  WS_PROTOCOL: 'http',
  WS_HOSTNAME: 'localhost',
  WS_PORT: 8081
};
```

### Run the following commands:
```
npm install
```

## Running the app
### Development mode
```
npm run start:dev
```

### Production mode
```
npm run build
npm run build-documentation (optional: only to generate automatic documentation)
npm start:prod
```

## Docker Image build
```
DOCKER_USERNAME="jenkinstfs" DOCKER_PASSWORD="D0m@tica123#" REGISTRY_HOST="domatica.no-ip.org:1080" REGISTRY_PROJECT="idomlive" REGISTRY_NAME="idomlive-gui-tool" REPOSITORY_TAG="latest" PROJECT_VERSION="1.0.0" COMMAND="publish" ./docker/build.sh
```