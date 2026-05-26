-- =============================================================================
-- BASE DE DONNÉES : KAFUMBU SMART CITY PLATFORM
-- SCRIPT DE CRÉATION POUR CPANEL / MYSQL
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `kafumbu_smartcity` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kafumbu_smartcity`;

-- -----------------------------------------------------------------------------
-- TABLE : users (Membres Admin & Visiteurs/Investisseurs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nom complet de l\'utilisateur ou raison sociale',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Adresse e-mail réelle de l\'utilisateur pour connexion et contact',
  `username` VARCHAR(255) NULL UNIQUE COMMENT 'Identifiant de plateforme (kafumbu-smartcity.cd) généré automatiquement',
  `password` VARCHAR(255) NOT NULL COMMENT 'Mot de passe haché (ou en clair pour la démo locale)',
  `role` ENUM('admin', 'visitor') DEFAULT 'visitor' COMMENT 'Rôle : admin (gestion) ou visitor (investisseur/citoyen)',
  `tier` ENUM('none', 'citizen', 'bronze', 'silver', 'gold') DEFAULT 'none' COMMENT 'Niveau d\'engagement d\'un visiteur',
  `company` VARCHAR(255) NULL COMMENT 'Nom de l\'entreprise si applicable',
  `phone` VARCHAR(50) NULL COMMENT 'Téléphone ou numéro WhatsApp',
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

-- -----------------------------------------------------------------------------
-- TABLE : donations (Enregistrement des contributions & investissements)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT 'ID de l\'utilisateur ayant fait le don',
  `amount` DECIMAL(15,2) NOT NULL COMMENT 'Montant investi en USD',
  `payment_method` VARCHAR(50) NOT NULL COMMENT 'Moyen de paiement (ex: card, bank, mobile_money)',
  `transaction_ref` VARCHAR(100) NULL UNIQUE COMMENT 'Référence unique de la transaction cPanel / Stripe / Mobile money',
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'completed' COMMENT 'Statut du paiement',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE : interactions (Historique des actions faites par l\'utilisateur)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `interactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT 'ID de l\'utilisateur associé',
  `type` ENUM('invest', 'support', 'contact', 'download', 'other') NOT NULL COMMENT 'Type d\'interaction',
  `details` TEXT NULL COMMENT 'Description textuelle libre ou données JSON',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- INDEX DE PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX `idx_users_role` ON `users`(`role`);
CREATE INDEX `idx_users_tier` ON `users`(`tier`);
CREATE INDEX `idx_donations_user` ON `donations`(`user_id`);
CREATE INDEX `idx_interactions_user` ON `interactions`(`user_id`);

-- -----------------------------------------------------------------------------
-- JEU DE DONNÉES DE TEST & COMPTES DE DÉMO
-- -----------------------------------------------------------------------------

-- Insertion des utilisateurs de démo (mots de passe configurés pour correspondre aux identifiants)
INSERT INTO `users` (`id`, `name`, `email`, `username`, `password`, `role`, `tier`, `company`, `phone`) VALUES
(1, 'Admin Kafumbu', 'admin@kafumbu-smartcity.cd', 'admin@kafumbu-smartcity.cd', 'Admin@123', 'admin', 'none', 'KSC Global', '+243999999999'),
(2, 'Jean Citoyen', 'citizen@kafumbu.cd', 'citizen@kafumbu.cd', 'Citizen@123', 'visitor', 'citizen', 'Citoyen Engagé', '+243888888888'),
(3, 'Marc Bronze', 'bronze@kafumbu.cd', 'bronze@kafumbu.cd', 'Bronze@123', 'visitor', 'bronze', 'Bronze Holdings', '+243777777777'),
(4, 'Sophie Silver', 'silver@kafumbu.cd', 'silver@kafumbu.cd', 'Silver@123', 'visitor', 'silver', 'Silver Invest RDC', '+243666666666'),
(5, 'David Gold', 'gold@kafumbu.cd', 'gold@kafumbu.cd', 'Gold@123', 'visitor', 'gold', 'Gold & Partners', '+243555555555');

-- Insertion de quelques dons (investissements) initiaux pour simuler l'historique
INSERT INTO `donations` (`user_id`, `amount`, `payment_method`, `transaction_ref`, `status`, `created_at`) VALUES
(2, 10.00, 'mobile', 'TX-MOB-CIT-987', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 5000.00, 'card', 'TX-CRD-BRZ-541', 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 25000.00, 'bank', 'TX-BNK-SLV-302', 'completed', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(5, 100000.00, 'bank', 'TX-BNK-GLD-109', 'completed', DATE_SUB(NOW(), INTERVAL 45 DAY));

-- Insertion de quelques interactions de démo
INSERT INTO `interactions` (`user_id`, `type`, `details`) VALUES
(2, 'download', 'Téléchargement de la brochure publique'),
(3, 'invest', 'Premier versement de $5,000 pour le palier Bronze'),
(3, 'support', 'Contact WhatsApp avec le support technique'),
(4, 'invest', 'Signature de l\'accord consultatif initial pour le projet Silver'),
(5, 'invest', 'Validation de la contribution Gold d\'un montant de $100,000'),
(5, 'download', 'Téléchargement du rapport de transparence financière trimestriel');

-- TABLE : campaigns (Campagnes & initiatives de financement)
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre de la campagne',
  `description` LONGTEXT NOT NULL COMMENT 'Description complète',
  `slug` VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
  `status` ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft' COMMENT 'Statut de la campagne',
  `goal_amount` DECIMAL(15,2) NOT NULL COMMENT 'Objectif de financement',
  `current_amount` DECIMAL(15,2) DEFAULT 0 COMMENT 'Montant collecté',
  `start_date` DATE NOT NULL COMMENT 'Date de début',
  `end_date` DATE NOT NULL COMMENT 'Date de fin',
  `image_url` VARCHAR(500) NULL COMMENT 'URL de l\'image de couverture',
  `category` VARCHAR(100) NULL COMMENT 'Catégorie (urbanisme, transport, énergie, etc.)',
  `created_by` INT NOT NULL COMMENT 'ID utilisateur admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_campaigns_status` (`status`),
  INDEX `idx_campaigns_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE : news/publications (Actualités & articles)
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'Titre de l\'actualité',
  `content` LONGTEXT NOT NULL COMMENT 'Contenu complet',
  `slug` VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
  `excerpt` VARCHAR(500) NULL COMMENT 'Résumé/description courte',
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT 'Statut de publication',
  `featured_image` VARCHAR(500) NULL COMMENT 'URL de l\'image en vedette',
  `category` VARCHAR(100) NULL COMMENT 'Catégorie (actualité, blog, rapport, etc.)',
  `author_id` INT NOT NULL COMMENT 'ID utilisateur auteur',
  `published_at` TIMESTAMP NULL COMMENT 'Date de publication',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_news_status` (`status`),
  INDEX `idx_news_slug` (`slug`),
  INDEX `idx_news_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE : media (Galerie, fichiers, images)
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL COMMENT 'Nom du fichier original',
  `file_path` VARCHAR(500) NOT NULL COMMENT 'Chemin relatif du fichier stocké',
  `file_type` VARCHAR(50) NOT NULL COMMENT 'Type de fichier (image, video, document)',
  `mime_type` VARCHAR(100) NOT NULL COMMENT 'Type MIME (image/jpeg, etc.)',
  `file_size` INT NOT NULL COMMENT 'Taille en bytes',
  `width` INT NULL COMMENT 'Largeur (pour images)',
  `height` INT NULL COMMENT 'Hauteur (pour images)',
  `alt_text` VARCHAR(255) NULL COMMENT 'Texte alternatif pour accessibilité',
  `title` VARCHAR(255) NULL COMMENT 'Titre du média',
  `description` TEXT NULL COMMENT 'Description du média',
  `status` ENUM('active', 'deleted') DEFAULT 'active' COMMENT 'Statut du média',
  `uploaded_by` INT NOT NULL COMMENT 'ID utilisateur qui a uploadé',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_media_file_type` (`file_type`),
  INDEX `idx_media_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLE : settings (Paramètres du site)
CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(255) PRIMARY KEY COMMENT 'Clé du paramètre',
  `value` LONGTEXT NOT NULL COMMENT 'Valeur du paramètre',
  `type` VARCHAR(50) DEFAULT 'string' COMMENT 'Type de donnée (string, json, boolean, etc.)',
  `updated_by` INT NULL COMMENT 'ID utilisateur qui a modifié',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de démo pour campaigns
INSERT INTO `campaigns` (`title`, `description`, `slug`, `status`, `goal_amount`, `current_amount`, `start_date`, `end_date`, `image_url`, `category`, `created_by`) VALUES
('Smart Transport Initiative', 'Modernisation du système de transport public de Kafumbu avec technologie IoT', 'smart-transport-2025', 'active', 500000000.00, 0.00, '2026-05-21', '2028-12-31', '/uploads/campaigns/transport.jpg', 'transport', 1),
('Green Energy Project', 'Installation de panneaux solaires dans les quartiers défavorisés', 'green-energy-2025', 'active', 300000.00, 0.00, '2026-05-21', '2028-12-31', '/uploads/campaigns/energy.jpg', 'énergie', 1),
('Digital Kafumbu', 'Programme d\'alphabétisation numérique pour les citoyens', 'digital-literacy-2025', 'draft', 150000.00, 0.00, '2025-03-01', '2025-09-30', '/uploads/campaigns/digital.jpg', 'éducation', 1);

-- Données de démo pour news
INSERT INTO `news` (`title`, `content`, `slug`, `excerpt`, `status`, `featured_image`, `category`, `author_id`, `published_at`) VALUES
('Lancement de la Smart City Initiative', 'Kafumbu lance officiellement son initiative de ville intelligente visant à transformer l\'infrastructure urbaine...', 'lancement-smart-city', 'Kafumbu lance son initiative smart city', 'published', '/uploads/news/launch.jpg', 'actualité', 1, NOW()),
('Rapports de transparence financière Q1 2025', 'Consultez notre rapport détaillé sur l\'utilisation des fonds collectés au cours du premier trimestre...', 'rapport-q1-2025', 'Rapport financier trimestriel disponible', 'published', '/uploads/news/report.jpg', 'rapport', 1, NOW()),
('Interview: Le futur urbain selon les citoyens', 'Nous avons interrogé 500 citoyens sur leur vision de Kafumbu en 2030...', 'interview-citoyens', 'Les citoyens partagent leur vision', 'draft', '/uploads/news/interview.jpg', 'blog', 1, NULL);

-- Données de démo pour settings
INSERT INTO `settings` (`key`, `value`, `type`) VALUES
('site_title', 'Kafumbu Smart City Platform', 'string'),
('site_description', 'La plateforme de transformation urbaine collaborative', 'string'),
('site_logo', '/uploads/settings/logo.png', 'string'),
('contact_email', 'contact@kafumbu-smartcity.cd', 'string'),
('contact_phone', '+243999999999', 'string'),
('headquarters_address', 'Kinshasa, République Démocratique du Congo', 'string'),
('social_twitter', 'https://twitter.com/kafumbu', 'string'),
('social_facebook', 'https://facebook.com/kafumbu', 'string'),
('social_linkedin', 'https://linkedin.com/company/kafumbu', 'string'),
('maintenance_mode', 'false', 'boolean'),
('max_upload_size', '52428800', 'string');
