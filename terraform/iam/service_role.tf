data "aws_iam_policy_document" "eb_service_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["elasticbeanstalk.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "eb_service_role" {
  name               = "${var.app_name}-service-role"
  assume_role_policy = data.aws_iam_policy_document.eb_service_assume_role_policy.json
}
