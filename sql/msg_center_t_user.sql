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
-- Table structure for table `t_user`
--

DROP TABLE IF EXISTS `t_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user` (
  `c_userid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `c_customer` varchar(45) DEFAULT NULL COMMENT '个人/公司名称',
  `c_username` varchar(45) DEFAULT NULL COMMENT '用户名',
  `c_type` int(11) DEFAULT NULL COMMENT '用户类型',
  `c_role` int(11) DEFAULT '2',
  `c_pwd` varchar(45) DEFAULT NULL,
  `c_is_use` int(11) DEFAULT NULL COMMENT '是否可用',
  `c_create_time` datetime DEFAULT NULL,
  `c_dead_time` datetime DEFAULT NULL COMMENT '有效时间',
  `c_phone` varchar(11) DEFAULT NULL COMMENT '手机号码',
  `c_email` varchar(45) DEFAULT NULL COMMENT '邮箱',
  `c_appkey` varchar(45) DEFAULT NULL,
  `c_appscrect` varchar(45) DEFAULT NULL,
  `c_desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`c_userid`),
  UNIQUE KEY `c_username_UNIQUE` (`c_username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user`
--

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;
INSERT INTO `t_user` VALUES (1,NULL,'lkj',100,2,'202cb962ac59075b964b07152d234b70',1,'2016-06-23 22:54:05',NULL,NULL,NULL,'yjMAmfzRQy','AAmPQMX7HbsxMNSPsstByHEskXjfSTDA','高级管理员'),(4,'LX','lzmhlzsd',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-08 13:51:39','2017-08-08 13:51:39','13917609856','','yjMnmfzRQy','CAmPQMX7HbsxMNSPsstByHEskXjfSTDA','账号'),(7,'BZ','abc',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-08 18:01:03','2017-08-08 18:01:03','13917609856',NULL,'yjMnmfzRsy','BAmPQMX7HbsxMNSPsstByHEskXjfSTDA','账号'),(9,'BBZZ','lzmhlzsd12',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-15 10:41:34','2017-08-15 10:41:34','','','cxGNwXJSsB','Cxnpe2K6HzQxDbhEzxth8PdHzhrGK5YC','账号'),(10,'a','a',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-15 16:54:51','2017-08-15 16:54:51','13917609856','332847979@qq.com','aHXRpnnRJf','CsQNsb6TCTPXSS7B2sZtT7Zyx6dswKPf','账号');
/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-17 21:51:42
