import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FixItNow API",
      version: "1.0.0",
      description: "FixItNow Home Services Marketplace API. Connects customers with verified home service professionals.",
      contact: {
        name: "FixItNow Support",
        email: "support@fixitnow.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {},
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errorDetails: { type: "object" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            phone: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            role: { type: "string", enum: ["CUSTOMER", "TECHNICIAN", "ADMIN"] },
            status: { type: "string", enum: ["ACTIVE", "BANNED"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string", nullable: true },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            technicianId: { type: "string", format: "uuid" },
            categoryId: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            price: { type: "number" },
            category: { $ref: "#/components/schemas/Category" },
            technician: { $ref: "#/components/schemas/User" },
            avgRating: { type: "number", nullable: true },
            reviewCount: { type: "integer" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            customerId: { type: "string", format: "uuid" },
            technicianId: { type: "string", format: "uuid" },
            serviceId: { type: "string", format: "uuid" },
            scheduledAt: { type: "string", format: "date-time" },
            timeSlot: { type: "string", nullable: true },
            status: { type: "string", enum: ["REQUESTED", "ACCEPTED", "DECLINED", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"] },
            totalAmount: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            bookingId: { type: "string", format: "uuid" },
            transactionId: { type: "string" },
            amount: { type: "number" },
            provider: { type: "string" },
            status: { type: "string", enum: ["PENDING", "COMPLETED", "FAILED"] },
            paidAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            bookingId: { type: "string", format: "uuid" },
            customerId: { type: "string", format: "uuid" },
            technicianId: { type: "string", format: "uuid" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", nullable: true },
          },
        },
        Wallet: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            balance: { type: "number" },
            totalEarned: { type: "number" },
            totalSpent: { type: "number" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            title: { type: "string" },
            message: { type: "string" },
            type: { type: "string" },
            read: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "FixItNow API Documentation",
  }));
  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
