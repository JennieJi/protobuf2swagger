# protobuf2swagger

Work in progress project for saving some life, update not garrenteed. Welcome for pull request :).

Main purpose is to convert [protobuf v2](https://developers.google.com/protocol-buffers/docs/proto) file to [openapi v3](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) JSON schema with NodeJS, and merge with some custom open api configurations.  
Then you may render it easily with [SwaggerUI](https://github.com/swagger-api/swagger-ui).

# What is supported

- customSchema in OAS v2 or v3 formats
- convert _service_ to paths
- convert _enum_, _message_ to schemas in components/definitions, paths will reference to them
- basic types mapping to JS type _number_, _string_, _boolean_ ( long types will be mapped to _string_)
- **nested**, **repeated** types

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
  // Required
  files: ['test1.proto', 'test2.proto'],
  // Optional
  dist: 'apischema.json',
  // Optional
  formatServicePath: (path) => path.replace(/\./g, '/'),
  // Optional, will convert long to string by default
  long: 'number',
  // Optional
  customSchema: {
    swagger: '2.0',
    paths: {
      '/api/test': {
        get: {
          responses: {
            200: {
              schema: {
                $ref: 'GetDataResponse', // Tell me the protobuf message name
              },
            },
          },
          params: [],
        },
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
