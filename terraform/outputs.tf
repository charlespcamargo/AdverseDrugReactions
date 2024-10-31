output "elastic_beanstalk_env_name" {
  value = aws_elastic_beanstalk_environment.app_env.name
}

output "environment_url" {
  value = aws_elastic_beanstalk_environment.app_env.endpoint_url
}

output "eb_instance_profile" {
  value = module.iam.eb_instance_profile  
}

output "eb_service_role" {
  value = module.iam.eb_service_role  
}