
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

## Date


11-12-2019

## Comment

Modify table group_reminders, add group_id as PK

## Query

ALTER TABLE `normsup`.`group_reminders` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`, `group_id`);


## Applied

True

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## Date


11-12-2019

## Comment

Modify table group_reminders, remove id

## Query

ALTER TABLE `normsup`.`group_reminders` 
DROP COLUMN `id`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`group_id`);



## Applied

True