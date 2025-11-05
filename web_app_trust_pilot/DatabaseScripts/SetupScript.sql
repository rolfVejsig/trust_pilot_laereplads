DROP DATABASE IF EXISTS learepladsDB;

CREATE DATABASE learepladsDB;
USE learepladsDB;

CREATE TABLE Categories(
CategoryId INT AUTO_INCREMENT,
CategoryName VARCHAR(50),
PRIMARY KEY (CategoryId)
);

CREATE TABLE professions(
ProfessionId INT AUTO_INCREMENT,
ProfessionName VARCHAR(30),
Category INT,
PRIMARY KEY (ProfessionId),
FOREIGN KEY (Category) REFERENCES Categories (categoryId)
);

CREATE TABLE Users(
UserId INT AUTO_INCREMENT,
UserName VARCHAR(14),
UserEmail VARCHAR(40),
UserPassword CHAR(64),
Profession INT,
PRIMARY KEY (UserId),
FOREIGN KEY (Profession) REFERENCES Professions (ProfessionId)
);

CREATE TABLE Companies(
CompanyId INT AUTO_INCREMENT,
CompanyName VARCHAR(20),
CompanyPassword CHAR(64),
WebpageURL VARCHAR(255),
OwnerFirstName VARCHAR(14),
OwnerLastName VARCHAR(18),
WorkEmail VARCHAR(40),
PhoneNumber CHAR(8),
PRIMARY KEY (CompanyId)
);

CREATE TABLE CompanyProfessions(
Company INT,
Profession INT,
FOREIGN KEY (Company) REFERENCES Companies (CompanyId),
FOREIGN KEY (Profession) REFERENCES Professions (ProfessionId)
);

CREATE TABLE Ratings(
RatingId INT AUTO_INCREMENT,
Points INT,
RatingTitle VARCHAR(20),
RatingText TEXT,
RatingDate DATE,
Rater INT,
Company INT,
PRIMARY KEY (RatingId),
FOREIGN KEY (Rater) REFERENCES Users (UserId),
FOREIGN KEY (Company) REFERENCES Companies (CompanyId)
);