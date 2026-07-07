# Implemented Routes

This file lists the API routes created and implemented in this project.

## Auth Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Technician Routes
- GET /api/technician/
- GET /api/technician/:id
- PATCH /api/technician/profile
- PUT /api/technician/availability

## Admin Routes
- POST /api/admin/categories
- GET /api/admin/categories
- GET /api/admin/allUsers
- GET /api/admin/bookings
- PATCH /api/admin/user/:id

## Service Routes
- POST /api/services/
- GET /api/services/

## Booking Routes
- POST /api/bookings/create
- PATCH /api/bookings/status/:id

## Payment Routes
- POST /api/payments/create
- POST /api/payments/confirm
- GET /api/payments/
- GET /api/payments/:id

## Review Routes
- POST /api/reviews/

## Category Routes
- GET /api/category/

## Notes
- Routes are mounted in the main app through the Express app configuration.
- Authentication and authorization are applied where required.
