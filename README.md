# mortage-calculator

This is a typical mortgage calculator with a possibility to customize your banks and enter all the data you wish. 

The working version with the server is available at https://mortgage-calcu.herokuapp.com/

The mortgage calculator consists of two pages - (1) Calculator itself (index.html) and (2) the banks management page (banks.html). Both pages have separate css and js files for interactive dynamic content.

The application uses vanilla Javascript and ordinary css.

It comes together with the Nedb, super easy database, subset of MongoDB. It has API file for CRUD operations (index.js). All works at the node.js server together with the Express.js library.

Main dependencies:
    "express": "^4.17.1",
    "nedb": "^1.8.0"
    
    
How to run the project.

1. Download all the files from git.
2. Open terminal in the folder where you keep your project.
3. Run npm install. Now your folder sould have all dependencies and node_modules.
