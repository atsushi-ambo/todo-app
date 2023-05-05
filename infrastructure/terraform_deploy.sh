#!/bin/bash

# Set the local IP address as an environment variable for Terraform
export TF_VAR_local_ip_address=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')

# Run Terraform commands
terraform init
terraform plan
terraform apply -auto-approve
