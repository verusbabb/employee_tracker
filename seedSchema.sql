DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- create department table --
CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- create role table, deparment_id references id from department table --
CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  );
  
  -- create employee table, role_id references id from role table --
  -- manager_id references id from employee table --
CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  department_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  );
  
  -- adding departments to department table --
INSERT INTO department (department_name)
VALUES ('C-Suite');

INSERT INTO department (department_name)
VALUES ('Engineering');

INSERT INTO department (department_name)
VALUES ('Operations');

INSERT INTO department (department_name)
VALUES ('Sales');

INSERT INTO department (department_name)
VALUES ('Marketing');

 -- adding roles within departments --
INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 300000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('VP Engineering', 200000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('VP Operations', 175000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('VP Sales', 125000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ('VP Marketing', 125000, 5);

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 85000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Operations Manager', 90000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 65000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 55000, 5);

-- adding dummy employees to employee table to start company with employees --
-- adding one director for each department and one manager for each department --
-- manager works for director in each department --

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Steve', 'Babb', 1, 1, 1);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Christa', 'Babb', 1, 2, 2);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Adam', 'Babb', 1, 3, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Tom', 'Babb', 1, 4, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Claire', 'Babb', 1, 5, 5);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Blair', 'Clark', 2, 6, 2);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Mike', 'Beaudoin', 3, 7, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Blake', 'Hawley', 4, 8, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id, department_id)
VALUES ('Tami', 'Nevels', 5, 9, 5);



  
  
  
  
