# ExpressのレイヤードアーキテクチャではService層に相当するファイル

# 線形代数を使用するためのモジュール（今回は行列計算に使用）
# LinearAlgebraはJuliaの標準ライブラリ（npm installのようなインストール不要）
# JSの場合: npm install mathjs が必要（外部パッケージ依存）
using LinearAlgebra

#=
# このファイルの式に必要な入力値
- weights: 各資産の配分比率
- expected_returns: 各資産の期待リターン
- volatilities: 各資産のボラティリティ（標準偏差=値のバラツキ）
- correlations: 各資産間の関係性、相関係数行列（相関係数=値同士の相関の大きさ（-1〜1））

# このファイルの式の説明
- covariance_matrix: 各資産リスク間の関係性、共分散行列（共分散=相関係数（動く方向）× ボラティリティ（動く大きさ）の積）
- リターン: 重みつき和（R = 重み * 期待リターン = Σ(wi * Ri)）
- リスク: 重みつき和の分散（Var(R) = Var（重み * 期待リターン）=Var(Σ(wi * Ri)) = ΣΣ(wi * wj * Cov(Ri, Rj))）
- 式変形の過程で、Cov(Ri, Rj)（共分散行列（covariance_matrix））が必要になる

# Juliaの標準機能で使用しているもの（JSでは外部ライブラリまたは手書きが必要）
- dot(a, b): 内積（JSでは reduce + ループが必要）
- diagm(v): ベクトルから対角行列を生成（JSには該当機能なし）
- A * B: 行列積（JSでは二重forループが必要）
- weights': 転置（JSには演算子なし）
- sqrt(): 平方根（JSではMath.sqrt()）
- zeros(n, n): ゼロ行列生成（JSでは Array(n).fill().map(() => Array(n).fill(0))）
- Matrix{Float64}(I, n, n): 単位行列（JSには該当機能なし）
=#

#=
期待リターンを計算
E(Rp) = Σ(wi × μi)

Julia: dot(w, μ) ← 標準ライブラリの内積関数で1行
JSの場合: 
  function calculateExpectedReturn(weights, expectedReturns) {
    const n = weights.length;
    let expectedReturn = 0;
    for (let i = 0; i < n; i++) {
      expectedReturn += weights[i] * expectedReturns[i];
    }
    return expectedReturn;
  }
=#
function calculate_expected_return(weights::Vector{Float64}, expected_returns::Vector{Float64})
  return dot(weights, expected_returns)
end

#=
共分散行列を構築
Σ = diag(σ) × ρ × diag(σ)

Julia: diagm（対角行列生成）と行列積で1行
JSの場合:
  function buildCovarianceMatrix(volatilities, correlations) {
    const n = volatilities.length;
    const covMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        covMatrix[i][j] = correlations[i][j] * volatilities[i] * volatilities[j];
      }
    }
    return covMatrix;
  }
=#
function build_covariance_matrix(volatilities::Vector{Float64}, correlations::Matrix{Float64})
  σ = diagm(volatilities)
  return σ * correlations * σ
end

#=
リスク（標準偏差）を計算
σp = √(w^T × Σ × w)

Julia: 転置(')と行列積(*)で1行
JSの場合:
  function calculateRisk(weights, covarianceMatrix) {
    const n = weights.length;
    const sigmaW = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sigmaW[i] += covarianceMatrix[i][j] * weights[j];
      }
    }
    let variance = 0;
    for (let i = 0; i < n; i++) {
      variance += weights[i] * sigmaW[i];
    }
    return Math.sqrt(variance);
  }
=#
function calculate_risk(weights::Vector{Float64}, covariance_matrix::Matrix{Float64})
  variance = weights' * covariance_matrix * weights
  return sqrt(variance)
end

#=
ポートフォリオ評価のメイン関数
=#
function evaluate_portfolio(weights, expected_returns, volatilities, correlations)
  # 共分散行列を構築
  cov_matrix = build_covariance_matrix(volatilities, correlations)

  # 期待リターン計算
  expected_return = calculate_expected_return(weights, expected_returns)

  # リスク計算
  risk = calculate_risk(weights, cov_matrix)

  return (expectedReturn=expected_return, risk=risk)
end