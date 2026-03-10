package main

import (
	// JSONのエンコードとデコードを行うためのパッケージ
	// JSON.stringify（json.Marshal）やJSON.parse（json.Unmarshal）のような役割
  "encoding/json" 
	// HTTPリクエストのボディを読み取るためのパッケージ
	// io.ReadAllはres.text()のような役割
	// io.
  "io" 
  "log" // console.logのような役割
	"net/http" // HTTPリクエストを送るためのパッケージ、fetchのような役割
  "os" // process.envのprocessのような役割

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// .env.local 読み込み
  if err := godotenv.Load(".env.local"); err != nil {
    log.Println("No .env.local file found")
  }

	router := gin.Default()

	// 起動テスト用エンドポイント
	router.GET("/api/test", func(c *gin.Context) {
		// レスポンス
		c.JSON(200, gin.H{
			"message": "Go server is running",
		})
	})

	// Jula接続テスト用エンドポイント
	router.GET("/api/test-julia", func(c *gin.Context) {
		// 環境変数からJuliaサーバーのURLを取得（変数宣言+代入）
		juliaURL := os.Getenv("JULIA_SERVER_URL")

		// Juliaサーバーの/testエンドポイントにリクエスト（変数宣言+代入）
		// http.Getは、responseとerrorの2つの値を返す
		// Goでは、複数の値を返す関数が一般的
		resp, err := http.Get(juliaURL + "/test")
		if err != nil {
      c.JSON(500, gin.H{
        "message": "Failed to connect to Julia",
        "details": err.Error(),
      })
    	return
    }

		// Go特有な書き方
		// HTTPリクエストが終わったら、resp.Bodyを閉じる
		// これをしないと、リクエストが溜まってしまう
		defer resp.Body.Close()

		// レスポンスの読み取り（変数宣言+代入）
		// ioReadAllで値を二つ（bodyとerror）返す
		// _を使うことでerrorを無視している
		body, _ := io.ReadAll(resp.Body)

		// JSONのパース結果を格納する変数（var 変数名（result） 型（map[string]interface{}））
		// map[string]interface{}は、GoでJSONオブジェクトを表す一般的な型
		// map: キーと値のペアを格納するデータ構造
		// string: キーは文字列
		// interface{}: 値は任意の型（JSONの値は、文字列、数値、配列、オブジェクトなど様々な型があるため）
		var result map[string]interface{}
		
		// GoのJSONパースは、json.Unmarshalを使う
		// json.Unmarshalは、第一引数にJSONデータ、第二引数にパース結果を格納する変数のポインタを渡す
		json.Unmarshal(body, &result)

		// レスポンス
		c.JSON(200, gin.H{
			"message": "Julia connection test is successed",
			"juliaResponse": result,
		})
	})

	router.Run(":8080")
}