
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

## Date


10-03-2020

## Comment

Make `documents` id column auto increment

## Query

ALTER TABLE `normsup`.`document` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT;



## Applied

True


## Date


10-03-2020

## Comment

Drop from table `user` column client and make column organisation NOT NULL

## Query

ALTER TABLE `normsup`.`user`
    DROP COLUMN `client`,
    CHANGE COLUMN `organisation` `organisation` INT(11) NOT NULL ;



## Applied

True

## Date


10-03-2020

## Comment

Create table `suppliers`

## Query

CREATE TABLE `normsup`.`suppliers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `org_id` INT NOT NULL,
  `created_at` VARCHAR(45) NULL DEFAULT 'CURRENT_TIMESTAMP',
  `name` VARCHAR(45) NULL DEFAULT '',
  `lastname` VARCHAR(45) NULL DEFAULT '',
  `email` VARCHAR(45) NULL DEFAULT '',
  PRIMARY KEY (`id`));


## Applied

True


## Date


10-03-2020

## Comment

Add on table `suppliers` validity_date column

## Query


ALTER TABLE `normsup`.`suppliers` 
ADD COLUMN `validity_date` DATETIME NOT NULL AFTER `email`;



## Applied

True


## Date


10-03-2020

## Comment

Add on table `user` profile picture url

## Query


ALTER TABLE `normsup`.`user` 
ADD COLUMN `picture_url` VARCHAR(255) NULL DEFAULT '' AFTER `city`;



## Applied

True


  ## Date


15-03-2020

## Comment



## Query


ALTER TABLE `normsup`.`document` 
ADD COLUMN `supplier` INT NOT NULL AFTER `client`;



## Applied

True


  ## Date


15-03-2020

## Comment



## Query


CREATE TABLE `normsup`.`supplier_conformity` (
  `supplier_id` INT NOT NULL,
  `kbis` INT NULL DEFAULT 0,
  `urssaf` INT NULL DEFAULT 0,
  `lnte` INT NULL DEFAULT 0,
  `kbis_expiration` DATETIME NULL,
  `urssaf_expiration` DATETIME NULL,
  `lnte_expiration` DATETIME NULL,
  PRIMARY KEY (`supplier_id`));



## Applied

True


  ## Date


15-03-2020

## Comment



## Query

ALTER TABLE `normsup`.`suppliers` 
ADD COLUMN `password` VARCHAR(255) NULL AFTER `validity_date`;

## Applied

True

