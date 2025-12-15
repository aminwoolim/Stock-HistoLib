# 📈 Stock Analytics — Serverless AWS Data Pipeline + Dashboard

A lightweight, serverless analytics platform that ingests stock price CSVs, 
computes key financial metrics, and displays them through an interactive 
CloudFront-hosted UI. Deployed automatically via GitHub → CodePipeline → CodeBuild → S3.


## 🚀 Features

- Automated ETL Pipeline
  - Upload CSVs → S3 triggers Lambda to parse + compute:
    - Volatility, CAGR, moving averages, annual returns, drawdowns, etc.
  - Results stored in DynamoDB.
- REST API (API Gateway + Lambda)
  - /tickers — list processed tickers
  - /stats/{ticker} — detailed analytics
  - /hist/{ticker} — historical closing prices
- Interactive Frontend
  - Hosted in S3, globally delivered via CloudFront
  - Grid of stock “cards” with hover glow
  - On-click modal with charts (Chart.js) + yearly stats
  - Cache-busting + long-cache optimization
- Full CI/CD
  - GitHub → CodePipeline → CodeBuild
  - Auto-syncs UI files to S3
  - Auto-invalidation of CloudFront caches



## 🧱 Architecture

AWS Services Used:

```S3 · Lambda · DynamoDB · API Gateway · CloudFront · CodePipeline · CodeBuild · IAM · CloudWatch```

Workflow:

```CSV Upload → S3 Event → Lambda ETL → DynamoDB → API → Frontend → CloudFront```


## 🗂️ Repository Structure

```.
├── index.html           # Main UI template (loads app.js + styles.css)
├── app.js               # Frontend logic, API calls, charts, modal controls
├── styles.css           # Custom theme (dark UI, grid, glow effects)
├── config.json          # (Optional) API base URL, auto-generated
├── buildspec.yml        # CodeBuild deploy script
├── README.md            # This file
└── /assets (optional)   # Logos or images
```



## ▶️ Usage

1. Upload TICKER.csv (e.g., AAPL.csv) to the data S3 bucket
2.	Lambda automatically processes it and updates DynamoDB
3.	Visit the CloudFront URL to view updated cards & charts
4.	Push UI changes to GitHub → pipeline deploys automatically



## 📌 Example Analytics
- Price change %
- Daily returns / volatility
- Best & worst day
- Max drawdown
- CAGR
- MA20 / MA50
- Per-year returns + volatility



## 🛠️ Requirements
- AWS account with access to:
- S3 buckets (data + site)
- Lambda functions
- DynamoDB table (StockStats)
- API Gateway REST API
- CloudFront distribution
- CodePipeline + CodeBuild
- GitHub repo connected via CodeStar Connections



## 📄 License

MIT


