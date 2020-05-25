// all requires needed to run application
const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

function init() {
    const logoText = logo({ name: "Chippendales" }).render();

    console.log(logoText);

    loadMainPrompts()
}

async function loadMainPrompts() {
    const { choice } = await prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "View Departments And Roles",
            "Add A New Department",
            "Add A New Role",
            "Add A New Employee",
            "Update Employee",
            "Remove Employee",
            "View Budgets",
            "EXIT"],
    });
    switch (choice) {
        case "View All Employees":
            return showEmployees();
        case "View All Employees By Department":
            return showByDepartment();
        case "View All Employees By Manager":
            return showByManager();
        case "View Departments And Roles":
            return showDepartRoles();
        case "Add A New Department":
            return addDepartment();
        case "Add A New Role":
            return addRole();
        case "Add A New Employee":
            return addEmployee();
        case "Update Employee":
            return UpdateEmployee();
        case "Remove Employee":
            return removeEmployee();
        case "View Budgets":
            return viewBudgets();
        case "EXIT":
            quit();
    }

}
async function showEmployees() {
    try {
        const allEmployees = await db.getAllEmployees();
        console.log("\n");
        console.table(allEmployees);
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}
async function showByDepartment() {
    try {
        const departmentChoices = await db.selectAllDepartments();
        let { department } = await prompt(
            {
                name: "department",
                type: "list",
                message: "Which department would you like to view?",
                choices: departmentChoices.map((item) => item.department_name),
            }
        );
        let employeesDepartment = await db.getEmployeeByDep(department);
        console.log("\n");
        console.table(employeesDepartment);
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function showByManager() {
    try {
        let allManagers = await db.getAllManagers();
        let managerList = allManagers.map((item) => item.manager)
        let { manager } = await prompt(
            {
                name: "manager",
                type: "list",
                message: "Which manager would you like to view?",
                choices: Array.from(new Set(managerList))
            }
        );
        let employeesManager = await db.getEmployeeByMan(manager);
        console.log("\n");
        console.table(employeesManager);
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function showDepartRoles () {
    try {
        const allDepartRoles = await db.getAllDepartRoles();
        console.log("\n");
        console.table(allDepartRoles);
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function addDepartment() {
    try {
        let { newDepartment } = await prompt(
            {
                name: "newDepartment",
                type: "input",
                message: "What is the name of the department you would like to add?",
            }
        );
        await db.createDepartment(newDepartment)
        console.log("\n" + "Your department was created successfully!" + "\n");
        loadMainPrompts()
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function addRole() {
    try {
        const departmentChoices = await db.selectAllDepartments();
        let { newRole, salary, department } = await prompt(
            [
                {
                    name: "newRole",
                    type: "input",
                    message: "What is the name of the role you would like to add?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the annual salary for the role?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department does the role belong to?",
                    choices: departmentChoices.map((item) => item.department_name)
                }
            ]
        );
        let departmentIdArray = await db.getDepartmentId(department)
        let departmentId = departmentIdArray.map((item) => item.id).toString();
        await db.createRole(newRole, salary, departmentId);
        console.log("\n" + "Your role was created successfully!" + "\n");
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function addEmployee() {
    try {
        let allRolls = await db.selectAllRole();
        let employees = await db.namesAllEmployees();
        let employeeNames = employees.map((item) => item.employee)
        let { firstName, lastName, role, name } = await prompt(
            [
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: allRolls.map((item) => item.title)
                },
                {
                    name: "name",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: employeeNames
    
                }
            ]
        );
        let roleIdArray = await db.getRoleId(role)
        let roleId = roleIdArray.map((item) => item.id).toString();
        let managerIdArray = await db.getEmployeeId(name);
        let managerId = managerIdArray.map((item) => item.id).toString();
        await db.createEmployee(firstName, lastName, roleId, managerId);
        console.log("\n" + "Your employee was created successfully!" + "\n");
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function UpdateEmployee() {
    try {
        let employees = await db.namesAllEmployees();
        let employeeNames = employees.map((item) => item.employee)
        let allRolls = await db.selectAllRole();
        let rollTitles = allRolls.map((item) => item.title)
        let { name, role } = await prompt(
            [
                {
                    name: "name",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeeNames
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employees new role?",
                    choices: rollTitles
                }
            ]
        )
        let roleIdArray = await db.getRoleId(role)
        let roleId = roleIdArray.map((item) => item.id).toString();
        let employeeArray = await db.getEmployeeId(name);
        let employeeID = employeeArray.map((item) => item.id).toString();
        await db.createEmployeeUpdate(employeeID, roleId);
        console.log("\n" + "Your employee was updated successfully!" + "\n");
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }

}

async function removeEmployee() {
    try {
        let employees = await db.namesAllEmployees();
        let { name } = await prompt(
            {
                name: "name",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employees.map((item) => item.employee)
            }
        )
        let employeeArray = await db.getEmployeeId(name);
        let employeeID = employeeArray.map((item) => item.id).toString();
        await db.removeEmployeeData(employeeID)
        console.log("\n" + "Your employee was removed successfully!" + "\n");
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function viewBudgets() {
    const { choice } = await prompt({
        name: "choice",
        type: "list",
        message: "How would you like to view the budgets?",
        choices: [
            "View All Department Budgets",
            "View Budgets For Specific Department",
            "Return to Main"],
    })
    switch (choice) {
        case "View All Department Budgets":
            return viewAllBudgets();
        case "View Budgets For Specific Department":
            return viewBudgetsByDepartment();
        case "Return to Main":
            loadMainPrompts();
    }
}

async function viewAllBudgets() {
    try {
        const allBudgets = await db.getAllBudgets();
        console.log("\n");
        console.table(allBudgets);
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

async function viewBudgetsByDepartment() {
    try {
        const departmentChoices = await db.selectAllDepartments();
        let { department } = await prompt(
                {
                    name: "department",
                    type: "list",
                    message: "What department budget would you like to view?",
                    choices: departmentChoices.map((item) => item.department_name)
                }
        );
        const departmentBudget = await db.getDepartmentBudget(department);
        console.log("\n");
        console.table(departmentBudget)
        loadMainPrompts();
    } catch (error) {
        console.log("\n" + "There seems to be an error sorry for the inconvenience" + "\n")
        console.table(error)
        process.exit();
    }
}

function quit() {
    console.log("\n" + "Goodbye!" + "\n");
    process.exit();
}