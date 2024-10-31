DROP TABLE IF EXISTS cart_products;

DROP TABLE IF EXISTS cart;

DROP TABLE IF EXISTS notices;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS payments;

DROP TABLE IF EXISTS adresses;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Utilisateur',
    inscription_date DATE
);

CREATE TABLE products (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description VARCHAR(500) NOT NULL,
    price INT NOT NULL,
    quantity_available INT,
    image_url VARCHAR(1000) NOT NULL DEFAULT 'default.jpg',
    height DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL
);

CREATE TABLE categories (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_description VARCHAR(255) NOT NULL
);

CREATE TABLE payments (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    rising INT NOT NULL,
    payment_date DATE NOT NULL,
    payment_mean VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE adresses (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    number_road VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE cart (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    date_creation DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE cart_products (
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE notices (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    commentary VARCHAR(250) NOT NULL,
    mark INT NOT NULL,
    date_opinion DATE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    payment_id INT UNSIGNED NOT NULL,
    address_id INT UNSIGNED NOT NULL,
    order_date DATE NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    total_rising INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments (id),
    FOREIGN KEY (address_id) REFERENCES adresses (id)
);

INSERT INTO
    users (
        email,
        username,
        password,
        role,
        inscription_date
    )
VALUES (
        "adj@adj.com",
        "adj",
        "Iamthebest",
        "Administrateur",
        "2024-10-20"
    ),
    (
        "adjo@adjo.dz",
        "adjo",
        "Youarethebest",
        "Utilisateur",
        "2024-10-21"
    );

INSERT INTO
    products (
        product_name,
        product_description,
        price,
        quantity_available,
        image_url,
        height,
        length,
        weight
    )
VALUES (
        "table",
        "lalalalalalalalalalalalalla",
        10,
        10,
        "https://www.istockphoto.com/photo/woman-hiking-near-lake-antermoia-in-dolomites-gm1790759817-547692024",
        5,
        6,
        12
    ),
    (
        "tableooo",
        "lalalalalalalalalalalalallaoooo",
        102,
        101,
        "https://www.istockphoto.com/photo/woman-hiking-near-lake-antermoia-in-dolomites-gm1790759817-547692024",
        56,
        62,
        123
    );

INSERT INTO
    categories (
        category_name,
        category_description
    )
VALUES ("tablette", "louloulou"),
    ("hxhdhxh", "xhhxhxh");

INSERT INTO
    payments (
        user_id,
        rising,
        payment_date,
        payment_mean,
        payment_status
    )
VALUES (
        1,
        50,
        "2020-03-03",
        "paypal",
        "accepté"
    ),
    (
        2,
        40,
        "2021-03-20",
        "carte",
        "accepté"
    );

INSERT INTO
    adresses (
        user_id,
        lastname,
        firstname,
        number_road,
        city,
        postal_code
    )
VALUES (
        1,
        "lolo",
        "lulu",
        35,
        "Paris",
        75008
    ),
    (
        2,
        "lele",
        "lalo",
        "32",
        "Lyon",
        69200
    );

INSERT INTO
    cart (user_id, date_creation)
VALUES (1, "2023-01-12"),
    (2, "2023-01-15");

INSERT INTO
    cart_products (cart_id, product_id, quantity)
VALUES (1, 1, 5),
    (2, 2, 6);

INSERT INTO
    notices (
        product_id,
        user_id,
        commentary,
        mark,
        date_opinion
    )
VALUES (
        1,
        1,
        "azertyyy",
        3,
        "2020-10-10"
    ),
    (
        2,
        2,
        "azerrrrrtyyy",
        5,
        "2020-10-20"
    );

INSERT INTO
    orders (
        user_id,
        payment_id,
        address_id,
        order_date,
        order_status,
        total_rising
    )
VALUES (
        1,
        1,
        1,
        "2020-10-25",
        "lalala",
        200
    ),
    (
        2,
        2,
        2,
        "2020-10-15",
        "lalalalou",
        150
    );