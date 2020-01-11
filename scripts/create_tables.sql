DROP DATABASE IF EXISTS FitnessClub;

CREATE DATABASE FitnessClub;
USE FitnessClub;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  permissions ENUM('normal', 'admin') NOT NULL DEFAULT 'normal',
  lastlogin TIMESTAMP,
  firstname VARCHAR(200) NOT NULL,
  lastname VARCHAR(200) NOT NULL,
  telephone VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE trainers (
  id INT UNSIGNED NOT NULL,
  description VARCHAR(200) NOT NULL,
  
  FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE classes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(200) NOT NULL,
  duration TIME
);

CREATE TABLE specific_classes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
  trainer_id INT UNSIGNED NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  start TIMESTAMP NOT NULL,
  end TIMESTAMP NOT NULL,
  max_participants INT,
  reserved_places INT NOT NULL,

  FOREIGN KEY (trainer_id) REFERENCES trainers(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE reservations (

  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  specific_class_id INT UNSIGNED NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (specific_class_id) REFERENCES specific_classes(id)
);
