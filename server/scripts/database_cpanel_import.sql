-- =============================================================================
-- KAFUMBU SMART CITY PLATFORM - IMPORT CPANEL
-- Base cible deja creee dans cPanel/phpMyAdmin: better_kafumbu_city
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- TABLE : users (Membres Admin & Visiteurs/Investisseurs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nom complet de l''utilisateur ou raison sociale',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Adresse e-mail réelle de l''utilisateur pour connexion et contact',
  `username` VARCHAR(255) NULL UNIQUE COMMENT 'Identifiant de plateforme (kafumbu-smartcity.cd) généré automatiquement',
  `password` VARCHAR(255) NOT NULL COMMENT 'Mot de passe hache ou demo',
  `role` ENUM('admin', 'visitor') DEFAULT 'visitor' COMMENT 'Role utilisateur',
  `tier` ENUM('none', 'citizen', 'bronze', 'silver', 'gold') DEFAULT 'none' COMMENT 'Niveau d''engagement',
  `company` VARCHAR(255) NULL COMMENT 'Entreprise',
  `phone` VARCHAR(50) NULL COMMENT 'Telephone ou WhatsApp',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_verification_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL,
  `payload` JSON NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `attempts` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_email_verification_tokens_email` (`email`),
  INDEX `idx_email_verification_tokens_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `transaction_ref` VARCHAR(100) NULL UNIQUE,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_donations_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `interactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('invest', 'support', 'contact', 'download', 'other') NOT NULL,
  `details` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_interactions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `status` ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
  `goal_amount` DECIMAL(15,2) NOT NULL,
  `current_amount` DECIMAL(15,2) DEFAULT 0,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `category` VARCHAR(100) NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_campaigns_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `excerpt` VARCHAR(500) NULL,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `featured_image` VARCHAR(500) NULL,
  `category` VARCHAR(100) NULL,
  `author_id` INT NOT NULL,
  `published_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `alt_text` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `status` ENUM('active', 'deleted') DEFAULT 'active',
  `uploaded_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_media_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(255) PRIMARY KEY,
  `value` LONGTEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'string',
  `updated_by` INT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_settings_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info','success','warning','urgent') DEFAULT 'info',
  `status` ENUM('unread','read') DEFAULT 'unread',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notifications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `sender_role` ENUM('admin','visitor') NOT NULL,
  `receiver_role` ENUM('admin','visitor') NOT NULL,
  `subject` VARCHAR(255) NULL,
  `content` TEXT NOT NULL,
  `status` ENUM('unread','read') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_visitor_sender` (`sender_role`, `sender_id`),
  INDEX `idx_messages_visitor_receiver` (`receiver_role`, `receiver_id`),
  INDEX `idx_messages_status` (`status`),
  INDEX `idx_messages_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `visitor_notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info','success','warning','urgent','message') DEFAULT 'info',
  `status` ENUM('unread','read') DEFAULT 'unread',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_visitor_notifications_user` (`user_id`),
  INDEX `idx_visitor_notifications_status` (`status`),
  INDEX `idx_visitor_notifications_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `username`, `password`, `role`, `tier`, `company`, `phone`) VALUES
(1, 'Admin Kafumbu', 'admin@kafumbu-smartcity.cd', 'admin@kafumbu-smartcity.cd', 'Admin@123', 'admin', 'none', 'KSC Global', '+243999999999'),
(2, 'Jean Citoyen', 'citizen@kafumbu.cd', 'citizen@kafumbu.cd', 'Citizen@123', 'visitor', 'citizen', 'Citoyen Engagé', '+243888888888'),
(3, 'Marc Bronze', 'bronze@kafumbu.cd', 'bronze@kafumbu.cd', 'Bronze@123', 'visitor', 'bronze', 'Bronze Holdings', '+243777777777'),
(4, 'Sophie Silver', 'silver@kafumbu.cd', 'silver@kafumbu.cd', 'Silver@123', 'visitor', 'silver', 'Silver Invest RDC', '+243666666666'),
(5, 'David Gold', 'gold@kafumbu.cd', 'gold@kafumbu.cd', 'Gold@123', 'visitor', 'gold', 'Gold & Partners', '+243555555555');
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `tier` = VALUES(`tier`),
  `company` = VALUES(`company`),
  `phone` = VALUES(`phone`);

INSERT INTO `donations` (`user_id`, `amount`, `payment_method`, `transaction_ref`, `status`, `created_at`) VALUES
(2, 10.00, 'mobile', 'TX-MOB-CIT-987', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 5000.00, 'card', 'TX-CRD-BRZ-541', 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 25000.00, 'bank', 'TX-BNK-SLV-302', 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(5, 100000.00, 'bank', 'TX-BNK-GLD-109', 'completed', DATE_SUB(NOW(), INTERVAL 45 DAY))
ON DUPLICATE KEY UPDATE
  `amount` = VALUES(`amount`),
  `payment_method` = VALUES(`payment_method`),
  `status` = VALUES(`status`);

INSERT INTO `interactions` (`user_id`, `type`, `details`) VALUES
(2, 'download', 'Telechargement de la brochure publique'),
(3, 'invest', 'Premier versement de $5,000 pour le palier Bronze'),
(3, 'support', 'Contact WhatsApp avec le support technique'),
(4, 'invest', 'Signature de l''accord consultatif initial pour le projet Silver'),
(5, 'invest', 'Validation de la contribution Gold d''un montant de $100,000'),
(5, 'download', 'Telechargement du rapport de transparence financiere trimestriel');

INSERT INTO `campaigns` (`title`, `description`, `slug`, `status`, `goal_amount`, `current_amount`, `start_date`, `end_date`, `image_url`, `category`, `created_by`) VALUES
('Smart Transport Initiative', 'Modernisation du systeme de transport public de Kafumbu avec technologie IoT', 'smart-transport-2025', 'active', 500000000.00, 0.00, '2026-05-21', '2028-12-31', '/uploads/campaigns/transport.jpg', 'transport', 1),
('Green Energy Project', 'Installation de panneaux solaires dans les quartiers defavorises', 'green-energy-2025', 'active', 300000.00, 0.00, '2026-05-21', '2028-12-31', '/uploads/campaigns/energy.jpg', 'energie', 1),
('Digital Kafumbu', 'Programme d''alphabetisation numerique pour les citoyens', 'digital-literacy-2025', 'draft', 150000.00, 0.00, '2025-03-01', '2025-09-30', '/uploads/campaigns/digital.jpg', 'education', 1)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `status` = VALUES(`status`),
  `goal_amount` = VALUES(`goal_amount`),
  `current_amount` = VALUES(`current_amount`),
  `start_date` = VALUES(`start_date`),
  `end_date` = VALUES(`end_date`),
  `image_url` = VALUES(`image_url`),
  `category` = VALUES(`category`);

INSERT INTO `news` (`title`, `content`, `slug`, `excerpt`, `status`, `featured_image`, `category`, `author_id`, `published_at`) VALUES
('Lancement de la Smart City Initiative', 'Kafumbu lance officiellement son initiative de ville intelligente visant a transformer l''infrastructure urbaine...', 'lancement-smart-city', 'Kafumbu lance son initiative smart city', 'published', '/uploads/news/launch.jpg', 'actualite', 1, NOW()),
('Rapports de transparence financiere Q1 2025', 'Consultez notre rapport detaille sur l''utilisation des fonds collectes au cours du premier trimestre...', 'rapport-q1-2025', 'Rapport financier trimestriel disponible', 'published', '/uploads/news/report.jpg', 'rapport', 1, NOW()),
('Interview: Le futur urbain selon les citoyens', 'Nous avons interroge 500 citoyens sur leur vision de Kafumbu en 2030...', 'interview-citoyens', 'Les citoyens partagent leur vision', 'draft', '/uploads/news/interview.jpg', 'blog', 1, NULL)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `content` = VALUES(`content`),
  `excerpt` = VALUES(`excerpt`),
  `status` = VALUES(`status`),
  `featured_image` = VALUES(`featured_image`),
  `category` = VALUES(`category`),
  `published_at` = VALUES(`published_at`);

INSERT INTO `settings` (`key`, `value`, `type`) VALUES
('site_title', 'Kafumbu Smart City Platform', 'string'),
('site_description', 'La plateforme de transformation urbaine collaborative', 'string'),
('site_logo', '/uploads/settings/logo.png', 'string'),
('contact_email', 'contact@kafumbu-smartcity.cd', 'string'),
('contact_phone', '+243999999999', 'string'),
('headquarters_address', 'Kinshasa, Republique Democratique du Congo', 'string'),
('social_twitter', 'https://twitter.com/kafumbu', 'string'),
('social_facebook', 'https://facebook.com/kafumbu', 'string'),
('social_linkedin', 'https://linkedin.com/company/kafumbu', 'string'),
('maintenance_mode', 'false', 'boolean'),
('max_upload_size', '52428800', 'string')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`),
  `type` = VALUES(`type`);

SET FOREIGN_KEY_CHECKS = 1;
