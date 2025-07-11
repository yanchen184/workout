# 💪 健身日曆 Workout Calendar v1.9.0

一個基於 React + Refine + Firebase 的健身訓練記錄應用程序。

## ✨ 功能特色

- 📅 **日曆視圖**: 直觀地查看和管理健身計劃
- 💪 **肌肉群追蹤**: 記錄胸肌、肩膀、腿部、背部、腹肌、手臂的訓練
- 🏃 **有氧運動**: 支持跑步、籃球、壁球、保齡球等多種有氧運動記錄
- 📊 **上週回顧**: 可上拉查看上一週的訓練記錄，便於回顧
- 📊 **數據統計**: 查看訓練頻率、完成率、連續天數等統計信息
- 📝 **訓練記錄**: 詳細記錄每次訓練的內容和備註
- 😴 **休息日模式**: 支持設定休息日，合理安排訓練計劃
- 🔥 **連續追蹤**: 追蹤連續訓練天數，保持動力
- 📱 **響應式設計**: 支持桌面和移動設備

## 🚀 在線演示

**主要訪問地址**: [https://yanchen184.github.io/workout/](https://yanchen184.github.io/workout/)

> 📝 **部署狀態**: [![Deploy to GitHub Pages](https://github.com/yanchen184/workout/actions/workflows/deploy.yml/badge.svg)](https://github.com/yanchen184/workout/actions/workflows/deploy.yml)

## 🛠️ 技術棧

- **前端框架**: React 18 + TypeScript
- **UI 組件庫**: Ant Design
- **狀態管理**: Refine Framework
- **後端服務**: Firebase (Firestore + Authentication)
- **構建工具**: Vite
- **部署**: GitHub Pages + GitHub Actions

## 📦 安裝與運行

### 本地開發

```bash
# 克隆項目
git clone https://github.com/yanchen184/workout.git

# 進入項目目錄
cd workout

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

### 構建生產版本

```bash
# 構建項目
npm run build

# 預覽構建結果
npm run preview
```

### 部署到 GitHub Pages

```bash
# 自動部署（推送到 master 分支時觸發）
git push origin master

# 手動部署
npm run deploy
```

## 🔧 GitHub Pages 設定

### 📋 重要設定步驟：

**✅ 已配置 GitHub Actions 自動部署，現在需要啟用 Pages：**

1. **前往 Repository Settings > Pages**
   - 打開：[https://github.com/yanchen184/workout/settings/pages](https://github.com/yanchen184/workout/settings/pages)

2. **設定 Pages 來源**：
   - 在 **"Source"** 下拉選單中選擇 **"Deploy from a branch"**
   - 在 **"Branch"** 下拉選單中選擇 **"gh-pages"**
   - 選擇 **"/ (root)"** 資料夾
   - 點擊 **"Save"**

3. **等待部署完成**：
   - GitHub Actions 會自動構建並推送到 gh-pages 分支
   - 幾分鐘後網站將可在 [https://yanchen184.github.io/workout/](https://yanchen184.github.io/workout/) 訪問

### 🔄 自動部署流程：

- 推送到 `master` 分支 → 自動觸發 GitHub Actions
- GitHub Actions 構建項目 → 部署到 `gh-pages` 分支  
- GitHub Pages 從 `gh-pages` 分支提供服務

### 🛠️ 手動啟用 Pages（如果需要）：

如果 Pages 未自動啟用，請手動設定：

1. 進入 **Repository Settings**
2. 滾動到 **Pages** 設定
3. 在 **Source** 下拉選單選擇 **"Deploy from a branch"**
4. 選擇 **"gh-pages"** 分支和 **"/ (root)"** 資料夾
5. 點擊 **Save**

## 🔧 配置說明

### Firebase 配置

項目使用 Firebase 作為後端服務，配置文件位於 `src/config/firebase.ts`。

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  // ... 其他配置
};
```

### 環境變量

如需自定義配置，可創建 `.env` 文件：

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 📖 使用說明

### 1. 註冊/登入
- 使用電子郵件和密碼註冊新帳戶
- 或使用現有帳戶登入

### 2. 查看數據儀表板
- 查看總訓練次數、完成率、連續天數等統計
- 查看各肌肉群訓練頻率分布
- 查看最近訓練活動

### 3. 使用日曆功能
- 在日曆中查看已安排的訓練計劃
- 點擊日期快速新增該日的訓練計劃
- 不同顏色標籤代表不同肌肉群

### 4. 新增訓練計劃
- 選擇訓練日期
- 選擇要訓練的肌肉群（可多選）
- 添加訓練備註（重量、組數等）
- 標記是否已完成

### 5. 管理訓練記錄
- 查看所有訓練記錄列表
- 編輯或刪除現有記錄
- 查看詳細的訓練信息

## 🎯 核心概念

### 肌肉群分類
- 🔥 **胸肌** (Chest)
- 🔥 **肩膀** (Shoulders) 
- 🦵 **腿部** (Legs)
- 💚 **背部** (Back)
- ⚡ **腹肌** (Abs)
- 💪 **手臂** (Arms)
- ❤️ **有氧** (Cardio)

### 有氧運動類型
- 🏃 **跑步**: 記錄距離、時間、熱量消耗
- 🏀 **籃球**: 記錄時間、強度、熱量消耗
- 🎾 **壁球**: 記錄時間、對手、熱量消耗
- 🎳 **保齡球**: 記錄局數、分數、熱量消耗
- 🏊 **游泳**: 記錄圈數、時間、熱量消耗
- 🚴 **騎車**: 記錄距離、時間、熱量消耗
- 🦢 **跳繩**: 記錄時間、次數、熱量消耗
- 🚶 **健走**: 記錄距離、時間、熱量消耗
- 🧘 **瑜伽**: 記錄時間、類型、熱量消耗
- 🏃 **其他**: 自定義有氧運動

### 超量回復原理
應用基於超量回復原理設計，幫助用戶：
- 追蹤各肌肉群的訓練頻率
- 確保適當的休息間隔
- 在最佳時機安排下次訓練
- 避免過度訓練或訓練不足

## 🚀 部署架構

### GitHub Actions 自動部署
- 推送到 `master` 分支時自動觸發
- 自動建構並部署到 `gh-pages` 分支
- GitHub Pages 從 `gh-pages` 分支提供服務

### 版本管理
- 版本號顯示在應用右上角
- 版本配置在 `src/config/version.ts`
- 支持語義化版本控制

## 🔧 修復記錄 v1.9.0

### GitHub Pages 部署修復
- 修復 "HttpError: Not Found" 錯誤
- 改用 gh-pages 分支部署方式
- 簡化 GitHub Actions 配置
- 確保兼容性和穩定性

### 構建問題修復
- 修復 package.json 導入錯誤
- 創建獨立的版本配置文件
- 優化構建配置
- 改善錯誤處理

### 技術改進
- 統一版本管理系統
- 優化部署流程穩定性
- 增強錯誤處理機制
- 改善文檔說明

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程
1. Fork 本項目
2. 創建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- GitHub Issues: [提交問題](https://github.com/yanchen184/workout/issues)
- Repository: [yanchen184/workout](https://github.com/yanchen184/workout)

## 🙏 致謝

- [Refine](https://refine.dev/) - 提供優秀的 React 框架
- [Ant Design](https://ant.design/) - 提供美觀的 UI 組件
- [Firebase](https://firebase.google.com/) - 提供可靠的後端服務
- [GitHub Pages](https://pages.github.com/) - 提供免費的靜態網站托管

---

**開始你的健身之旅吧！💪**
