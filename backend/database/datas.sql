DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firsname VARCHAR(255),
    lastname VARCHAR(255)
);

INSERT INTO
    users (
        email,
        password,
        firstname,
        lastname
    )
VALUES ("adj@adj.com",)