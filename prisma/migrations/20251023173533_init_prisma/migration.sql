-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `occurredAt` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sales_occurredAt_idx`(`occurredAt`),
    INDEX `sales_category_idx`(`category`),
    INDEX `sales_region_idx`(`region`),
    INDEX `sales_channel_idx`(`channel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
