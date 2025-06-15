import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Bell, RefreshCw, Activity, BarChart } from 'lucide-react';

const StockSentimentDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [analysisText, setAnalysisText] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('FSX');
  const [selectedModel, setSelectedModel] = useState('ProsusAI/finbert');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [stockAnalysis, setStockAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [modelPerformance, setModelPerformance] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:4875';

  // ตรวจสอบสถานะ API
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/`);
      const data = await response.json();
      setApiHealth({ status: 'healthy', message: data.message });
    } catch (error) {
      setApiHealth({ status: 'error', message: error.message });
    }
  };

  // ดึงรายชื่อโมเดลที่ใช้ได้
  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${API_BASE}/models`);
      const data = await response.json();
      setAvailableModels(data.available_models || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // ดึงข้อมูลประสิทธิภาพโมเดล
  const fetchModelPerformance = async () => {
    try {
      const response = await fetch(`${API_BASE}/models/performance`);
      const data = await response.json();
      setModelPerformance(data);
    } catch (error) {
      console.error('Error fetching model performance:', error);
    }
  };

  // วิเคราะห์ sentiment ข้อความ
  const analyzeSentiment = async () => {
    if (!analysisText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: analysisText, 
          model_name: selectedModel
        })
      });
      
      const data = await response.json();
      setSentimentResult(data);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setLoading(false);
    }
  };

  // วิเคราะห์หุ้น
  const analyzeStock = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/analyze/stock/${selectedTicker}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      setStockAnalysis(data);
    } catch (error) {
      console.error('Error analyzing stock:', error);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูล alert ล่าสุด
  const fetchRecentAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE}/alerts/recent?limit=10`);
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // สร้าง subscription ตัวอย่าง
  const createExampleSubscription = async () => {
    const subscription = {
      user_id: `user_${Date.now()}`,
      email: 'demo@example.com',
      alert_configs: [
        {
          ticker: 'FSX',
          positive_threshold: 0.2,
          negative_threshold: -0.2,
          enabled: true
        },
        {
          ticker: 'GOOGL',
          positive_threshold: 0.3,
          negative_threshold: -0.3,
          enabled: true
        }
      ]
    };

    try {
      const response = await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      
      const data = await response.json();
      alert('Subscription created successfully!');
      console.log('Subscription created:', data);
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  // ตรวจสอบ alert ด้วยตนเอง
  const checkAlertsManually = async () => {
    if (subscriptions.length === 0) {
      alert('ไม่มี subscription ให้ตรวจสอบ กรุณาสร้าง subscription ก่อน');
      return;
    }

    try {
      const userId = subscriptions[0].user_id;
      const response = await fetch(`${API_BASE}/alerts/check/${userId}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      alert(`ตรวจสอบแล้ว พบ ${data.alerts_found} alerts`);
      fetchRecentAlerts(); // อัพเดต alert list
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  };

  // ฟังก์ชันสำหรับแสดง sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  // ฟังก์ชันสำหรับแสดงสี sentiment
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // เปรียบเทียบผลลัพธ์จากทุกโมเดล
  const compareModels = async () => {
    if (!analysisText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/compare-models?text=${encodeURIComponent(analysisText)}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      setCompareResults(data);
      setShowComparison(true);
    } catch (error) {
      console.error('Error comparing models:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    fetchRecentAlerts();
    fetchAvailableModels();
    fetchModelPerformance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📈 Stock Sentiment Alert Dashboard
          </h1>
          <p className="text-gray-600">
            ระบบเตือนภัยราคาหุ้นตาม Sentiment Analysis
          </p>
        </div>

        {/* API Health Status */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg border-l-4 ${
            apiHealth?.status === 'healthy' 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              <span className="font-medium">
                API Status: {apiHealth?.status || 'Unknown'}
              </span>
              {apiHealth?.model_status && (
                <span className="ml-4 text-sm">
                  Model: {apiHealth.model_status}
                </span>
              )}
              <button
                onClick={checkApiHealth}
                className="ml-auto p-1 hover:bg-white rounded"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">🧠 วิเคราะห์ Sentiment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ข้อความที่ต้องการวิเคราะห์
                </label>
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  placeholder="พิมพ์ข้อความทางการเงินที่ต้องการวิเคราะห์..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกโมเดล AI
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model.split('/')[1] || model}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-xs text-gray-500">
                  {modelPerformance?.model_details?.[selectedModel]?.description}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticker Symbol
                </label>
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FSX">FSX</option>
                  <option value="CCET">CCET</option>
                  <option value="JMART">JMART</option>
                  <option value="ADVANC">ADVANC</option>
                  <option value="VGI">VGI</option>
                  <option value="PTT">PTT</option>
                  <option value="DELTA">DELTA</option>
                  <option value="SIMULATION">SIMULATION</option>
                  <option value="PCC">PCC</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={analyzeSentiment}
                  disabled={loading || !analysisText.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  วิเคราะห์ Sentiment
                </button>
                
                <button
                  onClick={compareModels}
                  disabled={loading || !analysisText.trim()}
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  เปรียบเทียบโมเดล
                </button>
              </div>
              
              {sentimentResult && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">ผลการวิเคราะห์:</h3>
                  <div className="flex items-center mb-2">
                    {getSentimentIcon(sentimentResult.label?.toLowerCase())}
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(sentimentResult.label?.toLowerCase())}`}>
                      {sentimentResult.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Confidence: {(sentimentResult.score * 100).toFixed(1)}%</p>
                    <p>Model: {sentimentResult.model_used}</p>
                  </div>
                </div>
              )}
              
              {showComparison && compareResults && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">เปรียบเทียบโมเดล:</h3>
                    <button
                      onClick={() => setShowComparison(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                                         {Object.entries(compareResults.model_comparison).map(([modelName, result]) => (
                       <div key={modelName} className="p-3 border rounded-lg bg-gray-50">
                         <div className="flex items-center justify-between">
                           <div className="flex-1">
                             <div className="font-medium text-sm truncate">
                               {modelName.split('/')[1] || modelName}
                             </div>
                             <div className="text-xs text-gray-500 truncate">
                               {modelName}
                             </div>
                           </div>
                           <div className="flex items-center space-x-2">
                             {result.error ? (
                               <span className="text-red-500 text-xs">Error</span>
                             ) : (
                               <>
                                 <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(result.label?.toLowerCase())}`}>
                                   {result.label}
                                 </span>
                                 <span className="text-xs text-gray-600">
                                   {(result.score * 100).toFixed(1)}%
                                 </span>
                               </>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stock Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📈 วิเคราะห์หุ้น</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกหุ้นที่ต้องการวิเคราะห์
                </label>
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FSX">FSX</option>
                  <option value="CCET">CCET</option>
                  <option value="JMART">JMART</option>
                  <option value="ADVANC">ADVANC</option>
                  <option value="VGI">VGI</option>
                  <option value="PTT">PTT</option>
                  <option value="DELTA">DELTA</option>
                  <option value="SIMULATION">SIMULATION</option>
                  <option value="PCC">PCC</option>
                </select>
              </div>
              
              <button
                onClick={analyzeStock}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                วิเคราะห์หุ้น
              </button>
              
              {stockAnalysis && (
                <div className="mt-4 space-y-4">
                  {/* Stock Price Info */}
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold mb-2">ข้อมูลราคาหุ้น</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">ราคา</p>
                        <p className="font-semibold text-lg">
                          ${stockAnalysis.stock_data?.price?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">การเปลี่ยนแปลง</p>
                        <p className={`font-semibold ${
                          stockAnalysis.stock_data?.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stockAnalysis.stock_data?.change?.toFixed(2)} 
                          ({stockAnalysis.stock_data?.change_percent?.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sentiment Analysis */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">การวิเคราะห์ Sentiment</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Sentiment Score:</span>
                        <span className={`font-semibold ${
                          stockAnalysis.sentiment_analysis?.sentiment_score > 0.1 
                            ? 'text-green-600' 
                            : stockAnalysis.sentiment_analysis?.sentiment_score < -0.1 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {stockAnalysis.sentiment_analysis?.sentiment_score?.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ข่าวที่วิเคราะห์:</span>
                        <span>{stockAnalysis.sentiment_analysis?.news_analyzed} ข่าว</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Confidence:</span>
                        <span>{(stockAnalysis.sentiment_analysis?.confidence * 100)?.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alert Management Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">🔔 การจัดการ Alert</h2>
            <div className="space-x-2">
              <button
                onClick={createExampleSubscription}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                สร้าง Subscription ตัวอย่าง
              </button>
              <button
                onClick={checkAlertsManually}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                ตรวจสอบ Alert
              </button>
              <button
                onClick={fetchRecentAlerts}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                รีเฟรช
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Alert ล่าสุด:</h3>
            {alerts.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                ยังไม่มี Alert ใดๆ
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        alert.action === 'BUY' ? 'bg-green-100' : 
                        alert.action === 'SELL' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {alert.action === 'BUY' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : alert.action === 'SELL' ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {alert.action} {alert.ticker}
                        </div>
                        <div className="text-sm text-gray-600">
                          {alert.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${alert.price?.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: {alert.sentiment_score?.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">📋 วิธีการใช้งาน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">1. วิเคราะห์ Sentiment:</h4>
              <p className="text-gray-600">
                ป้อนข้อความทางการเงินเพื่อวิเคราะห์ว่ามี sentiment เป็นบวก ลบ หรือเป็นกลาง
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. วิเคราะห์หุ้น:</h4>
              <p className="text-gray-600">
                เลือกหุ้นเพื่อดูราคาปัจจุบันและการวิเคราะห์ sentiment จากข่าวล่าสุด
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. สร้าง Subscription:</h4>
              <p className="text-gray-600">
                ตั้งค่าการแจ้งเตือนอัตโนมัติเมื่อ sentiment ของหุ้นเปลี่ยนแปลงตามเงื่อนไขที่กำหนด
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. ติดตาม Alert:</h4>
              <p className="text-gray-600">
                ดู alert ล่าสุดและการแนะนำการซื้อขาย (BUY/SELL) ตาม sentiment analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSentimentDashboard;