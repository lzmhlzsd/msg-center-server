-- MySQL dump 10.13  Distrib 5.6.23, for Win64 (x86_64)
--
-- Host: localhost    Database: msg_center
-- ------------------------------------------------------
-- Server version	5.5.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_notice_total`
--

DROP TABLE IF EXISTS `t_notice_total`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_notice_total` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_appkey` varchar(45) DEFAULT NULL,
  `c_date` datetime DEFAULT NULL,
  `c_email_success` int(11) DEFAULT NULL,
  `c_email_fail` int(11) DEFAULT NULL,
  `c_msg_success` int(11) DEFAULT NULL,
  `c_msg_fail` int(11) DEFAULT NULL,
  `c_weixin_success` int(11) DEFAULT NULL,
  `c_weixin_fail` int(11) DEFAULT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_notice_total`
--

LOCK TABLES `t_notice_total` WRITE;
/*!40000 ALTER TABLE `t_notice_total` DISABLE KEYS */;
INSERT INTO `t_notice_total` VALUES (1,'yjMnmfzRQy','2016-08-22 00:00:00',1,0,0,0,0,0),(2,'yjMnmfzRQy','2016-08-25 00:00:00',1,0,0,0,0,0),(3,'yjMnmfzRQy','2016-08-29 00:00:00',1,0,0,0,2,0),(5,'yjMnmfzRQy','2016-09-01 00:00:00',0,5,0,0,4,0),(10,'yjMnmfzRQy','2016-09-02 00:00:00',0,7,0,0,5,2),(11,'yjMnmfzRQy','2016-09-03 00:00:00',0,2,0,0,2,0),(12,'yjMnmfzRQy','2016-09-05 00:00:00',2,0,1,2,2,0);
/*!40000 ALTER TABLE `t_notice_total` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-17 21:51:49
