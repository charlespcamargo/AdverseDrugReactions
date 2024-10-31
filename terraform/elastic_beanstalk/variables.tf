# elastic_beanstalk/variables.tf

variable "instance_type" {
  description = "EC2 instance type for Elastic Beanstalk"
  type        = string
}

variable "app_name" {
  description = "Elastic Beanstalk application name"
  default     = "adverse-drug-reactions"
}

variable "instance_profile" {
  description = "IAM Instance Profile for Elastic Beanstalk"
  type        = string
}

variable "service_role" {
  description = "IAM Service Role for Elastic Beanstalk"
  type        = string
}

variable "environment_name" {
  description = "Elastic Beanstalk environment name"
  default     = "adverse-drug-reactions-env"
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "elb_security_group" {
  description = "Security group for the Elastic Load Balancer"
  type        = string
}
