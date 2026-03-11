# ExpressのレイヤードアーキテクチャではService層に相当するファイル

# 線形代数を使用するためのモジュール（今回は行列計算に使用）
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
=#

#=
期待リターンを計算
E(Rp) = Σ(wi × μi)
=#
function calculate_expected_return(weights::Vector{Float64}, expected_returns::Vector{Float64})
  return sum(weights .* expected_returns)
end

#=
共分散行列を構築
Σij = ρij × σi × σj
=#
function build_covariance_matrix(volatilities::Vector{Float64}, correlations::Matrix{Float64})
  n = length(volatilities)
  cov_matrix = zeros(n, n)

  for i in 1:n
    for j in 1:n
      cov_matrix[i, j] = correlations[i, j] * volatilities[i] * volatilities[j]
    end
  end

  return cov_matrix
end

#=
リスク（標準偏差）を計算
σp = √(w^T × Σ × w)
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