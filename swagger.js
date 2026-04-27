const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

function generateMarkdownDocs(spec) {
  const sections = [];
  const info = spec.info || {};
  const servers = spec.servers || [];
  const paths = spec.paths || {};

  sections.push(`# ${info.title || "API Documentation"}`);
  sections.push("");
  sections.push(`**Version:** ${info.version || "N/A"}`);
  sections.push("");
  sections.push(`${info.description || "No description provided."}`);
  sections.push("");

  if (servers.length) {
    sections.push("## Servers");
    sections.push("");
    servers.forEach((server) => {
      sections.push(`- ${server.url}`);
    });
    sections.push("");
  }

  sections.push("## Endpoints");
  sections.push("");

  Object.entries(paths).forEach(([route, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      sections.push(`### ${method.toUpperCase()} ${route}`);
      sections.push("");
      sections.push(operation.summary || "No summary provided.");
      sections.push("");

      if (operation.parameters && operation.parameters.length) {
        sections.push("**Parameters**");
        sections.push("");
        operation.parameters.forEach((parameter) => {
          sections.push(
            `- \`${parameter.name}\` (${parameter.in}) - ${
              parameter.required ? "required" : "optional"
            }`
          );
        });
        sections.push("");
      }

      if (operation.responses) {
        sections.push("**Responses**");
        sections.push("");
        Object.entries(operation.responses).forEach(([statusCode, response]) => {
          sections.push(`- \`${statusCode}\`: ${response.description || "No description"}`);
        });
        sections.push("");
      }
    });
  });

  return sections.join("\n");
}

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
  const markdownDocs = generateMarkdownDocs(swaggerSpec);

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.get("/api-docs/download/json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="api-docs.json"');
    res.send(swaggerSpec);
  });

  app.get("/api-docs/download/md", (req, res) => {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="api-docs.md"');
    res.send(markdownDocs);
  });

  app.get("/api-docs/download", (req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Download API Docs</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; }
      h1 { margin-bottom: 1rem; }
      a { display: block; margin: 0.75rem 0; font-size: 1.1rem; }
    </style>
  </head>
  <body>
    <h1>Download API Documentation</h1>
    <a href="/api-docs/download/json">Download OpenAPI JSON</a>
    <a href="/api-docs/download/md">Download Markdown Docs</a>
  </body>
</html>`);
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

  app.use(
    "/redoc-static",
    require("express").static(path.join(__dirname, "node_modules/redoc/bundles"))
  );

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
    <script src="/redoc-static/redoc.standalone.js"></script>
  </body>
</html>`);
  });
}

module.exports = setupSwagger;
