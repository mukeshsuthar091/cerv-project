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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userDetails`
--

LOCK TABLES `userDetails` WRITE;
/*!40000 ALTER TABLE `userDetails` DISABLE KEYS */;
INSERT INTO `userDetails` VALUES (1,1,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:17:05','0000-00-00 00:00:00'),(2,3,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:38:53','0000-00-00 00:00:00'),(3,2,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-03 14:39:13','0000-00-00 00:00:00'),(5,6,'DGDF874176A9F4F51',NULL,'b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46',NULL,'2024-04-05 08:43:51','0000-00-00 00:00:00'),(7,7,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712332867/cerv-project-images/bgfgigg5muslaat0285d.jpg','b-401, king residency','Hello! there.','Delivery','5','5km: 10rs.','Chinese','Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712332869/cerv-project-images/ceefrd3iakxdevahla8f.jpg','2024-04-05 14:58:14','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `userDetails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-07 18:35:48
