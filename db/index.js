const connection = require("./cmsConnection");
// mySQL queries go here!

class DB {
    // Keeping a reference to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;

    }
    //   Alphabetical ordered SQL query functions.
    createDepartment(newDepartment) {
        return this.connection.query("INSERT INTO department SET ?", {
            department_name: newDepartment
        });
    };

    createEmployee(firstName, lastName, roleId, managerId) {
        return this.connection.query("INSERT INTO employee SET ?", {
            first_name: firstName,
            last_name: lastName,
            role_id: parseInt(roleId),
            manager_id: parseInt(managerId)
        });
    };
    
    createEmployeeUpdate(employeeID, roleId) {
        return this.connection.query("UPDATE employee SET ? WHERE ?",
        [
            {
                role_id: roleId
            },
            {
                id: employeeID
            }
        ]);
    };

    createRole(newRole, salary, departmentId) {
        return this.connection.query("INSERT INTO role SET ?", {
            title: newRole,
            salary: parseInt(salary),
            department_id: parseInt(departmentId)
        });
    };
    
    getAllBudgets() {
        return this.connection.query(`SELECT  department_name as department, sum(salary) as budget
        FROM role 
        INNER JOIN department ON department.id = role.department_id
        INNER JOIN employee ON employee.role_id = role.id
        GROUP BY department_name`)
    };

    getAllDepartRoles() {
        return this.connection.query(`SELECT department_name as department, title, salary FROM department
        INNER JOIN role on department.id = role.department_id`)
    }

    getAllEmployees() {
        
        return this.connection.query(`SELECT employee.*, title, department_name as department, salary, 
        concat (manager.first_name, ' ', manager.last_name) as manager
        FROM department
        INNER JOIN role ON department.id = role.department_id
        INNER JOIN employee ON role.id = employee.role_id
        LEFT JOIN employee as manager on employee.manager_id = manager.id`);
    };

    getAllManagers() {
        return this.connection.query(`SELECT manager.id as manager_id, 
        concat (manager.first_name, " ", manager.last_name) as manager, 
        concat (employee.first_name, " ", employee.last_name) as employee
        FROM employee
        INNER JOIN employee as manager on employee.manager_id = manager.id`)
    };
    
    getDepartmentBudget(department) {
        return this.connection.query(`SELECT  department_name as department, sum(salary) as budget
        FROM role 
        INNER JOIN department ON department.id = role.department_id
        INNER JOIN employee ON employee.role_id = role.id
        WHERE ?`, {
            department_name: department
        });
    };

    getDepartmentId(department) {
        return this.connection.query(`SELECT id FROM department WHERE ?`,
        {
            department_name: department
        });
    };
    
    getEmployeeByDep(department) {
        return this.connection.query(`SELECT employee.id as "employee id", department_name as department, 
        concat (employee.first_name, " ", employee.last_name) as employee, title, salary
        FROM department
        INNER JOIN role ON department.id = role.department_id
        INNER JOIN employee ON role.id = employee.role_id
        WHERE ?`, {
            department_name: department
        });
    };
    
    getEmployeeByMan(manager) {
        return this.connection.query(`SELECT 
        concat (manager.first_name, " ", manager.last_name) as manager, 
        concat (employee.first_name, " ", employee.last_name) as employee,
        title, salary, department_name as department
        FROM employee
        INNER JOIN role ON role.id = employee.role_id
        INNER JOIN department ON department.id = role.department_id
        INNER JOIN employee as manager on employee.manager_id = manager.id HAVING ?`, {
            manager: manager
        });
    };
    
    getEmployeeId(name) {
        return this.connection.query(`SELECT id, 
        concat (employee.first_name, " ", employee.last_name) as employee FROM employee
        HAVING ?`, {
            employee: name
        });
    };

    getEmployeeIdMan(manager) {
        return this.connection.query(`SELECT id, 
        concat (employee.first_name, " ", employee.last_name) as employee FROM employee
        HAVING ?`, {
            employee: manager
        });
    };

    getRoleId(role) {
        return this.connection.query(`SELECT id FROM role WHERE ?`,
        {
            title: role
        });
    };
    
    namesAllEmployees() {
        return this.connection.query(`SELECT concat (employee.first_name, " ", employee.last_name) as employee FROM employee`)
    };

    removeEmployeeData(employeeId) {
        return this.connection.query("DELETE FROM employee WHERE ?", {
            id: parseInt(employeeId)
        });
    };
    
    selectAllDepartments() {
        return this.connection.query(`SELECT * FROM department`)
    };
    
    selectAllRole() {
        return this.connection.query(`SELECT * FROM role`)
    };
    
    updateManager(employeeID, managerId) {
        return this.connection.query("UPDATE employee SET ? WHERE ?",
        [
            {
                manager_id: managerId
            },
            {
                id: employeeID
            }
        ]);
    }
}
module.exports = new DB(connection);