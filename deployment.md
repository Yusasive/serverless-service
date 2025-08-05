# 🚀 CI/CD Pipeline Setup Guide for a New Service

This guide outlines how to configure GitHub Actions to deploy a new microservice using the existing CI/CD structure.

---

## 🧱 Prerequisites

Before integrating a new service into the CI/CD pipeline:

1. **Folder Structure**: Your service should be located at:
   ```
   services/<your-new-service>/
   ```
2. **Serverless Config**:
   - The folder must contain a `serverless.yml` or a named configuration file like `serverless.ireland.yml`.
   - Ensure required AWS Lambda functions (e.g. migration or seeders) are defined if needed.

3. **Deployment Ready**:
   - The service can be deployed independently using the Serverless CLI:
     ```bash
     sls deploy --stage <env> --config serverless.ireland.yml
     ```

4. **Ensure Secrets Are Set** in GitHub:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `SERVERLESS_ACCESS_KEY`

---

## ⚙️ Step 1: Create Workflow File for the Service

Create a new workflow file in `.github/workflows/<your-new-service>.yml`.

### Template:

```yaml
name: <Your New Service> CI/CD

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      aws_region:
        required: false
        type: string
        default: "eu-west-1"

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      ENVIRONMENT: ${{ inputs.environment }}
      AWS_REGION: ${{ inputs.aws_region }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Serverless
        run: npm install -g serverless

      - name: Install dependencies
        working-directory: services/<your-new-service>
        run: npm install

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Validate Serverless config
        working-directory: services/<your-new-service>
        env:
          SERVERLESS_ACCESS_KEY: ${{ secrets.SERVERLESS_ACCESS_KEY }}
        run: sls print --stage ${{ env.ENVIRONMENT }} --config serverless.ireland.yml

      - name: Deploy to AWS
        working-directory: services/<your-new-service>
        env:
          SERVERLESS_ACCESS_KEY: ${{ secrets.SERVERLESS_ACCESS_KEY }}
        run: sls deploy --stage ${{ env.ENVIRONMENT }} --config serverless.ireland.yml
```

---

## ⚙️ Step 2: Add Workflow to the Main Pipeline

Edit `.github/workflows/main.yml` and add the following job under `jobs:`:

```yaml
  <your-new-service-name>:
    needs: [setup]
    if: |
      github.event_name == 'push' &&
      (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/dev' || github.ref == 'refs/heads/test') &&
      contains(needs.setup.outputs.changed_files, 'services/<your-new-service>')
    uses: ./.github/workflows/<your-new-service>.yml
    with:
      environment: ${{ needs.setup.outputs.environment }}
      aws_region: ${{ needs.setup.outputs.aws_region }}
    secrets: inherit
```

---

## ✅ Step 3: Validate the Setup

After pushing your changes:

1. Make a commit affecting `services/<your-new-service>/` folder.
2. Push to `main`, `dev`, or `test` branch.
3. Watch the GitHub Actions tab to ensure:
   - `setup` job runs.
   - Your service-specific job is triggered conditionally based on changed files.
   - Deployment and validation pass successfully.

---

## 🧪 Optional: Add DB Migration or Seeder Steps

If your service has a DB migration or seeder Lambda function:

```yaml
- name: Run DB Migrations
  run: |
    aws lambda invoke       --function-name <your-new-service>-${{ inputs.environment }}-runMigration       --invocation-type RequestResponse       --cli-binary-format raw-in-base64-out       invocation-result.json
    cat invocation-result.json
```

---

## 🧼 Cleanup and Consistency Tips

- Use consistent naming (`serverless.ireland.yml`, `runMigration`).
- Ensure each service uses the correct `working-directory`.
- Ensure `.gitignore` doesn’t exclude any required files.

---

## 📚 Summary

| Task                        | Location                                      |
|-----------------------------|-----------------------------------------------|
| New service config          | `services/<your-service>/`                   |
| New workflow file           | `.github/workflows/<your-service>.yml`       |
| Main pipeline job entry     | `.github/workflows/main.yml`                 |
| Deployment config template  | Uses `serverless deploy` with correct config |