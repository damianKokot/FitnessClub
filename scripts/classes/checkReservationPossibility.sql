DELIMITER $$
CREATE PROCEDURE checkAvailability(
   IN userId INT,
   IN startC TIMESTAMP,
   IN endC TIMESTAMP,
   OUT possible int
)
BEGIN
   DECLARE done int DEFAULT FALSE;
   DECLARE classID int;
   DECLARE startS TIMESTAMP;
   DECLARE endS TIMESTAMP;
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
         INTO startS, endS 
         FROM specific_classes AS s
         INNER JOIN classes AS c ON s.class_id=c.id
         WHERE s.id = classID;
         
         IF startS IS NOT NULL AND endS IS NOT NULL AND 
            (startC between @startS AND @endS OR endC between @startS AND @endS OR startC < @startS AND endC > @endS) THEN 
            SET possible=FALSE;
         END IF;
         
      END LOOP readLoop;
   CLOSE classCur;
END$$

DELIMITER ;