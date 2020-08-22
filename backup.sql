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
-- Table structure for table `admins`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Normsup_Admin','normsup.admin@normsup.com','$2b$14$JFwPSpKKEBEzya17JduSoe1TKTJ.d4NEc.u5d3N0TiHAXhDgdXdf.','2020-05-11 21:43:04','Normsup','Admin',NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Normsup','90 avenue de normsup','78300','2019-10-02 20:48:35','Poissy','France'),(3,'Client 2','addresse client 2','78300','2020-03-25 20:22:55','Poissy','France'),(4,'L\'Oréal','90','78300','2020-07-22 17:02:50','Paris','France');
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
  `user_id` int(11) NOT NULL,
  `alerts_state` tinyint(4) DEFAULT '1',
  `alert_valid_sup` tinyint(4) DEFAULT '0',
  `alert_invalid_sup` tinyint(4) DEFAULT '1',
  `alert_invalid_mail` tinyint(4) DEFAULT '1',
  `alert_frequency` varchar(45) DEFAULT 'EVERYOTHERDAY',
  `alert_offline_supplier` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_preferences`
--

LOCK TABLES `client_preferences` WRITE;
/*!40000 ALTER TABLE `client_preferences` DISABLE KEYS */;
INSERT INTO `client_preferences` VALUES (1,1,1,0,0,0,'WEEKLY',0),(14,33,1,0,1,1,'DAILY',1);
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
  `supplier_id` int(11) NOT NULL,
  `creationDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`,`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_supplier_relation`
--

LOCK TABLES `client_supplier_relation` WRITE;
/*!40000 ALTER TABLE `client_supplier_relation` DISABLE KEYS */;
INSERT INTO `client_supplier_relation` VALUES (1,12,'2020-04-18 11:54:42'),(1,13,'2020-04-18 14:13:38'),(1,31,'2020-04-25 14:59:12'),(1,36,'2020-06-27 16:12:17'),(1,37,'2020-06-27 16:12:27'),(1,38,'2020-06-27 16:12:46'),(1,39,'2020-06-27 16:12:53'),(1,40,'2020-06-27 16:13:06'),(1,41,'2020-06-27 16:13:13'),(1,42,'2020-06-27 16:13:27'),(1,43,'2020-06-27 16:13:39'),(1,44,'2020-06-27 16:13:47'),(4,45,'2020-07-22 17:15:51');
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
  `validityDate` varchar(45) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uploadedBy` int(11) DEFAULT NULL,
  `client` int(11) NOT NULL,
  `supplier` int(11) NOT NULL,
  `size` float DEFAULT NULL,
  `format` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
INSERT INTO `document` VALUES (6,'URSSAF/35279847400016/URSSAF_08-07-2020','attestation_pizzeria.pdf','2020-12-18 00:00:00.000','2020-07-08 18:02:19',2,1,12,54500,'application/pdf','URSSAF'),(7,'KBIS/35279847400016/KBIS_11-08-2020','Kbis_2020.pdf','2020-12-03 00:00:00.000','2020-08-11 15:44:24',2,1,12,25677,'application/pdf','KBIS');
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `download_history`
--

DROP TABLE IF EXISTS `download_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `download_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `download_history`
--

LOCK TABLES `download_history` WRITE;
/*!40000 ALTER TABLE `download_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `download_history` ENABLE KEYS */;
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
  PRIMARY KEY (`group_id`,`member_id`),
  CONSTRAINT `group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (2,13,0),(2,31,0),(7,12,0),(7,13,0),(7,31,0),(7,36,0),(7,37,0),(7,38,0),(7,39,0),(8,12,0),(8,13,0),(8,31,0),(8,36,0),(8,37,0),(8,38,0),(8,39,0),(8,40,0),(8,41,0),(8,42,0),(10,36,0),(10,37,0),(10,38,0),(11,12,0),(12,45,0);
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
  `activated` int(11) DEFAULT '0',
  `legal_docs` varchar(45) DEFAULT '',
  `comp_docs` varchar(45) DEFAULT '',
  `frequency` int(11) DEFAULT '5',
  `last_reminder` datetime DEFAULT CURRENT_TIMESTAMP,
  `next_reminder` datetime DEFAULT NULL,
  `spont_reminder` datetime DEFAULT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_reminders`
--

LOCK TABLES `group_reminders` WRITE;
/*!40000 ALTER TABLE `group_reminders` DISABLE KEYS */;
INSERT INTO `group_reminders` VALUES (2,1,'u','',15,'2020-07-16 12:01:43','2020-09-04 15:15:12','2020-07-28 01:09:20'),(3,1,'u_l_k','',15,'2020-04-06 21:43:21','2020-04-11 21:43:21',NULL),(5,1,'u_l_k','',15,'2020-04-24 18:45:39','2020-04-29 18:45:39',NULL),(7,1,'u_l_k','',15,'2020-04-24 18:51:12','2020-04-29 18:51:12',NULL),(8,1,'u_l_k','',15,'2020-04-24 18:51:36','2020-04-29 18:51:36',NULL),(10,1,'u_l_k','',15,'2020-04-24 18:52:57','2020-04-29 18:52:57',NULL),(11,1,'u_l_k','',15,'2020-07-16 12:01:43','2020-07-31 12:01:43',NULL),(12,1,'u_l_k','',15,'2020-07-22 19:17:22','2020-07-27 19:17:22',NULL);
/*!40000 ALTER TABLE `group_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_reminders_history`
--

DROP TABLE IF EXISTS `group_reminders_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_reminders_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `supplier_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `status` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_reminders_history`
--

LOCK TABLES `group_reminders_history` WRITE;
/*!40000 ALTER TABLE `group_reminders_history` DISABLE KEYS */;
INSERT INTO `group_reminders_history` VALUES (1,'2020-05-15 18:59:39',11,2,1,'OK'),(2,'2020-05-15 18:59:39',12,11,1,'OK'),(3,'2020-05-18 18:14:17',11,2,1,'OK'),(4,'2020-05-18 18:14:17',12,11,1,'OK'),(5,'2020-05-18 18:44:30',11,2,1,'OK'),(6,'2020-05-18 18:44:30',12,11,1,'OK'),(7,'2020-05-18 18:53:00',11,2,1,'OK'),(8,'2020-05-18 18:53:00',12,11,1,'OK'),(9,'2020-05-18 18:55:06',11,2,1,'OK'),(10,'2020-05-18 18:55:06',12,11,1,'OK'),(11,'2020-05-18 18:59:22',11,2,1,'OK'),(12,'2020-05-18 18:59:22',12,11,1,'OK'),(13,'2020-05-18 19:01:25',11,2,1,'OK'),(14,'2020-05-18 19:01:25',12,11,1,'OK'),(15,'2020-05-18 19:11:08',11,2,1,'OK'),(16,'2020-05-18 19:11:08',12,11,1,'OK'),(17,'2020-05-18 19:15:08',11,2,1,'OK'),(18,'2020-05-18 19:15:08',12,11,1,'OK'),(19,'2020-05-18 19:16:57',11,2,1,'OK'),(20,'2020-05-18 19:16:57',12,11,1,'OK'),(21,'2020-05-18 19:22:36',11,2,1,'OK'),(22,'2020-05-18 19:22:36',12,11,1,'OK'),(23,'2020-05-19 11:26:59',11,2,1,'OK'),(24,'2020-05-19 11:26:59',12,11,1,'OK'),(25,'2020-05-19 11:43:38',11,2,1,'OK'),(26,'2020-05-19 11:43:38',12,11,1,'OK'),(27,'2020-05-19 11:46:17',11,2,1,'OK'),(28,'2020-05-19 11:46:17',12,11,1,'OK'),(29,'2020-05-29 17:51:13',11,2,1,'OK'),(30,'2020-05-29 17:51:13',12,11,1,'OK'),(31,'2020-05-29 17:56:38',11,2,1,'OK'),(32,'2020-05-29 17:56:38',12,11,1,'OK'),(33,'2020-05-29 17:57:27',11,2,1,'OK'),(34,'2020-05-29 17:57:27',12,11,1,'OK'),(35,'2020-05-29 17:59:44',11,2,1,'OK'),(36,'2020-05-29 17:59:44',12,11,1,'OK'),(37,'2020-07-16 12:01:43',31,2,1,'OK'),(38,'2020-07-16 12:01:43',12,11,1,'OK'),(39,'2020-07-28 00:51:56',13,2,1,'OK'),(40,'2020-07-28 00:51:56',31,2,1,'OK'),(41,'2020-07-28 01:09:19',13,2,1,'OK'),(42,'2020-07-28 01:09:19',31,2,1,'OK');
/*!40000 ALTER TABLE `group_reminders_history` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Group One','','2020-04-06 21:43:17',2),(4,'Suppliers one','','2020-07-22 17:17:21',12),(1,'test3','','2020-04-24 16:51:11',7),(1,'test4','','2020-04-24 16:51:36',8),(1,'test6','','2020-04-24 16:52:56',10),(1,'test7','','2020-04-24 16:53:11',11);
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
  `added_by_org` int(11) NOT NULL,
  `siret` varchar(45) DEFAULT '',
  `address` varchar(45) DEFAULT '',
  `siren` varchar(45) DEFAULT '',
  `denomination` varchar(45) DEFAULT '',
  `country` varchar(45) DEFAULT '',
  `city` varchar(45) DEFAULT '',
  `dateCreation` datetime DEFAULT NULL,
  `legalUnit` varchar(255) DEFAULT NULL,
  `postalCode` varchar(45) DEFAULT NULL,
  `spont_reminder` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `address` (`address`,`denomination`,`siren`,`country`,`city`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1,0,'35279847400016','45 CHE DU PAIN DE SUCRE','352798474','Ibm','','CAGNES SUR MER','1989-01-12 00:00:00','Travaux de finition n.c.a.','06800',NULL),(2,0,'50915715200018','A LAST','509157152','Sci last','','CASTELNAU D\'ARBIEU',NULL,'Location de terrains et d\'autres biens immobiliers','32500',NULL),(3,0,'31503063500090','9 RUE DES RONDONNEAUX','315030635','Testo','','PARIS 20','2009-01-01 00:00:00','Commerce de gros (commerce interentreprises) de fournitures et equipements industriels divers','75020',NULL),(5,0,'84021157700019','39 RTE DE JEAN ROUX','840211577','Temp','','SALLES','2018-01-06 00:00:00','Location de terrains et d\'autres biens immobiliers','33770',NULL),(12,1,'35279847400016','45 CHE DU PAIN DE SUCRE','352798474','Ibm','','CAGNES SUR MER','1989-01-12 00:00:00','Travaux de finition n.c.a.','06800','2020-08-19 23:05:09'),(13,1,'52379670400014','NIKE RONDHOUSE','523796704','Nike','','SOORTS HOSSEGOR',NULL,'Autres activites de soutien aux entreprises n.c.a.','40150','2020-08-19 23:06:15'),(31,1,'56285003200011','RUE FREDERIC MIREUR','562850032','Electra soc electricien','','DRAGUIGNAN','2020-04-25 16:59:13','Installation electrique','83300','2020-08-19 23:09:00'),(36,1,'80191887100022','2 RUE AMAZON','801918871','Lauwin solutions logistics','','LAUWIN PLANQUE','2014-05-12 00:00:00','Affretement et organisation des transports','59553','2020-08-19 23:24:47'),(37,1,'42858584800024','719 RUE ALBERT CAMUS','428585848','Logitech','','AUTERIVE','2003-01-01 00:00:00','Conseil pour les affaires et la gestion','31190','2020-06-30 18:28:05'),(38,1,'47571008300019','La source . com','475710083','La source','','CAPVERN','2020-06-27 18:12:46','Location d\'immeubles a usages industriels et commerciaux','65130','2020-06-30 18:29:14'),(39,1,'79050299100017','11 RUE DE VERNEUIL','790502991','Checkitoo','','FLEURINES','2013-01-14 00:00:00','Conseil pour les affaires et autres conseils de gestion','60700','2020-06-30 18:30:04'),(40,1,'44028419800023','CRIQUE LOUPE','440284198','Loupi','','SAINT ELIE','2001-12-17 00:00:00','Extraction d\'autres minerais de metaux non ferreux','97312',NULL),(41,1,'40486589100026','20 BD AUGUSTIN CIEUSSA','404865891','Lazio','','MARSEILLE 7','2002-02-15 00:00:00','Location de terrains et d\'autres biens immobiliers','13007',NULL),(42,1,'81912649100011','18 RUE DES MESANGES','819126491','Poza','','BIARRITZ','2016-03-17 00:00:00','Entretien corporel','64200',NULL),(43,1,'47803372300014','67 AV ALSACE LORRAINE','478033723','Pizzano pizza','','GRENOBLE','2004-07-28 00:00:00','Restauration de type rapide','38000',NULL),(44,1,'33190560400012','DOMINO','331905604','Domino','','SAINT GEORGES D\'OLERON','2020-06-27 18:13:48','Commerce de detail de livres, papeterie et fournitures de bureau','17190',NULL),(45,4,'52379670400014','NIKE RONDHOUSE','523796704','Nike','','SOORTS HOSSEGOR','2020-07-22 00:00:00','Autres activites de soutien aux entreprises n.c.a.','40150','2020-07-25 19:16:58');
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
  `gender` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`organisation_id`,`client_id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `representatives`
--

LOCK TABLES `representatives` WRITE;
/*!40000 ALTER TABLE `representatives` DISABLE KEYS */;
INSERT INTO `representatives` VALUES (3,12,1,NULL,'Yassin','El Fahim','0663893090','yassin.elfahim@gmail.com','2020-04-18 11:54:42',NULL),(6,13,1,NULL,'Yassin','Nikefahim','0663893090','yassin.elfdezdez@gmail.com','2020-06-27 16:20:32',NULL),(7,31,1,NULL,'reze','dzza','0663893090','fezfezefz@gmail.com','2020-06-27 16:25:04',NULL),(8,36,1,NULL,'daza','dzazda','0663893090','yassin.elfahim@gmail.com','2020-06-27 16:27:04',NULL),(9,37,1,NULL,'zzadza','dzadaz','0663893090','yassin.elfahim1@gmail.com','2020-06-27 16:27:55',NULL),(10,38,1,NULL,'dzaz','zdadza','0663893090','yassin.elfahim@gmail.com','2020-06-27 16:29:06',NULL),(11,39,1,NULL,'zdaad','zdazda','0663893090','yassin.elfahim@gmail.com','2020-06-27 16:29:56',NULL),(12,45,4,NULL,'Yassin','El Fahim','0663893090','yassin.elfahimm@gmail.com','2020-07-22 17:16:46',NULL);
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
INSERT INTO `roles` VALUES (1,'Administrateur','admin'),(2,'Utilisateur','user');
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
  `start_date` datetime NOT NULL,
  `kbis` int(11) DEFAULT '0',
  `urssaf` int(11) DEFAULT '0',
  `lnte` int(11) DEFAULT '0',
  `kbis_expiration` datetime DEFAULT NULL,
  `urssaf_expiration` datetime DEFAULT NULL,
  `lnte_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`supplier_id`,`client_id`,`start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_conformity`
--

LOCK TABLES `supplier_conformity` WRITE;
/*!40000 ALTER TABLE `supplier_conformity` DISABLE KEYS */;
INSERT INTO `supplier_conformity` VALUES (12,1,'2020-07-01 00:00:00',0,1,0,NULL,'2020-12-18 00:00:00',NULL),(12,1,'2020-08-01 00:00:00',0,0,0,NULL,NULL,NULL),(45,4,'2020-07-01 00:00:00',0,0,0,NULL,NULL,NULL),(45,4,'2020-08-01 00:00:00',0,0,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `supplier_conformity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_connexion_history`
--

DROP TABLE IF EXISTS `supplier_connexion_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_connexion_history` (
  `supplier_id` int(11) NOT NULL,
  `organisation_id` int(11) NOT NULL,
  `client_id` varchar(45) NOT NULL,
  `date_connexion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`supplier_id`,`date_connexion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_connexion_history`
--

LOCK TABLES `supplier_connexion_history` WRITE;
/*!40000 ALTER TABLE `supplier_connexion_history` DISABLE KEYS */;
INSERT INTO `supplier_connexion_history` VALUES (1,9,'1','2020-01-09 16:52:40'),(1,9,'1','2020-01-11 16:52:40'),(1,9,'1','2020-02-11 16:52:40'),(1,9,'1','2020-03-11 16:52:40'),(1,9,'1','2020-04-11 16:52:40'),(2,9,'1','2020-05-17 20:28:40'),(2,9,'1','2020-07-02 15:11:15'),(2,12,'1','2020-07-02 15:25:22'),(2,12,'1','2020-07-08 18:14:14'),(2,12,'1','2020-07-08 20:00:23'),(2,12,'1','2020-07-16 11:51:08'),(2,12,'1','2020-08-11 16:03:37'),(3,12,'1','2020-06-30 18:30:04'),(4,11,'1','2020-04-10 18:12:50'),(4,11,'1','2020-04-10 18:17:50'),(4,11,'1','2020-06-06 12:56:03'),(4,11,'1','2020-06-06 13:08:04'),(4,11,'1','2020-06-06 13:08:56'),(4,11,'1','2020-06-06 13:10:40'),(4,11,'1','2020-06-06 13:13:02'),(4,11,'1','2020-06-06 13:14:38'),(4,11,'1','2020-06-06 13:15:53'),(4,11,'1','2020-06-11 23:08:13'),(4,11,'1','2020-06-12 00:01:46'),(4,11,'1','2020-06-12 00:02:41'),(4,11,'1','2020-06-12 00:03:39'),(4,11,'1','2020-06-12 00:04:25'),(4,11,'1','2020-06-12 00:14:45');
/*!40000 ALTER TABLE `supplier_connexion_history` ENABLE KEYS */;
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
  `last_connexion` datetime DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,1,12,'2020-03-29 16:52:39.762','YassSupp','SuppNom','yassin.elfahim@gmail.com','2030-04-05 16:52:40','$2b$14$zwnyg19LGAlCz3mT8o0N7.IDvus.BC.BUtCjxf2zZ8Y57PtT4SYJu','2020-04-05 17:52:40',NULL),(2,1,12,'2020-03-29 16:54:08.517','Supplier1','supplier1','supplier1@gmail.com','2030-04-05 16:52:40','$2b$14$xiq.iAqgqYRQPB5h6n0Zc.gUjs2MRy/2qJGqTtS80935myvUtlZUu','2020-04-05 17:52:40',NULL),(4,1,13,'2020-04-04 13:18:46.466','Lolo','Lala','lolo.lala@gmail.com','2030-04-05 16:52:40','$2b$14$evrRYYVpZkRPjrIfcNk58e9yAqvyDvp3x62SpzvIJ8wXSxBmKb2nW','2020-04-05 17:52:40',NULL),(5,1,12,'2020-08-18 22:37:48.437','Yoass','Faok','yassin.elfahim1@gmail.com','2020-09-17 22:37:48','$2b$14$6DcM3xBpQE2V/kixU/pqD./Y.0YGW1fPEPIJ9sGGMhXYCiTsp1z7K',NULL,NULL);
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
  `last_connexion` datetime DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Ya_da','yassin.elfahim@gmail.com','$2b$14$pEE8HF39oQZeWZKE5aEXR.4exjUb2J8qRIh1VT4qs/HENuoJgm9qO','2019-09-24 12:25:01','Yassinezejklnj','El Fahim',1,1,'0','0663893090','90 av des templierssss',78300,'Poissy','PROFILEPIC/71abd3d7-574c-4538-ba06-e12635d4a9c5',NULL,NULL),('William_Tadjou','essayede.prendredes@bras.com','$2b$14$qH3muQLhWb3dFnBZDR4qZ.YkwRGadXf.fr6uyIAgS4Cjr0ZHRGHFm','2019-11-14 23:00:57','William','Tadjou',5,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Jean_Dupont','jean.dupont@gmail.com','$2b$14$LjT2tKgun7b8lA6Wb17aV.V5mdiOq9dzoyGiElIFGdVfLwhIHGBBC','2019-11-19 12:29:40','Jean','Dupont',6,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Marc_Dorcel','marc.dorcel@gmail.com','$2b$14$n/QnFMJsII9r88HOrPU6d.jwHlqr0TfV28eWiL6mRYS7/wkFXYKa.','2019-11-19 12:32:43','Marc','Dorcel',7,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Last_Try','last.try@gmail.com','$2b$14$LEydrSV4HaTMFgbUZc4PtOPBr7DywRpPqzwkA5u/20ohRLxPLG.Bi','2019-11-19 12:33:22','Last','Try',8,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Client2User_Clie','Client2User@gmail.com','$2b$14$0.zf.E3glgmanUaWJ4jcu.LMNNoLdor8IUQc34GrbtjxjO/Mf4Nn6','2020-03-25 22:58:16','Client2User','Client2User',26,3,'1','',NULL,NULL,NULL,'',NULL,NULL),('fezfee_fezfeefz','yassinelfahim07@gmail.xom','$2b$14$iRNJv2Izq19fJ6I377qdrO6afgh8G.F8EZGCIE2mYvCktUOz1uCE2','2020-07-27 18:53:38','fezfee','fezfeefz',29,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('zdazda_dzadza','yassinelfahim07@gmail.com','$2b$14$jTxy3046h7IgYjUV1texAu4zIzeM3RlLd19bJS0aCha5on9hm0H2e','2020-07-27 18:54:41','zdazda','dzadza',30,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Kimberley_Defari','kimberley.defaria@gmail.com','$2b$14$v3rXoRi.e5g4Ei1/CzngMuo/cIdbJCFuOri7.kHTTw345FN45K3j2','2020-07-27 18:58:16','Kimberley','De faria',31,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('ddzaaz_dzzadz','yassin.elfahim1@gmail.com','$2b$14$6R3ewAkEquxV6N7F6k5clOZXdxjLkoCAez0GitR3UwxVZ8ZOJfQhC','2020-08-17 11:32:25','ddzaaz','dzzadz',33,1,'1','',NULL,NULL,NULL,'',NULL,NULL),('Jérémy_Dauré','jeremy.daure@icloud.com','$2b$14$9MIr2DNIMcH/IhVAlq0u0OP4/Tt7Zfb/wAEX1RGErYqxF5yQW.wiO','2020-08-17 11:33:22','Jérémy','Dauré',34,1,'1','',NULL,NULL,NULL,'',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,3,2),(2,5,2),(3,8,2),(4,9,1),(5,10,1),(6,11,1),(7,12,2),(8,13,1),(9,14,2),(10,15,1),(11,16,1),(12,17,1),(13,19,2),(14,20,2),(15,21,1),(16,22,2),(17,26,1),(18,1,1),(19,6,2),(20,3,1),(21,27,1),(22,29,2),(23,30,2),(24,31,2),(25,33,1),(26,34,1);
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

-- Dump completed on 2020-08-22 13:34:35
