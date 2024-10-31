resource "aws_iam_policy" "eb_policy" {
  name        = "${var.app_name}-policy"
  description = "Policy for Elastic Beanstalk application"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "elasticbeanstalk:*",
          "ec2:*",
          "s3:*",
          "cloudwatch:*",
          "autoscaling:*",
          "iam:*"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_eb_policy" {
  policy_arn = aws_iam_policy.eb_policy.arn
  role       = aws_iam_role.eb_service_role.name
}
