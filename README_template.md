# React.js + GAS Web (Typescript + Vite + pnpm)

**Forked from:** [enuchi/React-Google-Apps-Script v3.1.0](https://github.com/enuchi/React-Google-Apps-Script)
原始 README 已保留為 [`README_enuchi.md`](./README_enuchi.md)

---

## 專案簡介

這個專案是從 `enuchi/React-Google-Apps-Script` 3.1.0 版本 fork 出來，主要修改如下：

* 移除了 Google Apps Script Add-on 的支援
* 前端專注於使用 **React.js + Vite**，支援 **HMR 開發**
* 後端仍使用 **Google Apps Script (GAS) 作為網頁伺服器**
* 使用 **pnpm** 作為套件管理工具
* 支援本地開發、程式碼檢查、整合測試，以及部署到 GAS

> 本 fork 是 **React.js 前端 + GAS 後端 Web 專案**，不再支援 Add-on 功能。

---

## 功能

* **React.js + Vite** 前端開發，支援 HMR
* **GAS 網頁應用程式** 提供後端 API 或靜態頁面
* 使用 **pnpm** 管理依賴
* 提供常用開發與部署指令

---

## 安裝

```bash
git clone https://github.com/Mirochiu/React-Google-Apps-Script
cd React-Google-Apps-Script
pnpm install
```

---

## 開發

啟動本地開發伺服器：

```bash
pnpm start
```

* 前端會在 `http://localhost:3000` 啟動
* 支援 **HMR**，修改前端檔案會即時刷新
* 後端請透過 GAS 部署測試，或使用本地模擬工具與 API 互動
* 首次啟動須耗時 30 秒以上，請耐心等候

---

## 部署

正式部署到 GAS：

```bash
pnpm deploy
```

* 將前端打包資源上傳到 GAS
* 後端 GAS 提供 API 與網頁服務

---

## 程式碼檢查

```bash
pnpm lint
```

* 進行程式碼格式檢查與靜態分析

---

## 整合測試

```bash
pnpm test:integration
```

* 執行整合測試，確保前後端協作正常

---

## 專案架構（簡略）

```
├─ dist/            # Vite 打包輸出
├─ src/
   ├─ client/       # React.js 前端程式碼
   └─ server/       # Google Apps Script 後端程式碼
├─ test/            # 測試用程式碼
├─ package.json
├─ pnpm-lock.yaml   # pnpm管理文件
├─ LICENSE          # 專案授權文件
├─ README.md        # 本專案說明文件
└─ README_enuchi.md # enuchi的專案說明文件
```

---

## 原始專案說明

原始專案仍可參考 [`README_enuchi.md`](./README_enuchi.md)。
原專案功能包含：

* Google Apps Script Add-on 支援
* React 與 GAS 整合範例
* Apps Script 部署工具

> 本 fork 不再支援 Add-on，只專注於 **React.js 前端 + GAS 後端 Web** 架構。
