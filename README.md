# Plant Water Planner Web

React + TypeScript + Vite frontend for the Plant Water Planner application.

## Local development

Install dependencies and start the dev server:

```bash
nvm use
corepack enable
yarn install
yarn dev
```

This project targets Node.js 24.

The app currently uses:

- `.env.development` for shared local development values
- `.env.development.local` for LocalStack-specific overrides
- `.env.production` for production builds

Build for a specific environment:

```bash
yarn build --mode development
yarn build --mode production
```

## Deployment

AWS static hosting is managed with Terraform and GitHub Actions.

- Terraform code lives in `iac/README.md`
- Development deploys automatically on pushes to `main`
- Production deploys manually through GitHub Actions

Before running the deployment workflows, update `.env.development` and `.env.production` with the correct API endpoint values and configure the required GitHub Environment variables and secrets described in `iac/README.md`.
