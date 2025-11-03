
Use learepladsDB;

-- Categories
INSERT INTO Categories (CategoryName) VALUES
('Healthcare'),
('Technology'),
('Education'),
('Finance'),
('Construction');

-- Professions
INSERT INTO Professions (ProfessionName, Category) VALUES
('Doctor', 1),
('Nurse', 1),
('Software Engineer', 2),
('Data Analyst', 2),
('Teacher', 3),
('Accountant', 4),
('Financial Advisor', 4),
('Architect', 5),
('Civil Engineer', 5);

-- Users
INSERT INTO Users (UserName, UserEmail, UserPassword, Profession) VALUES
('jdoe', 'jdoe@example.com', SHA2('password123', 256), 3),
('asmith', 'asmith@example.com', SHA2('password123', 256), 4),
('bwilliams', 'bwilliams@example.com', SHA2('mypassword', 256), 5),
('cmiller', 'cmiller@example.com', SHA2('secret', 256), 2),
('djohnson', 'djohnson@example.com', SHA2('123456', 256), 1),
('eroberts', 'eroberts@example.com', SHA2('letmein', 256), 8),
('fgarcia', 'fgarcia@example.com', SHA2('passw0rd', 256), 7),
('hlopez', 'hlopez@example.com', SHA2('password123', 256), 9);

-- Companies
INSERT INTO Companies (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber) VALUES
('MediCare Inc', SHA2('secure123', 256), 'https://medicare.com', 'Alice', 'Thompson', 'alice@medicare.com', '55512345'),
('TechNova', SHA2('innovate', 256), 'https://technova.io', 'Brian', 'Nguyen', 'brian@technova.io', '55523456'),
('EduWorld', SHA2('teachme', 256), 'https://eduworld.org', 'Cynthia', 'Perez', 'cynthia@eduworld.org', '55534567'),
('BuildIt', SHA2('builder', 256), 'https://buildit.co', 'David', 'Brown', 'david@buildit.co', '55545678'),
('FinServe', SHA2('finpass', 256), 'https://finserve.net', 'Emma', 'Rodriguez', 'emma@finserve.net', '55556789');

-- CompanyProfessions
INSERT INTO CompanyProfessions (Company, Profession) VALUES
(1, 1), -- MediCare employs Doctors
(1, 2), -- MediCare employs Nurses
(2, 3), -- TechNova employs Software Engineers
(2, 4), -- TechNova employs Data Analysts
(3, 5), -- EduWorld employs Teachers
(4, 8), -- BuildIt employs Architects
(4, 9), -- BuildIt employs Civil Engineers
(5, 6), -- FinServe employs Accountants
(5, 7); -- FinServe employs Financial Advisors

-- Ratings
INSERT INTO Ratings (Points, RatingText, Rater) VALUES
(5, 'Excellent experience, very professional!', 1),
(4, 'Good communication and timely delivery.', 2),
(3, 'Average service, could improve in punctuality.', 3),
(5, 'Highly skilled and knowledgeable.', 4),
(2, 'Unreliable and unresponsive.', 5),
(4, 'Overall good, minor issues with scheduling.', 6),
(5, 'Great service, would recommend!', 7),
(3, 'Satisfactory but not exceptional.', 8);
