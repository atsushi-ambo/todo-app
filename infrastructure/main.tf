provider "aws" {
  region = "ap-northeast-1"
}

# Create an RDS instance for the MySQL database
resource "aws_security_group" "rds_sg" {
  name = "rds_sg"
  description = "RDS security group"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["${var.local_ip_address}/32"]
  }
}

resource "aws_db_instance" "mysql" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t2.micro"
  name                 = "my_database_name"
  username             = "my_username"
  password             = "my_password"
  parameter_group_name = "default.mysql8.0"
  publicly_accessible  = true

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name = "MySQL RDS Instance"
  }

  depends_on = [
    aws_security_group.rds_sg,
  ]
}

# Create an EC2 instance to host the web application
resource "aws_security_group" "web_sg" {
  name        = "web_sg"
  description = "Web server security group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c94855ba95c71c99"  # Ubuntu 20.04 LTS
  instance_type = "t2.micro"
  associate_public_ip_address = true
  key_name      = "${var.key_name}"
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get -y install docker.io",
      "sudo docker run -p 80:80 -d ${var.docker_image}"
    ]
  }

  tags = {
    Name = "Web Server"
  }

  depends_on = [
    aws_security_group.web_sg,
  ]
}

# Output the IP address of the RDS instance
output "rds_address" {
  value = aws_db_instance.mysql.address
}
