import { execSync } from 'child_process';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

// Parse command line arguments
function parseArgs() { 
  const args = process.argv.slice(2);
  const stageArg = args.find(arg => arg.startsWith('--stage='));
  const stage = stageArg ? stageArg.split('=')[1] : null;
  return { stage };
}  

async function getSSMParameters() {
  const ssm = new SSMClient({ region: 'eu-west-1' });
  const { stage } = parseArgs();
  const stageEnv = stage || 'dev';
  
  const params = await ssm.send(new GetParametersCommand({
    Names: [
      `/litf-${stageEnv}/base-url`,
      `/litf-${stageEnv}/invoice-cc-email`
    ],
    WithDecryption: true
  }));

  const envVars = {
    VITE_SERVICE_BASE_URL: params.Parameters.find(p => p.Name.includes('base-url'))?.Value,
    VITE_ENVIRONMENT: stageEnv,
    VITE_INVOICE_CC_EMAILS: params.Parameters.find(p => p.Name.includes('invoice-cc-email'))?.Value
  };

  return envVars;
} 

async function build() {
  try {
    // Get SSM parameters
    const envVars = await getSSMParameters();
    
    // Set environment variables for the build process
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
    
    // Run build command
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 