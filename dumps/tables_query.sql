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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'232, surbhi vihars',0,'2024-04-07 11:53:38','0000-00-00 00:00:00'),(2,6,'b-401, king residency',0,'2024-04-07 12:14:38','0000-00-00 00:00:00'),(3,6,'b-401, king residency',0,'2024-04-07 12:15:28','0000-00-00 00:00:00'),(4,4,'b-401, king residency',0,'2024-04-07 12:18:41','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userDetails`
--

DROP TABLE IF EXISTS `userDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userDetails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `business_license_number` varchar(100) NOT NULL,
  `business_license_image` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `bio` text,
  `order_type` enum('Delivery','Pickup','Both') NOT NULL,
  `distance_fee_waived` varchar(100) DEFAULT NULL,
  `distance_and_fee` varchar(100) DEFAULT NULL,
  `food_category` varchar(100) NOT NULL,
  `driver_name` varchar(150) NOT NULL,
  `driver_license_number` varchar(150) NOT NULL,
  `driver_license_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `userDetails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userDetails`
--

LOCK TABLES `userDetails` WRITE;
/*!40000 ALTER TABLE `userDetails` DISABLE KEYS */;
INSERT INTO `userDetails` VALUES (1,1,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:17:05','0000-00-00 00:00:00'),(2,3,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:38:53','0000-00-00 00:00:00'),(3,2,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:39:13','0000-00-00 00:00:00'),(7,7,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712332867/cerv-project-images/bgfgigg5muslaat0285d.jpg','b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712332869/cerv-project-images/ceefrd3iakxdevahla8f.jpg','2024-04-05 14:58:14','0000-00-00 00:00:00'),(8,6,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712495908/cerv-project-images/xfvb6i3cqfwf7uxtnnkv.jpg','','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712495910/cerv-project-images/ttnv3tzanlqjhelhy6xv.jpg','2024-04-07 12:15:28','0000-00-00 00:00:00'),(9,4,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712496101/cerv-project-images/oyv3u2kthl7vf2wuwvq2.jpg','','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712496103/cerv-project-images/rthfd2dxmtgklycmkjn2.jpg','2024-04-07 12:18:41','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `userDetails` ENABLE KEYS */;
UNLOCK TABLES;

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
  `role` int(1) NOT NULL,
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

-- Dump completed on 2024-04-08 10:29:07
