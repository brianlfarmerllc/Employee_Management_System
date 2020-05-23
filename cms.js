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
            "Add Employee",
            "EXIT"],
    });
    switch (choice) {
        case "View All Employees":
            return showEmployees();
        case "View All Employees By Department":
            return showByDepartment();
        case "View All Employees By Manager":
            return showByManager();
        case "Add Employee":
            return addEmployee();
        case "EXIT":
            quit();
    }
}
async function showEmployees() {
    const allEmployees = await db.getAllEmployees();

    console.log("\n");
    console.table(allEmployees);

    loadMainPrompts();
}
async function showByDepartment() {
    let allDepartments = await db.selectAllDepartments();

    let { department } = await prompt(
        [
            {
                name: "department",
                type: "list",
                message: "Which department would you like to view?",
                choices: allDepartments.map((item) => item.department_name),
            },
        ],
    );
    let employeesDepartment = await db.getEmployeeByDep(department);
    console.log("\n");
    console.table(employeesDepartment);

    loadMainPrompts();
}

async function showByManager() {
    let allManagers = await db.getAllManagers();
    let managerList = allManagers.map((item) => item.manager)

    let { manager } = await prompt(
        [
            {
                name: "manager",
                type: "list",
                message: "Which manager would you like to view?",
                choices: Array.from(new Set(managerList))
            },
        ],
    );

    let employeesManager = await db.getEmployeeByMan(manager);
    console.log("\n");
    console.table(employeesManager);

    loadMainPrompts();
}

async function addEmployee() {
    let allRolls = await db.selectAllRole();
    let allManagers = await db.getAllManagers();
    let managerList = allManagers.map((item) => item.manager)

    let { firstName, lastName, role, managersname } = await prompt(
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
                name: "managersname",
                type: "list",
                message: "Who is the employee's manager?",
                choices: Array.from(new Set(managerList))
            },
        ],
    );

    roleIdArray = await db.getRoleId(role)
    roleId = roleIdArray.map((item) => item.id).toString()
    

       await db.createEmployee(firstName, lastName, roleId, managersname);

    //    console.log("Your employee was created successfully!");




    loadMainPrompts();
}

function quit() {
    console.log("Goodbye!");
    process.exit();
}