# asset-allocater-mvp

# 技術構成
- Client: JavaScript, React, React Router(仮), Mantine（仮）
- Server: Go, Fiber
- Calc Engine: Julia, Oxygen.jl 
- DB: PostgreSQL 
- Infra: Render

# ゴール関連
## ゴール
### FE: Reactで資産配分入力画面を作る（簡単で良い）
    - 資産配分入力画面（入力）
    - 合計比率の表示（state）
    - 期待リターン表示（出力）
    - リスク（出力）
### BE: Go, FiberでAPIを作る
    - DBからパラメータを取得する
    - calc-engineにパラメータと共にリクエストを送信（JSON） 
    - calc-engineのレスポンスを受信（JSON） 
    - FEに結果を適切な形で返す（JSON） 
### Calc-Engine: Juliaで計算エンジンを作る
    - BEからのリクエストを受け取る（JSON） 
    - BEにレスポンスを返す（JSON）
### 

## NiceToHave
- chart形式
- Swagger
- 認証
- DB保存
- 外部APIからのデータ取得

# 工数管理
## Day1
1. ローカル環境設定
1. 疎通確認
    1. client起動
    1. 



# Utils
- [git プレフィックス](https://qiita.com/a_ya_ka/items/c472a02051d78e4c0855)
- [テキスト比較ツール difff《ﾃﾞｭﾌﾌ》](https://difff.jp/)
- [Yahoo Finance](https://finance.yahoo.com/)

# 学習関連
## GO
1. 安定版の1.26.1を選択
1. [オンラインサンドボックス](https://go.dev/play/)
1. brew installを使用
1. Goの中のtestingが一般的？
1. Gin（フルスタック）やFiber（BE）が一般的、今回はExpress(JS)と比較しやすいFiberを検討
1. IDE: VSCode
1. デバッガ: VSCodeの拡張？
### 参考記事
1. [HelloWorld](https://qiita.com/rapirapi/items/a1a770c044d72328a34e)
1. Helloworld, 38-go-test

## Julia
日本語記事少ないわ、、、、
1. 安定版の1.12.5を選択
1. brew install juliaupから安定版をサーチしjuliaup addを使用
1. [オンラインサンドボックス]()


### 参考記事
1. [HelloWorld](https://qiita.com/niwasawa/items/09d1058ecfda1649bfe5)
1. Helloworld, 38-julia-test
1. [簡単操作系](https://qiita.com/SatoshiTerasaki/items/a7646618cab8a4811d91?utm_source=chatgpt.com)
1. [株価シミュレーション](https://qiita.com/ismkt/items/210dee5cd6109e7c2ee9)

## JS


