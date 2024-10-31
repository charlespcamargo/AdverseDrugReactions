resource "aws_elastic_beanstalk_environment" "app_env" {
  name                = var.environment_name
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v4.0.3 running Docker"

  # IAM Instance Profile
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = var.instance_profile
  }

  # AWS Execution Role
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = var.service_role
  }

  # VPC ID and Subnets
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VpcId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.subnet_ids)
  }

  # Load Balancer Type
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  # ELB Security Group
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSecurityGroups"
    value     = var.elb_security_group
  }
}
