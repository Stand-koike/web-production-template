# Builder Workflow

## Purpose

Pencil.devから出力されたHTMLを制作可能な状態へ整理する工程。

## Input

* HTML
* Tailwind CSS
* Assets

## Process

### 1. Analyze

現在の構造を確認する。

確認項目:

* セクション構造
* 重複コード
* 不要要素
* 命名

### 2. Refactor

コードのみ整理する。

対象:

* HTML階層
* class
* コメント
* Component候補

### 3. Handoff

次工程へ渡す。

出力:

* 整理済みコード
* Component一覧
* Animation対象一覧

## Do Not

Builder工程では見た目を変えない。

見た目の改善はReviewer工程で行う。
