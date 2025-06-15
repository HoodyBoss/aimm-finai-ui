# AIMM-FinAI UI

A modern React-based dashboard for Financial Sentiment Analysis using AI models.

## Features
- **Multi-Model Support**: Choose from 11 different AI models
- **Real-time Analysis**: Analyze financial text sentiment in real-time
- **Model Comparison**: Compare results across all available models
- **Performance Metrics**: View detailed model performance information
- **Alert System**: Set up sentiment monitoring alerts
- **Stock Analysis**: Analyze specific stock symbols
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3456
```

## API Integration

Make sure the AIMM-FinAI API is running on `http://localhost:4875` before using the UI.

## Available Scripts

- `npm run dev` - Start development server on port 3456
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **React 18** - UI Framework
- **Next.js 14** - React Framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **FastAPI Backend** - API Integration

## Model Support

Supports 11 financial sentiment analysis models including:
- FinBERT variants
- DistilRoBERTa models
- DeBERTa v3
- Chinese language models

## Usage

1. Enter financial text in the analysis box
2. Select your preferred AI model
3. Click "Analyze Sentiment" for single analysis
4. Use "Compare Models" to see results from all models
5. Set up alerts for continuous monitoring
6. Analyze specific stocks by symbol

## Port Configuration

The UI runs on port 3456 to avoid conflicts with other applications.

## 📋 Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- AIMM-FinAI Backend running on port 4875

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install additional Tailwind plugins:**
   ```bash
   npm install @tailwindcss/forms
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3456
   ```

## 🏗️ Project Structure

```
aimm-finai-ui/
├── react_frontend_example.tsx    # Main dashboard component
├── index.tsx                     # Entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind CSS config
└── README.md                    # This file
```

## 🤖 Supported AI Models

1. **ProsusAI/finbert** - โมเดลหลัก FinBERT
2. **yiyanghkust/finbert-tone** - FinBERT สำหรับ tone analysis
3. **StephanAkkerman/FinTwitBERT-sentiment** - FinTwitBERT สำหรับ sentiment
4. **mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis** - DistilRoBERTa (98.23% accuracy)
5. **Sigma/financial-sentiment-analysis** - Sigma financial sentiment (99.24% accuracy)
6. **mrm8488/deberta-v3-ft-financial-news-sentiment-analysis** - DeBERTa v3 (99.40% accuracy)
7. **ahmedrachid/FinancialBERT-Sentiment-Analysis** - FinancialBERT
8. **nickmuchi/distilroberta-finetuned-financial-text-classification** - DistilRoBERTa
9. **AnkitAI/distilbert-base-uncased-financial-news-sentiment-analysis** - DistilBERT
10. **bardsai/finance-sentiment-zh-base** - สำหรับภาษาจีน
11. **yiyanghkust/finbert-tone-chinese** - FinBERT ภาษาจีน

## 🎯 API Endpoints

- `GET /` - API information
- `GET /models` - Available models
- `GET /models/performance` - Model performance data
- `POST /analyze` - Analyze single text
- `POST /analyze-multiple` - Analyze multiple texts
- `POST /compare-models` - Compare all models

## 🔧 Configuration

### Backend URL
Default: `http://localhost:4875`

To change, modify `API_BASE` in `react_frontend_example.tsx`

### CORS Settings
Configured in `next.config.js` for seamless API communication

## 🎨 UI Components

### 1. Sentiment Analysis
- Text input for analysis
- Model selection dropdown
- Analysis results display
- Model comparison feature

### 2. Stock Analysis
- Stock ticker selection
- Real-time stock data
- Sentiment analysis of financial news

### 3. Alert Management
- Create subscriptions
- View recent alerts
- Manual alert checking

### 4. Model Performance
- Accuracy metrics
- Speed comparisons
- Recommendations

## 📱 Usage

1. **Start Backend:**
   ```bash
   cd ../aimm-finai
   python main.py
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   ```
   http://localhost:3456
   ```

4. **Use Dashboard:**
   - Enter financial text
   - Select AI model
   - View analysis results
   - Compare multiple models

## 🔍 Troubleshooting

### Common Issues

1. **TypeScript Errors:**
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

2. **API Connection Issues:**
   - Check backend is running on port 4875
   - Verify CORS settings
   - Check firewall settings

3. **Missing Dependencies:**
   ```bash
   npm install
   npm install lucide-react
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙋‍♂️ Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Contact AIMM team

### 📋 Port Information

- **Backend**: `http://localhost:4875`
- **Frontend**: `http://localhost:3456`