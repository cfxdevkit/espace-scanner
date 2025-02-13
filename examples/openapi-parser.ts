import { OpenAPIV3 } from "openapi-types";

/**
 * Represents the extracted API endpoint information
 */
export interface ApiEndpointInfo {
  path: string;
  method: string;
  description: string;
  parameters: {
    name: string;
    required: boolean;
    type: string;
    description?: string;
    schema?: OpenAPIV3.SchemaObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enum?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any;
  }[];
  responseSchema: OpenAPIV3.SchemaObject | null;
  tags: string[];
}

/**
 * Resolves a parameter reference from components
 */
function resolveParameterRef(
  ref: string,
  spec: OpenAPIV3.Document
): OpenAPIV3.ParameterObject | null {
  const refPath = ref.replace("#/components/parameters/", "").split("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = spec.components?.parameters;

  for (const segment of refPath) {
    if (!current || typeof current !== "object") return null;
    current = current[segment];
  }

  return current as OpenAPIV3.ParameterObject;
}

/**
 * Resolves a schema reference from components
 */
function resolveSchemaRef(ref: string, spec: OpenAPIV3.Document): OpenAPIV3.SchemaObject | null {
  const refPath = ref.replace("#/components/schemas/", "").split("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = spec.components?.schemas;

  for (const segment of refPath) {
    if (!current || typeof current !== "object") return null;
    current = current[segment];
  }

  // If the resolved schema is still a reference, resolve it recursively
  if (current && typeof current === "object" && "$ref" in current) {
    return resolveSchemaRef(current.$ref, spec);
  }

  return current as OpenAPIV3.SchemaObject;
}

/**
 * Resolves a schema, following references if necessary
 */
function resolveSchema(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  spec: OpenAPIV3.Document
): OpenAPIV3.SchemaObject | null {
  if ("$ref" in schema) {
    return resolveSchemaRef(schema.$ref, spec);
  }

  // If it's an array type, resolve the item schema
  if (schema.type === "array" && schema.items) {
    const resolvedItems = resolveSchema(
      schema.items as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
      spec
    );
    if (resolvedItems) {
      return {
        ...schema,
        items: resolvedItems,
      };
    }
  }

  // If it's an object type or has properties (even without explicit type), resolve property schemas
  if ((schema.type === "object" || schema.properties) && schema.properties) {
    const resolvedProperties: { [key: string]: OpenAPIV3.SchemaObject } = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      const resolved = resolveSchema(
        prop as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
        spec
      );
      if (resolved) {
        resolvedProperties[key] = resolved;
      }
    }
    return {
      ...schema,
      type: "object", // Ensure type is set
      properties: resolvedProperties,
    };
  }

  return schema;
}

/**
 * Extracts parameter information from OpenAPI parameter objects
 */
function extractParameterInfo(
  parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
  spec: OpenAPIV3.Document
): ApiEndpointInfo["parameters"][0] | null {
  let resolvedParam: OpenAPIV3.ParameterObject;

  if ("$ref" in parameter) {
    const resolved = resolveParameterRef(parameter.$ref, spec);
    if (!resolved) return null;
    resolvedParam = resolved;
  } else {
    resolvedParam = parameter;
  }

  const schema = resolvedParam.schema as OpenAPIV3.SchemaObject;
  return {
    name: resolvedParam.name,
    required: resolvedParam.required || false,
    type: schema?.type || "string",
    description: resolvedParam.description,
    schema: schema,
    enum: schema?.enum,
    default: schema?.default,
  };
}

/**
 * Extracts response schema from OpenAPI operation object
 */
function extractResponseSchema(
  responses: OpenAPIV3.ResponsesObject,
  spec: OpenAPIV3.Document
): OpenAPIV3.SchemaObject | null {
  const successResponse = responses["200"];
  if (!successResponse) return null;

  let schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;

  if ("$ref" in successResponse) {
    const resolved = resolveSchemaRef(successResponse.$ref, spec);
    if (!resolved) return null;
    schema = resolved;
  } else if ("content" in successResponse) {
    schema = successResponse.content?.["application/json"]?.schema;
  }

  if (!schema) return null;

  if ("$ref" in schema) {
    const resolved = resolveSchemaRef(schema.$ref, spec);
    if (!resolved) return null;
    return resolved;
  }

  return schema;
}

/**
 * Extracts API endpoint information from an OpenAPI path
 */
function extractPathInfo(
  path: string,
  pathItem: Required<OpenAPIV3.PathItemObject>,
  spec: OpenAPIV3.Document
): ApiEndpointInfo[] {
  const endpoints: ApiEndpointInfo[] = [];

  const methods = ["get", "post", "put", "delete", "patch"] as const;
  for (const method of methods) {
    const operation = pathItem[method] as OpenAPIV3.OperationObject;
    if (!operation) continue;

    const endpoint: ApiEndpointInfo = {
      path,
      method: method.toUpperCase(),
      description: operation.description || "",
      parameters: [],
      responseSchema: extractResponseSchema(operation.responses, spec),
      tags: operation.tags || [],
    };

    if (operation.parameters) {
      for (const param of operation.parameters) {
        const paramInfo = extractParameterInfo(param, spec);
        if (paramInfo) {
          endpoint.parameters.push(paramInfo);
        }
      }
    }

    endpoints.push(endpoint);
  }

  return endpoints;
}

/**
 * Parses OpenAPI specification and extracts endpoint information
 */
export function parseOpenApiSpec(spec: OpenAPIV3.Document): Map<string, ApiEndpointInfo[]> {
  const endpointMap = new Map<string, ApiEndpointInfo[]>();

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (pathItem) {
      const endpoints = extractPathInfo(path, pathItem as Required<OpenAPIV3.PathItemObject>, spec);
      if (endpoints.length > 0) {
        endpointMap.set(path, endpoints);
      }
    }
  }

  return endpointMap;
}

/**
 * Gets API endpoint information for a specific path
 */
export function getApiEndpointInfo(
  spec: OpenAPIV3.Document,
  targetPath: string
): ApiEndpointInfo[] | null {
  const pathItem = spec.paths[targetPath];
  if (!pathItem) return null;

  return extractPathInfo(targetPath, pathItem as Required<OpenAPIV3.PathItemObject>, spec);
}

/**
 * Generates TypeScript interfaces for API request parameters and response
 */
export function generateTypeDefinitions(
  endpointInfo: ApiEndpointInfo,
  spec: OpenAPIV3.Document
): string {
  let typeDefinitions = "";

  // Generate parameter interface
  const parameterProps = endpointInfo.parameters
    .map((param) => {
      const optional = param.required ? "" : "?";
      let type = param.schema?.type || param.type || "string";

      // Convert integer type to number
      if (type === "integer") {
        type = "number";
      }

      // Add enum type if available
      if (param.enum) {
        type = param.enum.map((v) => (typeof v === "string" ? `'${v}'` : v)).join(" | ");
      }

      let docs = param.description ? `/** ${param.description}` : "/**";
      if (param.default !== undefined) {
        docs += `\n   * @default ${param.default}`;
      }
      if (param.enum) {
        docs += `\n   * @enum ${param.enum.join(", ")}`;
      }
      docs += " */";

      return `  ${docs}\n  ${param.name}${optional}: ${type};`;
    })
    .join("\n\n");

  const interfaceName = capitalize(
    endpointInfo.path
      .split("/")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "") || "Request"
  );

  // Add eslint-disable comment if the interface would be empty
  const paramsComment = !parameterProps ? "// eslint-disable-next-line\n" : "";
  typeDefinitions += `${paramsComment}export interface ${interfaceName}Params {\n${parameterProps}\n}\n\n`;

  // Generate response interface if schema exists
  if (endpointInfo.responseSchema) {
    // First generate the result type if it exists
    let resultType = "";
    if (endpointInfo.responseSchema.properties?.result) {
      const resultSchema = endpointInfo.responseSchema.properties.result as OpenAPIV3.SchemaObject;
      resultType = generateSchemaInterface(resultSchema, spec);
    }

    // Then generate the main response interface
    let responseProps = "";
    for (const [propName, propSchema] of Object.entries(
      endpointInfo.responseSchema.properties || {}
    )) {
      const resolvedSchema = resolveSchema(
        propSchema as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
        spec
      );
      if (!resolvedSchema) {
        responseProps += `\n  ${propName}?: any;\n`;
        continue;
      }

      if (propName === "result") {
        if (resolvedSchema.properties) {
          // If result is an object with properties, generate an inline interface
          responseProps += `\n  /** API response result */\n  result?: {\n`;
          for (const [key, propValue] of Object.entries(resolvedSchema.properties)) {
            const resolvedProp = resolveSchema(
              propValue as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
              spec
            );
            if (!resolvedProp) continue;

            const propType =
              resolvedProp.type === "integer" ? "number" : resolvedProp.type || "any";
            const description = resolvedProp.description
              ? `\n    /** ${resolvedProp.description} */\n`
              : "\n";
            responseProps += `${description}    ${key}?: ${propType};\n`;
          }
          responseProps += "  };\n";
        } else {
          // Otherwise use the generated result type
          responseProps += `\n  /** API response result */\n  result?: ${resultType || "any"};\n`;
        }
      } else {
        const type = resolvedSchema.type === "integer" ? "number" : resolvedSchema.type || "any";
        const description = resolvedSchema.description
          ? `\n  /** ${resolvedSchema.description} */`
          : "";
        responseProps += `${description}\n  ${propName}?: ${type};\n`;
      }
    }

    // Add eslint-disable comment if the interface would be empty
    const responseComment = !responseProps ? "// eslint-disable-next-line\n" : "";
    typeDefinitions += `${responseComment}export interface ${interfaceName}Response {${responseProps}}\n`;
  }

  return typeDefinitions;
}

/**
 * Generates TypeScript interface properties from an OpenAPI schema
 */
function generateSchemaInterface(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  spec: OpenAPIV3.Document,
  indent: string = "  "
): string {
  const resolvedSchema = resolveSchema(schema, spec);
  if (!resolvedSchema) return "any";

  if (!resolvedSchema.properties) {
    // Handle array types
    if (resolvedSchema.type === "array" && resolvedSchema.items) {
      const itemSchema = resolveSchema(resolvedSchema.items, spec);
      if (!itemSchema) return "any[]";

      if (itemSchema.type === "object" || itemSchema.properties) {
        return `Array<{\n${generateSchemaInterface(itemSchema, spec, indent + "  ")}\n${indent}}>`;
      } else if (itemSchema.type === "array") {
        return `${generateSchemaInterface(itemSchema, spec, indent)}[]`;
      } else {
        const type = itemSchema.type === "integer" ? "number" : itemSchema.type || "any";
        return `${type}[]`;
      }
    }
    // Handle primitive types
    return resolvedSchema.type === "integer" ? "number" : resolvedSchema.type || "any";
  }

  return Object.entries(resolvedSchema.properties)
    .map(([propName, propSchema]) => {
      const resolvedPropSchema = resolveSchema(
        propSchema as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
        spec
      );
      if (!resolvedPropSchema) return `${propName}: any;`;

      let type: string;

      if (resolvedPropSchema.type === "array" && resolvedPropSchema.items) {
        const itemSchema = resolveSchema(resolvedPropSchema.items, spec);
        if (!itemSchema) return `${propName}: any[];`;

        if (itemSchema.type === "object" || itemSchema.properties) {
          type = `Array<{\n${generateSchemaInterface(itemSchema, spec, indent + "  ")}\n${indent}}>`;
        } else if (itemSchema.type === "array") {
          type = `${generateSchemaInterface(itemSchema, spec, indent)}[]`;
        } else {
          const itemType = itemSchema.type === "integer" ? "number" : itemSchema.type || "any";
          type = `${itemType}[]`;
        }
      } else if (resolvedPropSchema.type === "object" || resolvedPropSchema.properties) {
        type = `{\n${generateSchemaInterface(resolvedPropSchema, spec, indent + "  ")}\n${indent}}`;
      } else {
        type = resolvedPropSchema.type === "integer" ? "number" : resolvedPropSchema.type || "any";
      }

      const optional = resolvedPropSchema.required ? "" : "?";
      const description = resolvedPropSchema.description
        ? `\n${indent}/** ${resolvedPropSchema.description} */`
        : "";

      return `${description}\n${indent}${propName}${optional}: ${type};`;
    })
    .join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
