from langchain_aws import BedrockEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import os
import glob
import boto3

# Initialize AWS Bedrock client
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.environ.get("AWS_REGION", "us-east-1")
)

# Initialize Bedrock embeddings
# Using Cohere Embed model by default, but you can change to any supported model
embeddings = BedrockEmbeddings(
    client=bedrock_client,
    model_id="cohere.embed-english-v3"  # You can also use "amazon.titan-embed-text-v1" or other models
)

# Get all text files in the repository (excluding .git, node_modules)
files = []
for ext in ['js', 'jsx', 'ts', 'tsx', 'json', 'md', 'yml', 'yaml']:
    files.extend(glob.glob(f'**/*.{ext}', recursive=True))

# Filter out files from directories we want to exclude
files = [f for f in files if not (f.startswith('node_modules/') or f.startswith('.git/'))]

# Read the content of each file
docs = []
for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            docs.append({'content': content, 'metadata': {'source': file_path}})
    except Exception as e:
        print(f'Error reading {file_path}: {e}')

# Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = []
metadatas = []

for doc in docs:
    chunks = text_splitter.split_text(doc['content'])
    texts.extend(chunks)
    metadatas.extend([{'source': doc['metadata']['source']}] * len(chunks))

# Create vector store
vectorstore = Chroma.from_texts(
    texts=texts,
    embedding=embeddings,
    metadatas=metadatas,
    persist_directory='./chroma_db'
)

# Persist the vector store
vectorstore.persist()
print(f'Vector store created with {len(texts)} chunks from {len(docs)} files') 