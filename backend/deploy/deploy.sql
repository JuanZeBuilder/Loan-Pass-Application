CREATE DATABASE IF NOT EXISTS corppass;
CREATE USER IF NOT EXISTS 'corppassadmin'@'%' IDENTIFIED BY 'password123';
GRANT ALL ON corppass.* TO 'corppassadmin'@'%';