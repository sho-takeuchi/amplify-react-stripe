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

- 


# 使用技術
- Node.js v16.13.2
- Express 4.16.1
- Sequelize 　6.15.1
- PostgreSQL
- Docker
- AWS
    - CDK(TypeScript)
    - RDS(PostgreSQL) 
    - ECR
    - ECS(fargate)
    
## Node.js、Express、Sequelize、PostgreSQLを使う理由
将来的にこちらのアプリを何らかのデータ保存場所(画像など)に使用することを想定している。
別のアプリで、AWS Amplify×REST APIを使用するときに、Lambda関数の実行環境を個人的にNode.js→テンプレートをServerless ExpressJS function (Integration with API Gateway)を選択しているため、Node.js(Express)を使用している。

## Docker(代表的なコンテナ技術)を使う理由
仮想マシン(単一のサーバー上で複数のOSを稼働させる技術)とは違い、コンテナは、サーバーのリソース(CPU、メモリ、ファイルシステム、プロセス空間など)を効率的に使用でき、起動や停止が高速で行えます。そして、1個のコンテナイメージから複数のコンテナを起動できるため、必要な数だけ起動や停止が可能という「スケーラビリティ」にも優れています。また、Docker(同じイメージ)を使えば開発チームの環境を全く同じにできるのもメリットです。

## ECS(fargate)を使う理由
- ECS(EC2起動タイプ)では、コンテナのためのEC2インスタンスのOSやDockerAgent、ミドルウェアなどの構築や設定操作管理が必要。
- fargateでは、上記の手間が省ける。
- インスタンスタイプやクラスター管理が不要になる。
- 負荷に応じたオートスケール機能をキャパシティの考慮不要で利用できる。

## CDKを使う理由
- 手動でリソースを作成する場合と比べて、環境構築が容易
- 手動でリソースを作成する場合と比べて、環境構築時の作業漏れ(ヒューマンエラー)が殆ど発生しない。
- インフラ構成をコード化しているため、使用しているリソースが一目でわかる
- レビューが容易

## Github Actionsを使う理由(実装予定)

# AWS(インフラ)構成図
![template1-designer](https://user-images.githubusercontent.com/58723017/153323823-de803e7f-7b88-4fd6-99f5-7b95493e666a.png)

