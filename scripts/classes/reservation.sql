DELIMITER $$
CREATE PROCEDURE assignUser (
   IN userEmail VARCHAR(255),
   IN classId VARCHAR(255)
)
BEGIN
   DECLARE _rollback BOOL DEFAULT 0;
   DECLARE message varchar(255);
   DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = 1;
   
   SELECT id INTO @userId FROM users AS u WHERE u.email = userEmail;
   SET autocommit=0;
   START TRANSACTION;

   SELECT reserved_places, max_participants INTO @res, @max 
   FROM specific_classes AS s
   WHERE s.class_id=classId;

   IF @res < @max THEN
      SELECT start, end INTO @startC, @endC 
      FROM specific_classes
      WHERE id=classId;
   
	   CALL checkAvailability(@userId, @startC, @endC, @temp);
      IF NOT @temp THEN 
	      SIGNAL SQLSTATE '45000';
         SET message = 'There is other reservation at this time!';
	   END IF;
   
      UPDATE specific_classes 
         SET reserved_places=reserved_places + 1
         WHERE id=classId; 
      SET message = 'Cannot insert!';
      INSERT INTO reservations(user_id, specific_class_id) 
         VALUES(@userId, classId);
   END IF;

   IF _rollback THEN
      SELECT message;
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
   
   SET @count = (SELECT COUNT(*) FROM specific_classes WHERE id = classId AND trainer_id = @userId);
   IF @count > 0 THEN
      SIGNAL SQLSTATE '45000';
   END IF;
   
   SET @count = (SELECT COUNT(*) FROM reservations WHERE specific_class_id = classId AND user_id = @userId);
   IF @count = 0 THEN
      SIGNAL SQLSTATE '45000';
   END IF;
 
   UPDATE specific_classes 
      SET reserved_places=reserved_places - 1
      WHERE id=classId; 
   DELETE FROM reservations 
      WHERE user_id = @userId;

   IF _rollback THEN
      SELECT "ROLLBACK";
      ROLLBACK;
   ELSE
      SELECT "OK";
      COMMIT;
   END IF;
END$$
DELIMITER ;
