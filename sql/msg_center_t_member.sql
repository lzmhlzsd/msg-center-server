-- MySQL dump 10.13  Distrib 5.7.12, for osx10.9 (x86_64)
--
-- Host: localhost    Database: msg_center
-- ------------------------------------------------------
-- Server version	5.7.12

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
-- Table structure for table `t_member`
--

DROP TABLE IF EXISTS `t_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_member` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_avatar` varchar(256) DEFAULT NULL,
  `c_name` varchar(45) NOT NULL,
  `c_userno` varchar(45) NOT NULL,
  `c_department` varchar(45) DEFAULT NULL COMMENT '部门',
  `c_mobile` varchar(45) NOT NULL,
  `c_email` varchar(45) NOT NULL,
  `c_weixinid` varchar(45) DEFAULT NULL,
  `c_userid` int(11) NOT NULL,
  `c_sync` int(11) DEFAULT '0' COMMENT '0: 未同步  1：已同步',
  `c_create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `c_status` int(11) DEFAULT NULL COMMENT '是否关注',
  PRIMARY KEY (`c_id`),
  UNIQUE KEY `UNIQUE` (`c_userid`,`c_userno`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_member`
--

LOCK TABLES `t_member` WRITE;
/*!40000 ALTER TABLE `t_member` DISABLE KEYS */;
INSERT INTO `t_member` VALUES (1,NULL,'A','101',NULL,'13917609856','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',NULL),(6,NULL,'b','1001',NULL,'13917609857','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',NULL),(7,NULL,'lkj','1002',NULL,'13917609856','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',NULL);
/*!40000 ALTER TABLE `t_member` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-12 18:06:00
