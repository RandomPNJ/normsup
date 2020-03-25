-- MySQL dump 10.13  Distrib 8.0.17, for Linux (x86_64)
--
-- Host: localhost    Database: normsup
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `org_name` varchar(95) DEFAULT NULL,
  `address` varchar(245) DEFAULT NULL,
  `postalCode` varchar(45) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Normsup','90 avenue de normsup','78300','2019-10-02 20:48:35','Poissy','France'),(2,'NormSup','10 RUE DE PENTHIEVRE','75008','2020-01-01 20:48:35','Paris','France');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_preferences`
--

DROP TABLE IF EXISTS `client_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `alerts_state` tinyint(4) DEFAULT '1',
  `alert_valid_sup` tinyint(4) DEFAULT '0',
  `alert_invalid_sup` tinyint(4) DEFAULT '1',
  `alert_invalid_mail` tinyint(4) DEFAULT '1',
  `alert_frequency` varchar(45) DEFAULT 'EVERYOTHERDAY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_id_UNIQUE` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_preferences`
--

LOCK TABLES `client_preferences` WRITE;
/*!40000 ALTER TABLE `client_preferences` DISABLE KEYS */;
INSERT INTO `client_preferences` VALUES (1,1,1,1,1,1,'EVERYOTHERDAY');
/*!40000 ALTER TABLE `client_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_supplier_relation`
--

DROP TABLE IF EXISTS `client_supplier_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_supplier_relation` (
  `client_id` int(11) NOT NULL,
  `supplier_id` varchar(45) NOT NULL,
  `creationDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`,`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_supplier_relation`
--

LOCK TABLES `client_supplier_relation` WRITE;
/*!40000 ALTER TABLE `client_supplier_relation` DISABLE KEYS */;
INSERT INTO `client_supplier_relation` VALUES (1,'1','2020-03-18 15:32:09'),(1,'2','2020-03-18 16:08:44'),(1,'3','2020-03-18 16:28:04');
/*!40000 ALTER TABLE `client_supplier_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `filename` varchar(150) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uploadedBy` int(11) DEFAULT NULL,
  `client` int(11) NOT NULL,
  `supplier` int(11) NOT NULL,
  `size` float DEFAULT NULL,
  `format` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_members` (
  `group_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `added_by` int(11) DEFAULT '0',
  PRIMARY KEY (`group_id`,`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_reminders`
--

DROP TABLE IF EXISTS `group_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_reminders` (
  `group_id` int(11) NOT NULL,
  `activated` int(11) DEFAULT NULL,
  `legal_docs` varchar(45) DEFAULT NULL,
  `comp_docs` varchar(45) DEFAULT NULL,
  `frequency` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_reminders`
--

LOCK TABLES `group_reminders` WRITE;
/*!40000 ALTER TABLE `group_reminders` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `client_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT '',
  `creation_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`name`,`client_id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisations`
--

DROP TABLE IF EXISTS `organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `siret` varchar(45) DEFAULT '',
  `address` varchar(45) DEFAULT '',
  `siren` varchar(45) DEFAULT '',
  `denomination` varchar(45) DEFAULT '',
  `country` varchar(45) DEFAULT '',
  `city` varchar(45) DEFAULT '',
  `dateCreation` date DEFAULT NULL,
  `legalUnit` varchar(255) DEFAULT NULL,
  `postalCode` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `siret_UNIQUE` (`siret`),
  FULLTEXT KEY `address` (`address`,`denomination`,`siren`,`country`,`city`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1,'35279847400016','45 CHE DU PAIN DE SUCRE','352798474','Ibm','','CAGNES SUR MER','1989-01-12','Travaux de finition n.c.a.','06800'),(2,'50915715200018','A LAST','509157152','Sci last','','CASTELNAU D\'ARBIEU',NULL,'Location de terrains et d\'autres biens immobiliers','32500'),(3,'31503063500090','9 RUE DES RONDONNEAUX','315030635','Testo','','PARIS 20','2009-01-01','Commerce de gros (commerce interentreprises) de fournitures et equipements industriels divers','75020');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `representatives`
--

DROP TABLE IF EXISTS `representatives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `representatives` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organisation_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `added_by` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `phonenumber` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `representatives`
--

LOCK TABLES `representatives` WRITE;
/*!40000 ALTER TABLE `representatives` DISABLE KEYS */;
INSERT INTO `representatives` VALUES (2,2,1,NULL,'Yassine','SciFahime','1663893090','yassin.elfahime@sci.com','2020-03-18 16:08:44'),(4,3,1,NULL,'Yatestoe','Testofahime','066390390','yassin.testo@gmail.com','2020-03-18 16:28:04'),(10,1,1,NULL,'IB','dzad','0663893090','ya.aaA@dzad.frAa','2020-03-23 15:42:50');
/*!40000 ALTER TABLE `representatives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrateur','admin'),(2,'Utilisateur','user'),(3,'Invite','guest');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_conformity`
--

DROP TABLE IF EXISTS `supplier_conformity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_conformity` (
  `supplier_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `kbis` int(11) DEFAULT '0',
  `urssaf` int(11) DEFAULT '0',
  `lnte` int(11) DEFAULT '0',
  `kbis_expiration` datetime DEFAULT NULL,
  `urssaf_expiration` datetime DEFAULT NULL,
  `lnte_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`supplier_id`,`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_conformity`
--

LOCK TABLES `supplier_conformity` WRITE;
/*!40000 ALTER TABLE `supplier_conformity` DISABLE KEYS */;
INSERT INTO `supplier_conformity` VALUES (1,0,0,0,0,NULL,NULL,NULL),(1,1,0,0,0,NULL,NULL,NULL),(2,0,0,0,0,NULL,NULL,NULL),(2,1,0,0,0,NULL,NULL,NULL),(10,1,0,0,0,NULL,NULL,NULL),(11,1,0,0,0,NULL,NULL,NULL),(12,1,0,0,0,NULL,NULL,NULL),(13,1,0,0,0,NULL,NULL,NULL),(14,1,0,0,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `supplier_conformity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `org_id` int(11) NOT NULL,
  `created_at` varchar(45) DEFAULT 'CURRENT_TIMESTAMP',
  `name` varchar(45) DEFAULT '',
  `lastname` varchar(45) DEFAULT '',
  `email` varchar(45) DEFAULT '',
  `validity_date` datetime NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organisation` int(11) NOT NULL,
  `createdBy` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phonenumber` varchar(11) DEFAULT '',
  `address` varchar(255) DEFAULT NULL,
  `postalCode` int(11) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `picture_url` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Ya_da','yassin.elfahim@gmail.com','$2b$14$pEE8HF39oQZeWZKE5aEXR.4exjUb2J8qRIh1VT4qs/HENuoJgm9qO','2019-09-24 12:25:01','Yassin','El Fahim',1,1,'lob123','0663893090','90 av des templierssss',78300,'Poissy','PROFILEPIC/c89123bc-c907-49f5-a647-b0339357bec7'),('Jérémy_Dauré','jeremy.daure@gmail.com','$2b$14$LhmTezstM71zv3PeYe23S.gpstDd5kIXfwB6HnR3W0Nf8BKqvSLxm','2019-11-14 22:41:28','Jérémy','Dauré',3,1,'1','',NULL,NULL,NULL,''),('William_Tadjou','essayede.prendredes@bras.com','$2b$14$qH3muQLhWb3dFnBZDR4qZ.YkwRGadXf.fr6uyIAgS4Cjr0ZHRGHFm','2019-11-14 23:00:57','William','Tadjou',5,1,'1','',NULL,NULL,NULL,''),('Jean_Dupont','jean.dupont@gmail.com','$2b$14$LjT2tKgun7b8lA6Wb17aV.V5mdiOq9dzoyGiElIFGdVfLwhIHGBBC','2019-11-19 12:29:40','Jean','Dupont',6,1,'1','',NULL,NULL,NULL,''),('Marc_Dorcel','marc.dorcel@gmail.com','$2b$14$n/QnFMJsII9r88HOrPU6d.jwHlqr0TfV28eWiL6mRYS7/wkFXYKa.','2019-11-19 12:32:43','Marc','Dorcel',7,1,'1','',NULL,NULL,NULL,''),('Last_Try','last.try@gmail.com','$2b$14$LEydrSV4HaTMFgbUZc4PtOPBr7DywRpPqzwkA5u/20ohRLxPLG.Bi','2019-11-19 12:33:22','Last','Try',8,1,'1','',NULL,NULL,NULL,''),('Jérémy_Dauré','jeremy.daure@normsup.com','$2b$14$N7Eg03pyqrnB.oacRhkOmuNLllBau0E/LweSSptPPRjhLOiWE01nG','2020-03-05 00:56:20','Jérémy','Dauré',11,2,'1','',NULL,NULL,NULL,''),('Created_One','dazda','$2b$14$vHz.IIqMstAsVlyZX8HP9evUmKn28XwPRywzZu0PspQCJ17cf0pTm','2020-03-05 20:53:47','Created','One',25,2,'11','',NULL,NULL,NULL,'');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `roleID` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,3,2),(2,5,3),(3,8,3),(4,9,1),(5,10,1),(6,11,1),(7,12,2),(8,13,1),(9,14,2),(10,15,1),(11,16,1),(12,17,1),(13,19,2),(14,20,2),(15,21,1),(16,22,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-23 16:16:29
