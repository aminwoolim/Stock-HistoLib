# 📈 Stock Analytics Learning Platform (AWS Serverless)

This project is an AWS-powered, serverless stock analysis platform that processes historical stock price data, computes key financial statistics, and explains what each statistic means in clear, beginner-friendly language so users can learn while exploring the data.

---

## 🧠 What This Project Does

- Ingests historical stock data (CSV) stored in Amazon S3  
- Uses AWS Lambda to calculate summary statistics such as:
  - Average closing price  
  - Daily volatility  
  - Highest and lowest prices  
- Stores computed results in DynamoDB  
- Exposes a REST API via API Gateway to retrieve stock summaries  
- Serves a static web UI that displays both statistics and plain-English explanations  
- Automatically deploys frontend updates using GitHub, CodePipeline, and CodeBuild  

This project blends cloud-native development with data science fundamentals while remaining free-tier friendly.

---

## 🏗️ Architecture Overview

### Backend
- **Amazon S3** – Stores raw stock data files  
- **AWS Lambda** – Processes data and computes statistics  
- **Amazon DynamoDB** – Persists computed summaries and metadata  
- **Amazon API Gateway** – REST endpoints for querying results  

### Frontend
- Static website built with HTML, CSS, and JavaScript  
- Hosted on **Amazon S3**  
- Delivered globally via **Amazon CloudFront**  

### CI/CD
- **GitHub** – Source of truth  
- **AWS CodePipeline** – Orchestrates deployments  
- **AWS CodeBuild** – Builds and deploys site assets to S3 and invalidates CloudFront cache  

---

## 🔄 How Updates Work

This project follows a GitOps-style workflow:

1. All code changes are made locally in the GitHub repository  
2. Changes are committed and pushed to GitHub  
3. CodePipeline automatically triggers  
4. CodeBuild deploys frontend files to S3 and invalidates CloudFront  
5. Updated changes are served via the CloudFront distribution  

> ⚠️ Edits made directly in the AWS Console (for example, Lambda code) are not tracked in GitHub and may be overwritten by the pipeline.

---

## 🌐 Frontend Behavior

- The UI fetches stock summaries from API Gateway  
- Each statistic is displayed with:
  - A readable label  
  - The numeric value  
  - A short explanation of what it represents  
- Versioned assets (`?v=x.y.z`) are used to prevent browser caching issues  

---

## 🛠️ Technologies Used

- AWS Lambda  
- Amazon S3  
- Amazon DynamoDB  
- Amazon API Gateway  
- Amazon CloudFront  
- AWS CodePipeline  
- AWS CodeBuild  
- Amazon CloudWatch  
- JavaScript, HTML, CSS  
- Python (data processing)  

---

## 🎯 Why This Project Exists

This project was built to:
- Practice AWS Developer Associate concepts  
- Learn serverless data processing patterns  
- Demonstrate CI/CD pipelines in AWS  
- Make financial statistics approachable for beginners  
- Show how cloud services support data science workflows  

---

## 🚀 Future Enhancements

- Beginner vs advanced learning modes  
- Expanded metric glossary and explanations  
- Step Functions for multi-stage processing  
- Authentication with Amazon Cognito  
- Data visualization dashboards  
- Streaming or near-real-time data ingestion  

---

## 🧩 Key Takeaway

This project is not just about computing stock statistics — it is about teaching what those statistics mean using scalable, serverless AWS infrastructure.

