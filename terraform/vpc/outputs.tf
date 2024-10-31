output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_ids" {
  value = aws_subnet.public_subnet[*].id
}

output "elb_security_group" {
  value = aws_security_group.elb_sg.id
}