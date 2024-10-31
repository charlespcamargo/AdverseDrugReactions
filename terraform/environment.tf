resource "aws_elastic_beanstalk_environment" "app_env" {
  name                = var.environment_name
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v4.0.3 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = module.iam.eb_instance_profile  
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_EXECUTION_ROLE"
    value     = module.iam.eb_service_role  
  }
  
}
