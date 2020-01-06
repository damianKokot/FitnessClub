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
           CALL `Insert not allowed`;

        END IF;
    END;
$$
delimiter ; 
