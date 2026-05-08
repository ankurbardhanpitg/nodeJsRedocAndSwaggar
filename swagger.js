const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

/**
 * here we are creating the swagger specification
 * @param {number} port - the port number to listen on
 * @returns {Object} the swagger specification
 */
function createSwaggerSpec(port) {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "NodeJS Redoc and Swagger API",
        version: "1.0.0",
        description: "Simple CRUD API for users and companies",
      },
      tags: [
        {
          name: "user",
          description: "User related APIs",
        },
        {
          name: "company",
          description: "Company related APIs",
        },
      ],
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
      components: {
        schemas: {
          Message: {
            type: "object",
            properties: {
              message: { type: "string", example: "Operation successful" },
            },
            required: ["message"],
          },
          User: {
            type: "object",
            properties: {
              id: { type: "string", example: "1710000000000" },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
            },
            required: ["id", "name", "email"],
          },
          NewUser: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
            },
            required: ["name", "email"],
          },
          UpdateUser: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
            },
          },
          Company: {
            type: "object",
            properties: {
              id: { type: "string", example: "1710000000000" },
              name: { type: "string", example: "Acme Inc." },
              email: { type: "string", example: "info@acme.com" },
              address: { type: "string", example: "221B Baker Street" },
            },
            required: ["id", "name", "email"],
          },
          NewCompany: {
            type: "object",
            properties: {
              name: { type: "string", example: "Acme Inc." },
              email: { type: "string", example: "info@acme.com" },
              address: { type: "string", example: "221B Baker Street" },
            },
            required: ["name", "email"],
          },
          UpdateCompany: {
            type: "object",
            properties: {
              name: { type: "string", example: "Acme Inc." },
              email: { type: "string", example: "info@acme.com" },
              address: { type: "string", example: "221B Baker Street" },
            },
          },
        },
      },
      paths: {
        "/api/users": {
          get: {
            tags: ["user"],
            summary: "Get all users",
            responses: {
              200: {
                description: "List of users",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["user"],
            summary: "Create a new user",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NewUser" },
                },
              },
            },
            responses: {
              201: {
                description: "Created user",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/User" },
                  },
                },
              },
              400: {
                description: "Validation error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "name and email are required" },
                  },
                },
              },
            },
          },
        },
        "/api/users/{id}": {
          put: {
            tags: ["user"],
            summary: "Update user by id",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateUser" },
                },
              },
            },
            responses: {
              200: {
                description: "Updated user",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/User" },
                  },
                },
              },
              404: {
                description: "User not found",
              },
            },
          },
          delete: {
            tags: ["user"],
            summary: "Delete user by id",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              200: {
                description: "User deleted successfully",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "User deleted successfully" },
                  },
                },
              },
              404: {
                description: "User not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "User not found" },
                  },
                },
              },
            },
          },
        },
        "/api/companies": {
          get: {
            tags: ["company"],
            summary: "Get all companies",
            responses: {
              200: {
                description: "List of companies",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Company" },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["company"],
            summary: "Create a new company",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NewCompany" },
                },
              },
            },
            responses: {
              201: {
                description: "Created company",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Company" },
                  },
                },
              },
              400: {
                description: "Validation error",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "name and email are required" },
                  },
                },
              },
            },
          },
        },
        "/api/companies/{id}": {
          get: {
            tags: ["company"],
            summary: "Get company by id",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              200: {
                description: "Company",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Company" },
                  },
                },
              },
              404: {
                description: "Company not found",
              },
            },
          },
          put: {
            tags: ["company"],
            summary: "Update company by id",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateCompany" },
                },
              },
            },
            responses: {
              200: {
                description: "Updated company",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Company" },
                  },
                },
              },
              404: {
                description: "Company not found",
              },
            },
          },
          delete: {
            tags: ["company"],
            summary: "Delete company by id",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              200: {
                description: "Company deleted successfully",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "Company deleted successfully" },
                  },
                },
              },
              404: {
                description: "Company not found",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Message" },
                    example: { message: "Company not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
    apis: [],
  });
}

/**
 * here we are setting up the swagger documentation
 * @param {express.Application} app - the express application
 * @param {number} port - the port number to listen on
 */
function setupSwagger(app, port) {
  const swaggerSpec = createSwaggerSpec(port);

  // here we are serving the swagger specification
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // here we are serving the swagger documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        url: "/api-docs.json",
        defaultModelsExpandDepth: -1,
      },
    })
  );

  // here we are serving the redoc documentation
  app.get("/redoc", (req, res) => {
    res.type("html").send(`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Users API - ReDoc</title>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url="/api-docs.json"></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </body>
    </html>`);
  });
}

module.exports = setupSwagger;
