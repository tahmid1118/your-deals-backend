-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2025 at 01:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yourdeals_db`
--

CREATE DATABASE IF NOT EXISTS `yourdeals_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `yourdeals_db`;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `branch_id` int(11) NOT NULL,
  `branch_name` varchar(200) DEFAULT NULL,
  `branch_location` varchar(200) DEFAULT NULL,
  `branch_address` varchar(200) DEFAULT NULL,
  `branch_area` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `shop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`branch_id`, `branch_name`, `branch_location`, `branch_address`, `branch_area`, `created_at`, `updated_at`, `shop_id`) VALUES
(1, 'Fashion Hub Dhanmondi', 'Dhanmondi', 'House 25, Road 5, Dhanmondi', 'Dhanmondi', '2025-12-26 10:00:00', NULL, 1),
(2, 'Fashion Hub Gulshan', 'Gulshan', 'Plot 45, Road 11, Gulshan-1', 'Gulshan', '2025-12-26 10:00:00', NULL, 1),
(3, 'Style Gallery Banani', 'Banani', 'House 12, Road 27, Banani', 'Banani', '2025-12-26 10:00:00', NULL, 2),
(4, 'Style Gallery Uttara', 'Uttara', 'House 8, Road 3, Sector 7, Uttara', 'Uttara', '2025-12-26 10:00:00', NULL, 2),
(5, 'Trendy Closet Mirpur', 'Mirpur', 'Plot 15, Avenue 1, Mirpur-10', 'Mirpur', '2025-12-26 10:00:00', NULL, 3),
(6, 'Elite Wear Mohammadpur', 'Mohammadpur', 'House 35, Road 9, Mohammadpur', 'Mohammadpur', '2025-12-26 10:00:00', NULL, 4),
(7, 'Urban Style Bashundhara', 'Bashundhara', 'Plot 20, Block C, Bashundhara R/A', 'Bashundhara', '2025-12-26 10:00:00', NULL, 5),
(8, 'Classic Attire Motijheel', 'Motijheel', 'Building 10, Dilkusha C/A', 'Motijheel', '2025-12-26 10:00:00', NULL, 6),
(9, 'Fashion Point Badda', 'Badda', 'House 18, Link Road, Badda', 'Badda', '2025-12-26 10:00:00', NULL, 7),
(10, 'Chic Boutique Lalmatia', 'Lalmatia', 'House 22, Block D, Lalmatia', 'Lalmatia', '2025-12-26 10:00:00', NULL, 8),
(11, 'Smart Look Khilgaon', 'Khilgaon', 'Plot 7, Khilgaon Taltola', 'Khilgaon', '2025-12-26 10:00:00', NULL, 9),
(12, 'Vogue Collection Panthapath', 'Panthapath', 'Building 5, Panthapath', 'Panthapath', '2025-12-26 10:00:00', NULL, 10),
(13, 'Trendsetter Rampura', 'Rampura', 'House 30, DIT Road, Rampura', 'Rampura', '2025-12-26 10:00:00', NULL, 11),
(14, 'Fashion Street Jatrabari', 'Jatrabari', 'Shop 15, City Center, Jatrabari', 'Jatrabari', '2025-12-26 10:00:00', NULL, 12),
(15, 'Royal Wardrobe Elephant Road', 'Elephant Road', 'Building 12, Elephant Road', 'Elephant Road', '2025-12-26 10:00:00', NULL, 13),
(16, 'Style Studio Shantinagar', 'Shantinagar', 'House 8, Road 2, Shantinagar', 'Shantinagar', '2025-12-26 10:00:00', NULL, 14),
(17, 'Fashion Factory Tejgaon', 'Tejgaon', 'Plot 25, Tejgaon I/A', 'Tejgaon', '2025-12-26 10:00:00', NULL, 15),
(18, 'Glamour Zone Asad Gate', 'Asad Gate', 'House 40, Asad Avenue', 'Asad Gate', '2025-12-26 10:00:00', NULL, 16),
(19, 'Modern Threads Kallyanpur', 'Kallyanpur', 'Shop 22, Kallyanpur Main Road', 'Kallyanpur', '2025-12-26 10:00:00', NULL, 17),
(20, 'Style Avenue Azimpur', 'Azimpur', 'House 15, Road 5, Azimpur', 'Azimpur', '2025-12-26 10:00:00', NULL, 18);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_title` varchar(200) NOT NULL,
  `category_description` varchar(200) DEFAULT NULL,
  `target_customer` enum('men','women','kids') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_title`, `category_description`, `target_customer`, `created_at`, `updated_at`) VALUES
(1, 'Casual Wear', 'Comfortable everyday clothing', 'men', '2025-12-26 10:00:00', NULL),
(2, 'Formal Wear', 'Professional and business attire', 'men', '2025-12-26 10:00:00', NULL),
(3, 'Sports Wear', 'Athletic and gym clothing', 'men', '2025-12-26 10:00:00', NULL),
(4, 'Summer Collection', 'Light and breezy summer outfits', 'women', '2025-12-26 10:00:00', NULL),
(5, 'Winter Collection', 'Warm and cozy winter wear', 'women', '2025-12-26 10:00:00', NULL),
(6, 'Party Dresses', 'Elegant evening and party wear', 'women', '2025-12-26 10:00:00', NULL),
(7, 'Kids Casual', 'Everyday clothing for kids', 'kids', '2025-12-26 10:00:00', NULL),
(8, 'Kids School Wear', 'School uniforms and formal wear', 'kids', '2025-12-26 10:00:00', NULL),
(9, 'Baby Collection', 'Soft and comfortable baby clothes', 'kids', '2025-12-26 10:00:00', NULL),
(10, 'Accessories', 'Fashion accessories and add-ons', 'men', '2025-12-26 10:00:00', NULL),
(11, 'Footwear', 'Shoes and sandals collection', 'women', '2025-12-26 10:00:00', NULL),
(12, 'Traditional Wear', 'Cultural and traditional outfits', 'men', '2025-12-26 10:00:00', NULL),
(13, 'Denim Collection', 'Jeans and denim products', 'women', '2025-12-26 10:00:00', NULL),
(14, 'Activewear', 'Yoga and fitness clothing', 'women', '2025-12-26 10:00:00', NULL),
(15, 'Wedding Collection', 'Special occasion and wedding wear', 'men', '2025-12-26 10:00:00', NULL),
(16, 'Sleepwear', 'Comfortable nightwear and loungewear', 'women', '2025-12-26 10:00:00', NULL),
(17, 'Ethnic Wear', 'Traditional ethnic clothing', 'women', '2025-12-26 10:00:00', NULL),
(18, 'Teen Collection', 'Trendy outfits for teenagers', 'kids', '2025-12-26 10:00:00', NULL),
(19, 'Plus Size', 'Comfortable clothing for plus size', 'men', '2025-12-26 10:00:00', NULL),
(20, 'Maternity Wear', 'Comfortable pregnancy clothing', 'women', '2025-12-26 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deal`
--

CREATE TABLE `deal` (
  `deal_id` int(11) NOT NULL,
  `deal_title` varchar(200) DEFAULT NULL,
  `deal_details` varchar(200) DEFAULT NULL,
  `deal_thumbnail` varchar(200) DEFAULT NULL,
  `source_facebook` varchar(200) DEFAULT NULL,
  `source_website` varchar(200) DEFAULT NULL,
  `source_instagram` varchar(200) DEFAULT NULL,
  `deal_channel` enum('online','physical','both') NOT NULL,
  `deal_type` varchar(100) DEFAULT NULL,
  `deal_start_datetime` datetime DEFAULT NULL,
  `deal_end_datetime` datetime DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `branch_id` int(11) DEFAULT NULL,
  `shop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deal`
--

INSERT INTO `deal` (`deal_id`, `deal_title`, `deal_details`, `deal_thumbnail`, `source_facebook`, `source_website`, `source_instagram`, `deal_channel`, `deal_type`, `deal_start_datetime`, `deal_end_datetime`, `created_at`, `updated_at`, `branch_id`, `shop_id`) VALUES
(1, 'Winter Sale 50% Off', 'Get 50% discount on all winter collection items', '447974391_335726956291614_3457715464352453163_n.jpg', 'fb.com/fashionhub', 'fashionhub.com', 'instagram.com/fashionhub', 'both', 'seasonal', '2025-12-20 00:00:00', '2026-01-31 23:59:59', '2025-12-26 10:00:00', NULL, 1, 1),
(2, 'Buy 2 Get 1 Free', 'Purchase any two items and get one free', '470545056_510398875491087_7792261206238131915_n.jpg', 'fb.com/fashionhub', 'fashionhub.com', 'instagram.com/fashionhub', 'physical', 'promotional', '2025-12-26 00:00:00', '2026-01-15 23:59:59', '2025-12-26 10:00:00', NULL, 2, 1),
(3, 'New Year Mega Sale', 'Celebrate new year with up to 70% discount', '470607269_510378312159810_1257260679795376347_n.jpg', 'fb.com/stylegallery', 'stylegallery.com', 'instagram.com/stylegallery', 'online', 'seasonal', '2025-12-31 00:00:00', '2026-01-10 23:59:59', '2025-12-26 10:00:00', NULL, 3, 2),
(4, 'Flash Sale: 24 Hours Only', 'Limited time offer - 40% off on selected items', '470746382_510398665491108_3938817974956477131_n.jpg', 'fb.com/stylegallery', 'stylegallery.com', 'instagram.com/stylegallery', 'both', 'flash', '2025-12-27 00:00:00', '2025-12-28 00:00:00', '2025-12-26 10:00:00', NULL, 4, 2),
(5, 'Weekend Special Offer', 'Extra 30% off on weekend shopping', '470796823_510397568824551_8822883877595019429_n.jpg', 'fb.com/trendycloset', 'trendycloset.com', 'instagram.com/trendycloset', 'physical', 'weekend', '2025-12-28 00:00:00', '2025-12-29 23:59:59', '2025-12-26 10:00:00', NULL, 5, 3),
(6, 'Student Discount 25%', 'Special discount for students with valid ID', '526079036_728209483460552_7023137644665283694_n.jpg', 'fb.com/elitewear', 'elitewear.com', 'instagram.com/elitewear', 'both', 'student', '2025-12-26 00:00:00', '2026-03-31 23:59:59', '2025-12-26 10:00:00', NULL, 6, 4),
(7, 'Clearance Sale Up to 60%', 'End of season clearance - massive discounts', '541460618_750460854568748_6826875349311602043_n.jpg', 'fb.com/urbanstyle', 'urbanstyle.com', 'instagram.com/urbanstyle', 'physical', 'clearance', '2025-12-26 00:00:00', '2026-01-20 23:59:59', '2025-12-26 10:00:00', NULL, 7, 5),
(8, 'Free Shipping on Orders Above 2000', 'No shipping charges for orders above BDT 2000', '549606228_1221209440040065_5816350683428944226_n.jpg', 'fb.com/classicattire', 'classicattire.com', 'instagram.com/classicattire', 'online', 'shipping', '2025-12-26 00:00:00', '2026-02-28 23:59:59', '2025-12-26 10:00:00', NULL, 8, 6),
(9, 'Flat 500 BDT Off', 'Get flat 500 taka discount on minimum purchase of 3000', '555003688_1226228236203216_8337933768784922185_n.jpg', 'fb.com/fashionpoint', 'fashionpoint.com', 'instagram.com/fashionpoint', 'both', 'promotional', '2025-12-26 00:00:00', '2026-01-25 23:59:59', '2025-12-26 10:00:00', NULL, 9, 7),
(10, 'Anniversary Sale 45% Off', 'Celebrating our anniversary with special discounts', '557253396_775537905394376_480811546732932476_n.jpg', 'fb.com/chicboutique', 'chicboutique.com', 'instagram.com/chicboutique', 'both', 'anniversary', '2026-01-01 00:00:00', '2026-01-15 23:59:59', '2025-12-26 10:00:00', NULL, 10, 8),
(11, 'Early Bird Discount 35%', 'Shop before 12 PM and get 35% discount', '557633380_1230683785757661_4653253639487466719_n.jpg', 'fb.com/smartlook', 'smartlook.com', 'instagram.com/smartlook', 'physical', 'early_bird', '2025-12-27 06:00:00', '2026-01-31 12:00:00', '2025-12-26 10:00:00', NULL, 11, 9),
(12, 'Festive Collection Launch', 'New festive collection with 20% launch discount', '565693637_1246339194193756_290874684616632579_n.jpg', 'fb.com/voguecollection', 'voguecollection.com', 'instagram.com/voguecollection', 'both', 'launch', '2025-12-26 00:00:00', '2026-01-10 23:59:59', '2025-12-26 10:00:00', NULL, 12, 10),
(13, 'Loyalty Member Exclusive', 'Extra 15% off for loyalty card holders', '581955660_1270718341755841_5188616761491957754_n.jpg', 'fb.com/trendsetter', 'trendsetter.com', 'instagram.com/trendsetter', 'physical', 'loyalty', '2025-12-26 00:00:00', '2026-12-31 23:59:59', '2025-12-26 10:00:00', NULL, 13, 11),
(14, 'Mid-Season Sale 40%', 'Mid-season clearance on selected categories', '590451392_823488960599270_3041315329861702199_n.jpg', 'fb.com/fashionstreet', 'fashionstreet.com', 'instagram.com/fashionstreet', 'both', 'seasonal', '2025-12-26 00:00:00', '2026-01-30 23:59:59', '2025-12-26 10:00:00', NULL, 14, 12),
(15, 'Premium Collection Discount', 'Get 25% off on premium collection items', '599571912_1296225459203493_6010755830063311618_n.jpg', 'fb.com/royalwardrobe', 'royalwardrobe.com', 'instagram.com/royalwardrobe', 'online', 'premium', '2025-12-26 00:00:00', '2026-02-15 23:59:59', '2025-12-26 10:00:00', NULL, 15, 13),
(16, 'Buy 3 Get 50% Off on 3rd', 'Special offer on bulk purchases', '600162819_1293868062774202_5667449546045099589_n.jpg', 'fb.com/stylestudio', 'stylestudio.com', 'instagram.com/stylestudio', 'physical', 'promotional', '2025-12-26 00:00:00', '2026-01-20 23:59:59', '2025-12-26 10:00:00', NULL, 16, 14),
(17, 'Factory Outlet Sale', 'Direct from factory at wholesale prices', '600246903_1295388429287196_3385951968242749507_n.jpg', 'fb.com/fashionfactory', 'fashionfactory.com', 'instagram.com/fashionfactory', 'physical', 'factory', '2025-12-26 00:00:00', '2026-03-31 23:59:59', '2025-12-26 10:00:00', NULL, 17, 15),
(18, 'Online Exclusive 55% Off', 'Special discount for online shoppers only', '600368428_1296234142535958_5530765740902743866_n.jpg', 'fb.com/glamourzone', 'glamourzone.com', 'instagram.com/glamourzone', 'online', 'exclusive', '2025-12-26 00:00:00', '2026-01-31 23:59:59', '2025-12-26 10:00:00', NULL, 18, 16),
(19, 'Bundle Deal: Save More', 'Create your own bundle and save up to 45%', '601907005_1303025425191799_6431186795333383664_n.jpg', 'fb.com/modernthreads', 'modernthreads.com', 'instagram.com/modernthreads', 'both', 'bundle', '2025-12-26 00:00:00', '2026-02-28 23:59:59', '2025-12-26 10:00:00', NULL, 19, 17),
(20, 'Happy Hour Deal', 'Extra 30% off between 2 PM to 4 PM', '604889847_1301680671991305_7029417141578765938_n.jpg', 'fb.com/styleavenue', 'styleavenue.com', 'instagram.com/styleavenue', 'physical', 'happy_hour', '2025-12-27 14:00:00', '2026-01-31 16:00:00', '2025-12-26 10:00:00', NULL, 20, 18);

-- --------------------------------------------------------

--
-- Table structure for table `deal_category`
--

CREATE TABLE `deal_category` (
  `deal_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `shop_id` int(11) NOT NULL,
  `shop_name` varchar(200) DEFAULT NULL,
  `shop_details` varchar(200) DEFAULT NULL,
  `shop_email` varchar(200) DEFAULT NULL,
  `shop_contact` varchar(15) DEFAULT NULL,
  `shop_contact_alternative` varchar(15) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`shop_id`, `shop_name`, `shop_details`, `shop_email`, `shop_contact`, `shop_contact_alternative`, `created_at`, `updated_at`) VALUES
(1, 'Fashion Hub', 'Your one-stop fashion destination', 'contact@fashionhub.com', '01711111111', '01811111111', '2025-12-26 10:00:00', NULL),
(2, 'Style Gallery', 'Premium clothing and accessories', 'info@stylegallery.com', '01722222222', '01822222222', '2025-12-26 10:00:00', NULL),
(3, 'Trendy Closet', 'Latest fashion trends and styles', 'support@trendycloset.com', '01733333333', '01833333333', '2025-12-26 10:00:00', NULL),
(4, 'Elite Wear', 'Luxury fashion for everyone', 'hello@elitewear.com', '01744444444', '01844444444', '2025-12-26 10:00:00', NULL),
(5, 'Urban Style', 'Modern urban fashion collection', 'care@urbanstyle.com', '01755555555', '01855555555', '2025-12-26 10:00:00', NULL),
(6, 'Classic Attire', 'Timeless fashion pieces', 'service@classicattire.com', '01766666666', '01866666666', '2025-12-26 10:00:00', NULL),
(7, 'Fashion Point', 'Affordable fashion for all', 'contact@fashionpoint.com', '01777777777', '01877777777', '2025-12-26 10:00:00', NULL),
(8, 'Chic Boutique', 'Elegant and stylish collection', 'info@chicboutique.com', '01788888888', '01888888888', '2025-12-26 10:00:00', NULL),
(9, 'Smart Look', 'Contemporary fashion store', 'hello@smartlook.com', '01799999999', '01899999999', '2025-12-26 10:00:00', NULL),
(10, 'Vogue Collection', 'High-end fashion boutique', 'support@voguecollection.com', '01710101010', '01810101010', '2025-12-26 10:00:00', NULL),
(11, 'Trendsetter', 'Setting fashion trends since 2020', 'contact@trendsetter.com', '01720202020', '01820202020', '2025-12-26 10:00:00', NULL),
(12, 'Fashion Street', 'Street style fashion hub', 'info@fashionstreet.com', '01730303030', '01830303030', '2025-12-26 10:00:00', NULL),
(13, 'Royal Wardrobe', 'Premium quality clothing', 'care@royalwardrobe.com', '01740404040', '01840404040', '2025-12-26 10:00:00', NULL),
(14, 'Style Studio', 'Your personal style consultant', 'hello@stylestudio.com', '01750505050', '01850505050', '2025-12-26 10:00:00', NULL),
(15, 'Fashion Factory', 'Direct factory outlet prices', 'service@fashionfactory.com', '01760606060', '01860606060', '2025-12-26 10:00:00', NULL),
(16, 'Glamour Zone', 'Glamorous fashion for all occasions', 'contact@glamourzone.com', '01770707070', '01870707070', '2025-12-26 10:00:00', NULL),
(17, 'Modern Threads', 'Contemporary fashion collection', 'info@modernthreads.com', '01780808080', '01880808080', '2025-12-26 10:00:00', NULL),
(18, 'Style Avenue', 'Walk the fashion avenue', 'support@styleavenue.com', '01790909090', '01890909090', '2025-12-26 10:00:00', NULL),
(19, 'Fashion Fiesta', 'Celebrating fashion every day', 'hello@fashionfiesta.com', '01711121314', '01811121314', '2025-12-26 10:00:00', NULL),
(20, 'Classy Corner', 'Classy outfits at affordable prices', 'care@classycorner.com', '01722232425', '01822232425', '2025-12-26 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shop_category`
--

CREATE TABLE `shop_category` (
  `shop_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `role` enum('admin','member') DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `active_status` tinyint(1) DEFAULT 1,
  `image_url` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `full_name`, `email`, `address`, `contact_no`, `role`, `password`, `active_status`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Tahmid Shahriar Bhuiyan', 'tahmidshahriar.bd@gmail.com', NULL, '01515652762', NULL, '$2b$10$4zOnJfLDOAZvbV19HhQFre7MC77EamJ.En/V2zPRzMnrtdPP.qTaS', 1, NULL, '2025-12-21 18:50:07', '2025-12-21 18:52:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`branch_id`),
  ADD KEY `fk_branch_shop` (`shop_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `deal`
--
ALTER TABLE `deal`
  ADD PRIMARY KEY (`deal_id`),
  ADD KEY `fk_deal_shop` (`shop_id`),
  ADD KEY `fk_deal_branch` (`branch_id`);

--
-- Indexes for table `deal_category`
--
ALTER TABLE `deal_category`
  ADD PRIMARY KEY (`deal_id`,`category_id`),
  ADD KEY `fk_dc_shop_category` (`shop_id`,`category_id`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`shop_id`);

--
-- Indexes for table `shop_category`
--
ALTER TABLE `shop_category`
  ADD PRIMARY KEY (`shop_id`,`category_id`),
  ADD KEY `fk_sc_category` (`category_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deal`
--
ALTER TABLE `deal`
  MODIFY `deal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `shop_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `fk_branch_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `deal`
--
ALTER TABLE `deal`
  ADD CONSTRAINT `fk_deal_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_deal_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `deal_category`
--
ALTER TABLE `deal_category`
  ADD CONSTRAINT `fk_dc_deal` FOREIGN KEY (`deal_id`) REFERENCES `deal` (`deal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dc_shop_category` FOREIGN KEY (`shop_id`,`category_id`) REFERENCES `shop_category` (`shop_id`, `category_id`) ON UPDATE CASCADE;

--
-- Constraints for table `shop_category`
--
ALTER TABLE `shop_category`
  ADD CONSTRAINT `fk_sc_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sc_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
