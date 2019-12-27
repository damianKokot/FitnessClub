DROP TRIGGER IF EXISTS doesMailExist;

delimiter $$
CREATE TRIGGER doesMailExist BEFORE INSERT ON users
    FOR EACH ROW
    BEGIN
        IF NEW.email in (
            select A.email
            From users A 
            where (NEW.email = A.email)
        ) THEN 
          signal sqlstate '45000' set message_text = 'Mail is used!';
          
        END IF;
    END;
$$
delimiter ; 
