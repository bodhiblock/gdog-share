const { drawImage } = require('../common')
const path = require('path');
function styleUrlPath(name) {
  // return `./images/giftboxboard/${name}`
  return path.resolve(__dirname, `../images/giftboxboard/${name}`)
}

async function leaderboardBg(ctx) {
  function styleUrl(name) {
    return styleUrlPath(name)
  }

  ctx.save()
  await drawImage(ctx, styleUrl('gift_img.png'), [0, 0])
  ctx.restore()
}

module.exports = { leaderboardBg, styleUrlPath }
