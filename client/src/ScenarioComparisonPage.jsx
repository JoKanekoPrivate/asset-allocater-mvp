import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function ScenarioComparisonPage() {
  // 1. 状態管理
  // 資産配分の状態
  const [allocations, setAllocations] = useState({
    jpStock: 30,
    usStock: 40,
    bond: 20,
    cash: 10,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // シナリオ設定（固定値）
  const scenarioConfigs = [
    {
      scenarioName: "base",
      expectedReturns: [0.05, 0.07, 0.02, 0.005],
      volatilities: [0.18, 0.2, 0.06, 0.01],
    },
    {
      scenarioName: "bear",
      expectedReturns: [-0.08, -0.1, 0.01, 0.005],
      volatilities: [0.28, 0.3, 0.08, 0.01],
    },
    {
      scenarioName: "high_vol",
      expectedReturns: [0.03, 0.04, 0.015, 0.005],
      volatilities: [0.35, 0.38, 0.1, 0.01],
    },
  ];

  // 資産間の相関係数（固定値）
  const correlations = [
    [1.0, 0.6, 0.2, 0.0],
    [0.6, 1.0, 0.3, 0.0],
    [0.2, 0.3, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];

  // 合計値の計算
  let total = 0;
  for (const value of Object.values(allocations)) {
    total += value; // total = total + value と同じ
  }

  // 2. イベントハンドラー
  // 入力値の変更処理の関数化
  const handleChange = (asset, value) => {
    // Functional Updateを使用
    // Reactが最新の状態（prev）を提供してくれるので、それを基に新しい状態を計算
    setAllocations((prev) => ({
      // スプレッド構文で前の状態を展開
      ...prev,
      // 変更された資産の値を更新（数値に変換）
      // スプレッド構文に対する固有のキーバリューの追加（上書き）方法
      [asset]: Number(value),
    }));
  };

  // 計算実行
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // バリデーション
    if (total !== 100) {
      setError("合計を100%にしてください");
      return;
    }

    setLoading(true);

    const weights = [
      allocations.jpStock / 100,
      allocations.usStock / 100,
      allocations.bond / 100,
      allocations.cash / 100,
    ];

    try {
      const response = await fetch("/api/portfolio/scenario-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weights,
          scenarios: scenarioConfigs,
          correlations,
        }),
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      setError("計算に失敗しました");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. ローディング
  if (loading) {
    return (
      <div>
        <h1>Scenario Comparison</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  // 5. 返り値構築
  return (
    <div>
      <h1>Scenario Comparison</h1>

      {/* 入力フォーム */}
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

      {/* 結果表示 */}
      {results && (
        <div>
          <h2>結果</h2>

          {/* Expected Return グラフ */}
          <h3>期待リターン</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results}>
              <XAxis dataKey="scenarioName" />
              <YAxis />
              <Tooltip formatter={(value) => (value * 100).toFixed(2) + "%"} />
              <Legend />
              <Bar dataKey="expectedReturn" fill="#646cffaa" />
            </BarChart>
          </ResponsiveContainer>

          {/* Risk グラフ */}
          <h3>リスク</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results}>
              <XAxis dataKey="scenarioName" />
              <YAxis />
              <Tooltip formatter={(value) => (value * 100).toFixed(2) + "%"} />
              <Legend />
              <Bar dataKey="risk" fill="#61dafbaa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <Link to="/">← Home</Link>
      </div>
    </div>
  );
}
