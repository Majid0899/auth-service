🛡️ Auth Service

An authentication microservice built with Node.js, Express, and TypeScript, featuring JWT authentication, OAuth (Google & GitHub), Redis session management, and MySQL (via Sequelize) for data persistence.

🚀 Features

🔐 User registration and login with JWT tokens

🔁 Token refresh and logout endpoints

👥 Role-based authorization (Admin & User)

🌐 OAuth 2.0 login with Google and GitHub

💾 MySQL integration using Sequelize ORM

⚡ Rate limiting for login endpoint

🧠 Written in TypeScript for better type safety

🧩 Modular structure for scalability

⚙️ Installation
1 Clone Repository
    git clone https://github.com/Majid0899/auth-service.git
    cd auth-service
2 Install dependencies
    npm install
3. Configure environment variables
    Create a .env file in the root directory and add the following:
    # ==============================
      # App Configuration
    # ==============================
        PORT=5000
        URL=http://localhost

  # ==============================
  # Database Configuration (MySQL)
  # ==============================
  DB_HOST=localhost <yourHost>
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=rootpassword
  DB_NAME=auth_db

# ==============================
# JWT Configuration
# ==============================
JWT_SECRET=<yourjwtsecret>
JWT_REFRESH_SECRET=<yourjwtrefreshsecret>

# ==============================
# Redis Configuration
# ==============================
REDIS_URL=<your redis url>

# ==============================
# OAuth Configuration
# ==============================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback


GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# ==============================
# Rate Limiting
# ==============================
MAX_ATTEMPTS=5
BLOCK_TIME=900

🧑‍💻 Development
Start the development server
  npm run dev
Production
  npm run build
  npm start

🧩 API Endpoints
🔸 Authentication Routes (/api/auth)

Register User
POST /api/auth/register

Request Body:{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "1234567890",
  "role": "user"
}

Login User
POST /api/auth/login

Request Body:{
  "email": "john@example.com",
  "password": "Password123!"
}

Refresh Token
POST /api/auth/refresh

Request Body:{
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}

Logout User
POST /api/auth/logout

Request Body:

{
  "refreshToken": "<JWT_REFRESH_TOKEN>"
}

Get Profile (Protected)

GET /api/auth/profile
Headers: Authorization: Bearer <JWT_ACCESS_TOKEN>

List All Users (Admin Only)

GET /api/auth/users
Headers: Authorization: Bearer <JWT_ACCESS_TOKEN>

🔹 OAuth Routes (/api/auth)
Method	Endpoint	Provider	Description
GET	/google	Google	Redirects to Google login
GET	/google/callback	Google	OAuth callback with access & refresh tokens
GET	/github	GitHub	Redirects to GitHub login
GET	/github/callback	GitHub	OAuth callback with access & refresh tokens

| Category       | Technology                       |
| -------------- | -------------------------------- |
| Runtime        | Node.js (TypeScript)             |
| Framework      | Express.js                       |
| Database       | MySQL (Sequelize ORM)            |
| Cache/Session  | Redis                            |
| Authentication | JWT + Passport (Google & GitHub) |
| Security       | bcrypt, dotenv                   |
| Utilities      | Nodemon, ts-node, rate limiter   |

🤝 Contributing

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m "Add new feature")

Push to your branch (git push origin feature/your-feature)

Open a Pull Request

🧾 License

This project is licensed under the ISC License.

📬 Author

Majid Khan
💼 GitHub

📧 Email: your.email@example.com




  
