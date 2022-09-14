# Typescript Boilerplate

## IMPORTANT

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for running Postgres and Redis

- Turn on VSCODE's 'FORMAT ON SAVE' setting for the workspace (included prettier file will match the format automatically)
- Install VSCODE extensions  
  ㄴ[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)  
  ㄴ[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- You should see `.vscode/settings.json` on your directory with below contents  
  // Or just create file and paste below lines.

```
{
  "editor.formatOnSave": true,
  "eslint.format.enable": false,
  "editor.tabSize": 2
}
```

- To enable `format on save` feature with above configuration, in VSCODE

```
1. CTRL + SHIFT + P
2. Format Document (in pop-up bar)
3. Select Format Document
4. Select Configure Default Formatter...
5. Select Prettier - Code formatter
```

- `src/playground.ts` file is for the placeholder.
  Since this file work as code playground, I recommend add this file on `.gitignore`. (Currently commented out)

## Environment

- Node v14.x / Yarn for the package manager
- Typescript v4.7
- Bree for worker thread
- Koa for basic webserver
- Postgres 12 with Typeorm orm library
- Docker for the database container (Install Docker Desktop recommended)
- Prepared PM2 multi process deployment using PM2_INDEX and PM2_INSTANCE_NUM on `src/config.ts` file
- Default ports, You can change this by modify `docker-compose.yml` file and `src/config.ts` file

```

POSTGRES_DB: 5432 (local and container)
REDIS: 6379 (local and container)
WEB_SERVER: 4000 (for local environment)

```

## Environment Injection

This repository has 3 different env settings using `DotENV` library.
You can specify envionment append ENV flag as prefix of the command
`ex) ENV=production, ENV=local-prod, ENV=local`

### 1) Local

ㄴ Basic local config.

Default values will inject if there is no env flag (set on `src/config.ts` file)

### 2) Local-prod

ㄴ For connect production database on local computer

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

ㄴ For the production.

Save as production.env
`!!! DO NOT ADD THIS FILE ON GIT !!!`

```

## DO NOT ADD THIS FILE ON GIT

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

- Step 1. Install dependencies

```shell script
$ yarn install
```

- Step 2. Deploy docker containers on the local computer

```shell script
$ docker-compose up -d
```

- Step 3. Deploy server on the local computer direct from typescript

```shell script
$ SYNC=True yarn schema-sync # Init postgres database model. SYNC=True flag enables modifing database schema, This flag exist for migration production db from local computer. For more description, please visit src/config.ts file.
$ yarn watch-start # This script detect source code's change and automatically restart server
```

- Step 4. Deploy server on the local computer as production build  
  To execute this project as production build, You should create your environment file following above environment injection section

```shell script
$ yarn build
$ ENV=production yarn start
```

## Misc / Trouble Shooting

- If `SYNC=True yarn schema-sync` fails with datasource error, please run `yarn schema-log` first.  
  Quite sure there is an error on database entity model or database connection settings.

- [Using Typeorm CLI](https://typeorm.io/using-cli#create-a-new-migration)
