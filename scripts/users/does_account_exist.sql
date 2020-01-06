DELIMITER $$
DROP FUNCTION IF EXISTS CheckPassword$$
CREATE FUNCTION CheckPassword (@mail VARCHAR(200), @password_p VARCHAR(200))
    RETURNS BOOL
    NOT DETERMINISTIC
    READS SQL DATA
BEGIN

     PREPARE stmt FROM 
     'SELECT 
           email
      FROM users
      WHERE email = ? AND password = ? ';
     

     RETURN EXISTS ( EXECUTE stmt USING @mail, @password_p);
    
     DEALLOCATE PREPARE stmt;
     
END;
$$
DELIMITER ;
