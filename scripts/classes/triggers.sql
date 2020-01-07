DELIMITER $$
/*===================================================
      Trigger to calculate end hour and check 
      availability of trainer to run this course 
  ===================================================*/
CREATE TRIGGER insertClass BEFORE INSERT ON specific_classes 
FOR EACH ROW
BEGIN
   SELECT date_add(NEW.start, INTERVAL time_to_sec(c.duration) SECOND) 
      INTO @end
      FROM classes AS c
      WHERE c.id=NEW.class_id;
   SET NEW.end = @end;
   SET NEW.reserved_places = 0;
   CALL checkAvailability(NEW.trainer_id ,NEW.start, NEW.end, @temp);
   IF NOT @temp THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is other reservation at this time!';
   END IF;
END$$

/*===================================================
      When Updated we have to remove old trainer 
      which is associated to this course 
  ===================================================*/
CREATE TRIGGER updateClass BEFORE UPDATE ON specific_classes 
FOR EACH ROW
BEGIN
   SELECT date_add(NEW.start, INTERVAL time_to_sec(c.duration) SECOND) 
      INTO @end
      FROM classes AS c
      WHERE c.id=NEW.class_id;
   SET NEW.end = @end;
   CALL checkAvailability(NEW.trainer_id ,NEW.start, NEW.end, @temp);
   IF NOT @temp THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is other reservation at this time!';
   END IF;

   DELETE FROM reservations 
   WHERE specific_class_id = OLD.id AND user_id = OLD.trainer_id; 
END$$

/*===================================================
      After insert we want to point out that trainer
      is reserved to this course
  ===================================================*/
CREATE TRIGGER insertToReservations AFTER INSERT ON specific_classes
FOR EACH ROW
BEGIN
   INSERT INTO reservations(user_id, specific_class_id) VALUES(NEW.trainer_id, NEW.id);
END$$



/*===================================================
      Checks availability of normal user to make 
      reservation. If such user is connected with 
      other class in the same time, he cannot made
      reservation  
  ===================================================*/
CREATE TRIGGER isAllowedToReserve BEFORE INSERT ON reservations 
FOR EACH ROW
BEGIN
   SELECT start, end INTO @start, @end 
   FROM specific_classes AS s 
   WHERE s.id=NEW.specific_class_id;
   
   CALL checkAvailability(NEW.user_id, @start, @end, @temp);
   IF NOT @temp THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is other reservation at this time!';
   END IF;
END$$

DELIMITER ;