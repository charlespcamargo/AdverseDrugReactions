# Fetch the latest Amazon Linux 2 AMI
data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
 
data "aws_subnets" "available" {
  filter {
    name   = "vpc-id"
    values = [module.vpc.vpc_id]
  }
}
