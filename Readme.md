## Keycloak-express
- A sample express based app that manages to integrate with Keycloak for authentication and authorization.
- Made in 5 days without any prior knowledge of Keycloak or its integration with Node.js for a College Project.

# Routes
```
- /home: A public route that can be accessed without any authentication.
- /profile: A protected route that can only be accessed by authenticated users.
- /info: A page that shows the website info and can be accessed by anyone
- /contact: A public page to send a message to site admin
```

# Pre-requisites
- Node.js v16.x or higher
- Keycloak v17.x or higher (local or remote)
- Keycloak realm, client and user setup (Refer to the [Keycloak documentation](https://www.keycloak.org/docs/latest/getting_started/index.html))

# Setup Keycloak
- Download and install Keycloak from the [official website](https://www.keycloak.org/downloads.html)
- Extract it and run the following command to start the Keycloak Development Server
```bash
    $ bin/kc.sh start-dev
```
- Open the Keycloak admin console at `http://localhost:8080/auth` and setup the admin credentials and login
- Create a new realm and a new client in the realm [Refer to the Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_create-realm)
- Create a new user in the realm and assign a password to the user [Refer to the Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-user_server_administration_guide)
- Note down the realm name, client id, client secret, user name and password for the next steps

# Setup the project
- Clone the repository to your local machine
- Run `npm install` to install the dependencies
- Configure the `config.json` file with the App and Keycloak settings
- Start the server by running `npm start`
  
# Usage
- Open the browser and navigate to `http://localhost:3000` (or the port you have configured)
- Click on the `Login` button to authenticate with Keycloak
- After successful authentication, you will be redirected to the home page
- Click on the `Profile` link to access the protected route and see the user details
  
# Contributing
- Feel free to fork the repository and submit a pull request with your changes
- For any issues, please raise a ticket in the issues section
- For any queries, please reach out to the author
- If you like the project, please give a star to the repository
- If you find it useful, please share it with your friends and colleagues