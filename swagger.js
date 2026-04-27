const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function createSwaggerSpec(port) {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Users API",
        version: "1.0.0",
        description: "Simple CRUD API for users",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
      components: {
        schemas: {
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
        },
      },
      paths: {
        "/api/users": {
          get: {
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
              },
            },
          },
        },
        "/api/users/{id}": {
          put: {
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
              },
              404: {
                description: "User not found",
              },
            },
          },
        },
      },
    },
    apis: [],
  });
}

function setupSwagger(app, port) {
  const swaggerSpec = createSwaggerSpec(port);

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        url: "/api-docs.json",
      },
    })
  );
}

module.exports = setupSwagger;
