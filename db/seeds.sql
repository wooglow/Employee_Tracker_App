INSERT INTO department (id, department_name) 
VALUES
(1,	"Rearch and Development"),
(2, "Sales"),
(3,	"Financing and Accounting"),
(4,	"Maintenance"),
(5,	"Legal");

INSERT INTO roles (id, title, salary, dept_id)
VALUES
(6, "Customer Service", 50000 ,2),
(2, "B2B Service", 100000 ,2),
(7, "Research Team1", 120000 ,1),
(1, "Research Team2", 140000 ,1),
(3, "Financer", 150000 ,3),
(8, "Accounting Clerk", 60000 ,3),
(9, "Security Team", 60000 ,4),
(4, "Security Manager", 100000 ,4),
(5, "Lawyer", 150000 ,5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Alice","Anton",1, null),
(2, "Bob","Bolton",2, null),
(3, "Carlos","Capoue",3, null),
(4, "Delma","Dowson",4, null),
(5, "Elizabeth","Erlington",5, null),
(6, "Flores","Fugh",6, 2),
(7, "Gary","Glober",7, 1),
(8, "Hanna","Hamilton",8, 3),
(9, "Indira","Irwin",9, 4);