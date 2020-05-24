const connection = require("./cmsConnection");
// mySQL queries go here!

class DB {
    // Keeping a reference to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;

    }
    //   functions to generate query results
    selectAllRole() {
        return this.connection.query(`SELECT * FROM role`)
    }
    selectAllDepartments() {
        return this.connection.query(`SELECT * FROM department`)
    }
    namesAllEmployees() {
        return this.connection.query(`SELECT concat (employee.first_name, " ", employee.last_name) as employee FROM employee`)
    }

    getDepartmentId(department) {
        return this.connection.query(`SELECT id FROM department WHERE ?`,
            {
                department_name: department
            });
    }

    getRoleId(role) {
        return this.connection.query(`SELECT id FROM role WHERE ?`,
            {
                title: role
            });
    }

    getEmployeeId(name) {
        return this.connection.query(`SELECT id, 
    concat (employee.first_name, " ", employee.last_name) as employee FROM employee
    HAVING ?`,
            {
                employee: name
            });
    }

    getAllEmployees() {

        return this.connection.query(`SELECT employee.*, title, department_name as department, salary, 
    concat (manager.first_name, ' ', manager.last_name) as manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee as manager on employee.manager_id = manager.id`);
    }

    getEmployeeByDep(department) {
        return this.connection.query(`SELECT department_name as department, 
      concat (employee.first_name, " ", employee.last_name) as employee
      FROM department
      INNER JOIN role ON department.id = role.department_id
      INNER JOIN employee ON role.id = employee.role_id
      WHERE ?`, {
            department_name: department
        });
    }

    getAllManagers() {
        return this.connection.query(`SELECT manager.id as manager_id, 
    concat (manager.first_name, " ", manager.last_name) as manager, 
    concat (employee.first_name, " ", employee.last_name) as employee
    FROM employee
    INNER JOIN employee as manager on employee.manager_id = manager.id`)
    }

    getEmployeeByMan(manager) {
        return this.connection.query(`SELECT manager.id as manager_id, 
    concat (manager.first_name, " ", manager.last_name) as manager, 
    concat (employee.first_name, " ", employee.last_name) as employee
    FROM employee
    INNER JOIN employee as manager on employee.manager_id = manager.id
    HAVING ?`, {
            manager: manager
        });
    }

    createDepartment(newDepartment) {
        return this.connection.query("INSERT INTO department SET ?", {
            department_name: newDepartment
        });
    }

    createRole(newRole, salary, departmentId) {
        return this.connection.query("INSERT INTO role SET ?", {
            title: newRole,
            salary: parseInt(salary),
            department_id: parseInt(departmentId)
        });
    }

    createEmployee(firstName, lastName, roleId, managerId) {
        return this.connection.query("INSERT INTO employee SET ?", {
            first_name: firstName,
            last_name: lastName,
            role_id: parseInt(roleId),
            manager_id: parseInt(managerId)
        });
    }
    removeEmployeeData(employeeId) {
        return this.connection.query("DELETE FROM employee WHERE ?",
        {
            id: parseInt(employeeId)
        }
        )
    }
}
module.exports = new DB(connection);