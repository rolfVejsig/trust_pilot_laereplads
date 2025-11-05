-- ====== Categories ======
INSERT INTO Categories (CategoryName) VALUES
('Teknologi, byggeri og transport'),
('Omsorg, sundhed og pædagogik'),
('Kontor, handel og forretningsservice'),
('Fødevare, jordbrug og oplevelser');

-- ====== Professions ======
INSERT INTO Professions (ProfessionName, Category) VALUES
('Tømrer', 1),
('Murer', 1),
('Elektriker', 1),
('Smed', 1),
('Industritekniker', 1),
('VVS-energispecialist', 1),
('Bygningsmaler', 1),
('Mekaniker', 1),
('Chauffør', 1),
('IT-supporter', 1),
('Social- og sundhedsassistent', 2),
('Social- og sundhedshjælper', 2),
('Pædagogisk assistent', 2),
('Tandklinikassistent', 2),
('Hospitalsservice', 2),
('Optiker', 2),
('Kontor', 3),
('Detailhandel', 3),
('Handelsassistent', 3),
('Finans', 4),
('Eventkoordinator', 4),
('Turisme og service', 4),
('Bager', 4),
('Kok', 4),
('Tjener', 4),
('Gartner', 4),
('Landmand', 4),
('Dyrepasser', 4),
('Fiskeri', 4),
('Mad til mennesker (catering)', 4);

-- ====== Users ======
INSERT INTO Users (UserName, UserEmail, UserPassword, Profession) VALUES
('jdoe', 'jdoe@example.com', SHA2('password123', 256), 3),
('asmith', 'asmith@example.com', SHA2('password123', 256), 4),
('bwilliams', 'bwilliams@example.com', SHA2('mypassword', 256), 5),
('cmiller', 'cmiller@example.com', SHA2('secret', 256), 2),
('djohnson', 'djohnson@example.com', SHA2('123456', 256), 1),
('eroberts', 'eroberts@example.com', SHA2('letmein', 256), 8),
('fgarcia', 'fgarcia@example.com', SHA2('passw0rd', 256), 7),
('hlopez', 'hlopez@example.com', SHA2('password123', 256), 9);

-- ====== Companies ======
INSERT INTO Companies (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber) VALUES
('MediCare', SHA2('secure123', 256), 'https://medicare.com', 'Alice', 'Thompson', 'alice@medicare.com', '55512345'),
('TechNova', SHA2('innovate', 256), 'https://technova.io', 'Brian', 'Nguyen', 'brian@technova.io', '55523456'),
('EduWorld', SHA2('teachme', 256), 'https://eduworld.org', 'Cynthia', 'Perez', 'cynthia@eduworld.org', '55534567'),
('BuildIt', SHA2('builder', 256), 'https://buildit.co', 'David', 'Brown', 'david@buildit.co', '55545678'),
('FinServe', SHA2('finpass', 256), 'https://finserve.net', 'Emma', 'Rodriguez', 'emma@finserve.net', '55556789');

-- ====== CompanyProfessions ======
INSERT INTO CompanyProfessions (Company, Profession) VALUES
(1, 1),  -- MediCare employs Doctors
(1, 2),  -- MediCare employs Nurses
(2, 3),  -- TechNova employs Software Engineers
(2, 4),  -- TechNova employs Data Analysts
(3, 5),  -- EduWorld employs Teachers
(4, 8),  -- BuildIt employs Architects
(4, 9),  -- BuildIt employs Civil Engineers
(5, 6),  -- FinServe employs Accountants
(5, 7);  -- FinServe employs Financial Advisors

-- ====== Ratings ======
INSERT INTO Ratings (Points, RatingText, Rater, Company) VALUES
(5, 'Excellent healthcare services, highly professional staff!', 5, 1),
(4, 'Great communication and reliable tech team.', 1, 2),
(3, 'Educational content is okay, but delivery can improve.', 3, 3),
(5, 'Fast project delivery and high quality construction.', 6, 4),
(2, 'Finance consultation lacked depth.', 7, 5),
(4, 'Overall good support and responsive staff.', 2, 1),
(5, 'Top-notch development team.', 1, 2),
(3, 'Average performance, could be better.', 8, 4);
