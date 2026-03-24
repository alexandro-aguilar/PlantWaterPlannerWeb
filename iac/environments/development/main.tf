terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

locals {
  environment          = "development"
  bucket_env_suffix    = "dev"
  sanitized_project    = replace(lower(var.project_name), "/[^a-z0-9-]/", "-")
  unique_suffix        = replace(lower(coalesce(var.bucket_name_unique_suffix, data.aws_caller_identity.current.account_id)), "/[^a-z0-9-]/", "-")
  generated_bucket     = "${local.sanitized_project}-${local.bucket_env_suffix}-${local.unique_suffix}"
  resolved_bucket_name = coalesce(var.bucket_name, local.generated_bucket)
  common_tags = merge(
    {
      Environment = local.environment
      ManagedBy   = "terraform"
      Project     = var.project_name
    },
    var.tags,
  )
}

module "static_site" {
  source = "../../modules/static_site"

  bucket_name = local.resolved_bucket_name
  price_class = var.price_class
  tags        = local.common_tags
}
