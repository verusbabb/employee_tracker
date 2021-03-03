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
  manager_name VARCHAR(30),
  department_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  FOREIGN KEY (department_id) REFERENCES department(id)
  );
  
  -- adding departments to department table --
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
VALUES ('Senior Engineer', 200000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 85000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('Operations Director', 175000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Operations Manager', 90000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Director', 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 65000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Director', 125000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Manager', 55000, 4);

-- adding dummy employees to employee table to start company with employees --
-- adding one director for each department and one manager for each department --
-- manager works for director in each department --

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Steve', 'Babb', 1, 'CEO',1, 1);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Adam', 'Babb', 1, 'Steve Babb', 2, 1);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Tom', 'Babb', 1, 'Steve Babb', 3, 2);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Claire', 'Babb', 1, 'Steve Babb', 4, 2);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Blair', 'Clark', 1, 'Steve Babb', 2, 1);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Mike', 'Beaudoin', 2, 'Adam Babb', 2, 1);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Blake', 'Hawley', 3, 'Tom Babb', 3, 2);

INSERT INTO employee (first_name, last_name, manager_id, manager_name, role_id, department_id)
VALUES ('Tami', 'Nevels', 4, 'Claire Babb', 4, 2);





  
  
  
  
