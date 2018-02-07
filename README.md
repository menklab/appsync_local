##appsync-local

appsync-local is a tool designed to make local appsync development easier. 

By following a basic naming convention and a basic config file, appsync-local will upload a modular AppSync application in a single command.

## Install
`npm install --save-dev appsync-local`

## Basic Usage
Intended to be utilized with IDEs compatible with [js-graphql-language-service](https://github.com/jimkyndemeyer/js-graphql-language-service) and [Apache Velocity Template Language (VTL)](http://velocity.apache.org/). Curretly tested with and developed with [IntelliJ IDEA](https://www.jetbrains.com/idea/) and [js-graphql-intellij-plugin](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin)

Utilizing an AWS example is a good way to gain an understanding of how this tool works. Once an example project is deployed, it can be downloaded with the command below. This gives a great starting point for a syntax to build your project from. It can also be modified and uploaded to test how to tool works. 

##### Download
`node appsync-local.js --config .appsync-local.config.local.json download GraphCQL/`

Download an appsync schema, datasources, resolvers, and types into a semi-modular file structure. This is not indented to be directly compatible with upload, but rather, enable users to download and further customize/organize their project for the first time. **Think of this as a first-time use only.

##### Upload
`node appsync-local.js --config .appsync-local.config.local.json upload ./GraphQL/`

Upload is used to take an entire project and push it into an existing AppSync GraphQL Api. This can be used to upload changes on an iterative basis.

##### Example Config

configure graphql.config.json as described by [js-graphql-language-service](https://github.com/jimkyndemeyer/js-graphql-language-service).
```
{
  "README_schema" : "Specifies how to load the GraphQL schema that completion, error highlighting, and documentation is based on in the IDE",
  "schema": {

    "README_file" : "Remove 'file' to use request url below. A relative or absolute path to the JSON from a schema introspection query, e.g. '{ data: ... }' or a .graphql/.graphqls file describing the schema using GraphQL Schema Language. Changes to the file are watched.",
    "file": "",

    "README_request" : "To request the schema from a url instead, remove the 'file' JSON property above (and optionally delete the default graphql.schema.json file).",
    "request": {
      "url" : "https://<API ID>.appsync-api.us-east-1.amazonaws.com/graphql",
      "method" : "POST",
      "README_postIntrospectionQuery" : "Whether to POST an introspectionQuery to the url. If the url always returns the schema JSON, set to false and consider using GET",
      "postIntrospectionQuery" : true,
      "README_options" : "See the 'Options' section at https://github.com/then/then-request",
      "options" : {
        "headers": {
          "x-api-key" : "<API KEY FOR AUTH>"
        }
      }
    }

  },

  "README_endpoints": "A list of GraphQL endpoints that can be queried from '.graphql' files in the IDE",
  "endpoints" : [
    {
      "name": "AppSync",
      "url": "https://<API ID>.appsync-api.us-east-1.amazonaws.com/graphql",
      "options" : {
        "headers": {
          "x-api-key" : "<API KEY FOR AUTH>"
        }
      }
    }
  ]

}
```

add config for appsync-local to authenticate with. ** Currently this only works with API Token (for development mode)

```
{
   "access_key_id": "<access key>",
   "secret_access_key": "<secret key>",
   "session_token": "<optional if using 2factor in console>",
   "region": "us-east-1",
   "api_id": "<API ID>"
 }
 ```
 
## Contribute
Fork and Pull Request.