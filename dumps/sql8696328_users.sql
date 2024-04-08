-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: sql8.freesqldatabase.com    Database: sql8696328
-- ------------------------------------------------------
-- Server version	5.5.62-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `phone` bigint(20) NOT NULL,
  `stripe_id` varchar(50) DEFAULT NULL,
  `wallet_balance` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` int(1) NOT NULL ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mukesh','mukeshsuthar@gmail.com','$2a$10$PiuZYtVjOKlmw3ivlPkYtuSBLXpz5FvGPJ60qs1ik9v8sMRq2rUTK',NULL,'91',9461835672,NULL,NULL,'2024-04-03 14:00:09','0000-00-00 00:00:00',1),(2,'mukesh','mukesh@gmail.com','$2a$10$c6AmNapdAIMYMkAy7wbUsOi0c6Z2hTL0t4QUV/ePT28G4Ey9WD7qO',NULL,'91',9461835672,NULL,NULL,'2024-04-03 14:04:30','0000-00-00 00:00:00',2),(3,'mukesh suthar','mukesh@gmail.com','$2a$10$McI0CNSvTv2YH26K1iLnF.3ZT.6LBwOgY.I7iI8ZzrjHujHYx6qTy',NULL,'91',9461835672,NULL,NULL,'2024-04-03 14:33:06','0000-00-00 00:00:00',1),(4,'nova','nova@gmail.com','$2a$10$3zW3kRGHV4ib4bkIf/sxmuKcu1L9kCflBn6yVu52UO0GfVJExIdiq',NULL,'91',8160814990,NULL,NULL,'2024-04-04 10:01:13','0000-00-00 00:00:00',1),(6,'ravi','ravi@gmail.com','$2a$10$tXBh4iEuxpirs6iyMwDIWuDb2YwTolJG4sLLGaZwo6/Q0oZC0DShK',NULL,'91',8160814990,NULL,NULL,'2024-04-05 08:34:56','0000-00-00 00:00:00',1),(7,'ravi','ravi2@gmail.com','$2a$10$b0./NAOTdx8gi.H6waJKZegfb6pYenOM8w7jTxdPq05sxz0DRnZZq',NULL,'91',8160814990,NULL,NULL,'2024-04-05 08:49:27','0000-00-00 00:00:00',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-07 18:35:51
