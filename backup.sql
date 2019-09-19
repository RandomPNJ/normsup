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
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `siret` varchar(45) DEFAULT '',
  `address` varchar(45) DEFAULT '',
  `siren` varchar(45) DEFAULT '',
  `denomination` varchar(45) DEFAULT '',
  `group` varchar(45) DEFAULT '',
  `country` varchar(45) DEFAULT '',
  `city` varchar(45) DEFAULT '',
  `createTime` varchar(45) DEFAULT '',
  `client` varchar(45) NOT NULL,
  `dateCreation` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `siret_UNIQUE` (`siret`),
  FULLTEXT KEY `address` (`address`,`denomination`,`siren`,`country`,`city`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'testsiret','testaddress','testsiren','testdenom','testgroup','testcountry','testcity',NULL,'Fakeclient',NULL),(2,'84509791400012','10 RUE DE PENTHIEVRE','845097914','Normsup',NULL,NULL,NULL,NULL,'Fakeclient','2019-02-01'),(3,'43432499200016','39 RUE DU COLONEL FABIEN','434324992','Pain et pizza services','','','','','Fakeclient','2001-12-01'),(4,'47795390500023','90 avenue de la maladrerie','477953905','Industrie test','','','','','Fakeclient',NULL),(5,'49535130600016','COUDOULET','495351306','Orangeco','','','','','Fakeclient','2007-02-04'),(6,'34305956400041','42 AV DE FRIEDLAND','343059564','Societe francaise du radiotelephone - sfr','','','','','Fakeclient',NULL),(7,'55211846501648','CAMP CCE IBM','552118465','Cie ibm france','','','','','Fakeclient','1900-01-01'),(8,'82071454100019','13 RUE DE LONDRES','820714541','Arual fitness sas','','','','','Fakeclient','2016-01-06'),(9,'50252862300015','RUE DE LA FUSION','502528623','Llp test','','','','','Fakeclient','2008-10-03'),(10,'53321810300034','11 PL JEAN BAPTISTE SAY','533218103','Pril','','','','','Fakeclient','2015-12-10'),(11,'77983479500014','RUE DE LA REPUBLIQUE','779834795','Carrefour test','','','','','Fakeclient',NULL);
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
  `organisation` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdBy` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `main_org` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Yassin_ElFahim','yassin.elfahim@gmail.com','$2b$14$Yv264wbwiHuC7TfLMQzKJOg/D8mJlofh9.d0s6MA0g36EIZTf3PUe','2019-09-10 20:43:00','Yassin','El Fahim',1,NULL,'lob123','SpaceX',NULL),('Jérémy_Dauré','jeremy.daure@icloud.com','$2b$14$j0Xad2WBM7W19ysEt/zBZOqksFSE4eDc3cluQ4SIbBcn6o9uPQycO','2019-09-14 12:30:48','Jérémy','Dauré',2,NULL,'lob123','SpaceX','guest');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-19 12:00:22
