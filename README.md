# Amplify-React-Stripeアプリ

ここにhttps化した後にリンクを貼る。

Amplify、React、Stripeで商品購入・定期課金契約機能を実装しました。

# 実装内容

- ## Amplify CLIでREST APIを選択して、AWS Lambda関数を作成(Node.js,テンプレートExpress)。
- ## Stripe Payment Linksを使ってノーコードで決済URLを作成。
- ## ダッシュボードからStripeのAPIキー(公開可能キー、制限付きキー)を作成。
  - ### 公開可能キー
    カード情報の安全なトークン化、Stripe Checkoutへのリダイレクト操作
  - ### 制限付きキー
    Stripeアカウントにアクセス（顧客情報、決済情報）

- ## Stripe JavaScript SDKをReactアプリに設定。（公開可能キーでJavaScript SDKを初期化）
  - src/BuyButton.jsxにStripeの公開可能キーを取得するコードを記述。
- ## Stripe Node.js SDKをAmplifyのサーバー側アプリに設定
  - `amplify update function`で制限付きキーを暗号化してAWSに保存。
  - amplify/backend/function/Lambda関数名/src/app.jsでStripeの制限付きキーを取得するコードを記述。
  - 取得したAPIキー(制限付きキー)を元ににStripe Node.js SDKを読み込みセットアップ。

- ## Stripeに登録した商品・料金情報を取得するAPIの作成
  - Stripe Node.js SDKの命名規則に従い、amplify/backend/function/Lambda関数名/src/app.jsにコードを記述。

- ## APIのデータをReactで読み込みブラウザに表示させる。
  - 非同期処理でAPIを呼び出すため、hook（State、useEffect、useState）を使用。
  - AmplifyでAPIを追加したので、Amplify SDKを使う(`import { API } from 'aws-amplify';`)
  - 上記APIクラスを使うのに必要な情報は、Amplify CLIで指定したAPI名、メソッド(getやpost)、APIパスの3種類
  - APIレスポンスをブラウザで表示。

- ## サーバー側(amplify/backend/function/Lambda関数名/src/app.js)にStripe Checkoutのセッションを作成
  - サーバー側でStripe Checkoutのセッションを作る処理は、stripe.checkout.sessions.create

- ## クライアント側(React)でリダイレクト処理を実装
  - Checkoutのセッション内容をサーバー側で作成しているので、そのセッションのIDをredirectToCheckoutに渡す。

# 使用技術
- Node.js: 16.13.2
- npm: 8.1.2
- React: 17.0.2
- Amplify cli: 6.3.1 
- Stripe JavaScript SDK
- Stripe Node.js SDK
- Git: 2.35.1
