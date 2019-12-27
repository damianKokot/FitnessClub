DROP FUNCTION IF EXISTS CheckPassword;

DELIMITER $$
CREATE FUNCTION CheckPassword (mail VARCHAR(200), password_p VARCHAR(200))
    RETURNS BOOL
    NOT DETERMINISTIC
    READS SQL DATA
BEGIN

     RETURN EXISTS (SELECT email FROM users WHERE email = mail AND password = password_p); 
         
END;
$$
DELIMITER ;
