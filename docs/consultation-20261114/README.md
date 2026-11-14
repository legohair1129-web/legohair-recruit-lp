# 採用相談導線の改善 — 2026-11-14

対象: `legohair1129-web/legohair-recruit-lp` / Vercel `legohair-recruit-lp`。
本番URL: https://legohair-recruit-lp.vercel.app/
比較元: `9a4c8abb32ae869d0dd5f1284b11fc83bcb180cf`。

## 変更

- ファーストビューを「転職するかどうか、まだ決めなくても大丈夫。」に変更。代表への質問、履歴書不要を明示。
- 冒頭・最下部・画面下部の固定バーに、等幅のLINEとInstagram DM相談ボタンを設置。見学・タイプ診断は補助導線に変更。
- 外部アプリへのリンクは通常のHTTPSリンク。同じタブで直接開き、ポップアップやタイマーによる強制遷移を使わない。
- Instagram DMが開かない場合のプロフィールリンクを冒頭と最下部に追加。自動的に別ページへ飛ばさず、利用者が選択できる。
- 添付Instagram QR画像を加工せず使用。PCの最下部に表示し、スマートフォンでは非表示。
- 既存の写真・色・フォントを維持。6つの本文セクション（診断・仲間・教育・撮影・理念・募集条件）は比較元と完全一致。旧キャッチと紹介文も冒頭下部に保持。
- 固定バーのための下余白、safe-area-inset-bottom、フォーカス時のスクロール余白を確保。

## 計測

既存のMeta Pixel ID `1504135836561412`を使用。広告キャンペーン・予算・最適化対象・カスタムコンバージョンの設定は変更していない。

| 操作 | LP内部イベント | Metaカスタムイベント |
|---|---|---|
| LINE相談ボタン | `line_consultation_click` | `RecruitLineClick` |
| Instagram DM相談ボタン | `instagram_dm_consultation_click` | `RecruitInstagramDMClick` |
| サロン見学予約ボタン | `salon_tour_click` | `RecruitFormClick` |
| Instagramプロフィール補助リンク | `instagram_profile_click` | `RecruitInstagramProfileClick` |

`cta`で`hero` / `entry` / `sticky` / `qr`を区別し、`interaction=outbound_click`、`measurement_version=consultation_v1`を付与。
Metaイベントマネージャーで対象Pixelと上表のイベント名を確認する。Meta管理画面での受信と広告レポートへの表示は、この作業環境からは確認できていない。

メインLPは改修前、ブラウザ内イベントと任意アダプターのみで、Pixelへの接続がなかった。今回、既存関連ページと同じ本番ホスト限定でPixel接続を実装。プレビューでは広告イベントを送信しない。明示的な計測拒否・Global Privacy Controlを尊重し、同意済み外部アダプターがある場合は二重送信を避ける。計測エラーでリンクや診断を停止しない。

準社員ページとキャリアチェックページには、LINEクリック時に`Lead`を送るコードがあったため削除。従来の`RecruitLineClick`は維持した。クリック数は問い合わせ完了数ではない。標準イベント`Lead` / `Contact` / `SubmitApplication`はクリックから送らない。

**影響:** 過去のLead件数と改修後のクリック件数は同じ定義ではない。Leadを最適化対象にしている広告があれば、LP側のクリック由来Leadは今後届かなくなる。広告設定自体は変更していない。申告された「34件」のすべてが当該コード由来かは未確認。

実相談数はLINE・Instagramで採用相談のメッセージを受信した件数として別管理する。LPだけではDM送信・友だち追加・フォーム送信の完了を確認できない。QR読み取りもLP内クリックには含まれない。

## 検証結果

- ビルド: 3ページ、8セクション、ローカル画像・リンク・アンカー・ID重複を検証して合格。
- Nodeテスト: 3配置のリンク、4種類のイベント、Pixel IDと本番限定実行、プレビュー除外、アダプター二重送信防止、例外処理、本文・写真の保持、Lead非送信が合格。
- 診断: 全1,024回答パターン合格。ブラウザでも5問から結果まで操作して確認。
- Chrome iframeの幅320 / 375 / 390 / 430 / 768 / 1440pxで確認。いずれもscrollWidthとclientWidthが一致（ブラウザのスクロールバー幅を除く実効幅）。読み込み済み画像の欠損なし。これは実機検証ではない。
- ブラウザで冒頭・最下部・固定バーの相談クリックを実行。LINE/Instagramと配置を区別したイベントが1クリックに1回発生。見学ボタンも別イベントで確認。テストはローカルプレビューで外部遷移を抑止し、広告データには加算しない。
- LINE: `https://lin.ee/7dPFevn`からLINE公式ドメインの`@911qytrk`友だち追加画面へ遷移。表示名・運営者情報はWeb画面に出ないため、LEGOHAIR公式アカウントの名称と受信可否は未確認。
- Instagram: `https://ig.me/m/legohair_group`からInstagram公式ログイン画面へ遷移。ログイン後の宛先URLが`/m/legohair_group`であることを確認。未ログイン環境のためDM画面そのもの、受信設定、プロフィールの現状は未確認。添付QRの表示アカウント名は`@LEGOHAIR_GROUP`。
- iPhone / Android実機、Instagramアプリ内ブラウザ、Metaイベントマネージャーの実受信、外部フォーム送信は未実施。実際の採用問い合わせやテストメッセージは送信していない。

確認画像: [スマートフォン](mobile.jpg) / [PC](desktop.jpg)

## 再検証コマンド

```sh
node scripts/build.mjs
node scripts/test-consultation.mjs
node scripts/test-diagnosis.mjs
git diff --check
```

旧本番デプロイ: `dpl_3iERDS8xXDVqBRM6J4yewPTZjBfB`。必要な場合はVercelでこの版へ戻せる。
