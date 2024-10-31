resource "aws_ecr_repository" "app_repository" {
  name = "adverse-drug-reactions"
}

output "repository_url" {
  value = aws_ecr_repository.app_repository.repository_url
}
