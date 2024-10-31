resource "aws_launch_template" "app_launch_template" {
  name_prefix   = "my-launch-template-"
  image_id      = data.aws_ami.latest_amazon_linux.id
  instance_type = "t2.micro"
}

resource "aws_autoscaling_group" "app" {
  launch_template {
    id      = aws_launch_template.app_launch_template.id 
    version = "$Latest"
  }
  min_size           = 1
  max_size           = 3
  desired_capacity   = 2
  vpc_zone_identifier = module.vpc.subnet_ids

}
