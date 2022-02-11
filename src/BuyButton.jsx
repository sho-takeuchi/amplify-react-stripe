import { Button } from 'reactstrap'
import {loadStripe} from '@stripe/stripe-js';

export function BuyButton({price}) {
    const handleClick = async () => {
        const stripe = await loadStripe(process.env.REACT_APP_API_STRIPE_PUBLISHABLE_API_KEY) //こちらのキーはフロントエンドでしようする公開可能キー(.envに記載)
        stripe.redirectToCheckout({
            lineItems: [{ //決済する料金のリスト
                price: price.id,
                quantity: 1 //対応する料金は1単位
            }],
            mode: price.recurring ? 'subscription' : 'payment',
            successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`, //決済が完了したときにリダイレクトするページのURL
            cancelUrl: window.location.origin, //決済せずに戻る場合のURL
            submitType: 'donate', //決済ボタンの表記をカスタマイズ
            billingAddressCollection: 'required', //住所入力必須
            shippingAddressCollection: { //住所を日本に固定
                allowedCountries: ['JP']
            }
        })
    }
    return (
        <Button block onClick={handleClick}>
            {`${price.unit_amount.toLocaleString()} ${price.currency.toLocaleUpperCase()}`}
            {price.recurring ? (
            <>
                {` / per ${price.recurring.interval_count} ${price.recurring.interval}`}
                </>
            ): null}
        </Button>
    )
}