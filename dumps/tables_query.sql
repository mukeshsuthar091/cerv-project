CREATE DATABASE  IF NOT EXISTS `bhpe43rhnivc28iaaaha` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bhpe43rhnivc28iaaaha`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: bhpe43rhnivc28iaaaha-mysql.services.clever-cloud.com    Database: bhpe43rhnivc28iaaaha
-- ------------------------------------------------------
-- Server version	8.0.22-13

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'a05a675a-1414-11e9-9c82-cecd01b08c7e:1-491550428,
a38a16d0-767a-11eb-abe2-cecd029e558e:1-381572339';

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `label` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (14,48,'Office','A-101 Alpha pvt. ltd.',NULL,NULL,NULL,NULL,0,'2024-04-10 08:53:53','2024-04-10 08:53:53'),(15,48,'Farm House','A-101, MoonLight farm house.',NULL,NULL,NULL,NULL,0,'2024-04-10 08:55:14','2024-04-10 08:55:14'),(16,48,'Home','C-301, Bella Residency.',NULL,NULL,NULL,NULL,0,'2024-04-10 09:42:57','2024-04-10 09:42:57'),(18,78,'Home','C-301, Bella Residency.',NULL,NULL,NULL,NULL,0,'2024-04-12 17:21:58','2024-04-12 17:21:58');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,49,'Noodles',NULL,'2024-04-11 06:05:12','2024-04-13 13:19:56'),(2,49,'Frankie','https://res.cloudinary.com/dqoso7erl/image/upload/v1713022013/cerv-project-images/karhakp9yggoax3shq3h.jpg','2024-04-11 06:36:38','2024-04-14 14:13:48'),(3,49,'Szechwan',NULL,'2024-04-12 10:14:12','2024-04-12 10:14:12'),(8,78,'Noodles',NULL,'2024-04-13 08:09:18','2024-04-13 08:09:18'),(9,78,'Noodles','https://res.cloudinary.com/dqoso7erl/image/upload/v1712995817/cerv-project-images/edb6div8fw8bh52gdxx9.jpg','2024-04-13 08:10:16','2024-04-13 08:10:18'),(11,49,'Frenky','https://res.cloudinary.com/dqoso7erl/image/upload/v1713012100/cerv-project-images/epj9eewuonvwljxzyfci.jpg','2024-04-13 12:41:39','2024-04-13 14:46:37'),(12,49,'Pizza','https://res.cloudinary.com/dqoso7erl/image/upload/v1713158005/cerv-project-images/acbuhh5j7amwxgdzj1ro.jpg','2024-04-15 05:13:17','2024-04-15 05:13:26');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size` varchar(50) NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (1,1,'Regular',1,150.00,'2024-04-11 06:26:00','2024-04-11 06:26:00'),(4,1,'Small',1,90.00,'2024-04-11 06:28:54','2024-04-11 06:28:54'),(5,1,'Medium',1,175.00,'2024-04-11 06:28:55','2024-04-11 06:28:55'),(6,1,'Large',1,200.00,'2024-04-11 06:28:55','2024-04-11 06:28:55'),(7,2,'Regular',1,150.00,'2024-04-12 14:55:28','2024-04-12 14:55:28'),(8,2,'Jain',1,145.00,'2024-04-12 14:55:28','2024-04-12 14:55:28');
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `sub_category_id` int NOT NULL,
  `food_name` varchar(255) DEFAULT NULL,
  `food_description` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,49,1,1,'House Noodles','This is a dummy text.',NULL,'2024-04-11 06:11:49','2024-04-11 06:11:49'),(2,49,2,2,'Jira Rice','This is a dummy text.',NULL,'2024-04-11 06:39:17','2024-04-11 06:39:17'),(3,49,1,1,'Tender Riblet Noodles','This is a dummy text.',NULL,'2024-04-12 10:42:04','2024-04-12 10:42:04'),(4,49,1,1,'Original Noodles','This is a dummy text.',NULL,'2024-04-12 10:42:04','2024-04-12 10:42:04');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `rated_entity_id` int NOT NULL,
  `rating_value` tinyint(1) NOT NULL DEFAULT '0',
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `rated_entity_id` (`rated_entity_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`rated_entity_id`) REFERENCES `products` (`id`),
  CONSTRAINT `ratings_chk_1` CHECK (((`rating_value` >= 1) and (`rating_value` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,49,1,4,'Nice Food','2024-04-12 07:08:34','2024-04-12 07:08:34'),(2,49,2,5,'Nice Food','2024-04-12 07:08:34','2024-04-12 07:08:34');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `sub_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,49,1,'Veg Noodles',NULL,'2024-04-11 06:05:54','2024-04-11 06:05:54'),(2,49,2,'Cheese Frankie','https://res.cloudinary.com/dqoso7erl/image/upload/v1713105649/cerv-project-images/x8wa75ktiyzsdgpaek1q.jpg','2024-04-11 06:37:21','2024-04-14 14:40:50'),(3,49,1,'Chinese Noodles',NULL,'2024-04-12 12:32:01','2024-04-12 12:32:01'),(4,49,1,'Non-Veg Noodles',NULL,'2024-04-12 12:32:01','2024-04-12 12:32:01'),(5,49,2,'Veg Frankie',NULL,'2024-04-14 14:19:20','2024-04-14 14:19:20'),(6,49,2,'Veg Frankie','https://res.cloudinary.com/dqoso7erl/image/upload/v1713104524/cerv-project-images/fwvgiyojbwrz1oqwxpdk.jpg','2024-04-14 14:22:02','2024-04-14 14:22:05'),(7,49,12,'Veg Pizza','https://res.cloudinary.com/dqoso7erl/image/upload/v1713158090/cerv-project-images/osnffqdg2lgjckkihuv2.jpg','2024-04-15 05:14:44','2024-04-15 05:14:51');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userDetails`
--

DROP TABLE IF EXISTS `userDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `business_license_number` varchar(100) DEFAULT NULL,
  `business_license_image` varchar(255) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `bio` text,
  `order_type` enum('Delivery','Pickup','Both') DEFAULT NULL,
  `distance_and_fee` varchar(100) DEFAULT NULL,
  `food_category` varchar(100) DEFAULT NULL,
  `cost_per_plat` varchar(150) DEFAULT NULL,
  `driver_name` varchar(150) DEFAULT NULL,
  `driver_license_number` varchar(150) DEFAULT NULL,
  `driver_license_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `userDetails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userDetails`
--

LOCK TABLES `userDetails` WRITE;
/*!40000 ALTER TABLE `userDetails` DISABLE KEYS */;
INSERT INTO `userDetails` VALUES (26,49,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712731937/cerv-project-images/w6vcl6llh5kfvrczpoqm.jpg','b-401, king residency',NULL,NULL,NULL,NULL,'Hello! there.','Delivery','5km: 10rs.','Chinese',NULL,'Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712731939/cerv-project-images/et44nr5rptidkdxronoa.jpg','2024-04-10 06:52:20','2024-04-10 06:52:20'),(27,78,'ABCF874176A9F4F00','https://res.cloudinary.com/dqoso7erl/image/upload/v1712911078/cerv-project-images/sg7t6ek9ycevplrtk3uo.jpg','A-404,  crazy residency',NULL,NULL,NULL,NULL,'Hello! there, our food is good.','Pickup','15km: 30rs.','Indian',NULL,'rohit','XYZ6DF31EF6648F00','https://res.cloudinary.com/dqoso7erl/image/upload/v1712911082/cerv-project-images/sxzmawmtemiqx0i6ykk0.png','2024-04-11 12:26:53','2024-04-12 08:38:03'),(44,107,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712907130/cerv-project-images/klf6f8ytkhlenhenszcy.jpg','b-401, king residency',NULL,NULL,NULL,NULL,'Hello! there.','Delivery','5km: 10rs.','Chinese',NULL,'Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712907131/cerv-project-images/cqyjj2aailqrhjkyuuyx.png','2024-04-12 07:32:09','2024-04-12 07:32:12'),(45,114,'DGDF874176A9F4F51','https://res.cloudinary.com/dqoso7erl/image/upload/v1712996122/cerv-project-images/le1nlzijdpcjkeq35bzk.jpg','b-401, king residency',NULL,NULL,NULL,NULL,'Hello! there.','Delivery','5km: 10rs.','Chinese',NULL,'Aakash','DF56DF31EF6648F46','https://res.cloudinary.com/dqoso7erl/image/upload/v1712996122/cerv-project-images/v5iy5iyjrjyhl2dwtgdu.jpg','2024-04-13 08:15:20','2024-04-13 08:15:23');
/*!40000 ALTER TABLE `userDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `stripe_id` varchar(50) DEFAULT NULL,
  `wallet_balance` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (48,'ravi','ravi@gmail.com','$2a$10$03GrWHtBi2ObNjYQHeXWmu3Km7Ta59P7L6GM8TN0Koqw7y7i1FGpy',NULL,'91','8178454119',NULL,NULL,'2024-04-10 06:48:27','2024-04-10 06:49:29',2),(49,'vijay','vijay12@gmail.com','$2a$10$ZDn9PmXum6OemRXgHVhjZOUA00mwj.grf7Za3.296gH1.Gaq0IUjq',NULL,'91','9632485180',NULL,NULL,'2024-04-10 06:52:12','2024-04-10 06:52:12',1),(54,'nilay','nilay001@gmail.com','$2a$10$MM0kx8tJcVSPScW/NVTj5eCfeN19z91whzc1zh6OTJkY5MvgWMtei',NULL,'91','9876543210',NULL,NULL,'2024-04-10 12:00:17','2024-04-10 12:25:35',2),(55,'Parth','parthmodi22500@gmail.com','$2a$10$.xsiffIga/RjwisrmQ9ln.KKWyGrqhOpPM7hffRw1QelpZcd8rLoq',NULL,'91','8320375847',NULL,NULL,'2024-04-11 03:41:04','2024-04-11 03:41:04',2),(61,'P','pmodi0705@gmail.com','$2a$10$deljfSp6hDzCMOvZRrXbn.NxW9kYilP3nEuuZQxOwuLalwVmymNZW',NULL,'91','8320375844',NULL,NULL,'2024-04-11 04:05:22','2024-04-11 04:05:22',2),(62,'Pppp','H12@gmail.com','$2a$10$rziDZ/ogMMZUxs8OWimWY.xq1SdN.QLSck3tgyB/7gG/zvp5P92fi',NULL,'91','1234567890',NULL,NULL,'2024-04-11 04:09:55','2024-04-11 04:09:55',2),(63,'rohit','rohit20@gmail.com','$2a$10$YI717sjYGCfEQE.XcdNR6OGe6TJ/Bm0qsZlBdqSDkr/WXpKCeV1jW',NULL,'91','9999999999',NULL,NULL,'2024-04-11 04:20:00','2024-04-11 04:20:00',2),(64,'Jinay shah','Jinayshah@gmail.com','$2a$10$oiAPy5VJK0cMJ27Jaykfh..1C764L9tH9d40hcS3Go2ohp4s1Fc26',NULL,'91','5656565653',NULL,NULL,'2024-04-11 06:20:38','2024-04-11 06:20:38',2),(66,'vijay','vijay0032@gmail.com','$2a$10$t2XyEzwgWBYkPNZX0Sut1uDZCIwKcHMxzJ6/VIMgd9U/0XV1cx0Mi',NULL,'91','1234569990',NULL,NULL,'2024-04-11 06:34:35','2024-04-11 06:34:35',2),(69,'Parthk','Rr@gmail.com','$2a$10$GKNTZAtythzDwcmroV.YgOxHV6E7u3NHGXryiqYGQyQuSDmAKv6ci',NULL,'91','5550000000',NULL,NULL,'2024-04-11 11:45:22','2024-04-11 11:45:22',2),(74,'smit','smit@gmail.com','$2a$10$o9HK1BIf8vtjoBLWjxd/JuwctZ6TXQQW2pH.A4Cw5VbBERLov/LhO','https://res.cloudinary.com/dqoso7erl/image/upload/v1712899717/cerv-project-images/wccutn5bnqesetn81nmp.jpg','91','9945433350',NULL,NULL,'2024-04-11 12:20:29','2024-04-12 05:28:38',2),(78,'vijay','vijay001@gmail.com','$2a$10$nnCojNeCauTsVY7ecQD3suEbI7oopV.njS4gzsBXZpG9VuosVmYGe','https://res.cloudinary.com/dqoso7erl/image/upload/v1712995598/cerv-project-images/pvdteijfka0w2n1b0v4z.jpg','91','1234563330',NULL,NULL,'2024-04-11 12:26:53','2024-04-13 08:06:39',1),(79,'Test','Test@gmail.com','$2a$10$aY08YQ29KWOqcZ4FAv7oo.GWdkMTgj3TSI9cXWu1rDCrh0zeGbydW',NULL,'91','8320827244',NULL,NULL,'2024-04-11 12:49:56','2024-04-11 12:49:56',2),(80,'Xhfh','Hhhhhhh@gmail.com','$2a$10$iXU7ihGGiM7FuIIlpF6/cudm2Sv8oRmvubVW.946rsiqkXjdTd5UW',NULL,'91','5556663322',NULL,NULL,'2024-04-11 13:06:28','2024-04-11 13:06:28',2),(104,'Ketan','Ketan@gmail.com','$2a$10$3RTj0upYuHAeW5mBtCaq9OqY4uihS3c8WXcuyqWM654ybz9l2p3ti',NULL,'91','8695423870',NULL,NULL,'2024-04-12 04:09:52','2024-04-12 04:09:52',2),(105,'Jay','Jay@gmail.com','$2a$10$zCSFUTMCpqSMjiCcozp4.u9h4QFnUXcTR2PvoxXn6YzFc86HMCB9a',NULL,'91','8596555774',NULL,NULL,'2024-04-12 06:33:33','2024-04-12 06:33:33',2),(106,'Kevin','Kevin@gmail.com','$2a$10$zf4rynZxxt2nfej0Hjlk4eQWig/4tBRg4ZT2LosEOaBDlW1az1YXW',NULL,'91','8913294648',NULL,NULL,'2024-04-12 06:46:44','2024-04-12 06:46:44',2),(107,'sunil','sunil@gmail.com','$2a$10$1PDGXS/AMBc3KrfN4uCRyedDql8IeHSiCUgpv9QPHgpHylXuMQ8a.','https://res.cloudinary.com/dqoso7erl/image/upload/v1712907129/cerv-project-images/wmomugnm9zwdwqahfdtg.jpg','91','114520707',NULL,NULL,'2024-04-12 07:32:08','2024-04-12 07:32:12',1),(109,'Tt','Tt@gmail.com','$2a$10$YQ98eHo19DAGemzV5vv4lOQIqDqTAidWIfIxib/.T5.Q6QgHGGawG',NULL,'91','2356891473',NULL,NULL,'2024-04-12 16:27:24','2024-04-12 16:27:24',2),(110,'User','User@gmail.com','$2a$10$j5t.ifr.YmeA.LsXk3vHm.4tw7wX.P2dlJHbfq5G5Pt50uknunn0y',NULL,'91','8989898231',NULL,NULL,'2024-04-12 16:40:55','2024-04-12 16:40:55',2),(111,'Rr','Rre@gmail.com','$2a$10$AZ1lE0nIKOLGpmJfy0jSAuRhfWFeKvhzHORHm1URVoxbF7RXiO1kG',NULL,'91','3698521477',NULL,NULL,'2024-04-12 19:43:14','2024-04-12 19:43:14',2),(114,'chetan','chetan@gmail.com','$2a$10$ldW/z6A5NbhatzQ9boIqDeDwE26tjN0B39C52cd9rHX3.gzv5D/8G','https://res.cloudinary.com/dqoso7erl/image/upload/v1712996121/cerv-project-images/yjvabmaivvmm0nl9p6ds.jpg','91','2222222222',NULL,NULL,'2024-04-13 08:15:20','2024-04-13 08:15:23',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-15 11:03:18
