const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const groupsRoute = require('./routes/groups');
const expensesRoute = require('./routes/expenses');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Swagger setup with JWT Authorize button
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Expense Splitter API",
      version: "1.0.0",
      description: "API Documentation for Splitwise-like App"
    },
    servers: [{ url: "http://localhost:4000" }],

    // 🔥 Add JWT auth to enable Authorize button
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    // 🔥 Apply security globally (optional)
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ["./src/routes/*.js"], // Route files where swagger comments exist
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("📘 Swagger Docs at http://localhost:4000/api-docs");

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupsRoute);
app.use('/api/expenses', expensesRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
