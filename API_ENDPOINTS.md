# Ticket System API Endpoints

## Gateway Port: 8080

### Sales Service (via Gateway)
- `POST   /api/sales` - Create a new sale
- `GET    /api/sales` - Get all sales
- `GET    /api/sales/{id}` - Get sale by ID
- `PATCH  /api/sales/{id}/status` - Update sale status
- `DELETE /api/sales/{id}` - Delete a sale
- `GET    /api/sales/user/{userId}` - Get sales by user ID
- `GET    /api/sales/stats` - Get sales statistics
- `GET    /api/sales/revenue` - Get total revenue

### Payments Service (via Gateway)
- `POST   /api/payments/credit-card` - Process credit card payment
- `POST   /api/payments/debit-card` - Process debit card payment
- `POST   /api/payments/pix/generate` - Generate PIX payment
- `POST   /api/payments/pix/confirm/{paymentId}` - Confirm PIX payment
- `GET    /api/payments/pix/status/{paymentId}` - Get PIX payment status
- `POST   /api/payments/refund/{paymentId}` - Refund payment
- `GET    /api/payments/sale/{saleId}` - Get payment by sale ID
- `GET    /api/payments/{id}` - Get payment by ID

### Events Service (via Gateway)
- `POST   /api/events` - Create a new event
- `GET    /api/events` - Get all events
- `GET    /api/events/{id}` - Get event by ID
- `PUT    /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET    /api/events/stats` - Get event statistics
- `GET    /api/events/upcoming` - Get upcoming events
- `GET    /api/events/{id}/exists` - Check if event exists

### Users Service (via Gateway)
- `POST   /api/users` - Create a new user
- `GET    /api/users` - Get all users
- `GET    /api/users/{id}` - Get user by ID
- `PUT    /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET    /api/users/by-userid/{userId}` - Get user by external user ID

### Notifications Service (via Gateway)
- `POST   /api/notifications` - Create notification
- `GET    /api/notifications/user/{userId}` - Get user notifications
- `PATCH  /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete notification

### Seed Endpoints
- `POST   /seed` - Seed database with sample data
- `GET    /health` - Health check

## Direct Service Ports

### Discovery Server
- Port: 8761
- URL: http://localhost:8761

### Services (Direct Access - Development Only)
- Users Service: http://localhost:3000
- Sales Service: http://localhost:4000
- Events Service: http://localhost:5001
- Notifications Service: http://localhost:5000
- Gateway: http://localhost:8080
- Frontend: http://localhost:5173

## Database Schema

### Sales Table
- id: UUID (Primary Key)
- userId: VARCHAR (Not Null)
- eventId: UUID (Not Null)
- quantity: INTEGER (Not Null)
- totalAmount: DOUBLE (Not Null)
- saleStatus: VARCHAR (Not Null) - PENDING, PAID, CANCELLED, REFUNDED
- paymentMethod: VARCHAR (Not Null) - CREDIT_CARD, DEBIT_CARD, PIX, CASH
- saleDate: TIMESTAMP (Not Null)
- paymentDate: TIMESTAMP
- cancellationDate: TIMESTAMP
- notes: VARCHAR(500)

### Payments Table
- id: UUID (Primary Key)
- saleId: UUID (Not Null)
- status: VARCHAR (Not Null) - PENDING, COMPLETED, FAILED, REFUNDED
- paymentMethod: VARCHAR (Not Null)
- amount: DOUBLE (Not Null)
- transactionId: VARCHAR (Unique)
- cardLastFour: VARCHAR
- cardBrand: VARCHAR
- pixKey: VARCHAR
- pixQrCode: VARCHAR
- pixExpiration: TIMESTAMP
- installments: INTEGER
- createdAt: TIMESTAMP (Not Null)
- processedAt: TIMESTAMP
- paymentDetails: VARCHAR(1000)