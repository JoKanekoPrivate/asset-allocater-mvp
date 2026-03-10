using Oxygen
using JSON3
using DotEnv

# 環境変数の読み込み
DotEnv.config(".env.local")

# テスト用エンドポイント
@get "/test" function()
  return Dict(
    "status" => "ok",
    "message" => "Julia server is running"
  )
end

# ダミー計算用エンドポイント
@post "/calc/evaluate" function(req)
  # リクエストボディの読み取り
  body = JSON3.read(req.body)
    
  # レスポンス
  return Dict(
    "message" => "Calculation is completed",
    "expectedReturn" => 0.05,
    "risk" => 0.12
  )
end

# 環境変数から取得
port = parse(Int, get(ENV, "PORT", "8081"))
host = get(ENV, "HOST", "127.0.0.1")

# サーバー起動
serve(host=host, port=port)