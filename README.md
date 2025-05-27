# Zustand Example

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

Zustand is a fast state manager with a user-friendly API.
This example implements a basic store and list using the `zustand` library.

## 🚀 How to use

- Install with `yarn` or `npm install`.
- Run `yarn start` or `npm run start` to try it out.

## 📝 Notes

- [Zustand docs](https://github.com/pmndrs/zustand)

## 🔍 Vector Store Setup

This repository includes a GitHub Action that creates a vector store of the codebase on every push to the `main` branch. The vector store allows for semantic search and retrieval of code snippets. We use AWS Bedrock for generating embeddings.

### Setup Required

1. Add the following AWS Bedrock secrets to your GitHub repository:

   - Go to your repository on GitHub
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret" for each of these:

     - Name: `AWS_ACCESS_KEY_ID`
     - Value: Your AWS access key with Bedrock permissions

     - Name: `AWS_SECRET_ACCESS_KEY`
     - Value: Your AWS secret key

     - Name: `AWS_REGION` (optional, defaults to us-east-1)
     - Value: The AWS region where Bedrock is available (e.g., us-east-1, us-west-2)

2. Ensure your AWS account has access to Amazon Bedrock and the specific model (default is "cohere.embed-english-v3"). You may need to request model access in the AWS Bedrock console.

3. The workflow will run automatically on every push to the `main` branch, creating a vector store that is saved as a GitHub artifact.

4. To download the vector store artifact:
   - Go to the Actions tab in your repository
   - Click on the latest workflow run
   - Scroll down to the Artifacts section
   - Download the "vector-store" artifact
