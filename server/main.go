package main

import (
	// JSONのエンコードとデコードを行うためのパッケージ
	// JSON.stringify（json.Marshal）やJSON.parse（json.Unmarshal）のような役割
	"encoding/json"
	// HTTPリクエストのボディを読み取るためのパッケージ
	// io.ReadAllはres.text()のような役割
	// io.
	"io"
	"log"      // console.logのような役割
	"net/http" // HTTPリクエストを送るためのパッケージ、fetchのような役割
	"os"       // process.envのprocessのような役割

	// bytes.NewReaderは、Goでバイト列をio.Readerに変換するための関数
	"bytes"

	"github.com/gin-gonic/gin"
	// 環境変数を読み込むためのパッケージ
	// dotenvのような役割
	"github.com/joho/godotenv"
)

func main() {
	// .env.local 読み込み
	// godoenv.Loadは、nil（成功）またはerror（失敗）を返す
	// if文内で、変数定義を
	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("No .env.local file found")
	}

	// ⭐️デバッグ用に環境変数をログ出力
	log.Printf("PORT: %s", os.Getenv("PORT"))
	log.Printf("JULIA_BASE_URL: %s", os.Getenv("JULIA_BASE_URL"))

	router := gin.Default()

	// 起動テスト用エンドポイント
	router.GET("/api/test", func(c *gin.Context) {
		// レスポンス
		c.JSON(200, gin.H{
			"message": "Go server is running",
		})
	})

	// Julia接続テスト用エンドポイント
	router.GET("/api/test-julia", func(c *gin.Context) {
		// 環境変数からJuliaサーバーのURLを取得（変数宣言+代入）
		juliaURL := os.Getenv("JULIA_BASE_URL")

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
			"message":       "Julia connection is successed",
			"juliaResponse": result,
		})
	})

	router.POST("/api/portfolio/evaluate", func(c *gin.Context) {

		// 環境変数からJuliaサーバーのURLを取得
		juliaURL := os.Getenv("JULIA_BASE_URL")

		// クライアントからのリクエストボディを格納する変数
		var requestBody map[string]interface{}

		// クライアントからのリクエストボディの取得・読み取り
		if err := c.BindJSON(&requestBody); err != nil {
			c.JSON(400, gin.H{
				"error":   "Invalid request body",
				"details": err.Error(),
			})
			return
		}

		// Juliaサーバーに送るリクエストボディの構築
		juliaRequest := map[string]interface{}{
			"weights":         requestBody["weights"],
			"expectedReturns": requestBody["expectedReturns"],
			"volatilities":    requestBody["volatilities"],
			"correlations":    requestBody["correlations"],
		}

		// JSONデータに変換
		jsonData, err := json.Marshal(juliaRequest)
		if err != nil {
			c.JSON(500, gin.H{
				"message": "Failed to marshal JSON",
				"details": err.Error(),
			})
			return
		}

		// Juliaサーバーの/calc/evaluateエンドポイントにリクエスト
		resp, err := http.Post(
			juliaURL+"/calc/evaluate",
			"application/json",
			bytes.NewBuffer(jsonData),
		)
		if err != nil {
			c.JSON(500, gin.H{
				"message": "Failed to connect to Julia",
				"details": err.Error(),
			})
			return
		}
		defer resp.Body.Close()

		// レスポンスの読み取り
		juliaResponseBody, _ := io.ReadAll(resp.Body)

		// ⭐️デバッグ
		log.Printf("********* %s", string(juliaResponseBody))

		// JSONのパース結果を格納する変数
		var juliaResult map[string]interface{}
		json.Unmarshal(juliaResponseBody, &juliaResult)

		// クライアントへのレスポンス
		c.JSON(200, juliaResult)
	})

	// 環境変数からポート取得
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	router.Run(":" + port)
}
