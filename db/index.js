const connection = require("./cmsConnection");
// mySQL queries go here!

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;

  }
//   functions to generate query results

  getAllEmployees() {

    return this.connection.query(`SELECT employee.*, title, department_name as department, salary, 
    concat (manager.first_name, ' ', manager.last_name) as manager
    FROM department
    INNER JOIN role ON department.id = role.department_id
    INNER JOIN employee ON role.id = employee.role_id
    LEFT JOIN employee as manager on employee.manager_id = manager.id`);
  }

  getEmployeeByDep () {
      return this.connection.query(`SELECT department_name as department, 
      concat (employee.first_name, " ", employee.last_name) as employee
      FROM department
      INNER JOIN role ON department.id = role.department_id
      INNER JOIN employee ON role.id = employee.role_id`)
  }

  getAllDepartments () {
    return this.connection.query(`SELECT * FROM department`)
  }
}
module.exports = new DB(connection);