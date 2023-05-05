# Configure the AWS provider with the Tokyo region
provider "aws" {
  region = "ap-northeast-1"
}

# Create a security group for the RDS instance
resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "RDS security group"

  # Configure an ingress rule to allow access to the RDS instance
  # only from the specified local IP address on port 3306
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["${var.local_ip_address}/32"]
  }
}

# Create an AWS RDS instance for MySQL
resource "aws_db_instance" "mysql" {
  allocated_storage    = 20         # Allocated storage in GB
  storage_type         = "gp2"      # General Purpose SSD storage
  engine               = "mysql"    # MySQL database engine
  engine_version       = "8.0"      # MySQL engine version
  instance_class       = "db.t2.micro"  # Instance class for the RDS instance
  name                 = "my_database_name"  # Database name
  username             = "my_username"  # Database username
  password             = "my_password"  # Database password
  parameter_group_name = "default.mysql8.0"  # Parameter group for the RDS instance
  publicly_accessible  = true  # Make the RDS instance publicly accessible

  # Associate the RDS instance with the security group created earlier
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # Add tags to the RDS instance
  tags = {
    Name = "MySQL RDS Instance"
  }

  # Ensure the security group is created before the RDS instance
  depends_on = [
    aws_security_group.rds_sg,
  ]
}

# Output the RDS instance's address
output "rds_address" {
  value = aws_db_instance.mysql.address
}
