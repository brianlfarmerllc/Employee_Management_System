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
            "EXIT"],
    });
    switch (choice) {
        case "View All Employees":
            return showEmployees();
        case "View All Employees By Department":
            return showByDepartment();
        case "View All Employees By Manager":
            return showByManager();
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
    let allDepartments = await db.getAllDepartments();

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

    // let { manager } = await prompt(
    //     [
    //         {
    //             name: "manager",
    //             type: "list",
    //             message: "Which manager would you like to view?",
    //             choices: allManagers.map((item) => item.manager),
    //         },
    //     ],
    // );

    // let employeesDepartment = await db.getEmployeeByDep(department);
    // console.log("\n");

    console.table(allManagers);

    loadMainPrompts();
}

function quit() {
    console.log("Goodbye!");
    process.exit();
}