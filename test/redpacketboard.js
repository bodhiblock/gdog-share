const redpacketboard = require('../redpacketboard/redpacketboard')

async function test() {
  console.time('diy')

  let purple = new redpacketboard({
    text: 'Useraaaaaa的红包',
    value: 1000000,
  })
  await purple.initBg()
  await purple.setData()
  purple.getPNG()
  console.log(purple.getBuffer())
  console.log(purple.getPNG(), 'img')
}

test()
