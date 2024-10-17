DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

INSERT INTO
    users (email, username, password)
VALUES (
        "adj@adj.com",
        "adj",
        "Iamthebest"
    ),
    (
        "adjo@adjo.dz",
        "adjo",
        "Youarethebest"
    ),
    (
        "adji@adji.dz",
        "adji",
        "Heisthebest"
    );