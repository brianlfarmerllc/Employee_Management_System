USE employee_tracker_db;


insert into department (department_name) values ("Management");
insert into department (department_name) values ("Legal");
insert into department (department_name) values ("Finance");
insert into department (department_name) values ("Stage");
insert into department (department_name) values ("Security");

insert into role (title, salary, department_id) values ("Manager", 250000, 1);
insert into role (title, salary, department_id) values ("Lawyer", 190000, 2);
insert into role (title, salary, department_id) values ("Acountant", 125000, 3);
insert into role (title, salary, department_id) values ("Head Entertainer", 100000, 4);
insert into role (title, salary, department_id) values ("Entertainer", 85000, 4);
insert into role (title, salary, department_id) values ("Security Guard", 50000, 5);

insert into employee (first_name, last_name, role_id, manager_id) values ("Somen", "Banerjee",1, null);
insert into employee (first_name, last_name, role_id, manager_id) values ("Atticus", "Finch",2, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ("Norm", "Peerson",3, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ("Brian", "Farmer",4, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ("Barney", "Farley",5, 4);
insert into employee (first_name, last_name, role_id, manager_id) values ("Adrian", "Swayze",5, 4);
insert into employee (first_name, last_name, role_id, manager_id) values ("Steven", "Seagal",6, 3);
