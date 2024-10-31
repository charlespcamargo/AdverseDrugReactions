output "eb_instance_profile" {
  value = aws_iam_instance_profile.eb_instance_profile.arn
}

output "eb_service_role" {
  value = aws_iam_role.eb_service_role.arn
}