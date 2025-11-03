USE learepladsDB;

DROP VIEW IF EXISTS GetAllCompanies;
DROP VIEW IF EXISTS CompanyOverview;
DROP PROCEDURE IF EXISTS InsertUser;
DROP PROCEDURE IF EXISTS UpdateUser;
DROP PROCEDURE IF EXISTS InsertCompany;
DROP PROCEDURE IF EXISTS GetCompanyById;
DROP PROCEDURE IF EXISTS GetCompanyProfessions;


CREATE VIEW GetAllCompanies AS
SELECT CompanyId, CompanyName FROM Companies;

CREATE VIEW CompanyOverview AS
SELECT * FROM Companies
INNER JOIN CompanyProfessions ON CompanyID INNER JOIN Professions ON ProfessionId INNER JOIN Categories ON CategoryId
WHERE CompanyProfessions.Company = Companies.CompanyId AND Professions.ProfessionId = CompanyProfessions.Profession AND Categories.CategoryId = Professions.Category;

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

CREATE PROCEDURE InsertCompany(IN CompanyName VARCHAR(20), IN CompanyPassword CHAR(64), IN WebpageURL VARCHAR(255),
IN OwnerFirstName VARCHAR(14), IN OwnerLastName VARCHAR(18), IN WorkEmail VARCHAR(40), IN PhoneNumber CHAR(8))
BEGIN
INSERT INTO Companies (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber)
VALUES (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber);
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


DELIMITER ;