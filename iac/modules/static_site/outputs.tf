output "bucket_name" {
  description = "Name of the S3 bucket that stores the built site."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "Identifier of the CloudFront distribution."
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain_name" {
  description = "CloudFront domain name for the site."
  value       = aws_cloudfront_distribution.site.domain_name
}
