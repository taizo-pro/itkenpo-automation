# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

関東ITソフトウェア健康保険組合（ITS健保）の施設抽選申込フォームに、保存した個人情報を自動入力するChrome拡張機能。ビルドシステムやパッケージマネージャは使用しておらず、Vanilla JS/HTML/CSSで構成されている。

## 開発・テスト

ビルドステップは不要。`chrome://extensions/` でデベロッパーモードを有効化し「パッケージ化されていない拡張機能を読み込む」からこのディレクトリを選択してロードする。コード変更後は拡張機能の「更新」ボタンをクリックして反映する。

対象サイト: `*://*.its-kenpo.or.jp/*`

## アーキテクチャ

3層構成のChrome Extension (Manifest V3):

1. **popup.html / popup.js** — ポップアップUI。設定タブ（ユーザー情報入力・保存）と自動入力タブの2タブ構成。Chrome Storage API (sync) でデータを永続化する。
2. **content.js** — 対象サイトに注入されるコンテンツスクリプト。`form.edit_apply` フォーム内の各入力フィールドをIDで特定し、`setTimeout` による段階的な値設定で依存フィールド（生年月日の日、郵便番号→住所など）を処理する。
3. **Chrome Message Passing** — popup.js が `chrome.tabs.sendMessage` でコンテンツスクリプトに `fillForm` アクションとユーザーデータを送信。content.js がフォーム入力後に成功/失敗レスポンスを返す。

### データフロー

```
ユーザー入力(popup) → Chrome Storage (sync) → メッセージ送信 → content.js → 対象サイトのDOM操作
```

### content.js のフォームフィールドマッピング

content.js 内で対象フォームの input ID（`apply_sign_no`, `apply_insured_no`, `apply_office_name` 等）にデータをマッピングしている。対象サイトのフォーム仕様が変更された場合はこのマッピングを更新する必要がある。

## 注意事項

- 外部依存なし。npm/yarn は使用していない
- 生年月日セレクタは和暦（昭和・平成・令和）変換を含む
- 郵便番号入力後に blur イベントを発火させて対象サイトの住所自動補完を利用している
- フォーム入力は `setTimeout`（100ms〜500ms）で段階的に行うため、タイミング問題が発生した場合は遅延値を調整する
