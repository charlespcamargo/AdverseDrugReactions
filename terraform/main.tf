provider "aws" {
  region  = "us-east-1"
  profile = "charles-conta-pessoal" # for safety 
}

data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Module
module "vpc" {
  source             = "./vpc"
  availability_zones = data.aws_availability_zones.available.names
}

# IAM Module
module "iam" {
  source = "./iam"
}

# ECR Module
module "ecr" {
  source = "./ecr"
}

# ECS Module
module "ecs" {
  source       = "./ecs"
  cluster_name = var.cluster_name
} 

# Elastic Beanstalk Module
module "elastic_beanstalk" {
  source             = "./elastic_beanstalk"
  instance_type      = var.instance_type
  instance_profile   = module.iam.eb_instance_profile
  service_role       = module.iam.eb_service_role
  vpc_id             = module.vpc.vpc_id            # Reference VPC ID from the output
  subnet_ids         = module.vpc.subnet_ids        # Reference subnet IDs from the output
  elb_security_group = module.vpc.elb_security_group # Passa o ID do grupo de segurança
}
