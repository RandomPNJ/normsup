
# SQL QUERIES



## Date


10-12-2019

## Comment

Create table for group reminders

## Query

CREATE TABLE `normsup`.`group_reminders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `activated` INT NULL,
  `legal_docs` VARCHAR(45) NULL,
  `comp_docs` VARCHAR(45) NULL,
  `frequency` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


## Applied

True


-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------