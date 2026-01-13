<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialDataSeeder extends Seeder
{
    public function run()
    {
        DB::unprepared(<<<'SQL'
        SET FOREIGN_KEY_CHECKS = 0;

        TRUNCATE TABLE order_details;
        TRUNCATE TABLE orders;
        TRUNCATE TABLE products;
        TRUNCATE TABLE carts;
        TRUNCATE TABLE users;
        TRUNCATE TABLE roles;
        TRUNCATE TABLE categories;
        TRUNCATE TABLE origins;

        SET FOREIGN_KEY_CHECKS = 1;

        SET @now := NOW();

        INSERT INTO roles (id, name, created_at, updated_at) VALUES
        (UUID(), 'admin',  @now, null),
        (UUID(), 'user',   @now, null),
        (UUID(), 'seller',   @now, null);

        INSERT INTO users (
            id, name, email, password, role_id, status, created_at, updated_at
        ) VALUES
        (
            UUID(),
            'Admin',
            'admin@7men.com',
            '$2y$10$Xzjvt7F.k2UKKJ1A.ld2hOjkvZML7mDw5.KrznxXVTqFHyNaQSvPy',
            (SELECT id FROM roles WHERE name='admin'),
            'active',
            @now, @now
        ),
        (
            UUID(),
            'User',
            'user@example.com',
            '$2y$10$Xzjvt7F.k2UKKJ1A.ld2hOjkvZML7mDw5.KrznxXVTqFHyNaQSvPy',
            (SELECT id FROM roles WHERE name='user'),
            'active',
            @now, null
        ),
        (
            UUID(),
            'Seller',
            'seller@example.com',
            '$2y$10$Xzjvt7F.k2UKKJ1A.ld2hOjkvZML7mDw5.KrznxXVTqFHyNaQSvPy',
            (SELECT id FROM roles WHERE name='seller'),
            'active',
            @now, null
        ),
        (
            UUID(),
            'User Test',
            'user@test.com',
            '$2y$10$Xzjvt7F.k2UKKJ1A.ld2hOjkvZML7mDw5.KrznxXVTqFHyNaQSvPy',
            (SELECT id FROM roles WHERE name='user'),
            'active',
            @now, null
        );

        INSERT INTO categories (id, name, created_at, updated_at) VALUES
        (UUID(), 'Trái cây nhập khẩu', @now, null);

        INSERT INTO origins (id, name, created_at, updated_at) VALUES
        (UUID(), 'Việt Nam', @now, null),
        (UUID(), 'Mỹ', @now, null),
        (UUID(), 'Úc', @now, null);

        INSERT INTO products (
            id, name, detail_desc, sold_quantity, stock_quantity, price,
            origin_id, category_id, unit, image, status, short_desc,
            created_at, updated_at
        ) VALUES
        (UUID(),'Táo Mỹ','Táo đỏ nhập khẩu',0,100,55000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','apple.jpg','active','Táo Mỹ',@now,null),
        (UUID(),'Nho Úc','Nho không hạt',0,100,99000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','grape.jpg','active','Nho Úc',@now,null),
        (UUID(),'Cam Sành','Cam nhiều nước',0,100,45000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','orange.jpg','active','Cam Sành',@now,null),
        (UUID(),'Xoài Cát','Xoài thơm',0,100,65000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','mango.jpg','active','Xoài Cát',@now,null),
        (UUID(),'Dưa Hấu','Dưa ngọt',0,100,30000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','watermelon.jpg','active','Dưa Hấu',@now,null),
        (UUID(),'Chuối','Chuối chín',0,100,25000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','banana.jpg','active','Chuối',@now,null),
        (UUID(),'Lê Hàn','Lê giòn',0,100,70000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','pear.jpg','active','Lê Hàn',@now,null),
        (UUID(),'Kiwi','Giàu vitamin C',0,100,85000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','kiwi.jpg','active','Kiwi',@now,null),
        (UUID(),'Cherry','Cherry Mỹ',0,100,150000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','cherry.jpg','active','Cherry',@now,null),
        (UUID(),'Dâu Tây','Dâu tươi',0,100,120000,(SELECT id FROM origins LIMIT 1),(SELECT id FROM categories LIMIT 1),'kg','strawberry.jpg','active','Dâu Tây',@now,null);
        INSERT INTO orders (
            id, user_id, recipient_name, recipient_email,
            recipient_phone_number, recipient_address, recipient_city, recipient_district, recipient_ward,
            payment_method, payment_status,
            datetime_order, total_amount, shipping_fee,
            status, created_at, updated_at
        ) VALUES (
            UUID(),
            (SELECT id FROM users LIMIT 1),
            'User Test',
            'user@test.com',
            '0909999999',
            '123 Lê Duẩn, Hải Châu, Đà Nẵng',
            'Đà Nẵng',
            'Hải Châu',
            'Thanh Khê',
            'cod',
            'paid',
            @now,
            0,
            30000,
            'pending',
            @now, null
        );

        INSERT INTO order_details (
            id, order_id, product_id,
            product_name, product_price,
            quantity, unit, total_price,
            created_at, updated_at
        )
        SELECT
            UUID(),
            (SELECT id FROM orders LIMIT 1),
            p.id,
            p.name,
            p.price,
            2,
            p.unit,
            p.price * 2,
            @now, null
        FROM products p
        LIMIT 5;

        UPDATE orders o
        SET o.total_amount = (
            SELECT SUM(od.total_price)
            FROM order_details od
            WHERE od.order_id = o.id
        ) + o.shipping_fee;

        SQL);
    }
}
