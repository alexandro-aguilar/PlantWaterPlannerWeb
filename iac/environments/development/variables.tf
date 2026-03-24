variable "aws_region" {
  description = "AWS region used for the static site infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Logical name used to derive tags and default resource names."
  type        = string
  default     = "plant-water-planner"
}

variable "bucket_name" {
  description = "Optional override for the S3 bucket name. When null, Terraform derives a unique name."
  type        = string
  default     = null
}

variable "bucket_name_unique_suffix" {
  description = "Optional unique suffix appended to the generated bucket name. When null, Terraform uses the AWS account ID."
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class for the development distribution."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Additional tags applied to the development resources."
  type        = map(string)
  default     = {}
}
