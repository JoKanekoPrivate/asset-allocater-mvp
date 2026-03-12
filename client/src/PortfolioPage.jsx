import { useState } from "react";
import { Link } from "react-router-dom";

export function PortfolioPage() {
  // 1. 状態管理
  const [allocations, setAllocations] = useState({
    jpStock: 40,
    usStock: 30,
    bond: 20,
    cash: 10,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1.2 component内の定数定義
  // 合計値の計算
  let total = 0;
  for (const value of Object.values(allocations)) {
    total += value; // total = total + value と同じ
  }

  // 2. イベントハンドラー
  const handleChange = (asset, value) => {
    setAllocations((prev) => ({
      ...prev,
      [asset]: Number(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // バリデーション
    if (total !== 100) {
      setError("合計を100%にしてください");
      return;
    }

    setLoading(true);
    setError("");

    // 資産配分（非固定値）
    const weights = [
      allocations.jpStock / 100,
      allocations.usStock / 100,
      allocations.bond / 100,
      allocations.cash / 100,
    ];

    // 期待リターン（固定値）
    const expectedReturns = [0.05, 0.07, 0.02, 0.005];
    
    // ボラティリティ（固定値）
    const volatilities = [0.18, 0.2, 0.06, 0.01];
    
    // 資産間の相関係数（固定値）
    const correlations = [
      [1.0, 0.6, 0.2, 0.0],
      [0.6, 1.0, 0.3, 0.0],
      [0.2, 0.3, 1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0],
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
          correlations,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError("計算に失敗しました");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };;

  // 3. 副作用処理
  // 4. ローディング
  if (loading) {
    return (
      <div>
        <h1>Portfolio Allocator</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

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
            onChange={(event) => handleChange("jpStock", event.target.value)}
          />
        </div>
        <div>
          <label>米国株 (%): </label>
          <input
            type="number"
            value={allocations.usStock}
            onChange={(event) => handleChange("usStock", event.target.value)}
          />
        </div>
        <div>
          <label>債券 (%): </label>
          <input
            type="number"
            value={allocations.bond}
            onChange={(event) => handleChange("bond", event.target.value)}
          />
        </div>
        <div>
          <label>現金 (%): </label>
          <input
            type="number"
            value={allocations.cash}
            onChange={(event) => handleChange("cash", event.target.value)}
          />
        </div>

        <div>合計: {total}%</div>

        {error && <div>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "計算中..." : "計算"}
        </button>
      </form>

      {result && (
        <div>
          <h2>結果</h2>
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
