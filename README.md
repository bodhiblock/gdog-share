# gdog-share

### giftboxboard Demo ./test/giftboxboard.js
```javascript   
let giftboxboard = new giftboxboard({
    text: 'Useraaaaaa1231231的礼盒',
    value: 1000000,
    scale: 0.4,
})      

await giftboxboard.initBg()
await giftboxboard.setData({
    text: '3112432432',
    value: 999,
})

console.log(await giftboxboard.getBuffer())
await giftboxboard.setData({
    text: '34399-----',
    value: 8888,
});
console.log(await giftboxboard.getBuffer())

```

### redpacketboard Demo ./test/redpacketboard.js
```javascript
let purple = new redpacketboard({
    text: 'Useraaaaaa1231231的红包',
    value: 1000000,
})
await purple.initBg()
await purple.setData({
    text: '3112432432',
    value: 999,
})

console.log(await purple.getBuffer())
await purple.setData({
    text: '34399-----',
    value: 8888,
});
console.log(await purple.getBuffer())
```

### Leaderboard Demo ./test/leaderboard.js
```
const shareData = {
    bot_id: 0,
    lang: 'en',
    chat_id: -1001560943991,
    symbol: 'ICCE',
    name: 'ICCEhs',
    token_contract: '0x890a3a3e648e3cb345a8bd4e06878351e1c93f15',
    title: '创世新币',
    create_time: '2023-07-31T11:00:23.000Z',
    total_market_cap: 9918,
    price: 0.000009918572141355937,
    liquidity: 3.9957446176515643,
    buy_count: 144444,
    sell_count: 1,
    holders: 14,
    total_holders: 16,
    token0_total_supply: 1000000000000000,
    txcount: 16,
    lp_totalsupply: "28931540249580343",
    "twitter_related": {
        "related_count": 86,
        "first_time": "2023-08-08T21:52:17.000Z",
        "retweet_count": 1251,
        "favorite_count": 101,
        "followers_count": 25704,
        "friends_count": 13052,
        "favourites_count": 198096,
        "statuses_count": 130729,
        "listed_count": 402
    },
    twitter_info: {},
    audit_info: {
        opensource: true,
        tax_buy: 0,
        tax_sell: 0.5976352755200698,
        is_honeypot: 0,
        owner_status: 'dropped',
        owner: '0x0000000000000000000000000000000000000000'
    },
    "lp_lockers": [
        {
            "amount": "28355802598612716",
            "expire": "2024-02-14T11:00:00.000Z",
            "address": "0xfaded4614c023dc186D789CfD73921c75bd746Da"
        }
    ],
    "token_lockers": [
        {
            "address": "0xfaded4614c023dc186D789CfD73921c75bd746Da",
            "amount": "13580000000001",
            "expire": "2023-08-31T10:00:00.000Z"
        },
        {
            "address": "0xfaded4614c023dc186D789CfD73921c75bd746Da",
            "amount": "13580000000001",
            "expire": "2023-08-31T10:00:00.000Z"
        },
        {
            "address": "0xfaded4614c023dc186D789CfD73921c75bd746Da",
            "amount": "13580000000001",
            "expire": "2023-08-31T10:00:00.000Z"
        }
    ]
}


async function test() {

    
    /*
    * option:{
    *   styleType: 'green',  // green=potential, blue=new, purple=hot, diy=<diy>
    *   diyText: 'DIY DEMO' // max length 8
    * }
    * logoPath="/data/gdogstatic/logo/"
    * QRUrl="https://t.g.dog/tgapp/?tokendetail="
    * scale 0.8
    * */
    
    console.time('diy');
    let diy = new Leaderboard({
        styleType: 'diy',
        diyText: 'Diy Demo'
    });
    await diy.initBg();
    console.time('diy setData');
    await diy.setData(shareData);
    console.timeEnd('diy setData');
    diy.getBuffer()
    // console.log(diy.getBuffer());

    shareData.symbol = 'DEMO';
    console.time('diy setData update');
    await diy.setData(shareData);
    diy.getBuffer()
    console.timeEnd('diy setData update');

    console.timeEnd('diy');
    diy.getPNG();

    let green = new Leaderboard('green');
    await green.initBg();
    await green.setData(shareData);
    green.getPNG();
    console.log(green.getBuffer());

    let blue = new Leaderboard('blue');
    await blue.initBg();
    await blue.setData(shareData);
    blue.getPNG();
    console.log(blue.getBuffer());

    let purple = new Leaderboard('purple');
    await purple.initBg();
    await purple.setData(shareData);
    purple.getPNG();
    console.log(purple.getBuffer());
}

test();
```
