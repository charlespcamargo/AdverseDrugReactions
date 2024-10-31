data "aws_iam_policy_document" "eb_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "eb_instance_role" {
  name               = "${var.app_name}-instance-role"
  assume_role_policy = data.aws_iam_policy_document.eb_assume_role_policy.json
}

resource "aws_iam_instance_profile" "eb_instance_profile" {
  name = "${var.app_name}-instance-profile"
  role = aws_iam_role.eb_instance_role.name
}
