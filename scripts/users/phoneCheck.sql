 
DROP TRIGGER IF EXISTS doesPhoneExist;

delimiter $$
CREATE TRIGGER doesPhoneExist BEFORE INSERT ON users
    FOR EACH ROW
    BEGIN
        IF NEW.telephone in (
            select A.telephone
            From users A 
            where (NEW.telephone = A.telephone)
        ) THEN 
           CALL `Insert not allowed`;

        END IF;
    END;
$$
delimiter ; 
