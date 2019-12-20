 
CREATE TRIGGER emailCheck BEFORE INSERT ON users
    FOR EACH ROW
    BEGIN
        IF NEW.email not in (
            select A.email
            From Available A  -- CHANGED THE ALIAS TO A
            where (NEW.email = A.email)
        ) THEN -- MISSING THEN
           CALL `Insert not allowed`;

        END IF;
    END;
