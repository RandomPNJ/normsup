
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


  ## Date


07-04-2020

## Comment



## Query

CREATE TABLE `normsup`.`group_reminders_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `supplier_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `status` VARCHAR(45) NULL DEFAULT '',
  PRIMARY KEY (`id`));


## Applied

True


  ## Date


07-04-2020

## Comment

Add a `last_connexion` column to identify hors ligne suppliers


## Query

ALTER TABLE `normsup`.`suppliers` 
ADD COLUMN `last_connexion` DATETIME NULL DEFAULT NULL AFTER `password`;


## Applied

True


## Date


08-04-2020

## Comment

Add a `start_date` and `end_date` column to `supplier_conformity` to identify the validity period


## Query


ALTER TABLE `normsup`.`supplier_conformity` 
ADD COLUMN `start_date` DATETIME NOT NULL AFTER `client_id`,
ADD COLUMN `end_date` DATETIME NOT NULL AFTER `start_date`;



## Applied

True

## Date


08-04-2020

## Comment

Create table `supplier_connexion_history`

## Query


DROP TABLE IF EXISTS `supplier_connexion_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_connexion_history` (
  `supplier_id` int(11) NOT NULL,
  `organisation_id` int(11) NOT NULL,
  `client_id` varchar(45) NOT NULL,
  `date_connexion` datetime NOT NULL,
  PRIMARY KEY (`supplier_id`,`date_connexion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



## Applied

True


## Date


13-04-2020

## Comment

Added foreign key on  table `group_members`

## Query

ALTER TABLE `normsup`.`group_members` 
ADD CONSTRAINT `group_id`
  FOREIGN KEY (`group_id`)
  REFERENCES `normsup`.`groups` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;



## Applied

True


## Date


18-04-2020

## Comment

Change the type of column `frequency` on table `group_reminders`

## Query

ALTER TABLE `normsup`.`group_reminders` 
CHANGE COLUMN `frequency` `frequency` INT NULL DEFAULT 5;



## Applied

True

## Date


18-04-2020

## Comment

Create table `admins` as NormSup admin users

## Query


DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_connexion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

## Applied

True


## Date


21-10-2020

## Comment

Update table `supplier_org_relation`

## Query

ALTER TABLE `normsup`.`supplier_org_relation` 
ADD COLUMN `repres_id` INT NOT NULL AFTER `createdAt`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`repres_id`);


## Applied

True

## Date


21-10-2020

## Comment

Update table `supplier_org_relation`

## Query

ALTER TABLE `normsup`.`supplier_org_relation` 
ADD CONSTRAINT `r_id`
  FOREIGN KEY (`repres_id`)
  REFERENCES `normsup`.`representatives` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;



## Applied

True

## Date


25-10-2020

## Comment

Update table `document`

## Query

ALTER TABLE `normsup`.`document` 
DROP COLUMN `supplier`,
CHANGE COLUMN `client` `siren` INT(11) NOT NULL ;

## Applied

True


## Date


25-10-2020

## Comment

Update table `supplier_connexion_history`

## Query

ALTER TABLE `normsup`.`supplier_connexion_history` 
CHANGE COLUMN `organisation_id` `organisation_id` INT(11) NULL ;

## Applied

True

## Date
 
05-11-2020
 
## Comment
 
Create table `doc_types`
 
## Query
 
CREATE TABLE `normsup`.`doc_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `type` VARCHAR(45) NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));
 
 
## Applied
 
True
 
 
## Date
 
05-11-2020
 
## Comment
 
Create table `supplier_doc_relation`
 
## Query
 
CREATE TABLE `normsup`.`supplier_doc_relation` (
  `doc_id` INT NOT NULL,
  `org_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  PRIMARY KEY (`doc_id`, `org_id`, `client_id`),
  INDEX `id_idx` (`org_id` ASC) VISIBLE,
  INDEX `id_idx1` (`client_id` ASC) VISIBLE,
  CONSTRAINT `doctypeid`
    FOREIGN KEY (`doc_id`)
    REFERENCES `normsup`.`doc_types` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `orgid`
    FOREIGN KEY (`org_id`)
    REFERENCES `normsup`.`organisations` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `clientid`
    FOREIGN KEY (`client_id`)
    REFERENCES `normsup`.`client` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);
 
 
 
 
## Applied
 
True

## Date
 
17-11-2020
 
## Comment
 
Alter table `supplier_conformity`
 
## Query
 
ALTER TABLE `normsup`.`supplier_conformity` 
DROP COLUMN `client_id`,
CHANGE COLUMN `supplier_id` `siren` INT(9) NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`siren`, `start_date`);
; 
 
## Applied
 
False

## Date
 
17-11-2020
 
## Comment
 
Alter table `document`
 
## Query
 
ALTER TABLE `normsup`.`document` 
ADD COLUMN `state` INT(1) NULL DEFAULT 2 AFTER `id`;


## Applied
 
False


