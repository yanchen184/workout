# 健身日曆啟動說明

## 📋 啟動步驟

1. **打開命令提示符或 PowerShell**
   - 按 Win + R，輸入 `cmd` 或 `powershell`

2. **進入項目目錄**
   ```bash
   cd C:\Users\yanchen\workspace\self\workout\workout
   ```

3. **安裝依賴**
   ```bash
   npm install
   ```

4. **啟動開發服務器**
   ```bash
   npm run dev
   ```

5. **或者直接運行 start.bat 文件**
   - 雙擊項目根目錄中的 `start.bat` 文件

## 🔧 如果遇到問題

### 問題1: 白畫面或模塊錯誤
- 確保所有依賴已安裝：`npm install`
- 清除緩存：`npm cache clean --force`
- 重新安裝：`rm -rf node_modules package-lock.json && npm install`

### 問題2: Firebase 連接問題
- 檢查網絡連接
- 確認 Firebase 配置正確

### 問題3: 端口被佔用
- Vite 通常使用 5173 端口
- 如果被佔用，會自動選擇其他端口

## 🚀 訪問應用

開發服務器啟動後，瀏覽器會自動打開，或手動訪問：
- http://localhost:5173

## 📱 功能介紹

1. **註冊/登入**: 使用 Email 和密碼
2. **數據儀表板**: 查看訓練統計
3. **健身日曆**: 查看和管理訓練計劃
4. **新增訓練**: 記錄新的訓練計劃
5. **訓練記錄**: 管理所有訓練記錄

## 🔥 開始使用

1. 註冊一個新帳戶
2. 在日曆中點擊日期
3. 選擇要訓練的肌肉群
4. 添加備註（如重量、組數等）
5. 標記完成狀態

享受你的健身之旅！💪
