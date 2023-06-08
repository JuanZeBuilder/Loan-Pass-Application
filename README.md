
# Corporate Pass Application

This project is a pass loaning web application for Singapore Sports School. 

Tech Stack: 
  - Frontend: Reactjs (ChakraUI framework)
  - Backend: Java (SpringBoot)
  - Database: MySQL


## Deployment
1. Go to backend/deploy directory
```bash
  cd backend/deploy
```
2. Run deploy script to set up datebase user settings  
```bash
  # for linux
  source deploy.bat
```
  Note:
  - Requires `mysql` command to be in PATH
  - Will ask for your `mysql` `root` user password
  - If no `mysql` command available in CLI, just run `deploy.sql` script in whichever MySQL client you are using (e.g. Workbench)

---
## Running Backend
1. Open a new terminal
2. Change directory to backend/corppass
```bash
  cd backend/corppass
```
3. Run the backend server
```bash
  mvn spring-boot:run
```
---
## Running Frontend
1. Open a new terminal
2. Change directory to frontend
```bash
  cd frontend
```
3. Download the required scripts and dependecies
```bash
  npm install
```
4. Start the application
```bash
  npm start
```
---
## Documentation

[Documentation](https://edwinlzs2.atlassian.net/wiki/spaces/NERDSPACE/pages/33047/Backend+APIs)


## Authors

- [@edwinlzs](https://github.com/edwinlzs)
- [@ngkangting](https://github.com/ngkangting)
- [@chunwangng](https://github.com/chunwangng)
- [@JuanZeBuilder](https://github.com/JuanZeBuilder)
- [@andreayup](https://github.com/andreayup)
- [@Alvan-Tan](https://github.com/Alvan-Tan)
