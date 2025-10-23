import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Analytics API',
      version: '1.0.0',
      description: 'API RESTful dinâmica para dados de gráficos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        PieDataPoint: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            value: { type: 'number' },
          },
        },
        SeriesDataPoint: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            data: {
              type: 'array',
              items: { type: 'number' },
            },
          },
        },
        SeriesResponse: {
          type: 'object',
          properties: {
            labels: {
              type: 'array',
              items: { type: 'string' },
            },
            datasets: {
              type: 'array',
              items: { $ref: '#/components/schemas/SeriesDataPoint' },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: {
                  type: 'array',
                  items: { type: 'object' },
                },
              },
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'error'] },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number' },
            database: { type: 'string', enum: ['connected', 'disconnected'] },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check endpoint',
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                },
              },
            },
            '503': {
              description: 'Service is unhealthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                },
              },
            },
          },
        },
      },
      '/charts/{type}': {
        get: {
          tags: ['Charts'],
          summary: 'Get chart data',
          parameters: [
            {
              name: 'type',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['pie', 'line', 'bar', 'area'],
              },
              description: 'Type of chart',
            },
            {
              name: 'startDate',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Start date (YYYY-MM-DD)',
            },
            {
              name: 'endDate',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'End date (YYYY-MM-DD)',
            },
            {
              name: 'groupBy',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['day', 'week', 'month'],
              },
              description: 'Group by time period (required for line/area charts)',
            },
            {
              name: 'dimension',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['category', 'region', 'product', 'channel'],
              },
              description: 'Dimension to group by (required for pie/bar charts)',
            },
            {
              name: 'metric',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['sum(amount)', 'avg(amount)', 'count(*)'],
                default: 'sum(amount)',
              },
              description: 'Metric to calculate',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'number', minimum: 1, maximum: 100 },
              description: 'Maximum number of results',
            },
            {
              name: 'order',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'desc',
              },
              description: 'Sort order',
            },
            {
              name: 'splitBy',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['category', 'region', 'product', 'channel'],
              },
              description: 'Split series by dimension (required for area charts)',
            },
          ],
          responses: {
            '200': {
              description: 'Chart data',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PieDataPoint' },
                      },
                      { $ref: '#/components/schemas/SeriesResponse' },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '422': {
              description: 'Unprocessable entity',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // We're defining the API inline
};

const specs = swaggerJsdoc(options);

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Analytics API Documentation',
}));

export { router as docsRoutes };
