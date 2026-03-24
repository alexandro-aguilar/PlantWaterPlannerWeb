variable "bucket_name" {
  description = "Name of the S3 bucket that stores the site assets."
  type        = string
}

variable "price_class" {
  description = "CloudFront price class for the distribution."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Tags applied to all managed resources."
  type        = map(string)
  default     = {}
}
