create database Week6Db;

use Week6Db;


 -- ====== Creating Table =======
 
create table articles(
	id int primary key auto_increment,
    title varchar(255),
    content text,
    journalistId int
);

create table journalists(
	id int primary key auto_increment,
    name varchar(100),
    email varchar(100),
    bio text
);

create table categories(
	id int primary key auto_increment,
    name varchar(100)
);

-- many to many relationship between articles and categories

CREATE TABLE article_categories (
    articleId INT,
    categoryId INT,
    PRIMARY KEY (articleId, categoryId),
    FOREIGN KEY (articleId) REFERENCES articles(id),
    FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- ====== Foreign keys ======= 

alter table articles
add constraint fk_journalistId
foreign key (journalistId)
references journalists(id);


-- ========= Inserting Data ========= --

insert INTO categories(name)
values ("POLITICS"), ("CLIMATE CHANGE"), ("AI"), ("TECHNOLOGY"), ("SCIENCE");


insert into journalists(name, email, bio)
values ("Bob", "bob@gmail.com", "I am a writer"),
		("Jake", "jake@gmail.com", "I am also a write");
