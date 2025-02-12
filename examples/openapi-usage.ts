import { OpenAPIV3 } from "openapi-types";
import { getApiEndpointInfo, generateTypeDefinitions } from "./openapi-parser";
import { evmApi } from "./evmapi";

// Get the path from command line arguments or use default
const path = process.argv[2] || "/statistics/tps";

// Example OpenAPI spec
const spec: OpenAPIV3.Document = evmApi;

// Get endpoint info
const endpointInfo = getApiEndpointInfo(spec, path);

if (!endpointInfo || endpointInfo.length === 0) {
  console.error(`No endpoint found for path: ${path}`);
  process.exit(1);
}

const endpoint = endpointInfo[0];

console.log("Endpoint Information:");
console.log("Path:", endpoint.path);
console.log("Method:", endpoint.method);
console.log("Description:", endpoint.description);

console.log("\nParameters:");
endpoint.parameters.forEach((param) => {
  console.log(`- ${param.name} (${param.required ? "required" : "optional"}): ${param.type}`);
  if (param.description) console.log(`  Description: ${param.description}`);
  if (param.enum) console.log(`  Allowed values: ${param.enum.join(", ")}`);
  if (param.default !== undefined) console.log(`  Default: ${param.default}`);
});
