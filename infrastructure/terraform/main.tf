provider "aws" {
  region = "ap-southeast-1" # Singapore
}

resource "aws_ecs_cluster" "agri_cluster" {
  name = "agrivision-core-cluster"
}

resource "aws_security_group" "gateway_sg" {
  name        = "agri-gateway-security-group"
  description = "Enable inbound internet access to API gateway"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
