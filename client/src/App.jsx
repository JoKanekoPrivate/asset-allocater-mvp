import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. 状態管理 
  const [message, setMessage] = useState("loading...");
  
  // 2. イベントハンドラー
  // 3. 副作用処理
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/test");
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error(err);
        setMessage("failed to connect");
      }
    };

    fetchData();
  }, []);

  
  // 4. ローディグ
  // 5. 返り値構築
  return (
    <div>
      <h1>Client - Server Connection Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App
