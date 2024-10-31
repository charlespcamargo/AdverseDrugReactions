resource "aws_autoscaling_group" "app_autoscaling_group" {
  launch_template {
    id      = aws_launch_template.app_launch_template.id
    version = "$Latest"
  }

  min_size            = 1
  max_size            = 1
  desired_capacity    = 1
  vpc_zone_identifier = module.vpc.subnet_ids
}  