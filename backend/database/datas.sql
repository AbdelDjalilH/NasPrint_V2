DROP TABLE IF EXISTS cart_products;

DROP TABLE IF EXISTS cart;

DROP TABLE IF EXISTS notices;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS payments;

DROP TABLE IF EXISTS adresses;

DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS otps;

-- Création des tables
CREATE TABLE users (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Utilisateur',
    inscription_date DATE
);

CREATE TABLE categories (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_description VARCHAR(255)
);

CREATE TABLE products (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description VARCHAR(1000) NOT NULL,
    category_id INT UNSIGNED,
    price DECIMAL(10, 2) NOT NULL,
    quantity_available INT,
    image_url VARCHAR(255) NOT NULL DEFAULT 'default.png',
    height DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
);

CREATE TABLE images (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    first_image VARCHAR(255) DEFAULT NULL,
    second_image VARCHAR(255) DEFAULT NULL,
    third_image VARCHAR(255) DEFAULT NULL,
    fourth_image VARCHAR(255) DEFAULT NULL,
    fifth_image VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
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
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE notices (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    commentary VARCHAR(250) NOT NULL,
    mark INT NOT NULL,
    date_opinion DATE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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
    FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES adresses (id) ON DELETE CASCADE
);

CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories
INSERT INTO
    categories (
        category_name,
        category_description
    )
VALUES (
        'tablette',
        'Description pour tablette'
    ),
    (
        'meuble',
        'Description pour meuble'
    ),
    (
        'Evenements & fêtes',
        'louloulou'
    ),
    (
        'Collection Art Mural',
        'xhhxhxh'
    ),
    (
        'Collection Art de Table',
        'xhhxhxh'
    );

-- Insertion des utilisateurs
INSERT INTO
    users (
        email,
        username,
        password,
        role,
        inscription_date
    )
VALUES (
        'adj.hamzaoui@gmail.com',
        'adj',
        '$argon2id$hash',
        'Administrateur',
        '2024-10-20'
    ),
    (
        'adjo@adjo.dz',
        'adjo',
        '$argon2id$hash',
        'Utilisateur',
        '2024-10-21'
    ),
    (
        'user3@example.com',
        'user3',
        '$argon2id$hash',
        'Utilisateur',
        '2024-11-21'
    );
-- Ajout d'un utilisateur avec user_id = 3
-- Insertion des produits
INSERT INTO
    products (
        product_name,
        product_description,
        category_id,
        price,
        quantity_available,
        image_url,
        height,
        length,
        weight
    )
VALUES (
        'Décoration murale - Aid Moubarak',
        'Décoration Aid Mubarak. Fabriqué en PLA Blanc et peint en doré. Le croissant de Lune est fait en 2 parties',
        1,
        15.00,
        10,
        'https://static.wixstatic.com/media/3f698e_1b05553948c443e0a76d3d41e51e0198~mv2.jpg',
        5.00,
        6.00,
        12.00
    ),
    (
        'Décoration murale - Fée',
        'Décoration Fée pour chambre d\'enfant. Bienvenue dans le monde merveilleux des fées ! Si vous cherchez à ajouter une touche magique à la chambre de votre enfant, cette décoration murale représentant une fée est le choix parfait. Cette fée apportera une atmosphère enchantée à n\'importe quelle pièce. Cette œuvre d\'art murale fera ressortir l\'imagination de votre enfant et stimulera sa créativité. Vous souhaitez ajouter une touche magique à la chambre de votre enfant ou simplement créer un coin de jeu enchanté, cette fée sera le choix parfait pour votre enfant, offrez-lui un espace féerique où il pourra s\'évader et laisser libre cours à son imagination.',
        2,
        12.00,
        15,
        'https://static.wixstatic.com/media/3f698e_c3a01e021fe949598576307b67224b5f~mv2.jpg',
        3.00,
        3.00,
        5.00
    ),
    (
        'Porte bouteille murale',
        'Ce support élégant et fonctionnel vous permet de libérer de l\'espace. Sa conception discrète et bien pensée, il s\'intègre parfaitement à tout décor, offrant une solution pratique dans votre cuisine. Conseil de fixation: Double face Cyanolit Koltout Express.',
        2,
        7.00,
        15,
        'https://static.wixstatic.com/media/3f698e_fc149d4a10004ba984ae220a6ecdad2d~mv2.jpg',
        3.00,
        3.00,
        5.00
    ),
    (
        'Topper baby shower',
        'Cake topper baby est parfait pour décorer un gâteau de naissance, un gâteau de baptême ou même pour une baby shower.',
        3,
        5.00,
        15,
        'https://static.wixstatic.com/media/3f698e_b153cda824834ce1b158c0610f594bec~mv2.jpg',
        3.00,
        3.00,
        5.00
    ),
    (
        'Bar à sucette',
        'Habillez vos événements avec ce présentoir lors d\'une fête d\'anniversaire ou à l\'occasion d\'un mariage gourmand. Il possède plusieurs trous qui permettent de placer vos sucettes. Réutilisable pour diverses occasions. Les enfants adorent!',
        3,
        15.00,
        15,
        'https://static.wixstatic.com/media/3f698e_306db7e6ad23435488c2703dbbe14ca8~mv2.jpg',
        3.00,
        3.00,
        5.00
    ),
    (
        'Emporte pièce - Eid Mubarak',
        'Vous cherchez le moyen parfait de rendre vos pâtisseries de l\'Aïd encore plus belles cette année ? Ne cherchez pas plus loin. Avec son design élégant et festif, il ajoutera une touche de sophistication à votre présentation de pâtisseries de l\'Aïd. Préparez-vous à émerveiller vos invités avec vos pâtisseries de l\'Aïd parfaitement décorées !',
        1,
        8.00,
        15,
        'https://static.wixstatic.com/media/3f698e_b4b5e811899c4c1f88c28d972f8760b8~mv2.jpg',
        3.00,
        3.00,
        5.00
    ),
    (
        'Porte chaussure Adultes',
        'Le Porte Chaussure Adulte est un produit...',
        3,
        10.00,
        15,
        'https://static.wixstatic.com/media/3f698e_5b1f79c592e842389b2271c16819ca26~mv2.jpg/v1/fill/w_500,h_501,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_5b1f79c592e842389b2271c16819ca26~mv2.jpg',
        3.00,
        3.00,
        5.00
    );

INSERT INTO
    images (
        product_id,
        first_image,
        second_image,
        third_image,
        fourth_image,
        fifth_image
    )
VALUES (
        1,
        'https://static.wixstatic.com/media/3f698e_1b05553948c443e0a76d3d41e51e0198~mv2.jpg/v1/fill/w_787,h_785,al_c,q_85,usm_0.66_1.00_0.01/3f698e_1b05553948c443e0a76d3d41e51e0198~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_2d9f8354819248378829c0c85f08837f~mv2.png/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3f698e_2d9f8354819248378829c0c85f08837f~mv2.png',
        '',
        '',
        ''
    ),
    (
        2,
        'https://static.wixstatic.com/media/3f698e_c3a01e021fe949598576307b67224b5f~mv2.jpg/v1/fill/w_500,h_501,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_c3a01e021fe949598576307b67224b5f~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_900ca363270743d08a6351de1f8ee2b8~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_900ca363270743d08a6351de1f8ee2b8~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_f808dc66fa2c446595ffb94b906efc5e~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_f808dc66fa2c446595ffb94b906efc5e~mv2.jpg',
        '',
        ''
    ),
    (
        3,
        'https://static.wixstatic.com/media/3f698e_fc149d4a10004ba984ae220a6ecdad2d~mv2.jpg/v1/fill/w_500,h_497,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_fc149d4a10004ba984ae220a6ecdad2d~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_80c770740a534763b0159d73602f78ce~mv2.png/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3f698e_80c770740a534763b0159d73602f78ce~mv2.png',
        'https://static.wixstatic.com/media/3f698e_37832299da77465ea8462335a0eb5651~mv2.png/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3f698e_37832299da77465ea8462335a0eb5651~mv2.png',
        'https://static.wixstatic.com/media/3f698e_be62e457ce564661abd859e776b76e69~mv2.png/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3f698e_be62e457ce564661abd859e776b76e69~mv2.png',
        ''
    ),
    (
        4,
        'https://static.wixstatic.com/media/3f698e_b153cda824834ce1b158c0610f594bec~mv2.jpg/v1/fill/w_500,h_501,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_b153cda824834ce1b158c0610f594bec~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_cf737cdc7e524a4d8ea0cad89af0ba62~mv2.png/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3f698e_cf737cdc7e524a4d8ea0cad89af0ba62~mv2.png',
        '',
        '',
        ''
    ),
    (
        5,
        'https://static.wixstatic.com/media/3f698e_306db7e6ad23435488c2703dbbe14ca8~mv2.jpg/v1/fill/w_500,h_502,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_306db7e6ad23435488c2703dbbe14ca8~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_a5f4603f34f84556a608ab2ac8622ecc~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_a5f4603f34f84556a608ab2ac8622ecc~mv2.jpg',
        '',
        '',
        ''
    ),
    (
        6,
        'https://static.wixstatic.com/media/3f698e_b4b5e811899c4c1f88c28d972f8760b8~mv2.jpg/v1/fill/w_500,h_499,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_b4b5e811899c4c1f88c28d972f8760b8~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_6a023b552e01442facd69d50bebfb4ea~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_6a023b552e01442facd69d50bebfb4ea~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_f800396c35464003b27c64528afd2a54~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_f800396c35464003b27c64528afd2a54~mv2.jpg',
        '',
        ''
    ),
    (
        7,
        'https://static.wixstatic.com/media/3f698e_5b1f79c592e842389b2271c16819ca26~mv2.jpg/v1/fill/w_500,h_501,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_5b1f79c592e842389b2271c16819ca26~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_25bd327c462542bfa60e284b3e4e98ba~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_25bd327c462542bfa60e284b3e4e98ba~mv2.jpg',
        'https://static.wixstatic.com/media/3f698e_60d9bcbcaef64697a8273536e899c861~mv2.jpg/v1/fill/w_500,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/3f698e_60d9bcbcaef64697a8273536e899c861~mv2.jpg',
        '',
        ''
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
        'lolo',
        'lulu',
        35,
        'Paris',
        75008
    ),
    (
        2,
        'lele',
        'lalo',
        '32',
        'Lyon',
        69200
    ),
    (
        3,
        'Doe',
        'John',
        123,
        'New York',
        10001
    );
-- Ajout d'une adresse pour l'utilisateur avec user_id = 3
-- Insertion des paniers
INSERT INTO
    cart (user_id, date_creation)
VALUES (1, '2023-01-12'),
    (2, '2023-01-15'),
    (3, '2024-11-21');
-- Ajout d'un panier pour l'utilisateur avec user_id = 3
-- Insertion des produits dans les paniers
INSERT INTO
    cart_products (cart_id, product_id, quantity)
VALUES (3, 1, 2), -- Exemple pour ajouter 2 unités du produit avec ID 1
    (3, 2, 1);
-- Exemple pour ajouter 1 unité du produit avec ID 2
-- Insertion des notices
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
        'azertyyy',
        3,
        '2020-10-10'
    ),
    (
        2,
        2,
        'azerrrrtyyy',
        5,
        '2020-10-20'
    );