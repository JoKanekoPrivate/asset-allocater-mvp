import { useState } from "react";
import { Link } from "react-router-dom";

export function PortfolioPage() {
  // 1. 状態管理
  const [allocations, setAllocations] = useState({
    jpStock: 40,
    usStock: 30,
    bond: 20,
    cash: 10
  });
  const [result, setResult] = useState(null);

  // 2. イベントハンドラー
  const handleChange = (asset, value) => {
    setAllocations(prev => ({
      ...prev,
      [asset]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const weights = [
      allocations.jpStock / 100,
      allocations.usStock / 100,
      allocations.bond / 100,
      allocations.cash / 100
    ];

    const expectedReturns = [0.05, 0.07, 0.02, 0.005];
    const volatilities = [0.18, 0.20, 0.06, 0.01];
    const correlations = [
      [1.0, 0.6, 0.2, 0.0],
      [0.6, 1.0, 0.3, 0.0],
      [0.2, 0.3, 1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0]
    ];

    try {
      const response = await fetch("/api/portfolio/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weights,
          expectedReturns,
          volatilities,
          correlations
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 3. 副作用処理
  // 4. ローディング
  // 5. 返り値構築
  return (
    <div>
      <h1>Portfolio Allocator</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>日本株 (%): </label>
          <input
            type="number"
            value={allocations.jpStock}
            onChange={(e) => handleChange("jpStock", e.target.value)}
          />
        </div>
        <div>
          <label>米国株 (%): </label>
          <input
            type="number"
            value={allocations.usStock}
            onChange={(e) => handleChange("usStock", e.target.value)}
          />
        </div>
        <div>
          <label>債券 (%): </label>
          <input
            type="number"
            value={allocations.bond}
            onChange={(e) => handleChange("bond", e.target.value)}
          />
        </div>
        <div>
          <label>現金 (%): </label>
          <input
            type="number"
            value={allocations.cash}
            onChange={(e) => handleChange("cash", e.target.value)}
          />
        </div>
        
        <button type="submit">計算</button>
      </form>

      {result && (
        <div>
          <h2>計算結果</h2>
          <p>期待リターン: {(result.expectedReturn * 100).toFixed(2)}%</p>
          <p>リスク: {(result.risk * 100).toFixed(2)}%</p>
        </div>
      )}

      <div>
        <Link to="/">← Home</Link>
      </div>
    </div>
  );
}
