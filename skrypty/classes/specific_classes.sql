DELIMITER $$
CREATE PROCEDURE getSpecificClass(
   IN className VARCHAR(255)
)
BEGIN
   SELECT s.id, c.name AS className,
      c.description AS classDescription,
      CONCAT(u.firstname, ' ', u.lastname)  AS trainerName,
      t.description AS trainerDescription,
      start,
      max_participants,
      reserved_places
   FROM specific_classes AS s
      INNER JOIN classes AS c ON c.id = s.class_id
      INNER JOIN trainers AS t ON s.trainer_id = t.id
      INNER JOIN users AS u ON t.id = u.id
   WHERE c.name=className;
END$$

CREATE PROCEDURE checkAvailability(
   IN userId INT,
   IN startC TIMESTAMP,
   IN endC TIMESTAMP,
   OUT possible int
)
BEGIN
   DECLARE done int DEFAULT FALSE;
   DECLARE classID int;
   DECLARE classCur CURSOR FOR SELECT specific_class_id FROM reservations AS r WHERE r.user_id=userId; 
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   SET possible=TRUE;
         
   OPEN classCur;
      readLoop: LOOP
         FETCH classCur INTO classID;
         IF done THEN
            LEAVE readLoop;
         END IF;

         SELECT s.start, date_add(s.start, INTERVAL time_to_sec(c.duration) SECOND)
         INTO @startS, @endS 
         FROM specific_classes AS s
         INNER JOIN classes AS c ON s.class_id=c.id
         WHERE c.id = classId;
         
         IF startC between @startS AND @endS OR endC between @startS AND @endS OR startC < @startS AND endC > @endS THEN 
            SET possible=FALSE;
         END IF;
      END LOOP readLoop;
   CLOSE classCur;
END$$

CREATE TRIGGER insertClass BEFORE INSERT ON specific_classes 
FOR EACH ROW
BEGIN
   SET NEW.end = (SELECT date_add(NEW.start, INTERVAL time_to_sec(c.duration) SECOND) 
      FROM classes AS c
      WHERE c.id=NEW.class_id);
   SET NEW.reserved_places = 0;
   CALL checkAvailability(NEW.trainer_id ,NEW.start, NEW.end, @temp);
   IF NOT @temp THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'There is other reservation at this time!';
   END IF;
END$$
CREATE TRIGGER insertToReservations AFTER INSERT ON specific_classes
FOR EACH ROW
BEGIN
   INSERT INTO reservations(user_id, specific_class_id) VALUES(NEW.trainer_id, NEW.id);
END$$

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

CREATE PROCEDURE assignUser (
   IN userEmail VARCHAR(255),
   IN classId VARCHAR(255)
)
BEGIN
   DECLARE _rollback BOOL DEFAULT 0;
   DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = 1;
   
   SELECT id INTO @userId FROM users AS u WHERE u.email = userEmail;
   SET autocommit=0;
   START TRANSACTION;

   SELECT reserved_places, max_participants INTO @res, @max 
   FROM specific_classes AS s
   WHERE s.class_id=classId;

   IF @res < @max THEN
      UPDATE specific_classes 
         SET reserved_places=reserved_places + 1
         WHERE class_id=classId; 
      INSERT INTO reservations(user_id, specific_class_id) 
         VALUES(@userId, classId);
   END IF;

   IF _rollback THEN
      SELECT "ROLLBACK";
      ROLLBACK;
   ELSE
      SELECT "OK";
      COMMIT;
   END IF;
END$$

CREATE PROCEDURE unAssignUser (
   IN userEmail VARCHAR(255),
   IN classId VARCHAR(255)
)
BEGIN
   DECLARE _rollback BOOL DEFAULT 0;
   DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = 1;
   
   SELECT id INTO @userId FROM users AS u WHERE u.email = userEmail;
   SET autocommit=0;
   START TRANSACTION;
   
   UPDATE specific_classes 
      SET reserved_places=reserved_places - 1
      WHERE class_id=classId; 
   DELETE FROM reservations 
      WHERE user_id=@userId;

   IF _rollback THEN
      SELECT "ROLLBACK";
      ROLLBACK;
   ELSE
      SELECT "OK";
      COMMIT;
   END IF;
END$$

DELIMITER ;
