# 🔍 Discovery Phase - 需求探索階段

## 📋 階段目標

在這個階段，我們通過**對話式需求分析**來理解和明確項目需求，為後續設計和開發奠定基礎。

## 🎯 主要活動

### 1. 需求澄清 (Requirements Clarification)
- 與利害關係人進行對話
- 明確核心功能需求
- 識別非功能性需求
- 定義驗收標準

### 2. 對話記錄 (Conversation Logs)
- 記錄所有需求討論
- 保存決策依據
- 追蹤需求變更

### 3. 需求文檔 (Requirements Documentation)
- 整理正式需求文檔
- 創建用戶故事
- 定義功能範圍

## 📁 目錄結構

```
0_discovery/
├── conversations/        # 對話記錄
│   ├── session_*.md     # 對話會話記錄
│   └── decisions.md     # 重要決策記錄
├── clarifications/      # 需求澄清
│   ├── questions.md     # 待澄清問題
│   └── answers.md       # 澄清結果
└── requirements/        # 需求文檔
    ├── user_stories.md  # 用戶故事
    ├── functional.md    # 功能需求
    └── non_functional.md # 非功能需求
```

## 🚀 VibeCoding 對話式探索

使用 VibeCoding 的智能對話功能：

```bash
# 啟動需求探索對話
vibecoding chat --phase discovery

# 系統會引導你完成：
# 1. 項目背景理解
# 2. 核心功能識別  
# 3. 技術約束分析
# 4. 驗收標準定義
```

## ✅ 階段完成標準

- [ ] 所有核心功能需求已明確
- [ ] 非功能需求已定義
- [ ] 用戶故事已編寫
- [ ] 驗收標準已設定
- [ ] 技術約束已識別
- [ ] 利害關係人已確認需求

## 📝 模板文件

- `conversations/session_template.md` - 對話記錄模板
- `requirements/user_story_template.md` - 用戶故事模板
- `requirements/functional_template.md` - 功能需求模板

## 🔄 下一階段

完成需求探索後，進入 [1_design](../1_design/README.md) 階段進行系統設計。 