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
  `c_sync` int(11) DEFAULT '0' COMMENT '0: 未同步  1：已同步  2: 已编辑，未同步',
  `c_create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `c_status` int(11) DEFAULT '0' COMMENT '是否关注',
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_member`
--

LOCK TABLES `t_member` WRITE;
/*!40000 ALTER TABLE `t_member` DISABLE KEYS */;
INSERT INTO `t_member` VALUES (139,'http://shp.qpic.cn/bizmp/vaqaZGfVVGiaRp392bCQ3nf2yp99MJFuex2MXpIzh9YqJycf5zSDSXA/','陆凯杰','003',NULL,'13917609856','332847979@qq.com','lukaijielzmhlzsd',4,1,'2016-09-05 13:37:12',1),(140,'http://shp.qpic.cn/bizmp/vaqaZGfVVGgK8WsBZ9Iicbj7reyEGeL7YeMt63iawMGFu9sYh4Nr3x8g/','杨正','004',NULL,'','','hueijin1987',4,1,'2016-09-05 13:37:12',1),(141,'','leo','005',NULL,'18221741738','','',4,1,'2016-09-05 13:37:12',1),(142,'http://shp.qpic.cn/bizmp/vaqaZGfVVGgK8WsBZ9Iicbj7reyEGeL7YYyQHM7LaQKaMhHK9SpiayEA/','周卫国','006',NULL,'13801676794','','david13801676794',4,1,'2016-09-05 13:37:12',1),(143,'http://shp.qpic.cn/bizmp/vaqaZGfVVGgK8WsBZ9Iicbj7reyEGeL7YEOTgwcsWTJ7eywhouJ245Q/','Jonhson','007',NULL,'15900705842','','yuanqibumi7286',4,1,'2016-09-05 13:37:12',1),(144,'http://shp.qpic.cn/bizmp/vaqaZGfVVGhRf8hgNsfP5kibMyfZGWQVmAtKomExfXN6QcKutEv72yQ/','刘坚','008',NULL,'18521599459','','liujian8802',4,1,'2016-09-05 13:37:12',1),(145,'','邬峰','lisi',NULL,'15062431973','498387646@qq.com','',4,1,'2016-09-05 13:37:12',4),(146,'','张三','zhangsan',NULL,'15913112120','zhangsan@gzmailteam.com','zhangsan',4,1,'2016-09-05 13:37:12',4);
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

-- Dump completed on 2017-01-17 21:51:47
