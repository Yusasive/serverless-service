#!/bin/bash

# LITF Frontend Deployment Script
# This script deploys both client UI and admin UI to shared infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get stage from command line argument, default to dev
STAGE=${1:-dev}
REGION=${2:-eu-west-1}

print_status "Starting deployment for stage: $STAGE in region: $REGION"

# Check if required tools are installed
if ! command -v serverless &> /dev/null; then
    print_error "Serverless Framework is not installed. Please install it first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Step 1: Deploy Client UI Service (creates shared infrastructure)
# print_status "=== Step 1: Deploying Client UI Service ==="
# cd services/client-ui-service

# # Install dependencies if node_modules doesn't exist
# if [ ! -d "node_modules" ]; then
#     print_status "Installing dependencies for Client UI..."
#     npm install
# fi

# # Build the application
# print_status "Building Client UI..."
# node build.js --stage="$STAGE"

# # Deploy using serverless
# print_status "Deploying Client UI to AWS..."
# serverless deploy --stage "$STAGE" --region "$REGION"

# # Deploy client UI files to S3
# print_status "Deploying Client UI files to S3..."
# echo "Y" | serverless client deploy --stage "$STAGE" --region "$REGION"

# print_success "Client UI Service deployed successfully!"

# Get CloudFront and S3 bucket information
# for i in {1..12}; do
#     CLOUDFRONT_ID=$(aws cloudformation list-exports --query "Exports[?Name=='litf-${STAGE}-CloudFrontDistributionId'].Value" --output text --region "$REGION")
#     BUCKET=$(aws cloudformation list-exports --query "Exports[?Name=='litf-${STAGE}-FrontendBucketName'].Value" --output text --region "$REGION")
#     if [[ -n "$CLOUDFRONT_ID" && -n "$BUCKET" ]]; then
#         break
#     fi
#     print_status "Waiting for CloudFormation exports to be available... (retry $i)"
#     sleep 5
# done

# if [ -z "$CLOUDFRONT_ID" ] || [ -z "$BUCKET" ]; then
#     print_error "Could not retrieve CloudFront ID or S3 bucket name from CloudFormation exports"
#     exit 1
# fi

# print_status "Using CloudFront ID: $CLOUDFRONT_ID"
# print_status "Using S3 Bucket: $BUCKET"

# Step 2: Deploy Admin UI Service to the same infrastructure
print_status "=== Step 2: Deploying Admin UI Service ==="
cd services/admin-ui-service
# cd ../admin-ui-service


# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies for Admin UI..."
    npm install
fi

# Build the application
print_status "Building Admin UI..."
node build.js --stage="$STAGE"

# Deploy admin UI files to S3
print_status "Deploying Admin UI files to S3..."
aws s3 sync dist/ s3://litf-dev-admin-frontend/ --delete

print_success "Admin UI Service deployed successfully!"

# Create CloudFront invalidation for both client and admin
# print_status "Creating CloudFront invalidation..."
# aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" "/admin/*" > /dev/null 2>&1
