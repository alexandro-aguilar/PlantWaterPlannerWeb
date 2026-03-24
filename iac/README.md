# Infrastructure

This directory manages static hosting for the Vite application with Terraform.

## Layout

- `modules/static_site`: reusable S3 + CloudFront static site module
- `environments/development`: development stack entrypoint
- `environments/production`: production stack entrypoint

Each environment creates:

- one private S3 bucket for build artifacts
- one CloudFront distribution in front of the bucket
- SPA-friendly 403/404 rewrites to `/index.html`

## Backend configuration

The Terraform backend is intentionally not committed. Both GitHub Actions workflows create a temporary `backend.hcl` file from environment variables before running `terraform init`.

Required backend values per GitHub Environment:

- `TF_STATE_BUCKET`
- `TF_STATE_KEY`
- `TF_STATE_REGION`

Required secret per GitHub Environment:

- `AWS_ROLE_ARN`

Recommended GitHub Environment setup:

- `development`: add the variables above
- `production`: add the same values and configure required reviewers so the manual workflow requires approval before deployment

## Local usage

Initialize and plan development:

```bash
cd iac/environments/development
terraform init -backend-config=backend.hcl
terraform plan
```

Initialize and plan production:

```bash
cd iac/environments/production
terraform init -backend-config=backend.hcl
terraform plan
```

If you do not set `bucket_name`, Terraform derives a unique bucket name in the format `plant-water-planner-<environment>-<unique-suffix>`. By default the unique suffix is the AWS account ID, and you can override it with `bucket_name_unique_suffix`.
