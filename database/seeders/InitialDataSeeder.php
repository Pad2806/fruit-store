<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::unprepared("
            /* ===============================
               RESET DATABASE (DEV ONLY)
            =============================== */
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE order_details;
            TRUNCATE TABLE orders;
            TRUNCATE TABLE cart_items;
            TRUNCATE TABLE carts;
            TRUNCATE TABLE products;
            TRUNCATE TABLE origins;
            TRUNCATE TABLE categories;
            TRUNCATE TABLE users;
            TRUNCATE TABLE roles;

            SET FOREIGN_KEY_CHECKS = 1;

            /* ===============================
               GLOBAL TIMESTAMP
            =============================== */
            SET @now := NOW();

            /* ===============================
               ROLES
            =============================== */
            INSERT INTO roles (id, name, created_at) VALUES
            ('b2a3080f-ebe9-11f0-a64b-06f3c06admin', 'admin', @now),
            ('b2a3080f-ebe9-11f0-a64b-06f3c06seller', 'seller', @now),
            ('b2a3080f-ebe9-11f0-a64b-06f3c06user', 'user', @now);

            /* ===============================
               CATEGORIES
            =============================== */
            INSERT INTO categories (id, name, description, created_at) VALUES
            (UUID(), 'Trái cây miền Bắc', 'Danh mục trái cây miền Bắc', @now),
            (UUID(), 'Trái cây miền Nam', 'Danh mục trái cây miền Nam', @now),
            (UUID(), 'Trái cây nhập khẩu', 'Danh mục trái cây nhập khẩu', @now),
            (UUID(), 'Trái cây sấy khô', 'Danh mục trái cây sấy khô', @now),
            (UUID(), 'Trái cây theo mùa', 'Danh mục trái cây theo mùa', @now),
            (UUID(), 'Trái cây hữu cơ', 'Danh mục trái cây hữu cơ', @now),
            (UUID(), 'Combo quà tặng', 'Danh mục combo quà tặng', @now),
            (UUID(), 'Nước ép trái cây', 'Danh mục nước ép trái cây', @now),
            (UUID(), 'Trái cây cao cấp', 'Danh mục trái cây cao cấp', @now),
            (UUID(), 'Trái cây giá tốt', 'Danh mục trái cây giá tốt', @now);

            /* ===============================
               ORIGINS
            =============================== */
            INSERT INTO origins (id, name, description, created_at) VALUES
            (UUID(), 'Việt Nam', 'Xuất xứ Việt Nam', @now),
            (UUID(), 'Thái Lan', 'Xuất xứ Thái Lan', @now),
            (UUID(), 'Mỹ', 'Xuất xứ Mỹ', @now),
            (UUID(), 'Úc', 'Xuất xứ Úc', @now),
            (UUID(), 'New Zealand', 'Xuất xứ New Zealand', @now),
            (UUID(), 'Hàn Quốc', 'Xuất xứ Hàn Quốc', @now),
            (UUID(), 'Nhật Bản', 'Xuất xứ Nhật Bản', @now),
            (UUID(), 'Chile', 'Xuất xứ Chile', @now),
            (UUID(), 'Nam Phi', 'Xuất xứ Nam Phi', @now),
            (UUID(), 'Trung Quốc', 'Xuất xứ Trung Quốc', @now);

            /* ===============================
               USERS
            =============================== */
            INSERT INTO users (
                id, name, email, phone_number, address, dob,
                password, role_id, status, created_at
            ) VALUES
            (
                UUID(), 'Admin', 'admin@7men.com', '0900000000', 'Hà Nội', '1995-01-01',
                '\$2y\$10\$examplehashedpasswordadmin',
                (SELECT id FROM roles WHERE name='admin' LIMIT 1),
                'active', @now
            ),
            (
                UUID(), 'User 01', 'user01@example.com', '0900000001', 'Hà Nội', '1998-01-01',
                '\$2y\$10\$examplehashedpassworduser',
                (SELECT id FROM roles WHERE name='user' LIMIT 1),
                'active', @now
            );

            /* ===============================
               PRODUCTS
            =============================== */
            INSERT INTO products (
                id, name, detail_desc, sold_quantity, stock_quantity, price,
                origin_id, category_id, unit, image, status, short_desc,
                created_at
            )
            SELECT
                UUID(),
                p.name,
                p.detail_desc,
                p.sold_quantity,
                p.stock_quantity,
                p.price,
                (SELECT id FROM origins ORDER BY RAND() LIMIT 1),
                (SELECT id FROM categories ORDER BY RAND() LIMIT 1),
                p.unit,
                p.image,
                p.status,
                p.short_desc,
                @now
            FROM (
                SELECT 'Táo Mỹ' AS name, 'Táo giòn ngọt nhập khẩu' AS detail_desc, 12 AS sold_quantity, 180 AS stock_quantity, 55000 AS price, 'kg' AS unit, 'apple.jpg' AS image, 'active' AS status, 'Táo giòn' AS short_desc
                UNION ALL SELECT 'Nho xanh','Nho không hạt',8,140,99000,'kg','grape.jpg','active','Nho ngọt'
                UNION ALL SELECT 'Cam sành','Cam nhiều nước',15,200,45000,'kg','orange.jpg','active','Cam mọng'
                UNION ALL SELECT 'Xoài cát','Xoài thơm',20,160,65000,'kg','mango.jpg','active','Xoài thơm'
                UNION ALL SELECT 'Dưa hấu','Dưa hấu ngọt',6,90,30000,'kg','watermelon.jpg','active','Dưa hấu'
            ) p;

            /* ===============================
               CARTS
            =============================== */
            INSERT INTO carts (id, user_id, created_at)
            SELECT UUID(), u.id, @now
            FROM users u;

            /* ===============================
               CART ITEMS
            =============================== */
            INSERT INTO cart_items (
                id, cart_id, product_id, product_name, product_price,
                quantity, unit, created_at
            )
            SELECT
                UUID(),
                c.id,
                p.id,
                p.name,
                p.price,
                FLOOR(1 + RAND() * 5),
                p.unit,
                @now
            FROM carts c
            JOIN products p
            ORDER BY RAND()
            LIMIT 30;
        ");
    }
}

