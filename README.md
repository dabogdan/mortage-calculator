# mortage-calculator with database nedb, express.js, vanilla Javascript

This is a typical dynamic mortgage calculator with a possibility to customize your banks and enter all the data you wish. 

The working version with the server is available at https://mortgage-calcu.herokuapp.com/

The mortgage calculator consists of two pages - (1) Calculator itself (index.html) and (2) the banks management page (banks.html). Both pages have separate css and js files for interactive dynamic content.

The application uses vanilla Javascript and ordinary css.

It comes together with the Nedb, super easy database, subset of MongoDB. It has API file for CRUD operations (index.js). All works at the node.js server together with the Express.js library.

All entered data is stored in the noSQL database file (database.db).

Main dependencies:
    "express": "^4.17.1",
    "nedb": "^1.8.0"

Optional dependency:
    "nodemon": "^2.0.7"

You will need to have npm and node.js installed at your local machine.

How to run the project.

1. Download all the files from git and unarchive. Now you have a folder with the project.
2. Open terminal in the folder route where you keep this downloaded project.
3. In the terminal run "npm install". Now your folder sould have all dependencies and node_modules.
4. After the project is installed, run "npm start" or "nodemon index" or "node index" - any of these will run the node.js server.
5. In the browser go at localhost: 3003. you are good to go!

Once you have the project up and running on your local machine, here is the links to use on your local project: 

localhost:3003/index.html is for the calculator page
localhost:3003/banks.html is for the bank management page
localhost:3003/api endpoint.