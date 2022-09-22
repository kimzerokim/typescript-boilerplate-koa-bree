# Typescript Web Server Boilerplate

## Environment

- `VSCODE` specified editor settings
- `Node v16.x`
- `Typescript v4.7`
- `Yarn classic` for the package manager
- `Postgres 12` with [Typeorm](https://github.com/typeorm/typeorm) library
- `Redis` pre-containerized
- [Bree](https://github.com/breejs/bree) for worker thread
- [Koa](https://github.com/koajs/koa) for basic webserver
- `Docker` for the database and test env container (Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) recommended)
- Prepared [PM2](https://github.com/Unitech/pm2) multi process deployment using `PM2_INDEX` and `PM2_INSTANCE_NUM` on `src/config.ts` file
- Default exposed ports below, You can change this by modifing `docker-compose.yml` file and `src/config.ts` file

```
POSTGRES_DB: 5433
REDIS: 6380
WEB_SERVER: 4000
```

## Before Start

### Step 1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for running Postgres and Redis

### Step 2. Install or Check VSCODE extensions

#### ㄴ[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

#### ㄴ[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Step 3. Turn on VSCODE's 'FORMAT ON SAVE' setting for the workspace

(included `.prettierrc.json` file will match the format automatically)  
You should see `.vscode/settings.json` on your directory with below contents  
// Or just create file and paste below lines.

```
{
  "editor.formatOnSave": true,
  "eslint.format.enable": false,
  "editor.tabSize": 2
}
```

### Step 4. Enable `format on save` feature with above configuration, in VSCODE

```
1. CTRL + SHIFT + P
2. Format Document (in pop-up bar)
3. Select Format Document
4. Select Configure Default Formatter...
5. Select Prettier - Code formatter
```

## Environment Injection

This repository has 3 different env settings using `DotENV` library.  
You can specify envionment append ENV flag as prefix of the command  
`ex) ENV=production, ENV=local-prod, ENV=local`

### 1) Local

ㄴ Basic local config.

Default values will inject if there is no env flag (set on `src/config.ts` file)

### 2) Local-prod

ㄴ For connect production database on local computer. (Example)

Save as local-prod.env  
`!!! DO NOT ADD THIS FILE ON GIT !!!`

```
PORT=4000
ENV=production
JWT_SECRET=Example
DB_TYPE=postgres
DB_USER=Example
DB_PASSWORD=Example
DB_HOST=Example
DB_PORT=5432
DB_NAME=project
REDIS_HOST=Example
REDIS_PORT=6379
```

### 3) Production

ㄴ For the production. (Example)

Save as production.env  
`!!! DO NOT ADD THIS FILE ON GIT !!!`

```
PORT=4000
ENV=production
JWT_SECRET=Example
DB_TYPE=postgres
DB_USER=Example
DB_PASSWORD=Example
DB_HOST=Example
DB_PORT=5432
DB_NAME=project
REDIS_HOST=Example
REDIS_PORT=6379
```

## How to use

### Step 1. Install dependencies

```bash
$ yarn install
```

### Step 2. Deploy docker containers on the local computer

```bash
$ docker-compose up -d
```

### Step 3. Deploy server on the local computer direct from typescript

```bash
$ SYNC=True yarn schema-sync
# Init postgres database model.
# SYNC=True flag enables modifing database schema.
# This flag exist for migration production db from local computer
# using typescript entity file directly.
# For more description, please visit src/config.ts file.

$ yarn watch-start
# This script detect source code's change and automatically restart server
```

### Step 4. Deploy server on the local computer as production build

To execute this project as production build, You should create your environment file following above environment injection section

```bash
$ yarn build
$ ENV=production yarn start
```

## How to Test

- For insure independent envionment, We use Docker container for the test instance.  
  `./src, ./__test__, ./package.json` files local change will apply immediately on the container.

- `IMPORTANT:` When local `./package.json` changes, You MUST execute `yarn install` inside the container or re-build container. Because packages are installed depending system architecture. So `node_modules` folder is not synced between local and container.

### Step 1. Deploy docker containers on the local computer

```bash
$ docker-compose up -d
```

### Step 2. Access on the test container

```bash
$ docker exec -it typescript-boilerplate-test /bin/bash
```

### Step 3. Start test inside container shell (on the default root)

```bash
(container) $ yarn test
```

### (optional) Force rebuild docker containers when needed

```bash
$ docker-compose build --no-cache
```

## Misc / Trouble Shooting

- If `SYNC=True yarn schema-sync` fails with datasource error, please run `yarn schema-log` first.  
  Quite sure there is an error on database entity model or database connection settings.

- [Using Typeorm CLI](https://typeorm.io/using-cli#create-a-new-migration)

- `src/playground.ts` file is for the placeholder.  
  Since this file work as code playground, I recommend add this file on `.gitignore`. (Currently commented out)
