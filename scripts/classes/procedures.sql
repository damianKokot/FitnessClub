DELIMITER $$
CREATE PROCEDURE getSpecificClass(
   IN className VARCHAR(255)
)
BEGIN
   SELECT s.id, c.name AS className,
      c.description AS classDescription,
      t.id AS trainerId,
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

DELIMITER ;
