/*INSERT INTO `ems-db`.`employees` (`name`, `title`, `gender`) VALUES ('Mary', 'VP', 'female');*/
/*
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (2, 'Lisa', 'SDE', 'female');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (2, 'Cloe', 'SDE', 'female');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (3, 'Luis', 'SDE', 'male');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (3, 'Alice', 'QA', 'female');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (3, 'Stella', 'HR', 'female');
UPDATE `ems-db`.`employees` SET `manager_id`=null WHERE `id`='1';
*/

/*
SELECT * FROM `ems-db`.employees AS e1
LEFT JOIN 
(SELECT id AS manager, name AS manager_name FROM `ems-db`.employees) AS e2
ON e1.manager = e2.manager;
*/
/*
SELECT E1.*, E2.name AS manager_name
FROM  `ems-db`.employees E1, `ems-db`.employees E2
WHERE E1.manager_id = E2.id OR E1.manager_id IS NULL;
*/
/*
SELECT A.*, B.reports
FROM (
SELECT E1.*, E2.name AS manager_name
FROM `ems-db`.employees E1, `ems-db`.employees E2
WHERE E1.id = 2 AND E2.id = E1.manager_id) A
LEFT JOIN (
SELECT E3.manager_id, COUNT(E3.id) AS reports
FROM  `ems-db`.employees E3
WHERE E3.manager_id = 2
) B ON A.id = B.manager_id;
*/


/*-------------------------------------------------------------------------------*/
/* GET /employees, get manager name and number of direct reports, add to list */
/*
SELECT E1.*, E2.name manager_name, E3.reports
FROM `ems-db`.employees E1
LEFT JOIN
(SELECT id, name FROM `ems-db`.employees) E2 
ON E1.manager_id = E2.id
LEFT JOIN (
SELECT manager_id, COUNT(manager_id) reports FROM `ems-db`.employees
GROUP BY manager_id 
) E3
ON E1.id = E3.manager_id;
*/

/*************************************************************************************/
/* GET /employees/:id, return employee's details and manager, number of direct reports */
/*
SELECT E1.*, E2.name manager_name, E3.reports FROM 
(SELECT * FROM `ems-db`.employees WHERE id = 1) E1
LEFT JOIN
(SELECT id, name FROM `ems-db`.employees) E2 
ON E1.manager_id = E2.id
LEFT JOIN (
SELECT manager_id, COUNT(manager_id) reports FROM `ems-db`.employees
GROUP BY manager_id 
) E3
ON E1.id = E3.manager_id;
*/
/**************************************************************************************/
/* GET /employees/reports/:id, return employee's direct reports and their manager and direct reports */
/*
SELECT E1.*, E2.name manager_name, E3.reports FROM 
(SELECT * FROM `ems-db`.employees WHERE manager_id = 1) E1
LEFT JOIN
(SELECT id, name FROM `ems-db`.employees) E2 
ON E1.manager_id = E2.id
LEFT JOIN (
SELECT manager_id, COUNT(manager_id) reports FROM `ems-db`.employees
GROUP BY manager_id 
) E3
ON E1.id = E3.manager_id;
*/
/****************************************************************************************/
/* GET /employees/managers, get all managers */
/*SELECT id, name FROM `ems-db`.employees;*/
/****************************************************************************************/
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (4, 'Lisa_c1', 'SDE', 'female');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (4, 'Lisa_c2', 'SDE', 'female');
INSERT INTO `ems-db`.`employees` (`manager_id`, `name`, `title`, `gender`) VALUES (4, 'Lisa_c3', 'SDE', 'male');

SELECT * FROM `ems-db`.employees;