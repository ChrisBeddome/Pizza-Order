DROP DATABASE IF EXISTS pizzadb;

CREATE DATABASE pizzadb;

USE pizzadb;

CREATE TABLE users (
    email           varchar(50)     not null,
    user_password   varchar(72),
    phone           varchar(50),
    first_name      varchar(50),
    last_name       varchar(50),
    primary key (email)
);

CREATE TABLE addresses (
    addressID       int(10)     not null auto_increment,
    user_fk         varchar(50),
    street          varchar(50),
    city            varchar(50),
    province        varchar(50),
    postal_code     varchar(50),
    apt_number      varchar(50),
    primary key (addressID),
    foreign key (user_fk) REFERENCES users (email)
);

CREATE TABLE orders (
    orderID         int(10)     not null auto_increment,
    user            varchar(50),
    order_time      datetime,
    address_fk      int(10),
    primary key (orderID),
    foreign key (address_fk) REFERENCES addresses (addressID),
    foreign key (user) REFERENCES users (email)
);

CREATE TABLE sauceLU (
    sauceID         int(10) not null auto_increment,
    sauce_type      varchar(50),
    primary key (sauceID)
);

CREATE TABLE cheeseLU (
    cheeseID        int(10) not null auto_increment,
    cheese_type     varchar(50),
    primary key (cheeseID)
);

CREATE TABLE doughLU (
    doughID         int(10) not null auto_increment,
    dough_type      varchar(50),
    primary key (doughID)
);

CREATE TABLE sizeLU (
    sizeID          int(10) not null auto_increment,
    size_type       varchar(50),
    primary key (sizeID)
);

CREATE TABLE pizzas (
    pizzaID             int(10)     not null auto_increment,
    orderID_fk          int(10),
    size_fk             int(10),
    dough_fk            int(10),
    sauce_fk            int(10),
    cheese_fk           int(10),
    primary key (pizzaID),
    foreign key (orderID_fk) REFERENCES orders (OrderID),
    foreign key (size_fk) REFERENCES sizeLU (sizeID),
    foreign key (dough_fk) REFERENCES doughLU (doughID),
    foreign key (sauce_fk) REFERENCES sauceLU (sauceID),
    foreign key (cheese_fk) REFERENCES cheeseLU (cheeseID)
);

CREATE TABLE toppings (
    toppingID           int(10) not null auto_increment,
    topping_name        varchar(50),
    primary key (toppingID)
);

CREATE TABLE pizzaToppings (
    pizza_fk        int(10),
    topping_fk      int(10),
    foreign key (pizza_fk) REFERENCES pizzas (pizzaID),
    foreign key (topping_fk) REFERENCES toppings (toppingID),
    primary key (pizza_fk, topping_fk)
);

-- Populate the Lookup Tables
INSERT INTO sizeLU (size_type) VALUES ('Small');
INSERT INTO sizeLU (size_type) VALUES ('Medium');
INSERT INTO sizeLU (size_type) VALUES ('Large');

INSERT INTO cheeseLU (cheese_type) VALUES ('Light');
INSERT INTO cheeseLU (cheese_type) VALUES ('Regular');
INSERT INTO cheeseLU (cheese_type) VALUES ('Extra');

INSERT INTO sauceLU (sauce_type) VALUES ('Light');
INSERT INTO sauceLU (sauce_type) VALUES ('Regular');
INSERT INTO sauceLU (sauce_type) VALUES ('Extra');

INSERT INTO doughLU (dough_type) VALUES ('Thin');
INSERT INTO doughLU (dough_type) VALUES ('Regular');
INSERT INTO doughLU (dough_type) VALUES ('Hand Tossed');

INSERT INTO toppings (topping_name) VALUES ('Green Peppers');
INSERT INTO toppings (topping_name) VALUES ('Mushrooms');
INSERT INTO toppings (topping_name) VALUES ('Onions');
INSERT INTO toppings (topping_name) VALUES ('Jalapenos');
INSERT INTO toppings (topping_name) VALUES ('Roasted Red Peppers');
INSERT INTO toppings (topping_name) VALUES ('Brooklyn Pepperoni');
INSERT INTO toppings (topping_name) VALUES ('Sausage');
INSERT INTO toppings (topping_name) VALUES ('Ground Beef');
INSERT INTO toppings (topping_name) VALUES ('Bacon');
INSERT INTO toppings (topping_name) VALUES ('Hot Calabrese');

GRANT SELECT, INSERT ON pizzadb.* TO 'pizzaUser'@'localhost' IDENTIFIED BY 'pizza123';



