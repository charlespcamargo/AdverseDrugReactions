resource "aws_ecs_cluster" "app_cluster" {
  name = var.cluster_name
}

resource "aws_ecr_repository" "app_repository" {
  name = "adverse-drug-reactions-repo"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "adverse-drug-reactions-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::183295438563:role/AmazonECSTaskExecutionRolePolicy"  


  container_definitions = jsonencode([
    {
      name      = "adverse-drug-reactions-container",
      image     = "${aws_ecr_repository.app_repository.repository_url}:latest"
      essential = true,
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

output "cluster_name" {
  value = aws_ecs_cluster.app_cluster.name
}
