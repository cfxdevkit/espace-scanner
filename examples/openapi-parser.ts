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

  return current as OpenAPIV3.SchemaObject;
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
    return resolveSchemaRef(schema.$ref, spec);
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
export function generateTypeDefinitions(endpointInfo: ApiEndpointInfo): string {
  let typeDefinitions = "";

  // Generate parameter interface
  const parameterProps = endpointInfo.parameters
    .map((param) => {
      const optional = param.required ? "" : "?";
      let type = param.schema?.type || param.type || "string";

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
  typeDefinitions += `export interface ${interfaceName}Params {\n${parameterProps}\n}\n\n`;

  // Generate response interface if schema exists
  if (endpointInfo.responseSchema) {
    const responseProps = generateSchemaInterface(endpointInfo.responseSchema);
    typeDefinitions += `export interface ${interfaceName}Response {\n${responseProps}\n}\n`;
  }

  return typeDefinitions;
}

/**
 * Generates TypeScript interface properties from an OpenAPI schema
 */
function generateSchemaInterface(schema: OpenAPIV3.SchemaObject, indent: string = "  "): string {
  if (!schema.properties) return "";

  return Object.entries(schema.properties)
    .map(([propName, propSchema]) => {
      const schema = propSchema as OpenAPIV3.SchemaObject;
      let type: string;

      if (schema.type === "array" && schema.items) {
        const itemSchema = schema.items as OpenAPIV3.SchemaObject;
        if (itemSchema.type === "object" && itemSchema.properties) {
          type = `Array<{\n${generateSchemaInterface(itemSchema, indent + "  ")}\n${indent}}>`;
        } else {
          type = `${itemSchema.type}[]`;
        }
      } else if (schema.type === "object" && schema.properties) {
        type = `{\n${generateSchemaInterface(schema, indent + "  ")}\n${indent}}`;
      } else {
        type = schema.type || "any";
      }

      const optional = schema.required ? "" : "?";
      const description = schema.description ? `\n${indent}/** ${schema.description} */` : "";

      return `${description}\n${indent}${propName}${optional}: ${type};`;
    })
    .join("\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
