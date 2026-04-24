📘 Product Requirements Document (PRD)
Project: EasyBasket Admin Dashboard (Multi-Role System)

1. Product Overview

The EasyBasket Admin Dashboard is a web-based application developed using React and Firebase that allows Super Admin and Admin users to manage the grocery delivery system efficiently.

The system introduces role-based access control (RBAC) where:

Admin manages products and orders
Super Admin has full control, including managing admins 2. Goals & Objectives
🎯 Primary Goals:
Implement role-based admin system
Provide centralized control panel for business operations
Enable real-time product and order management
🎯 Secondary Goals:
Allow Super Admin to monitor all admins
Improve system security and control
Provide scalable architecture 3. User Roles
👤 3.1 Super Admin
Full system access
Can manage all admins
Can view system-wide data
👤 3.2 Admin
Limited access
Can manage products and orders
Cannot manage other admins 4. User Stories
🔐 Authentication
Super Admin:
As a super admin, I want to log in securely so that I can access full system control
Admin:
As an admin, I want to log in so that I can manage products and orders
👥 Admin Management (Super Admin Only)
As a super admin, I want to create admin accounts
As a super admin, I want to view all admins
As a super admin, I want to update admin details
As a super admin, I want to delete or disable admins
📦 Product Management
As an admin, I want to add products
As an admin, I want to edit product details
As an admin, I want to delete products
🛒 Order Management
As an admin, I want to view all orders
As an admin, I want to update order status
📊 Dashboard
Super Admin:
View total admins, products, orders
Admin:
View products and orders summary 5. Feature List
✅ 5.1 Authentication & Role Management
Login system using Firebase Authentication
Role-based access:
super_admin
admin
✅ 5.2 Super Admin Features
👥 Admin Management
Add new admin
View admin list
Edit admin details
Delete / disable admin
📊 System Overview
Total admins
Total products
Total orders
✅ 5.3 Admin Features
📦 Product Management
Add product
Update product
Delete product
View product list
🛒 Order Management
View orders
Update order status:
Pending
Confirmed
Delivered
✅ 5.4 Dashboard
Summary cards:
Total products
Total orders
Total admins (super admin only)
✅ 5.5 Navigation

Routes:

/login
/dashboard
/products
/orders
/admins (super admin only) 6. Functional Requirements
System must authenticate users using Firebase
System must assign roles (admin / super_admin)
System must restrict access based on roles
Super Admin must manage admin accounts
Admin must manage products and orders
Data must be updated in real-time 7. Non-Functional Requirements
⚡ Performance
Page load time < 2 seconds
🔐 Security
Role-based access control
Protected routes
Secure Firebase rules
🎨 Usability
Simple UI
Easy navigation
📈 Scalability
Support multiple admins 8. Database Design (Firebase)
Users Collection
users/
user_id
name
email
role (admin / super_admin)
created_at
Products Collection
products/
product_id
name
price
stock
image
Orders Collection
orders/
order_id
user_id
total
status 9. Success Metrics
📊 Functional Metrics
Admin can perform CRUD on products
Super Admin can manage all admins
Orders updated successfully
📈 Performance Metrics
Dashboard loads < 2 sec
API response < 1 sec
🔐 Security Metrics
No unauthorized access
Role-based restrictions working 10. Constraints
Depends on Firebase services
Requires internet connection
Single platform (web only) 11. Future Enhancements
Multi-role hierarchy
Analytics dashboard
Sales reports
Notifications
Payment integration
🔥 IMPORTANT DESIGN ADVICE

Don’t ignore this:

👉 Store role like:

role: "admin" or "super_admin"

👉 Always check role before rendering page:

if (user.role === "super_admin") show admin panel
