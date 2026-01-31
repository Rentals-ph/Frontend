/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: rentals_ph
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `agent_approvals`
--

DROP TABLE IF EXISTS `agent_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_approvals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `approved_by_user_id` bigint(20) unsigned NOT NULL,
  `action` enum('approved','rejected') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_approvals_agent_id_created_at_index` (`created_at`),
  KEY `agent_approvals_user_id_foreign` (`user_id`),
  KEY `agent_approvals_approved_by_user_id_foreign` (`approved_by_user_id`),
  CONSTRAINT `agent_approvals_approved_by_user_id_foreign` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `agent_approvals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_approvals`
--

LOCK TABLES `agent_approvals` WRITE;
/*!40000 ALTER TABLE `agent_approvals` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `agent_approvals` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `read_time` int(11) NOT NULL,
  `author` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `migrations` VALUES
(1,'2019_12_14_000001_create_personal_access_tokens_table',1),
(2,'2024_01_01_000000_create_sessions_table',1),
(3,'2024_01_01_000001_create_rent_managers_table',1),
(4,'2024_01_01_000002_create_properties_table',1),
(5,'2024_01_01_000003_create_testimonials_table',1),
(6,'2024_01_01_000004_create_blogs_table',1),
(7,'2024_01_01_000005_create_users_table',1),
(8,'2024_01_01_000006_create_password_reset_tokens_table',1),
(9,'2024_01_01_000007_create_agents_table',1),
(10,'2024_01_01_000008_create_admins_table',1),
(11,'2024_01_01_000009_create_agent_approvals_table',1),
(12,'2026_01_28_035118_add_verified_column_to_agents_table',1),
(13,'2026_01_29_094637_merge_agents_and_admins_into_users_table',1),
(14,'2026_01_30_093953_add_agent_and_additional_fields_to_properties_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `personal_access_tokens` VALUES
(1,'App\\Models\\User',1,'auth-token','9bcad110e3a07c635786400834ae2f91e96328959ae8104b2b0010ac0babf410','[\"*\"]',NULL,NULL,'2026-01-29 18:37:15','2026-01-29 18:37:15'),
(2,'App\\Models\\User',2,'admin-auth-token','eb8db383e7e3f82a7f680f329473b6d7c8c54343b5d3a36e877bf95da69ea106','[\"*\"]',NULL,NULL,'2026-01-29 18:46:43','2026-01-29 18:46:43'),
(3,'App\\Models\\User',1,'auth-token','d3e3a564027536b2eb0b22934bb8e19977e1118ce7b4077eeeeff24ce6e74939','[\"*\"]',NULL,NULL,'2026-01-30 01:27:58','2026-01-30 01:27:58'),
(4,'App\\Models\\User',2,'admin-auth-token','b9f125d380fd43a00aaf5283883fab7f9eca4d1b9ca7a0e8a38290ce566485b2','[\"*\"]',NULL,NULL,'2026-01-30 01:28:49','2026-01-30 01:28:49'),
(5,'App\\Models\\User',1,'auth-token','74f19f5c706f125a7c29befe5555cc1a5be679b9c2d9eeac508230eceb62be3f','[\"*\"]',NULL,NULL,'2026-01-30 01:30:35','2026-01-30 01:30:35'),
(6,'App\\Models\\User',1,'auth-token','200dffa424a5985c364443b1875a0d2b1459e1a262ed3d83ff24f78791abfca3','[\"*\"]','2026-01-30 18:21:43',NULL,'2026-01-30 17:55:49','2026-01-30 18:21:43'),
(7,'App\\Models\\User',1,'auth-token','5026c74cc2a2e975f374b5186219398bfbba5522a51f921382b9a2101195e40b','[\"*\"]','2026-01-30 19:30:24',NULL,'2026-01-30 19:06:18','2026-01-30 19:30:24');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `agent_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `zoom_level` varchar(10) DEFAULT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Philippines',
  `state_province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `street_address` text DEFAULT NULL,
  `owner_firstname` varchar(100) DEFAULT NULL,
  `owner_lastname` varchar(100) DEFAULT NULL,
  `owner_phone` varchar(50) DEFAULT NULL,
  `owner_email` varchar(255) DEFAULT NULL,
  `owner_country` varchar(100) DEFAULT NULL,
  `owner_state` varchar(100) DEFAULT NULL,
  `owner_city` varchar(100) DEFAULT NULL,
  `owner_street_address` text DEFAULT NULL,
  `rapa_document_path` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_type` varchar(20) NOT NULL DEFAULT 'Monthly',
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `garage` int(11) DEFAULT NULL,
  `area` int(11) DEFAULT NULL,
  `lot_area` int(11) DEFAULT NULL,
  `floor_area_unit` varchar(20) NOT NULL DEFAULT 'Square Meters',
  `amenities` text DEFAULT NULL,
  `furnishing` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `rent_manager_id` bigint(20) unsigned DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `properties_rent_manager_id_foreign` (`rent_manager_id`),
  KEY `properties_agent_id_foreign` (`agent_id`),
  CONSTRAINT `properties_agent_id_foreign` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_rent_manager_id_foreign` FOREIGN KEY (`rent_manager_id`) REFERENCES `rent_managers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `properties` VALUES
(1,1,'Test','Test','House','TestTest','17.586030','120.628619','15','Philippines',NULL,NULL,'TestTest','Test','Test','123123','test@gmail.com','United States','Calabarzon','Makati','TestTestTest','properties/rapa/1769826104_Dal_Resume.pdf',123.00,'Daily',10,10,10,1,10,'Square Meters','[\"Air Conditioning\",\"Breakfast\",\"Wi-Fi Internet\"]','Semi Furnished','properties/images/1769826103_natcon-2025 2.png',NULL,0,NULL,'2026-01-30 18:21:44','2026-01-30 18:21:44','2026-01-30 18:21:44'),
(2,1,'test','test','Apartment / Condo','123','17.586030','120.628619','15','Philippines',NULL,NULL,'123','123','123','123','123@gmail.com','Philippines','Calabarzon','Makati','123123','properties/rapa/rapa_697d7750d7df57.63812475.pdf',123123.00,'Daily',10,1230,1230,1,123210,'Square Feet','[\"Air Conditioning\",\"Pool\",\"Breakfast\",\"Wi-Fi Internet\"]','Semi Furnished','properties/images/img_697d7750d4b025.48916276.jpg',NULL,0,NULL,'2026-01-30 19:30:24','2026-01-30 19:30:24','2026-01-30 19:30:24');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `rent_managers`
--

DROP TABLE IF EXISTS `rent_managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rent_managers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_official` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rent_managers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent_managers`
--

LOCK TABLES `rent_managers` WRITE;
/*!40000 ALTER TABLE `rent_managers` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `rent_managers` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sessions` VALUES
('7UBAvmvdQtURMn5BC2rd4tOfbMAMRgC2wTFRmlTc',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.2.20 Chrome/138.0.7204.251 Electron/37.5.1 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmxOSm5SV083M3pRbFFlT29qUFI4V0YxRnV4cnppakZOdXhydk04MyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1769740306),
('A3oDueDLdREF3TfXAnpICZRe9nP3KgTiALmewjBd',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVmlkQWNlZElxN0pNU3RjSFg3d2tzSHFaS2pCcXZVQ0dwQVIyNU9mTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1769740457),
('gTFVJ150880sEcw6KuirZgYUQR2dHEYkULCrledN',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiN241dE80UGJrd3hITk5pSFZDd2lHcnBYMGo5eXlwbHNoV0hlbGxiYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1769764760),
('OfnQhWEH1tCNDkNL6h185WRZpK6D0GLbBrsMBcpQ',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.2.20 Chrome/138.0.7204.251 Electron/37.5.1 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3A5eUFWQXRhWnZBandSMHdPMEVoNk9SWTdFNldKU2tJR2JDeW16dyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1769764387);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role` enum('agent','admin','super_admin','moderator') NOT NULL DEFAULT 'agent',
  `agency_name` varchar(255) DEFAULT NULL,
  `office_address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `prc_license_number` varchar(255) DEFAULT NULL,
  `license_type` enum('broker','salesperson') DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `years_of_experience` varchar(255) DEFAULT NULL,
  `license_document_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(1,'Ian John','Dal',NULL,'ianjohndal5@gmail.com',NULL,'password','09948797646','2026-01-22','agent','Filipino Homes','576 P Del Rosario Street Cebu City','Cebu City','Cebu','6000','09124471351357','salesperson','2026-02-26','5-10','agents/licenses/1769740616_javie.jpg','pending',0,1,NULL,'2026-01-29 18:36:56','2026-01-29 18:36:56'),
(2,'Admin','User','Admin User','admin@example.com',NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','+63912345678',NULL,'admin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,'2026-01-30 02:46:11','2026-01-30 02:46:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-02-01  0:40:49
