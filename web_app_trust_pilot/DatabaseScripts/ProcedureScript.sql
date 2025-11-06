USE learepladsDB;

DROP VIEW IF EXISTS GetCompanies;
DROP VIEW IF EXISTS CompanyOverview;
DROP VIEW IF EXISTS GetProfessions;
DROP VIEW IF EXISTS GetRatings;
DROP PROCEDURE IF EXISTS InsertUser;
DROP PROCEDURE IF EXISTS UpdateUser;
DROP PROCEDURE IF EXISTS DeleteUser;
DROP PROCEDURE IF EXISTS InsertCompany;
DROP PROCEDURE IF EXISTS GetCompanyById;
DROP PROCEDURE IF EXISTS GetCompanyProfessions;
DROP PROCEDURE IF EXISTS InsertRating;
DROP PROCEDURE IF EXISTS DeleteRating;
DROP PROCEDURE IF EXISTS GetCompanyRatings;


CREATE VIEW GetCompanies AS
SELECT CompanyId, CompanyName FROM Companies;

CREATE VIEW CompanyOverview AS
SELECT * FROM Companies
INNER JOIN CompanyProfessions ON CompanyID INNER JOIN Professions ON ProfessionId INNER JOIN Categories ON CategoryId
WHERE CompanyProfessions.Company = Companies.CompanyId AND Professions.ProfessionId = CompanyProfessions.Profession AND Categories.CategoryId = Professions.Category;

CREATE VIEW GetProfessions AS
SELECT ProfessionId, ProfessionName FROM Professions;

CREATE VIEW GetRatings AS
SELECT RatingId, Points, CompanyId, CompanyName, UserId, UserName FROM Ratings INNER JOIN Companies ON Company INNER JOIN Users ON Rater
WHERE Ratings.Company = Companies.CompanyId AND Ratings.Rater = Users.UserId;

DELIMITER //

CREATE PROCEDURE InsertUser(IN UserName VARCHAR(14), IN UserEmail VARCHAR(40), IN Userpassword CHAR(64), IN Profession INT)
BEGIN
INSERT INTO Users (UserName, UserEmail, UserPassword, Profession)
VALUES (UserName, UserEmail, UserPassword, Profession);
END//

CREATE PROCEDURE UpdateUser(IN UserName VARCHAR(14), IN Profession VARCHAR(30))
BEGIN
SET @NewProfession = 0;
SELECT ProfessionId FROM Professions WHERE ProfessionName = Profession INTO @NewProfession;
SET @UpdateUser = 0;
SELECT UserId FROM Users WHERE Users.UserName = UserName INTO @UpdateUser;
UPDATE Users
SET Users.Profession = @NewProfession WHERE UserId = @UpdateUser;
END//

CREATE PROCEDURE DeleteUser(IN UserId INT)
BEGIN
DELETE FROM Users Where Users.UserId = UserId;
END//

CREATE PROCEDURE InsertCompany(IN CompanyName VARCHAR(20), IN CompanyPassword CHAR(64), IN WebpageURL VARCHAR(255),
IN OwnerFirstName VARCHAR(14), IN OwnerLastName VARCHAR(18), IN WorkEmail VARCHAR(40), IN PhoneNumber CHAR(8),
IN CompanyProfessions TEXT)
BEGIN
	DECLARE next_value VARCHAR(50);
    DECLARE remaining_values TEXT;
INSERT INTO Companies (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber)
VALUES (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber);

    SET remaining_values = CompanyProfessions;
    SET @CompanyId = LAST_INSERT_ID(); 

    WHILE LENGTH(remaining_values) > 0 DO
        SET next_value = SUBSTRING_INDEX(remaining_values, ',', 1);
        
		SELECT ProfessionId INTO @ProfessionId FROM Professions WHERE ProfessionName = next_value;

            INSERT INTO CompanyProfessions (Company, Profession)
            VALUES (@CompanyId , @ProfessionId);

        -- Remove processed value
        IF remaining_values LIKE '%,%' THEN
            SET remaining_values = SUBSTRING(remaining_values, LENGTH(next_value) + 2);
        ELSE
            SET remaining_values = '';
        END IF;
    END WHILE;
END//

CREATE PROCEDURE GetCompanyById(IN CompanyId INT)
BEGIN
SELECT CompanyName, WebPageURL, OwnerFirstName, OwnerLastName FROM Companies
WHERE Companies.CompanyId = CompanyId;
END//

CREATE PROCEDURE GetCompanyProfessions(IN CompanyId INT)
BEGIN
SELECT ProfessionName, CategoryName FROM CompanyOverview
WHERE CompanyOverview.CompanyId = CompanyId;
END//

CREATE PROCEDURE InsertRating( IN Points INT, IN RatingText TEXT, IN UserId INT,  IN CompanyId INT)
BEGIN
INSERT INTO Ratings (Points, RatingText, Rater, Company)
VALUES (Points, RatingText, UserId, CompanyId);
END//

CREATE PROCEDURE DeleteRating(IN RatingId INT)
BEGIN
DELETE FROM Ratings WHERE Ratings.RatingId = RatingId;
END//

CREATE PROCEDURE GetCompanyRatings(IN CompanyId INT)
BEGIN
SELECT * FROM Ratings WHERE Company = CompanyId;
END//


DELIMITER ;