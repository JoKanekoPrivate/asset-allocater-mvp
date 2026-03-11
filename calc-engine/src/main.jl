# Expressのレイヤードアーキテクチャではindex.js（main.js）に相当するファイル
# サーバーの起動とルーティングの定義を行うファイル

using Oxygen
using JSON3
using DotEnv

# 環境変数の読み込み
DotEnv.config(".env.local")

# ルート定義を読み込み
include("routes.jl")

# 環境変数から取得
port = parse(Int, get(ENV, "PORT", "8081"))
host = get(ENV, "HOST", "127.0.0.1")

# サーバー起動
serve(host=host, port=port)