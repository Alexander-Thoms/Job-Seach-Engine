# Job Search Engine using Node.js

## Overview
This project is a job search engine using node.js. It allows users to search for a job, and save the results using MySql.

## Features
Search for jobs using search bar.
save results to MySql table.
remove all job listings from MySql Database.

## Tools used
Node.js
Express.js
Handlebars
Snyk

## API used
This project uses the JSearch API from RapidAPI.
https://rapidapi.com/

## How it works
User enters a search query
Application calls API 
Job links are extracted and displayed 
User can save to a MySql Database
Saved jobs can be viewed or cleared

## Installation
Install Node.js and MySQL and npm
git clone the project and cd into it
Run npm init -y to initialize the project
Run npm install express mysql2 express-handlebars dotenv helmet express-rate-limit
Create a .env file and add your MySQL password and API key
Set up the MySQL database and create the jobs table or use sql_code.sql file
Run node app.js to start the server
go to localhost:8080

## Security Features
Helmet.js for HTTP header protection
Rate limiting 10 per IP
enviroment files for sensitive data
basic input validation for malformed queries 

## Screenshots
<div align="center">
  <img src="https://github.com/user-attachments/assets/ac33da59-2a92-46c1-9a10-660c4442db1c" width="900" alt="Homepage screenshot" />
  <br/><br/>
  <img src="https://github.com/user-attachments/assets/a4874275-28ff-4dd2-8868-71ef59df96c3" width="900" alt="Search results screenshot" />
  <br/><br/>
  <img src="https://github.com/user-attachments/assets/c2ff6dbc-2dc0-450f-a9b4-6c85cc3f63d7" width="900" alt="Saved page screenshot" />
</div>


