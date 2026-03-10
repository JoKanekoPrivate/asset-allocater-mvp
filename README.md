# asset-allocater-mvp

# 技術構成
- Client: JavaScript
    - React
    - React Router(仮)
    - Mantine（仮） 
- Server: Go
    - [Gin](https://gin-gonic.com/en/docs/introduction/)
    - Air（ホットリロード）
    - godotenv（.env）
    - pgx（postgresドライバ）
- Calc Engine: Julia
    - Oxygen.jl 
    - 
- DB: PostgreSQL 
    - **
- Infra: Render
    - **

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

## NiceToHave
- chart形式
- Swagger
- 認証
- DB保存
- 外部APIからのデータ取得

# 工数管理
## Day1
1. 調べ物（学習関連にまとめた）✅
1. ローカル環境設定✅
1. 疎通確認
    1. client起動✅
    1. server起動✅
    1. client-server接続✅

## Day2
1. 調べ物（学習関連にまとめた）✅
1. 疎通確認
    1. calc-engine起動✅
    1. server-calc-engine接続✅
1. Julia計算部分作成
1. FE: Reactの資産配分入力画面の作成
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

### 学び
#### インデント
- スペース
#### 型
- Goは静的型付け言語なので、型安全である
- 同時に型推論も走るため、型を指定しなくても推論で保管もされる
- メリット: PythonやJuliaのような動的片付け言語の間に、静的型付け言語を設けることで型安全性が担保される
#### 変数
- const: 変数宣言+初期値の代入（不偏）
- var: 変数宣言+型宣言（初期値が要らない場合は、こちらが推奨）
- :=: 変数宣言+型推論+初期値の代入
- JSは再代入の可否でconst, letを使い分け

#### if文
- ()不要
- if文内で変数宣言ができる（変数宣言 ;（繋ぎのキーワード）条件　{操作}）
- エラー処理
    - JS: try/catch
    - Go: resp, err := http.Get(url)とif err != nil


### 参考記事
1. [Webサイト / HelloWorld](https://qiita.com/rapirapi/items/a1a770c044d72328a34e)
1. Helloworld, 38-go-test
1. [公式 / QuickStart](https://gin-gonic.com/en/docs/quickstart/?utm_source=chatgpt.com)
1. [Webサイト / フレームワーク概要](https://geechs-job.com/tips/details/142)
1. [Webサイト / 変数宣言（:= or var） ≒ const, let](https://qiita.com/Winesburg_Ohio/items/16ef144b48b241241ecd)
1. [Webサイト / errorが例外ではなく、戻り値として返ってくる / http.Get ≒ fetch](https://jeremybytes.blogspot.com/2021/01/go-golang-multiple-return-values.html#:~:text=The%20final%20return%20statement%20returns,of%20the%20%22:=%22%20operator.)


## Julia
日本語記事少ないわ、、、、
1. 安定版の1.12.5を選択
1. brew install juliaupから安定版をサーチしjuliaup addを使用
1. [オンラインサンドボックス]()


### 参考記事
1. [Webサイト / HelloWorld](https://qiita.com/niwasawa/items/09d1058ecfda1649bfe5)
1. Helloworld, 38-julia-test
1. [YouTube / Julia導入](https://www.youtube.com/watch?v=vMWlppfkW08)
1. [Webサイト / 簡単操作系](https://qiita.com/SatoshiTerasaki/items/a7646618cab8a4811d91?utm_source=chatgpt.com)
1. [Webサイト / 株価シミュレーション](https://qiita.com/ismkt/items/210dee5cd6109e7c2ee9)
1. [Webサイト / ボラシミュレーション](https://qiita.com/ismkt/items/027c0983c13abcc8b610)

## JS


# プレゼンに向けて
- 特徴
- こういう使い方ができる
- こういう使い方はできない
- 特徴のアピールができるプレゼンになるといいかも
    - 実際に使ってみてアピール
    - アプリにする必要がない