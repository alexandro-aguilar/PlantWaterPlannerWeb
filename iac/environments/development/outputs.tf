output "bucket_name" {
  description = "Name of the S3 bucket for the development site."
  value       = module.static_site.bucket_name
}

output "distribution_id" {
  description = "CloudFront distribution ID for the development site."
  value       = module.static_site.distribution_id
}

output "distribution_domain_name" {
  description = "CloudFront domain name for the development site."
  value       = module.static_site.distribution_domain_name
}
