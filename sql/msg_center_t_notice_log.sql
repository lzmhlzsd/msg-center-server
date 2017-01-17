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
-- Table structure for table `t_notice_log`
--

DROP TABLE IF EXISTS `t_notice_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_notice_log` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_appkey` varchar(45) DEFAULT NULL COMMENT '对应的appkey ',
  `c_type` varchar(64) DEFAULT NULL COMMENT '消息类型  [邮件、短信、微信]',
  `c_from` varchar(128) DEFAULT NULL COMMENT '发送来源',
  `c_content` text,
  `c_notice_to` text,
  `c_status` int(11) DEFAULT NULL COMMENT '发送成功标志   1： 成功   0 ： 失败',
  `c_send_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  `c_desc` text,
  `c_create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  KEY `INDEX` (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_notice_log`
--

LOCK TABLES `t_notice_log` WRITE;
/*!40000 ALTER TABLE `t_notice_log` DISABLE KEYS */;
INSERT INTO `t_notice_log` VALUES (57,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',1,'2016-09-02 03:59:34','','2016-09-02 11:59:34'),(58,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 03:59:35','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 11:59:34'),(59,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',1,'2016-09-02 05:18:51','','2016-09-02 13:18:50'),(60,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:18:51','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 13:18:50'),(61,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:21:49','\"微信该服务没有审批通过\"','2016-09-02 13:21:49'),(62,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:21:50','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 13:21:49'),(63,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:22:41','\"微信服务已经过期,请重新申请\"','2016-09-02 13:22:41'),(64,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:22:42','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 13:22:41'),(65,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',1,'2016-09-02 05:23:22','','2016-09-02 13:23:22'),(66,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:23:23','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 13:23:22'),(67,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',1,'2016-09-02 05:26:54','','2016-09-02 13:26:53'),(68,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码8000! 当日生产产量1000，生产效率10%','陆凯杰',0,'2016-09-02 05:26:54','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 13:26:53'),(69,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码0800! 当日生产产量200，生产效率12%','陆凯杰',1,'2016-09-02 13:34:32','','2016-09-02 21:34:31'),(70,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码0800! 当日生产产量200，生产效率12%','陆凯杰',0,'2016-09-02 13:34:32','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-02 21:34:31'),(71,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码0800! 当日生产产量200，生产效率12%','陆凯杰',1,'2016-09-03 13:35:39','','2016-09-03 21:35:38'),(72,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码0800! 当日生产产量200，生产效率12%','陆凯杰',0,'2016-09-03 13:35:39','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-03 21:35:38'),(73,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','设备报警，报警码0100! 当日生产产量800，生产效率100%','陆凯杰,刘坚',1,'2016-09-03 14:00:45','','2016-09-03 22:00:44'),(74,'yjMnmfzRQy','email','332847979@qq.com','设备报警，报警码0100! 当日生产产量800，生产效率100%','陆凯杰,刘坚',0,'2016-09-03 14:00:45','{\"code\":\"EENVELOPE\",\"command\":\"API\"}','2016-09-03 22:00:44'),(75,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',1,'2016-09-05 14:08:23','','2016-09-05 22:08:22'),(76,'yjMnmfzRQy','email','332847979@qq.com','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',1,'2016-09-05 14:08:23','','2016-09-05 22:08:22'),(77,'yjMnmfzRQy','weixin','wx53f7880bd8c78f62','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',1,'2016-09-05 14:09:42','','2016-09-05 22:09:42'),(78,'yjMnmfzRQy','email','332847979@qq.com','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',1,'2016-09-05 14:09:43','','2016-09-05 22:09:42'),(79,'yjMnmfzRQy','msg','8ecc10f0e2d7af479c8c365a619f785f','','陆凯杰',0,'2016-09-05 14:18:55','\"ReferenceError: emailto is not defined\"','2016-09-05 22:18:55'),(80,'yjMnmfzRQy','msg','8ecc10f0e2d7af479c8c365a619f785f','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',1,'2016-09-05 14:25:19','','2016-09-05 22:25:18'),(81,'yjMnmfzRQy','msg','8ecc10f0e2d7af479c8c365a619f785f','【斑彰科技】今日产量1200，完成率80%，报废率1.5%','陆凯杰',0,'2016-09-05 14:25:19','{}','2016-09-05 22:25:18'),(82,'yjMnmfzRQy','msg','8ecc10f0e2d7af479c8c365a619f785f','【斑彰科技】今日产量1500，完成率80%，报废率2.0%','陆凯杰',1,'2016-09-05 14:27:44','','2016-09-05 22:27:44');
/*!40000 ALTER TABLE `t_notice_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-17 21:51:39
