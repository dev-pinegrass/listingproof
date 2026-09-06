# Scoped AWS backend

CloudFormation stack `listingproof-bedrock-20260906`, us-east-1. The Lambda execution role permits only bedrock:InvokeModel on amazon.nova-lite-v1:0. AWS manages and rotates the function's role credentials. No root credentials are placed in Lambda or Sites.

The function URL is network-accessible but checks a 256-bit server-to-server bearer token before parsing input or invoking Bedrock. Sites holds that token as a secret; the browser never receives it. The model and inference limits are fixed in the backend. User-provided system prompts and model choices are ignored. Lambda has a 45-second timeout, 256 MB memory, and uses the account's existing concurrency quota. No request bodies or tokens are logged by application code. Calls incur AWS usage charges.

`node aws-backend/prepare.cjs` regenerates the template from the application prompt. `template.json` contains no secrets. BackendToken is a CloudFormation NoEcho parameter; do not put a real token into source. Configure BEDROCK_BACKEND_URL and BEDROCK_BACKEND_TOKEN as server environment values and redeploy Sites.

To disable, remove the backend environment variables from Sites and redeploy. To remove AWS resources, review then delete this named CloudFormation stack. Do not delete unrelated stacks. Token rotation requires updating the stack parameter and the corresponding Sites secret. The stack deliberately has no logging IAM permission and no data storage.
