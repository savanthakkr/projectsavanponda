-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 08, 2024 at 06:09 AM
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
-- Database: `store`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(100) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `categoryName`, `createdBy`) VALUES
(1, 'test', 1),
(4, 'cloth', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `categoryId` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `images` text,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `createdBy` (`createdBy`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `categoryId`, `price`, `images`, `createdBy`) VALUES
(3, 'shirt', 'good shirt', 1, 99.55, '', NULL),
(4, 't-shirt', 'casual shirt', 1, 109.00, '', NULL),
(5, 'pant', 'formal pant', 1, 109.00, '', NULL),
(7, 'savan', '  savan product', 1, 1000.00, '', NULL),
(8, 'savan', '  savan product', 1, 1000.00, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `hobbies` text,
  `userRole` enum('Admin','User') DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `gender`, `hobbies`, `userRole`, `profile_pic`) VALUES
(1, 'dhruval', 'hingu', 'dhruval@mail.com', '$2b$10$.n2J8iWsBzcuWubJj3zWN.E2757KxUfS8Alg0036WfJIpMkkh/gAy', 'Male', 'read, write', 'Admin', ''),
(2, 'yagnesh', 'patel', 'yagnesh@mail.com', '$2b$10$N5kRMzEJZvgcdL9Pc0eOqut80hfgGETLfhCOmIz6G5r8f6H/TZ3vO', 'Male', 'read, write', 'User', ''),
(3, 'mail', 'mail', 'mail@mail.com', '$2b$10$36SueSJ2sq8kn2zNm3fFlOMy54o.JpDTzSmVyRkejqBYMP2iJAg4u', 'Male', 'read, write', 'Admin', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
