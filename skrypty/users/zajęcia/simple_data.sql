INSERT INTO users(firstname, lastname, email, telephone, password, permissions) VALUES("Damian", "Kokot", "kokocik1213@gmail.com", "123456789", "$2b$10$b3uu0UCBS2ARK9nRqqQuaOaVHmUTysF.dgzhJ0Zb2w2SEDBFj3Y7e", "admin");
INSERT INTO users(firstname, lastname, email, telephone, password) VALUES("Emil", "Brzoza", "emil@gmail.com", "123456789", "$2b$10$b10jKr/w8BIxrMGTzvD8fuy0dTmR/U7SPSL9lDV3wo.t0kFNn.SSy");
INSERT INTO trainers(id, description) VALUES(1, "Best trainer in the world");
insert into classes(name, description, duration) values ("Zumba", "Tańce i hulańce...", "01:00:00");
insert into specific_classes(trainer_id, class_id, start, max_participants, reserved_places) values (1, 1, '2020-01-01 10:10:10', 10, 10);
insert into reservations(user_id, specific_class_id) VALUES(3, 1);
 