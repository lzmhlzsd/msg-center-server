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
-- Table structure for table `t_config`
--

DROP TABLE IF EXISTS `t_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_config` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_userid` int(11) DEFAULT NULL,
  `c_email_host` varchar(45) DEFAULT NULL,
  `c_email_port` varchar(45) DEFAULT NULL,
  `c_email_username` varchar(45) DEFAULT NULL,
  `c_email_password` varchar(45) DEFAULT NULL,
  `c_msg_apikey` varchar(128) DEFAULT NULL,
  `c_weixin_qyh_cropid` varchar(64) DEFAULT NULL,
  `c_weixin_qyh_screct` varchar(128) DEFAULT NULL,
  `c_weixin_gzh` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  UNIQUE KEY `c_userid_UNIQUE` (`c_userid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_config`
--

LOCK TABLES `t_config` WRITE;
/*!40000 ALTER TABLE `t_config` DISABLE KEYS */;
INSERT INTO `t_config` VALUES (1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,4,'smtp.sina.com','465','1','2','3','wx53f7880bd8c78f62','3Wzro5lNaBqdiW8ZLtl7W0DFI0rww4ZR4_7yfwrEWyINsJgjcTtoBdoVCAZWBG4c',NULL);
/*!40000 ALTER TABLE `t_config` ENABLE KEYS */;
UNLOCK TABLES;

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
  `c_status` int(11) DEFAULT '0' COMMENT '是否关注',
  PRIMARY KEY (`c_id`),
  UNIQUE KEY `UNIQUE` (`c_userid`,`c_userno`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_member`
--

LOCK TABLES `t_member` WRITE;
/*!40000 ALTER TABLE `t_member` DISABLE KEYS */;
INSERT INTO `t_member` VALUES (1,NULL,'A1','101',NULL,'13917609856','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',0),(6,NULL,'b','1001',NULL,'13917609857','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',0),(7,NULL,'lkj','1002',NULL,'13917609856','332847979@qq.com',NULL,4,0,'2016-08-12 09:04:40',0);
/*!40000 ALTER TABLE `t_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_notice_log`
--

DROP TABLE IF EXISTS `t_notice_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_notice_log` (
  `c_id` int(11) NOT NULL,
  `c_appkey` varchar(45) DEFAULT NULL COMMENT '对应的appkey ',
  `c_type` varchar(64) DEFAULT NULL COMMENT '消息类型  [邮件、短信、微信]',
  `c_content` varchar(255) DEFAULT NULL,
  `c_notice_to` varchar(255) DEFAULT NULL,
  `c_status` int(11) DEFAULT NULL COMMENT '发送成功标志   1： 成功   0 ： 失败',
  `c_create_time` timestamp NULL DEFAULT NULL COMMENT '发送时间',
  PRIMARY KEY (`c_id`),
  KEY `INDEX` (`c_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_notice_log`
--

LOCK TABLES `t_notice_log` WRITE;
/*!40000 ALTER TABLE `t_notice_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_notice_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_service`
--

DROP TABLE IF EXISTS `t_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_service` (
  `c_serviceid` int(11) NOT NULL,
  `c_servicename` varchar(45) DEFAULT NULL COMMENT '服务名称',
  `c_type` int(11) DEFAULT NULL COMMENT '服务类型 1=微信企业号 2=邮件 3=短信',
  `c_status` int(11) DEFAULT NULL,
  `c_desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`c_serviceid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_service`
--

LOCK TABLES `t_service` WRITE;
/*!40000 ALTER TABLE `t_service` DISABLE KEYS */;
INSERT INTO `t_service` VALUES (1,'邮件',1,1,'邮件'),(2,'短信',2,1,'短信'),(3,'微信企业号',3,1,'微信企业号');
/*!40000 ALTER TABLE `t_service` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_template`
--

LOCK TABLES `t_template` WRITE;
/*!40000 ALTER TABLE `t_template` DISABLE KEYS */;
INSERT INTO `t_template` VALUES (3,'122',NULL,NULL,NULL,'2016-08-08 09:08:17',1),(4,'123',NULL,NULL,NULL,'2016-08-08 09:08:17',1),(5,'B001','你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}你好，报警码{{code}}',NULL,'示例模板','2016-08-11 05:45:01',4),(6,'B002','AafefefefWFE131',NULL,'111111','2016-08-11 09:50:23',4);
/*!40000 ALTER TABLE `t_template` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `t_user` VALUES (1,NULL,'lkj',100,2,'202cb962ac59075b964b07152d234b70',1,'2016-06-23 22:54:05',NULL,NULL,NULL,NULL,NULL,'高级管理员'),(4,'LX','lzmhlzsd',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-08 13:51:39',NULL,'13917609856','','yjMnmfzRQy','CAmPQMX7HbsxMNSPsstByHEskXjfSTDA','账号'),(7,'BZ','abc',1,2,'202cb962ac59075b964b07152d234b70',0,'2016-08-08 18:01:03',NULL,'13917609856',NULL,'yjMnmfzRQy','CAmPQMX7HbsxMNSPsstByHEskXjfSTDA','账号'),(9,'BBZZ','lzmhlzsd12',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-15 10:41:34',NULL,'','','cxGNwXJSsB','Cxnpe2K6HzQxDbhEzxth8PdHzhrGK5YC','账号'),(10,'a','a',1,2,'202cb962ac59075b964b07152d234b70',1,'2016-08-15 16:54:51','2017-08-15 16:54:51','13917609856','332847979@qq.com','aHXRpnnRJf','CsQNsb6TCTPXSS7B2sZtT7Zyx6dswKPf','账号');
/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_service`
--

DROP TABLE IF EXISTS `t_user_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_user_service` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_userid` int(11) DEFAULT NULL COMMENT '用户ID',
  `c_serviceid` int(11) DEFAULT NULL COMMENT '服务ID',
  `c_service_status` int(11) DEFAULT NULL COMMENT '0:未申请  1:申请中  2:已获得',
  `c_apply_time` datetime DEFAULT NULL COMMENT '申请日期',
  `c_approval_time` datetime DEFAULT NULL COMMENT '审核日期',
  PRIMARY KEY (`c_id`),
  UNIQUE KEY `UNIQUE` (`c_userid`,`c_serviceid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_service`
--

LOCK TABLES `t_user_service` WRITE;
/*!40000 ALTER TABLE `t_user_service` DISABLE KEYS */;
INSERT INTO `t_user_service` VALUES (2,4,1,1,'2016-08-08 16:01:12',NULL),(3,4,2,1,'2016-08-08 16:02:36',NULL),(4,4,3,2,'2016-08-15 12:02:36','2016-08-15 12:30:36');
/*!40000 ALTER TABLE `t_user_service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-15 17:52:09
