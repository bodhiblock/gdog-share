const giftboxboard = require('../giftboxboard/giftboxboard')

async function test() {
  console.time('diy')

  let purple = new giftboxboard({
    text: 'Airdrop by Useraaaaaa',
    value: 88888,
  })
  await purple.initBg()

  console.log(await purple.getBuffer())
  await purple.setData({
    text: 'Airdrop by Useraaaaaa',
    value: 8822228888,
  })
  purple.getPNG()
}

test()
