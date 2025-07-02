# GitHub Pages 部署說明

## 目前的部署設置

此專案使用雙重部署策略來確保 GitHub Pages 能正常運作：

### 1. 主要部署方式（GitHub Actions + Pages）
- 檔案：`.github/workflows/deploy.yml`
- 使用 GitHub Actions 自動部署到 GitHub Pages
- 包含自動啟用 Pages 功能
- 在每次推送到 master/main 分支時自動觸發

### 2. 備用部署方式（gh-pages 分支）
- 檔案：`.github/workflows/gh-pages.yml`
- 使用 peaceiris/actions-gh-pages 部署到 gh-pages 分支
- 可手動觸發部署
- 作為主要方式的備用方案

## 如何啟用 GitHub Pages

如果部署失敗，請按照以下步驟手動啟用 GitHub Pages：

1. **前往 Repository Settings**
   - 進入 https://github.com/yanchen184/workout/settings/pages

2. **配置 Pages 來源**
   - 在 "Source" 部分選擇 "GitHub Actions"
   - 或者選擇 "Deploy from a branch" 並選擇 "gh-pages" 分支

3. **設置自訂域名（可選）**
   - 如果有自訂域名，在 "Custom domain" 輸入域名

4. **等待部署完成**
   - 部署通常需要幾分鐘時間
   - 完成後會顯示網站 URL

## 線上網址

部署成功後，網站將可在以下網址存取：
- 主要網址：https://yanchen184.github.io/workout
- 如果使用自訂域名，也會顯示在 Pages 設置中

## 故障排除

### 如果主要部署失敗：
1. 檢查 Actions 標籤中的部署狀態
2. 手動觸發 gh-pages 工作流程
3. 在 Pages 設置中切換到 gh-pages 分支

### 如果需要手動部署：
```bash
npm run build
npm run deploy
```

### 檢查部署狀態：
- GitHub Actions: https://github.com/yanchen184/workout/actions
- Pages 設置: https://github.com/yanchen184/workout/settings/pages

## 版本資訊
當前版本：v1.7.0
包含完整的 TypeScript 支援和雙重部署策略
