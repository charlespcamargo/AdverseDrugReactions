# terraform/variables.tf

variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  default     = "adverse-drug-reactions-dev-ecs"
}

variable "instance_type" {
  description = "EC2 instance type for ECS tasks and Elastic Beanstalk"
  default     = "t2.micro"
}

variable "account_id" {
  description = "AWS Account ID"
  default     = "183295438563"
}

variable "account_name" {
  description = "AWS Account name"
  default     = "charlespcamargo"
}

variable "app_name" {
  description = "Elastic Beanstalk application name"
  default     = "adverse-drug-reactions"
}

variable "environment_name" {
  description = "Elastic Beanstalk environment name"
  default     = "adverse-drug-reactions-env"
}
