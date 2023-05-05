# Define a variable for the local IP address to be used
# for restricting access to the RDS instance
variable "local_ip_address" {
  description = "Local IP address for restricting access"
  type        = string
}
