hello it's a test
### Social Media Platform
A simple full-stack social media application that allows users to register, log in, create and manage posts, like/unlike content, and comment on posts. Built with Node.js, React, MongoDB, and deployed using GitHub Actions and AWS EC2.

### Features
* User Registration and Login (with JWT Authentication)

* Create, Read, Update, Delete (CRUD) for Posts

* Like and Unlike functionality

* Add and Delete Comments

* Protected Routes (Only logged-in users can post/interact)

* Backend Testing with Mocha, Chai, and Sinon

* CI/CD pipeline using GitHub Actions

* Deployed on AWS EC2 with NGINX and PM2

### Technologies Used
* Frontend: React, Axios

* Backend: Node.js, Express, MongoDB, Mongoose

* Authentication: JWT (JSON Web Token)

* Testing: Mocha, Chai, Sinon

* CI/CD: GitHub Actions

* Deployment: AWS EC2, PM2, NGINX

### CI/CD Pipeline
* GitHub Actions run tests and build steps on push to main.

* Code is deployed automatically to AWS EC2 using a self-hosted runner.

* Environment secrets are configured via GitHub repository settings.

