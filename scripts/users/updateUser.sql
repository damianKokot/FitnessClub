DELIMITER $$
CREATE PROCEDURE updateUser(
   IN firstname VARCHAR(200),
   IN lastname VARCHAR(200),
   IN email VARCHAR(200),
   IN telephone VARCHAR(200),
   IN perm VARCHAR(200),
   IN oldEmail VARCHAR(200),
   IN desc VARCHAR(255)
)
BEGIN
   SELECT u.id, u.permissions 
   INTO @id, @perm 
   FROM users AS u 
   WHERE u.email = oldEmail;

   SELECT @id, @perm, perm, @perm != 'trainer', perm = 'trainer';

   IF (@perm = 'trainer' AND perm != 'trainer') THEN
      SELECT "DELETING"; 
      DELETE FROM trainers WHERE id = @id;
   END IF; 

   IF (@perm != 'trainer' AND perm = 'trainer') THEN 
      SELECT "INSERTING"; 
      INSERT INTO trainers(id, desc) 
      VALUES(@id, desc);
   END IF; 

   SELECT firstname, lastname, email, telephone, perm, oldEmail, desc;

   UPDATE trainers 
   SET description = desc 
   WHERE id = @id;

   SET @q='UPDATE users SET firstname=?, lastname=?, email=?, telephone=?, permissions=? WHERE email=?';
   PREPARE getHobbys FROM @q;
   SET @firstname = firstname; 
   SET @lastname = lastname; 
   SET @email = email; 
   SET @telephone = telephone; 
   SET @permissions = perm; 
   SET @oldEmail = oldEmail;

   EXECUTE getHobbys USING @firstname, @lastname, @email, @telephone, @permissions, @oldEmail;
   DEALLOCATE PREPARE getHobbys;
END$$

DELIMITER ;
