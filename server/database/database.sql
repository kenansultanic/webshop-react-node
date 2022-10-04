CREATE TABLE users
(
    id         serial primary key,
    name       varchar(20),
    surname    varchar(30),
    email      varchar(40) unique,
    password   varchar(300),
    type       varchar(20),
    newsletter boolean
);


CREATE TABLE user_details
(
    user_id int primary key,
    address varchar(40),
    city    varchar(20),
    zip     varchar(10),
    region  varchar(20),
    phone   varchar(20)
);


CREATE TABLE products
(
    id          serial primary key,
    name        varchar(50),
    price       float,
    quantity    integer,
    type        varchar(20),
    description varchar(300),
    timestamp   timestamp
);


ALTER TABLE products
    ADD COLUMN
        timestamp timestamp;


CREATE TABLE sizes
(
    id         serial,
    product_id int,
    size       varchar(5),
    primary key (id, product_id),
    foreign key (product_id) references products (id)
);


CREATE TABLE colors
(
    id         serial,
    product_id int,
    color      varchar(20),
    primary key (id, product_id),
    foreign key (product_id) references products (id)
);


CREATE TABLE keywords
(
    id         serial,
    product_id int,
    keyword    varchar(20),
    primary key (id, product_id),
    foreign key (product_id) references products (id)
);


CREATE TABLE product_images
(
    id         serial,
    product_id int,
    img_url    varchar(100),
    img_number int,
    primary key (id, product_id),
    foreign key (product_id) references products (id)
);


CREATE TABLE orders
(
    id           serial unique,
    user_id      int,
    order_date   timestamp,
    order_status varchar(20),
    primary key (id, user_id),
    foreign key (user_id) references users (id)
);


CREATE TABLE order_items
(
    order_id   int,
    product_id int,
    quantity   int,
    size       varchar,
    color      varchar,
    price      float,
    primary key (order_id, product_id),
    foreign key (order_id) references orders (id),
    foreign key (product_id) references products (id)
);


CREATE TABLE coupons
(
    id             serial primary key,
    coupon         varchar(20) unique,
    discount       integer,
    number_of_uses integer,
    valid_until    date
);


CREATE OR REPLACE FUNCTION getALlOrders()
    RETURNS TABLE
            (
                id           int,
                user_id      int,
                order_date   timestamp,
                order_status varchar,
                total        float
            )
AS
$$
BEGIN
    RETURN QUERY SELECT *, (SELECT SUM(price * quantity) FROM order_items WHERE order_id = orders.id) total FROM orders;
END;
$$
    language plpgsql;


CREATE OR REPLACE FUNCTION getUserOrderHistory(userID int)
    RETURNS TABLE
            (
                id           int,
                user_id      int,
                order_date   timestamp,
                order_status varchar,
                total        float,
                items        bigint
            )
AS
$$
BEGIN
    RETURN QUERY SELECT *,
                        (SELECT SUM(price * quantity) FROM order_items WHERE order_id = orders.id) total,
                        (SELECT COUNT(*) FROM order_items WHERE order_id = orders.id)              items
                 FROM orders
                 WHERE orders.user_id = userID;
END
$$
    language plpgsql;


CREATE OR REPLACE FUNCTION getDashboardStatistics()
    RETURNS TABLE
            (
                orders    int,
                products  int,
                customers int,
                income    float
            )
AS
$$
DECLARE
    num_orders    int;
    num_products  int;
    num_customers int;
    income        float;
BEGIN
    SELECT COUNT(*) FROM orders INTO num_orders;
    SELECT COUNT(*) FROM products INTO num_products;
    SELECT COUNT(*) FROM users INTO num_customers;
    SELECT SUM(price) FROM order_items INTO income;
    RETURN QUERY SELECT num_orders, num_products, num_customers, income;
END;
$$
    language plpgsql;
