/***************************** 

        /!\ WARNING /!\

        CHANGE THE DATE !  


******************************/

CREATE TEMPORARY TABLE tmp_conform_tbl SELECT * FROM supplier_conformity WHERE `start_date` = '2020-05-01 00:00:00';
UPDATE tmp_conform_tbl SET `start_date` = '2020-06-01 00:00:00';
INSERT INTO supplier_conformity SELECT * FROM tmp_conform_tbl;
DROP TEMPORARY TABLE IF EXISTS tmp_conform_tbl;