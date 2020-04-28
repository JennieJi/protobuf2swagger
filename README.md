# protobuf2swagger

Work in progress project for saving some life, update not garrenteed. Welcome for pull request :).

Main purpose is to convert [protobuf v2](https://developers.google.com/protocol-buffers/docs/proto) file to [openapi v3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) JSON schema with NodeJS, and merge with some custom open api configurations.  
Then you may render it easily with [SwaggerUI](https://github.com/swagger-api/swagger-ui).

# What is supported

- convert _enum_, _message_ into components, paths will reference to the components schema
- basic types mapping to JS type _number_, _string_, _boolean_ ( long types will be mapped to _string_)
- recognize fields:
  - [OperationObject](https://swagger.io/specification/#operationObject).requestBody.\$proto  
    Replace requestBody with a [Reference Object](https://swagger.io/specification/#referenceObject)
  - [OperationObject](https://swagger.io/specification/#operationObject).responses.\$proto  
    Replace responses['200'] with a [Reference Object](https://swagger.io/specification/#referenceObject)

# Install

`npm i -g protobuf2swagger`

# Cli Usage

`protobuf2swagger [config_file]`

| Argument    | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| config_file | Customize configuration file. Default to **protobuf2swagger.config.js** under current folder. |

For options may check `protobuf2swagger --help`. (Nothing there yet, seriously.)

## Config File

Example:

```javascript
module.exports = {
  file: 'test.proto',
  // or multiple files
  files: ['test1.proto', 'test2.proto'],
  dist: 'apischema.json',
  customSchema: {
    // Similar to openapi v3 format
    info: {
      title: 'API',
      version: '1.0.0',
      contact: {
        name: 'Jennie Ji',
        email: 'jennie.ji@hotmail.com',
        url: 'jennieji.github.io',
      },
    },
    tags: [
      {
        name: 'test',
        description: '',
      },
    ],
    paths: {
      '/api/test': {
        get: {
          requestBody: {
            $proto: 'GetDataRequest', // Tell me the protobuf message name
          },
          responses: {
            $proto: 'GetDataResponse', // Tell me the protobuf message name
          },
        },
        // or customize
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GetDataRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/GetDataResponse'
                  }
                }
              }
            }
          }
        }
      },
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
};
```

# Display with SwaggerUI

index.html (modified from swagger-ui-dist)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>API Document</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.22.2/swagger-ui.css"
    />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.22.2/swagger-ui-bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.22.2/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        // Begin Swagger UI call region
        const ui = SwaggerUIBundle({
          url: './apischema.json', // Path to the generated schema JSON file
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: 'StandaloneLayout',
        });
        // End Swagger UI call region
        window.ui = ui;
      };
    </script>
  </body>
</html>
```

Serve with simple [express](https://www.npmjs.com/package/express) server:

```javascript
const express = require('express');
const app = express();

app.use(express.static(__dirname /* path to index.html */));
app.listen(3000);

console.info('Served at port 3000');
```
