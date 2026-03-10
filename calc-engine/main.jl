using Oxygen
using JSON3

# ヘルスチェック
@get "/test" function()
  return Dict(
    "status" => "ok"
  )
end

# ダミー計算エンドポイント
@post "/calc/evaluate" function(req)
  # リクエストボディの読み取り
  body = JSON3.read(req.body)
    
  # レスポンス
  return Dict(
    "expectedReturn" => 0.05,
    "risk" => 0.12
  )
end

# サーバー起動
serve(host="127.0.0.1", port=8081)