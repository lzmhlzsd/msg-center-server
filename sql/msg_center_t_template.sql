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
-- Table structure for table `t_template`
--

DROP TABLE IF EXISTS `t_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_template` (
  `c_temp_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `c_temp_no` varchar(45) NOT NULL COMMENT '模板编号',
  `c_temp_content` text,
  `c_temp_status` varchar(45) DEFAULT NULL COMMENT '模板状态  短信模板  需要审核',
  `c_temp_desc` varchar(64) DEFAULT NULL COMMENT '模板描述',
  `c_temp_create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `c_temp_userid` int(11) NOT NULL COMMENT '用户id',
  PRIMARY KEY (`c_temp_id`),
  UNIQUE KEY `UNQIUE` (`c_temp_userid`,`c_temp_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_template`
--

LOCK TABLES `t_template` WRITE;
/*!40000 ALTER TABLE `t_template` DISABLE KEYS */;
INSERT INTO `t_template` VALUES (3,'122',NULL,NULL,NULL,'2016-08-08 09:08:17',1),(4,'123',NULL,NULL,NULL,'2016-08-08 09:08:17',1),(5,'B001','设备报警，报警码{{code}}! 当日生产产量{{yiled}}，生产效率{{ratio}}',NULL,'示例模板','2016-08-11 05:45:01',4),(6,'B002','AafefefefWFE131',NULL,'111111','2016-08-11 09:50:23',4),(9,'1526442','【斑彰科技】设备编号#mac_no#，状态[#status#]','1','','2016-09-05 13:49:52',4),(10,'1526444','【斑彰科技】今日产量#num#，完成率#ratio#，报废率#scrap#','1',NULL,'2016-09-05 13:49:52',4);
/*!40000 ALTER TABLE `t_template` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-17 21:51:50
