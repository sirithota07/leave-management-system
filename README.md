# Employee Leave Management System (Node.js + Express + MySQL)

## Run (Windows)
1. Start MySQL (XAMPP Control Panel -> MySQL -> Start).
2. Double-click START.bat  (or in terminal: npm install, then npm start).
3. Open http://localhost:3000

.env is already set for XAMPP (user root, empty password).
If your MySQL has a password, put it in DB_PASSWORD in .env.

Admin login: admin@company.com / admin123
Employees: use the Employee Register tab.

## Files
server.js, db.js (MySQL + auto-create tables), schema.sql, middleware/auth.js,
routes/auth.js, routes/leaves.js, public/ (index, employee, admin pages, css, js)
