-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 09, 2024 at 06:26 AM
-- Server version: 5.7.14
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_media`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `comment`, `userId`, `postId`) VALUES
(1, 'savan', 2, 1),
(2, 'asasas', 2, 1),
(3, 'asas', 2, 1),
(4, 'hiii', 2, 2),
(5, 'hello all', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `group_chat`
--

DROP TABLE IF EXISTS `group_chat`;
CREATE TABLE IF NOT EXISTS `group_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) NOT NULL,
  `room_id` int(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group_chat`
--

INSERT INTO `group_chat` (`id`, `user_id`, `room_id`, `created_at`, `content`) VALUES
(1, 2, 3, '2024-05-06 06:25:00', 'hello'),
(2, 1, 3, '2024-05-07 04:06:46', 'hii');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `likes_total` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `postId`, `userId`, `likes_total`) VALUES
(17, 2, 2, '0');

-- --------------------------------------------------------

--
-- Table structure for table `likes_post`
--

DROP TABLE IF EXISTS `likes_post`;
CREATE TABLE IF NOT EXISTS `likes_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `like_type` enum('like','dislike') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likes_post`
--

INSERT INTO `likes_post` (`id`, `post_id`, `user_id`, `like_type`) VALUES
(1, 2, 2, 'dislike'),
(5, 1, 2, 'like');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `timestamp`) VALUES
(15, 1, 2, 'yes i am also fine ', '2024-05-07 03:36:45'),
(2, 2, 1, 'hello', '2024-05-02 04:44:28'),
(3, 2, 1, 'how are you ', '2024-05-02 05:05:23'),
(4, 1, 2, 'hello', '2024-05-02 05:06:26'),
(5, 2, 1, 'hello', '2024-05-02 05:17:42'),
(6, 1, 2, 'how are you ', '2024-05-02 05:43:45'),
(8, 1, 2, 'i am fine', '2024-05-03 02:42:49'),
(9, 2, 1, 'how about you ', '2024-05-03 02:43:32'),
(10, 1, 2, 'yes i am also fine', '2024-05-03 02:43:44'),
(14, 2, 1, 'i am fine how about you ', '2024-05-07 03:36:14'),
(12, 1, 2, 'hello', '2024-05-07 03:14:05'),
(23, 2, 2, 'hello', '2024-05-09 06:14:23'),
(16, 2, 1, 'hiiii', '2024-05-07 04:28:38'),
(21, 1, 2, 'hello hii', '2024-05-07 05:57:04'),
(22, 2, 1, 'hii', '2024-05-07 05:57:20');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `des` text,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `des`, `userId`) VALUES
(1, 'savan', 2),
(2, 'hello', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user_id` int(255) NOT NULL,
  `userSelected_Name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `user_id`, `created_at`, `created_user_id`, `userSelected_Name`) VALUES
(3, '[1,3]', '2024-05-06 04:18:04', 2, '[\"savan\",\"savan\"]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`) VALUES
(1, 'savan11@gmail.com', 'savan', 'savan'),
(2, 'savanponda22@gmail.com', 'savanponda', 'savan ponda'),
(3, 'savan111@gmail.com', 'savanthakkr', 'savan'),
(4, 'harsh11@gmail.com', 'harsh', 'harsh');

-- --------------------------------------------------------

--
-- Table structure for table `user_follows`
--

DROP TABLE IF EXISTS `user_follows`;
CREATE TABLE IF NOT EXISTS `user_follows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `following_user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `followStatus` enum('follow','unfollow') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `following_user_id` (`following_user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_follows`
--

INSERT INTO `user_follows` (`id`, `user_id`, `following_user_id`, `created_at`, `followStatus`) VALUES
(16, 2, 1, '2024-05-01 05:07:48', 'follow');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
