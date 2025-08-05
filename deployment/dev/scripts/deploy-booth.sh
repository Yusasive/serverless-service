#!/bin/bash

# Configuration
STAGE=${1:-dev}
REGION=${2:-us-east-1}
ENVIRONMENT=${3:-local}

echo "Deploying booth-service..."

# Navigate to service directory
cd services/booth-service

if [ "$ENVIRONMENT" = "aws" ]; then
    # Deploy to AWS using serverless
    TMP_DEPLOY_LOG=$(mktemp)
    serverless deploy \
        --config serverless.aws.yml \
        --stage $STAGE \
        --region $REGION \
        --verbose 2>&1 | tee "$TMP_DEPLOY_LOG"

    DEPLOY_OUTPUT=$(cat "$TMP_DEPLOY_LOG")

    BASE_URL=$(echo "$DEPLOY_OUTPUT" | sed -n 's/^[[:space:]]*HttpApiUrl:[[:space:]]*//p')
    echo "Base URL: $BASE_URL"

    PARAM_NAME="/litf-${STAGE}/booth-service/base-url"

    if [ -n "$BASE_URL" ]; then
        # Create JSON payload for AWS SSM
        SSM_PAYLOAD="{\"Name\":\"$PARAM_NAME\",\"Value\":\"$BASE_URL\",\"Type\":\"String\",\"Overwrite\":true}"
        
        aws ssm put-parameter --cli-input-json "$SSM_PAYLOAD" --overwrite
        echo "✅ Updated booth service URL in SSM Parameter Store: $BASE_URL"

    else
        echo "⚠️ Warning: Could not extract base URL from deployment output"
        echo "Deployment output:"
        echo "$DEPLOY_OUTPUT"
    fi
fi

# Return to root directory
cd ../.. 