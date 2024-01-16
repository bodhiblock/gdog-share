const redpacketboard = require('../index.js').redpacketboard;

async function test() {
  console.time('diy')

  let purple = new redpacketboard({
    text: 'Useraaaaaa1231231的红包',
    value: 1000000,
    scale: 0.2
  })
  await purple.initBg()
  await purple.setData({
    text: '3112432432',
    value: 999,
  })

  console.log(await purple.getBuffer())
  await purple.setData({
    text: '34399---',
    value: 82328,
  });
  console.log(await purple.getBuffer())
  purple.getPNG();
}

test()
