# ExpressのレイヤードアーキテクチャではRouter層とController層に相当するファイル
# 最小構成の際に、main.jlに記載していたルーティング（エンドポイント）とコントローラーの役割に分割して記載

# JuliaでWebサーバーを構築するためのフレームワーク
using Oxygen
# JSONのパースと生成のためのモジュール
# JSの場合: const JSON = require("json3");
# Goの場合: import "encoding/json"
using JSON3

include("servicies/portfolio.jl")

# テスト用エンドポイント
@get "/test" function ()
  return Dict(
    "status" => "ok",
    "message" => "Julia server is running"
  )
end

# ダミー計算用エンドポイント
@post "/calc/test-evaluate" function (req)
  # リクエストボディの読み取り
  body = JSON3.read(req.body)

  # レスポンス
  return Dict(
    "message" => "Calculation is completed",
    "expectedReturn" => 0.05,
    "risk" => 0.12
  )
end

#=
ポートフォリオ評価
=#
# JSの場合: app.post("/calc/evaluate", (req, res) => { ... })
@post "/calc/evaluate" function (req)
  try
    # リクエストボディをパース
    body = JSON3.read(req.body)

    # データ抽出
    # JSの場合: const weights = body.weights.map(x => parseFloat(x));
    weights = Float64.(body.weights)
    expected_returns = Float64.(body.expectedReturns)
    volatilities = Float64.(body.volatilities)

    # 相関行列の構築
    n = length(weights)
    correlations = Matrix{Float64}(I, n, n)  # 単位行列から開始

    if haskey(body, :correlations)
      for corr in body.correlations
        i = corr.index1 + 1  # Julia は 1-indexed
        j = corr.index2 + 1
        correlations[i, j] = corr.value
        correlations[j, i] = corr.value  # 対称行列
      end
    end

    # 計算実行
    result = evaluate_portfolio(weights, expected_returns, volatilities, correlations)

    return Dict(
      "expectedReturn" => result.expectedReturn,
      "risk" => result.risk
    )

  catch e
    return Dict(
      "error" => "Calculation failed",
      "details" => string(e)
    )
  end
end