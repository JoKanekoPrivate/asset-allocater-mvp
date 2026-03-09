package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/api/test", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Go server is running",
		})
	})

	router.Run(":8080")
}