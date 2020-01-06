INSERT INTO users(firstname, lastname, email, telephone, password, permissions) VALUES("admin","admin","admin@admin.com","123465678","$2b$10$bdbsGyCdJIO7Au9PaxQXvuWkHsFJUcYSqabkf2dVnNBCXOImGe7t6", "admin");
INSERT INTO users(firstname, lastname, email, telephone, password, permissions) VALUES("Damian", "Kokot", "kokocik1213@gmail.com", "123456789", "$2b$10$b3uu0UCBS2ARK9nRqqQuaOaVHmUTysF.dgzhJ0Zb2w2SEDBFj3Y7e", "admin");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Emil", "Brzoza", "emil@gmail.com", "123456789", "$2b$10$b10jKr/w8BIxrMGTzvD8fuy0dTmR/U7SPSL9lDV3wo.t0kFNn.SSy");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Enrica","Nealey","enealey0@nymag.com","939-676-0453","$2b$10$6TB4YrZ6qApSFGil63KJrejyLzrDYE.bakowBedunCQSd1FKVrsMe");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Carrol","Caseborne","ccaseborne3@google.de","738-512-2644","$2b$10$PGxWWruw4AnUqLcCCQh6MOmXMvc.ZLEHznlVPlnmrrbDUx1WvN0by");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Mohandis","Jennrich","mjennrich2@cam.ac.uk","809-657-7905","$2b$10$rCWRkYmrAOzLZashsoeqauS1GX9OsKynwO2Muak0JFmlk0KXhmbGy");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Gualterio","Haucke","ghaucke1@simplemachines.org","277-961-4041","$2b$10$bqXnRmvgJsUG5CaNRPh2X.HrVs9LMvfXr2nnFj.atNRwJnB43SnAi");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Devin","Brolechan","dbrolechan4@arstechnica.com","788-672-6835","$2b$10$u.sREr9GIQS52b0d9SMUl.BC7jLG7HCD5JL4tdi.U6.r2AkzFYoeO");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Cort","Yaldren","cyaldren5@cbc.ca","768-345-6800","$2b$10$lrOm6cHag/h0J5RFj07CO.cIvfQLsJa34302ZozCdpCkH02x4ItVG");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("user","user","user@user.com","123465678","$2b$10$yMzxn4pI2IIMsn5vh6GRB.8VY27M6RlcDkoE32UtH1W1HqB4L8H4S");

INSERT INTO trainers(id, description) VALUES(3, "Trainer specialises in dance");
INSERT INTO trainers(id, description) VALUES(4, "Patient trainer");
INSERT INTO trainers(id, description) VALUES(5, "Workout trainer");
INSERT INTO trainers(id, description) VALUES(6, "Gym trainer");
INSERT INTO trainers(id, description) VALUES(7, "Gym trainer");

insert into classes(name, description, duration) values ("Zumba", "Tańce i hulańce...", "01:00:00");
insert into classes(name, description, duration) values ("Kalistenika", "Podciąganie na drążku", "01:00:00");
insert into classes(name, description, duration) values ("Siłownia", "Zajecia z rozbudowy masy ciała", "01:00:00");

INSERT INTO specific_classes(trainer_id, class_id, start, max_participants) VALUES(3, 1, '2020-10-10 10:00:00', 10);
INSERT INTO specific_classes(trainer_id, class_id, start, max_participants) VALUES(5, 2, '2020-10-10 10:00:00', 15);
INSERT INTO specific_classes(trainer_id, class_id, start, max_participants) VALUES(6, 3, '2020-10-10 10:00:00', 20);