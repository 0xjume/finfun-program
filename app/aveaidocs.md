## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#searching-tokens)    Searching Tokens

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#search-for-the-tokens-associated-with-given-keyword)    Search for the tokens associated with given keyword

`GET` `https://prod.ave-api.com/v2/tokens?keyword={keyword}`

The keyword must not be null or empty, search by SYMBOL or CONTRACT ADDRESS, and will return max 100 tokens.

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters)    Query Parameters

Name

Type

Description

keyword\*

String

The keyword needed to query

chain

String

Optional

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#headers)    Headers

Name

Type

Description

X-API-KEY\*

String

Your API key needed to access the url

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"\",\"symbol\":\"\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"\",\"blueCheckmark\":\"\",\"description\":\"ATM既是永动机也是：提款机\\n核心：币涨赚币价 币跌分红赚\\n\\nBSC链首个传世币一币传三代\\nBSC链首个可以随意唱空的币\\nBSC链首个分红超级暴力的币\\nBSC链首个把波段当兄弟的币\\nBSC链首个不看池子和币价币\\nATM  首创多项龙头抓紧上车\\n\\n持有1枚即可开始享受暴力分红\\n机制：0.1营销 0.3回流 2.6分红\\n卖单： 额外无损增加100%分红\",\"website\":\"\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"https://twitter.com/ATMZWSQ\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"https://t.me/ATMZWSQ\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"\",\"tokenPriceUSD\":\"\"}",\
            "burn_amount": "1111111",\
            "buy_tx": "3.0",\
            "chain": "bsc",\
            "created_at": 1711179777,\
            "current_price_eth": 1.954695817865348e-8,\
            "current_price_usd": 0.000010993584854389429,\
            "decimal": 1,\
            "fdv": "775.415951365567664034926",\
            "holders": 14304,\
            "is_mintable": "0",\
            "launch_at": 0,\
            "launch_price": 0.011005913770273977,\
            "lock_amount": "0",\
            "locked_percent": "0",\
            "logo_url": "https://www.logofacade.com/token_icon_request/65ffb2a20a9e59af22dae8a5_1711256226.png",\
            "market_cap": "775.415951365567664034926",\
            "name": "ATM",\
            "other_amount": "879999999999999999999928355395",\
            "price_change_1d": -76.53,\
            "price_change_24h": -99.96,\
            "risk_info": "",\
            "risk_level": 1,\
            "risk_score": 20,\
            "sell_tx": "3.0",\
            "symbol": "ATM",\
            "token": "0xa5957e0e2565dc93880da7be32abcbdf55788888",\
            "total": "880000000000000000000000000000",\
            "tx_count_24h": 48128,\
            "tx_volume_u_24h": "13385053.845136339041938053689092560385856"\
        }\
    ]
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

Response Fields

Value Type

Description

token

varchar

chain

varchar

symbol

varchar

decimal

int

name

varchar

total

varchar

lock\_amount

varchar

burn\_amount

varchar

other\_amount

varchar

fdv

varchar

fdv = (total - burn\_amount - other\_amount) \* current\_price\_usd

market\_cap

varchar

market\_cap = (total - lock\_amount - burn\_amount - other\_amount) \* current\_price\_usd

launch\_price

float64

launch\_at

timestamp

current\_price\_eth

float64

calculate by the chain main token
xxprice MAIN TOKEN per xxx Token

current\_price\_usd

float64

price\_change\_1d

float64

daily price change, start from UTC+0
**\*** recommend

price\_change\_24h

float64

tx\_volume\_u\_24h

float64

tx\_count\_24h

float64

holders

int

logo\_url

varchar

maybe null or "" for empty logo, need client to set a default logo

intro\_en

varchar

intro\_cn

varchar

appendix

json varchar

Media info, like twitter, telegram, website, whitepaper, discord, qq, btok, facebook, reddit, etc

risk\_level

int

-1 - high risk token
0 - normal, unverified token
1 - listed token

(risk\_level == -1 or (risk\_level != 1 and risk\_score>55)) are high risk tokens

risk\_score

int

< 20 safe
<=55 normal
\> 55 high risk

buy\_tax

float varchar

sell\_tax

float varchar

locked\_to

date

locked\_percent

float varchar

lock\_platform

varchar

is\_mintable

int varchar

1 - mintable
0 - not mintable

created\_at

timestamp

updated\_at

timestamp

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-prices)    Get Token Prices

`POST` `https://prod.ave-api.com/v2/tokens/price`

Get token latest price

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#reqest-json-body)    Reqest Json Body

Name

Type

Description

token\_ids

Array

list of token ids, max 200 token ids

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
token_id = {CA}-{chain}
```

tvl\_min

Integer

token min tvl threshold to include into search result

( **default: 1000**, 0 means no threshold)

tx\_24h\_volume\_min

Integer

token min 24 hour volume threshold to include into search result ( **default: 0**, 0 means no threshold)

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#headers-1)    Headers

Name

Type

Description

X-API-KEY\*

String

Your API key needed to access the url

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-1)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-1)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-1)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-1)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-1)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-1)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "0xa00e5306902c3fddace62bdf391907753c941050-bsc": {
        "current_price_usd": "0.012685573605324015",
        "price_change_1d": "0.77",
        "price_change_24h": "26.94"
    },
    "6n7Janary9fqzxKaJVrhL9TG2F61VbAtwUMu1YZscaQS-solana": {
        "current_price_usd": "0.03965076926709177",
        "price_change_1d": "52431.13",
        "price_change_24h": "57077.67"
    }
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

Response Fields

Value Type

Description

current\_price\_usd

float varchar

price\_change\_1d

float varchar

price\_change\_24h

float varchar

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-rank-topics)    Get Token Rank Topics

`GET` `https://prod.ave-api.com/v2/ranks/topics`

Get token rank topics

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-2)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-2)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-2)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-2)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-2)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-2)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "id": "hot",\
            "name_en": "Hot",\
            "name_zh": "热门"\
        },\
        {\
            "id": "new",\
            "name_en": "New",\
            "name_zh": "新币"\
        },\
        {\
            "id": "meme",\
            "name_en": "Meme",\
            "name_zh": "Meme"\
        },\
        {\
            "id": "bsc",\
            "name_en": "BSC",\
            "name_zh": "BSC"\
        },\
        {\
            "id": "solana",\
            "name_en": "Solana",\
            "name_zh": "Solana"\
        },\
        {\
            "id": "depin",\
            "name_en": "Depin",\
            "name_zh": "Depin"\
        },\
        {\
            "id": "ai",\
            "name_en": "AI",\
            "name_zh": "AI"\
        },\
        {\
            "id": "l2",\
            "name_en": "L2",\
            "name_zh": "L2"\
        },\
        {\
            "id": "gamefi",\
            "name_en": "GameFi",\
            "name_zh": "GameFi"\
        },\
        {\
            "id": "rwa",\
            "name_en": "RWA",\
            "name_zh": "RWA"\
        },\
        {\
            "id": "gainer",\
            "name_en": "Gainers",\
            "name_zh": "涨幅榜"\
        },\
        {\
            "id": "loser",\
            "name_en": "Losers",\
            "name_zh": "跌幅榜"\
        },\
        {\
            "id": "eth",\
            "name_en": "Ethereum",\
            "name_zh": "Ethereum"\
        },\
        {\
            "id": "arbitrum",\
            "name_en": "Arbitrum",\
            "name_zh": "Arbitrum"\
        },\
        {\
            "id": "blast",\
            "name_en": "Blast",\
            "name_zh": "Blast"\
        },\
        {\
            "id": "avalance",\
            "name_en": "Avalanche",\
            "name_zh": "Avalanche"\
        },\
        {\
            "id": "base",\
            "name_en": "Base",\
            "name_zh": "Base"\
        },\
        {\
            "id": "polygon",\
            "name_en": "Polygon",\
            "name_zh": "Polygon"\
        },\
        {\
            "id": "optimism",\
            "name_en": "Optimism",\
            "name_zh": "Optimism"\
        }\
    ]
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-list-by-topic)    Get Token List By Topic

`GET` `https://prod.ave-api.com/v2/ranks?topic={topic}`

Get token topic token list, each list will return max 100 tokens

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-1)    Query Parameters

Name

Type

Description

topic

String

topic in topic list

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-3)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-3)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-3)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-3)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-3)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-3)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"\",\"symbol\":\"\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"\",\"blueCheckmark\":\"\",\"description\":\"\",\"website\":\"\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"https://t.me/MewsWorld\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"\",\"tokenPriceUSD\":\"\"}",\
            "burn_amount": "0",\
            "chain": "solana",\
            "created_at": 1711430534,\
            "current_price_eth": "0.00003421957757978723",\
            "current_price_usd": "0.006081748538686991",\
            "decimal": 5,\
            "fdv": "540598982.18767202367296030399926",\
            "holders": 221951,\
            "is_mintable": "0",\
            "launch_at": 0,\
            "launch_price": "0.0000070993223869",\
            "lock_amount": "0",\
            "locked_percent": "0",\
            "logo_url": "https://www.logofacade.com/token_icon/solana/MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5.png",\
            "market_cap": "540598982.18767202367296030399926",\
            "other_amount": "0",\
            "price_change_1d": "-9.25",\
            "price_change_24h": "20.74",\
            "risk_info": "",\
            "risk_level": 1,\
            "risk_score": "40",\
            "symbol": "MEW",\
            "token": "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",\
            "total": "88888742891.75786",\
            "tx_count_24h": 126721,\
            "tx_volume_u_24h": "109495471.288093117535227109229691630000000000"\
        }\
     ]
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-details)    Get Token Details

`GET` `https://prod.ave-api.com/v2/tokens/{token-id}`

Get token details

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-2)    Query Parameters

Name

Type

Description

token\_id

string

token\_id = {token}-{chain}
eg: 0x05ea877924ec89ee62eefe483a8af97e77daeefd-bsc

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-4)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-4)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-4)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-4)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-4)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-4)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": {
        "token": {
            "token": "0x05ea877924ec89ee62eefe483a8af97e77daeefd",
            "chain": "bsc",
            "decimal": 18,
            "name": "BOBO",
            "symbol": "BOBO",
            "total": "1000000000000",
            "holders": 3793,
            "launch_price": "0.0006054343785418926",
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"\",\"symbol\":\"\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"\",\"blueCheckmark\":\"\",\"description\":\"全网首创机制融合\\n👑LP持有者的最爱👑\\n🏵【代币名称】BOBO\\n🍣【发行总量】10000亿\\n🍧【买卖滑点】0%\\n🍄【机制特点】双卖出（跟随卖单卖出10分之一代币）\\n⭐️100%-LP分红（LP初始值对等的双边0.02BNB值以上）分红BNB\\n⭐️DAPP燃烧BOBO代币双倍出局\\n⭐️发射同步上线用BOBO游戏(可以用BOBO打怪爆BOBO)\\n⭐️底池燃烧（每小时燃烧百分之0.5）解决双卖出币价难上升问题\",\"website\":\"https://boboburn.com/\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"https://twitter.com/BOBOchickenLabs\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"https://t.me/BOBOchickenLabs\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"\",\"tokenPriceUSD\":\"\"}",
            "current_price_eth": "0.0000013810279763043007",
            "current_price_usd": "0.0007970455833249669",
            "price_change_1d": "-19.39",
            "price_change_24h": "-39.87",
            "risk_level": 1,
            "logo_url": "token_icon_request/6615111dfef095f7284334b6_1712656669.png",
            "risk_info": "",
            "lock_amount": "0",
            "burn_amount": "57497126.43533818",
            "other_amount": "999865634173.392",
            "risk_score": "40",
            "launch_at": 0,
            "created_at": 1711782568,
            "tx_volume_u_24h": "26650.53771660843443877978186301868100000000000",
            "tx_count_24h": 341,
            "buy_tx": "0.0",
            "sell_tx": "0.0",
            "locked_percent": "0.0000574971264353",
            "is_mintable": "0",
            "market_cap": "61267.857968551224185880436393758",
            "fdv": "61267.857968551224185880436393758"
        },
        "pairs": [\
            {\
                "reserve0": "54526822.29903",\
                "reserve1": "75.07558",\
                "token0_price_eth": "0.00000",\
                "token0_price_usd": "0.00080",\
                "token1_price_eth": "1.00344",\
                "token1_price_usd": "579.12425",\
                "price_change": "-19.39000",\
                "price_change_24h": "-32.73000",\
                "volume_u": "26650.52514",\
                "low_u": "0.00078",\
                "high_u": "0.00120",\
                "fee": "0.00000",\
                "total_supply": "0.00000",\
                "tx_amount": "0.00000",\
                "pair": "0x9a23cd83f3882f9cf14ed29681ba132b217a0ade",\
                "chain": "bsc",\
                "amm": "cakev2",\
                "token0_address": "0x05ea877924ec89ee62eefe483a8af97e77daeefd",\
                "token0_symbol": "BOBO",\
                "token0_decimal": 18,\
                "token1_address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",\
                "token1_symbol": "WBNB",\
                "token1_decimal": 18,\
                "target_token": "0x05ea877924ec89ee62eefe483a8af97e77daeefd",\
                "created_at": 1711782568,\
                "tx_count": 340,\
                "updated_at": 1713170128,\
                "swap_url": "https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=",\
                "show_name": "PancakeSwapV2",\
                "is_fake": false\
            },\
            {\
                "reserve0": "44.41217",\
                "reserve1": "0.03567",\
                "token0_price_eth": "0.00000",\
                "token0_price_usd": "0.00108",\
                "token1_price_eth": "0.00178",\
                "token1_price_usd": "1.00000",\
                "price_change": "-28.32000",\
                "price_change_24h": "-28.32000",\
                "volume_u": "0.01257",\
                "low_u": "0.00108",\
                "high_u": "0.00151",\
                "fee": "0.00000",\
                "total_supply": "0.00000",\
                "tx_amount": "0.00000",\
                "pair": "0xe5b343c2d3964da91e9228ff9c2490082da90768",\
                "chain": "bsc",\
                "amm": "cakev2",\
                "token0_address": "0x05ea877924ec89ee62eefe483a8af97e77daeefd",\
                "token0_symbol": "BOBO",\
                "token0_decimal": 18,\
                "token1_address": "0x55d398326f99059ff775485246999027b3197955",\
                "token1_symbol": "USDT",\
                "token1_decimal": 18,\
                "target_token": "0x05ea877924ec89ee62eefe483a8af97e77daeefd",\
                "created_at": 1712853968,\
                "tx_count": 1,\
                "updated_at": 1713145270,\
                "swap_url": "https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=",\
                "show_name": "PancakeSwapV2",\
                "is_fake": false\
            }\
        ],
        "is_audited": true
    }
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#response-json-data)    Response Json Data

Name

Type

Description

--for pair info ----

reserve0

float64 varchar

the amount of token0

reserve1

float54 varchar

the amount of token1

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-pair-kine-data)    Get Pair Kine Data

`GET` `https://prod.ave-api.com/v2/klines/pair/{pair-id}?interval={interval}&size={size}`

Get token details

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-3)    Query Parameters

Name

Type

Description

pair\_id

string

token\_id = {pair}-{chain}
eg: 2prhzdRwWzas2f4g5AAjyRUBcQcdajxd8NAzKcqhv76P-solana

category

string

default is `u`, means return usd value kline data. `r` means return base token value kline data

interval

int

The time interval of K-Line, 1,5,15,30,60,120,240,1440,4320,10080,43200,525600,2628000

limit

int

The number of records need to return

to\_time

int

default null, means latest now

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-5)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-5)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-5)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-5)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-5)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-5)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": {
        "points": [\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "397.95555",\
                "time": 1713249720\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "760.01015",\
                "time": 1713249780\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "62.67269",\
                "time": 1713249840\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "999.33870",\
                "time": 1713249900\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "1906.47970",\
                "time": 1713249960\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00007",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "118.31160",\
                "time": 1713250020\
            }\
        ],
        "to_time": 1713250049870,
        "limit": 5,
        "interval": 1,
        "pair_id": "2prhzdRwWzas2f4g5AAjyRUBcQcdajxd8NAzKcqhv76P-solana"
    }
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-kine-data)    Get Token Kine Data

`GET` `https://prod.ave-api.com/v2/klines/token/{token-id}?interval={interval}&size={size}`

Get token details

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-4)    Query Parameters

Name

Type

Description

token\_id

string

token\_id = {token}-{chain}
eg: 5hmf8Jt9puwoqiFQTb3vr22732ZTKYRLRw9Vo7tN3rcz-solana

interval

int

The time interval of K-Line, 1,5,15,30,60,120,240,1440,4320,10080,43200,525600,2628000

limit

int

The number of records need to return

to\_time

int

default null, means latest now

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-6)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-6)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-6)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-6)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-6)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-6)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": {
        "points": [\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "397.95555",\
                "time": 1713249720\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "760.01015",\
                "time": 1713249780\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "62.67269",\
                "time": 1713249840\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "999.33870",\
                "time": 1713249900\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00000",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "1906.47970",\
                "time": 1713249960\
            },\
            {\
                "open": "0.00007",\
                "high": "0.00007",\
                "low": "0.00007",\
                "close": "0.00007",\
                "volume": "118.31160",\
                "time": 1713250020\
            }\
        ],
        "to_time": 1713250049870,
        "limit": 5,
        "interval": 1,
        "pair_id": "2prhzdRwWzas2f4g5AAjyRUBcQcdajxd8NAzKcqhv76P-solana"
    }
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-token-top100-holders)    Get Token Top100 Holders

`GET` `https://prod.ave-api.com/v2/tokens/top100/{token-id}`

Get token details

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-5)    Query Parameters

Name

Type

Description

token\_id

string

token\_id = {token}-{chain}
eg: 0xd1fa42f9c7dcb525231e2cf6db0235290ada6381-bsc

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-7)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-7)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-7)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-7)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-7)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-7)

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "address": "0xc54345d69323f7921a6b4ba73274f2a18c6d65cb",\
            "amount_cur": 295122908.6325318,\
            "amount_diff_3days": 75573430.57886718,\
            "cost_cur": 0,\
            "cost_diff_3days": 0,\
            "sell_amount_cur": 0,\
            "sell_amount_diff_3days": 0,\
            "sell_volume_cur": 0,\
            "sell_volume_diff_3days": 0,\
            "buy_volume_cur": 0,\
            "buy_volume_diff_3days": 0,\
            "buy_amount_cur": 0,\
            "buy_amount_diff_3days": 0,\
            "buy_tx_count_cur": 0,\
            "sell_tx_count_cur": 0,\
            "trade_first_at": 0,\
            "trade_last_at": 0\
        }\
    ]
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-pair-txs)    Get Pair Txs

`GET` `https://prod.ave-api.com/v2/txs/{pair-id}?limit={limit}&size={size}&to_time={to_time}`

Get token details

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-parameters-6)    Query Parameters

Name

Type

Description

pair\_id

string

pair\_id = {pair}-{chain}
eg: 0xd1fa42f9c7dcb525231e2cf6db0235290ada6381\_fo-bsc

limit

int

The number of records need to return

to\_time

int

default null, means latest now

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-8)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-8)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-8)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-8)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-8)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-8)

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": {
        "txs": [\
            {\
                "amount_usd": "4.6478469842598128928927902253772685980948",\
                "pair_liquidity_usd": "4114.0860450816022067136842404169458404794568",\
                "from_token_price_usd": "0.0000154374965416997873357898840573909638",\
                "from_token_amount": "301075.175738828000000000",\
                "from_token_reserve": "262610577.487939991000000000",\
                "to_token_price_usd": "506.4977167714089887340378481894731521606445",\
                "to_token_amount": "0.009176442124728205",\
                "to_token_reserve": "8.122615184341213972",\
                "tx_time": 1725851508,\
                "chain": "bsc",\
                "tx_hash": "0x0adc873ff7300abacaacf90e7a1a443ddfd6cef94abcda8778d90479ce266360",\
                "block_number": 42091589,\
                "amm": "fourmeme",\
                "sender_address": "0x0ef9cbfb61e7a9653763bc19383bd9efb5c86c72",\
                "pair_address": "0xd1fa42f9c7dcb525231e2cf6db0235290ada6381_fo",\
                "from_token_address": "0xd1fa42f9c7dcb525231e2cf6db0235290ada6381",\
                "from_token_symbol": "CZ",\
                "to_token_address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",\
                "to_token_symbol": "WBNB",\
                "wallet_address": "0x0ef9cbfb61e7a9653763bc19383bd9efb5c86c72"\
            },\
            {\
                "amount_usd": "12.5897345154895051636057933811212024011184",\
                "pair_liquidity_usd": "4103.0524842090800603119453388921076566475676",\
                "from_token_price_usd": "503.5893806195803676928335335105657577514648",\
                "from_token_amount": "0.024999999999999992",\
                "from_token_reserve": "8.147615184341213964",\
                "to_token_price_usd": "0.0000153639092157726698617634802923603843",\
                "to_token_amount": "819435.622710190000000000",\
                "to_token_reserve": "261791141.865229801000000000",\
                "tx_time": 1725862283,\
                "chain": "bsc",\
                "tx_hash": "0x419899ad81ca2b331bf0c5c44906e515c97dfd0858282e6ce2e7a52d88d968c7",\
                "block_number": 42095170,\
                "amm": "fourmeme",\
                "sender_address": "0x41b088d0ce656fcef416deefeca6a7b92b227913",\
                "pair_address": "0xd1fa42f9c7dcb525231e2cf6db0235290ada6381_fo",\
                "from_token_address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",\
                "from_token_symbol": "WBNB",\
                "to_token_address": "0xd1fa42f9c7dcb525231e2cf6db0235290ada6381",\
                "to_token_symbol": "CZ",\
                "wallet_address": "0x41b088d0ce656fcef416deefeca6a7b92b227913"\
            }\
        ],
        "total_count": 2,
        "to_time": 1725862619,
        "limit": 2,
        "pair_id": "0xd1fa42f9c7dcb525231e2cf6db0235290ada6381_fo-bsc"
    }
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-supported-chains)    Get Supported Chains

`GET` `https://prod.ave-api.com/v2/supported_chains`

Get all the chains, supported by ave

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-9)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-9)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-9)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-9)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-9)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-9)

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "chain_id": "1",\
            "name": "Ethereum",\
            "chain": "eth",\
            "description": "Ethereum Mainnet",\
            "rpc_url": "https://ethereum.blockpi.network/v1/rpc/public",\
            "block_explorer_url": "https://etherscan.io"\
        },\
        {\
            "chain_id": "10",\
            "name": "Optimism",\
            "chain": "optimism",\
            "description": "optimism",\
            "rpc_url": "https://mainnet.optimism.io/",\
            "block_explorer_url": "https://optimistic.etherscan.io"\
        }\
    ]
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-chain-main-tokens)    Get Chain Main Tokens

`GET` `https://prod.ave-api.com/v2/tokens/main?chain={chain_name}`

Get chain's main token list

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-10)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-10)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-10)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-10)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-10)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-10)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "total": "5735594.696400789416534983",\
            "launch_price": "3.8325531645907494439061804320321497281181",\
            "current_price_eth": "0.9862919877318664",\
            "current_price_usd": "1.6678588971613824",\
            "price_change_1d": "-1.73",\
            "price_change_24h": "0.01",\
            "lock_amount": "0",\
            "burn_amount": "0",\
            "other_amount": "0",\
            "tx_volume_u_24h": "4322731.5412745204009029611144757112966908000000",\
            "locked_percent": "0",\
            "market_cap": "9566162.6449036945437237410662287662404992",\
            "fdv": "9566162.6449036945437237410662287662404992",\
            "token": "0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f",\
            "chain": "core",\
            "decimal": 18,\
            "name": "Core DAO",\
            "symbol": "WCORE",\
            "holders": 133988,\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"Core DAO\",\"symbol\":\"WCORE\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"2100000000\",\"blueCheckmark\":\"\",\"description\":\"CoreDAO - the official org developing the Satoshi Plus ecosystem and building web3 infrastructure on Bitcoin’s PoW.\",\"website\":\"https://www.coredao.org/\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"https://twitter.com/Coredao_Org\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"https://t.me/CoreDAOTelegram\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"https://docs.coredao.org/core-white-paper-v1.0.5/\",\"tokenPriceUSD\":\"\"}",\
            "risk_level": 1,\
            "logo_url": "token_icon/core/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f_1702054848.png",\
            "risk_info": "{\"zh-cn\":\"\",\"zh-tw\":\"\",\"en\":\"\"}",\
            "risk_score": "40",\
            "launch_at": 0,\
            "created_at": 1675894134,\
            "tx_count_24h": 98031,\
            "buy_tx": "0.0",\
            "sell_tx": "0.0",\
            "is_mintable": "0"\
        },\
        {\
            "total": "2627098.125166",\
            "launch_price": "1.011251873258142229400000000000",\
            "current_price_eth": "0.5913511010121423",\
            "current_price_usd": "0.9994640155257786",\
            "price_change_1d": "0.04",\
            "price_change_24h": "0.02",\
            "lock_amount": "0",\
            "burn_amount": "0",\
            "other_amount": "0",\
            "tx_volume_u_24h": "740838.1263046855923711816998449208981312000000",\
            "locked_percent": "0",\
            "market_cap": "2625690.0413586548758024042476",\
            "fdv": "2625690.0413586548758024042476",\
            "token": "0x900101d06a7426441ae63e9ab3b9b0f63be145f1",\
            "chain": "core",\
            "decimal": 6,\
            "symbol": "USDT",\
            "holders": 868957,\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"\",\"symbol\":\"\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"\",\"blueCheckmark\":\"\",\"description\":\"\",\"website\":\"\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"\",\"tokenPriceUSD\":\"\"}",\
            "risk_level": 1,\
            "logo_url": "token_icon/core/0x900101d06a7426441ae63e9ab3b9b0f63be145f1.png",\
            "risk_info": "",\
            "risk_score": "40",\
            "launch_at": 0,\
            "created_at": 1679419324,\
            "tx_count_24h": 16771,\
            "buy_tx": "0.0",\
            "sell_tx": "0.0",\
            "is_mintable": "0"\
        }\
    ]
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-chain-trending-list)    Get Chain Trending List

`GET` `https://prod.ave-api.com/v2/tokens/trending?chain={chain_name}`

Get chain's main token list

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-11)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-11)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-11)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-11)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-11)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-11)

Copy

````inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
```json
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": [\
        {\
            "total": "5735594.696400789416534983",\
            "launch_price": "3.8325531645907494439061804320321497281181",\
            "current_price_eth": "0.9862919877318664",\
            "current_price_usd": "1.6678588971613824",\
            "price_change_1d": "-1.73",\
            "price_change_24h": "0.01",\
            "lock_amount": "0",\
            "burn_amount": "0",\
            "other_amount": "0",\
            "tx_volume_u_24h": "4322731.5412745204009029611144757112966908000000",\
            "locked_percent": "0",\
            "market_cap": "9566162.6449036945437237410662287662404992",\
            "fdv": "9566162.6449036945437237410662287662404992",\
            "token": "0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f",\
            "chain": "core",\
            "decimal": 18,\
            "name": "Core DAO",\
            "symbol": "WCORE",\
            "holders": 133988,\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"Core DAO\",\"symbol\":\"WCORE\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"2100000000\",\"blueCheckmark\":\"\",\"description\":\"CoreDAO - the official org developing the Satoshi Plus ecosystem and building web3 infrastructure on Bitcoin’s PoW.\",\"website\":\"https://www.coredao.org/\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"https://twitter.com/Coredao_Org\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"https://t.me/CoreDAOTelegram\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"https://docs.coredao.org/core-white-paper-v1.0.5/\",\"tokenPriceUSD\":\"\"}",\
            "risk_level": 1,\
            "logo_url": "token_icon/core/0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f_1702054848.png",\
            "risk_info": "{\"zh-cn\":\"\",\"zh-tw\":\"\",\"en\":\"\"}",\
            "risk_score": "40",\
            "launch_at": 0,\
            "created_at": 1675894134,\
            "tx_count_24h": 98031,\
            "buy_tx": "0.0",\
            "sell_tx": "0.0",\
            "is_mintable": "0"\
        },\
        {\
            "total": "2627098.125166",\
            "launch_price": "1.011251873258142229400000000000",\
            "current_price_eth": "0.5913511010121423",\
            "current_price_usd": "0.9994640155257786",\
            "price_change_1d": "0.04",\
            "price_change_24h": "0.02",\
            "lock_amount": "0",\
            "burn_amount": "0",\
            "other_amount": "0",\
            "tx_volume_u_24h": "740838.1263046855923711816998449208981312000000",\
            "locked_percent": "0",\
            "market_cap": "2625690.0413586548758024042476",\
            "fdv": "2625690.0413586548758024042476",\
            "token": "0x900101d06a7426441ae63e9ab3b9b0f63be145f1",\
            "chain": "core",\
            "decimal": 6,\
            "symbol": "USDT",\
            "holders": 868957,\
            "appendix": "{\"contractAddress\":\"\",\"tokenName\":\"\",\"symbol\":\"\",\"divisor\":\"\",\"tokenType\":\"\",\"totalSupply\":\"\",\"blueCheckmark\":\"\",\"description\":\"\",\"website\":\"\",\"email\":\"\",\"blog\":\"\",\"reddit\":\"\",\"slack\":\"\",\"facebook\":\"\",\"twitter\":\"\",\"btok\":\"\",\"bitcointalk\":\"\",\"github\":\"\",\"telegram\":\"\",\"wechat\":\"\",\"linkedin\":\"\",\"discord\":\"\",\"qq\":\"\",\"whitepaper\":\"\",\"tokenPriceUSD\":\"\"}",\
            "risk_level": 1,\
            "logo_url": "token_icon/core/0x900101d06a7426441ae63e9ab3b9b0f63be145f1.png",\
            "risk_info": "",\
            "risk_score": "40",\
            "launch_at": 0,\
            "created_at": 1679419324,\
            "tx_count_24h": 16771,\
            "buy_tx": "0.0",\
            "sell_tx": "0.0",\
            "is_mintable": "0"\
        }\
    ]
}
```
````

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

## [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#get-contract-risk-detection-report)    Get Contract Risk Detection Report

`GET` `https://prod.ave-api.com/v2/contracts/{token-id}`

Get contract risk detection report

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#query-paramters)    Query Paramters

Params

Description

token\_id

token\_id = {token}-{chain}
eg: 0x05ea877924ec89ee62eefe483a8af97e77daeefd-bsc

#### [Direct link to heading](https://docs.ave.ai/reference/api-reference/v2\#reponse-body)    Reponse Body

200: OK Success

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-200-ok-success-12)

400: Bad Request The parameters may be invalid

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-400-bad-request-the-parameters-may-be-invalid-12)

401: Unauthorized Ave-auth does not exist or is not correct

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-401-unauthorized-ave-auth-does-not-exist-or-is-not-correct-12)

404: Not Found Not found any matched results

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-404-not-found-not-found-any-matched-results-12)

500: Internal Server Error Some unknown error occurred

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-500-internal-server-error-some-unknown-error-occurred-12)

403: Forbidden The limit of this API has been reached

[Direct link to tab](https://docs.ave.ai/reference/api-reference/v2#tab-id-403-forbidden-the-limit-of-this-api-has-been-reached-12)

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
    "status": 1,
    "msg": "SUCCESS",
    "data_type": 1,
    "data": {
        "analysis_big_wallet": "1",
        "analysis_creator_gt_5percent": 69,
        "analysis_lp_creator_gt_5percent": 0,
        "analysis_lp_current_adequate": "0",
        "analysis_lp_current_volume": 38,
        "analysis_scam_wallet": "0",
        "anti_whale_modifiable": "0",
        "approve_gas": "",
        "big_lp_without_any_lock": 1,
        "burn_amount": 0,
        "buy_gas": "",
        "buy_tax": 0,
        "can_take_back_ownership": "0",
        "cannot_buy": "0",
        "cannot_sell_all": "0",
        "chain": "eth",
        "creator_address": "0x77bf1ce8a52984edd089406883eff2ee80b6173b",
        "creator_balance": "5743.900487564855038081",
        "creator_percent": "0.687152",
        "decimal": "0",
        "dex": [\
            {\
                "amm": "uniswapv2",\
                "liquidity": "37.77464736477205421370573086038483660274720092473624",\
                "name": "Uniswapv2: SCFI v2/WETH",\
                "pair": "0xa1e3ad027e043883b310bcfea573c23428dc0d08"\
            }\
        ],
        "err_code": "",
        "err_msg": "",
        "external_call": "0",
        "has_black_method": 0, // 1- has a black list, 0 false
        "has_code": 1,
        "has_mint_method": 0,
        "has_white_method": 0,// 1 - has a white list, 0 false
        "hidden_owner": "0", // "1" - has a hidden owner
        "holders": 45,
        "honeypot_with_same_creator": "0",
        "is_anti_whale": "0",
        "is_honeypot": -1, // 1 means honeypot token, 0 means not, -1 uncheck
        "is_in_dex": "1",
        "is_open_source": "1",
        "is_proxy": "0",
        "lock_amount": 0,
        "owner": "0x77bf1ce8a52984edd089406883eff2ee80b6173b",
        "owner_balance": "5743.900487564855038081",
        "owner_change_balance": "0",
        "owner_percent": "0.687152",
        "pair_holders": 3,
        "pair_holders_rank": [\
            {\
                "address": "0xaa3d85ad9d128dfecb55424085754f6dfa643eb1",\
                "analysis_show_warning": "1",\
                "mark": null,\
                "percent": "0.900487",\
                "quantity": "0.43732139211339754"\
            },\
            {\
                "address": "0x664c556f541066791cd50bfe290d70947bd33989",\
                "mark": null,\
                "percent": "0.099513",\
                "quantity": "0.0483285258957821"\
            },\
            {\
                "address": "0x0000000000000000000000000000000000000000",\
                "lock": [ // means lock\
\
                ],\
                "mark": "Null Address",\
                "percent": "0.000000",\
                "quantity": "0.000000000000001"\
            }\
        ],
        "pair_lock_percent": 0,
        "pair_total": "0.485649918009180631",
        "personal_slippage_modifiable": "0",
        "query_count": 1,
        "risk_score": 66,
        "selfdestruct": "0",
        "sell_gas": "",
        "sell_tax": 0,
        "slippage_modifiable": 0,
        "token": "0x6debc4e5d398f7c32af927a43cd2fcc523764ba2",
        "token_holders_rank": [\
            {\
                "address": "0x77bf1ce8a52984edd089406883eff2ee80b6173b",\
                "analysis_show_creator": "1",\
                "analysis_show_warning": "1",\
                "mark": null,\
                "percent": "0",\
                "quantity": "5743.900487564855"\
            },\
            {\
                "address": "0xcdab9cd0ee3d0c53b5c63905821d0c2d36054efe",\
                "analysis_show_warning": "1",\
                "mark": null,\
                "percent": "0",\
                "quantity": "2025.139"\
            },\
            {\
                "address": "0x775c72e667f63e2e30cf70a8b575420d20690ddf",\
                "mark": null,\
                "percent": "0",\
                "quantity": "400"\
            },\
            {\
                "address": "0xa1e3ad027e043883b310bcfea573c23428dc0d08",\
                "is_contract": 1,\
                "is_lp": 1,\
                "mark": "Uniswapv2: SCFI v2/WETH",\
                "percent": "0",\
                "quantity": "26.30999566495795"\
            },\
            {\
                "address": "0xa5219a16124a300042b032f23244a04c374f1b81",\
                "mark": null,\
                "percent": "0",\
                "quantity": "20.235677987022843"\
            },\
            {\
                "address": "0x50cc45d132131b87d909780d86a7b0b3ab05994c",\
                "mark": null,\
                "percent": "0",\
                "quantity": "20"\
            },\
            {\
                "address": "0xd48fae12b4bd481c29130c236f0b345e77d1ac5f",\
                "mark": null,\
                "percent": "0",\
                "quantity": "19.63595199256127"\
            },\
            {\
                "address": "0xe4571cb68853756299a7778c0256a83ff6a9e36b",\
                "mark": null,\
                "percent": "0",\
                "quantity": "18.521243551733118"\
            },\
            {\
                "address": "0x93f5af632ce523286e033f0510e9b3c9710f4489",\
                "mark": null,\
                "percent": "0",\
                "quantity": "16.587060326544457"\
            },\
            {\
                "address": "0xc36d8626fd835739cc08c6248accb06bd75864f1",\
                "mark": null,\
                "percent": "0",\
                "quantity": "12"\
            }\
        ],
        "token_lock_percent": 0,
        "token_name": "Semi Centralized Finance v2",
        "token_symbol": "SCFI v2",
        "total": "8359",
        "trading_cooldown": "0",
        "transfer_pausable": "0"
    }
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.BadRequestError'> : \"keyword\" parameter must not be empty",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.UnauthorizedError'> : Permission denied",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.NotFoundError'> : Not found any matched results",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 2,
  "msg": "<class 'decimal.InvalidOperation'> : Unknown error, check logs for more information",
  "data": {}
}
```

Copy

```inline-grid min-w-full grid-cols-[auto_1fr] p-2 [count-reset:line]
{
  "code": 1,
  "msg": "<class 'openapi.error.ForbiddenError'> : The limit of this API has been reached today",
  "data": {}
}
```

[PreviousAPI Reference](https://docs.ave.ai/reference/api-reference)

Last updated 27 days ago