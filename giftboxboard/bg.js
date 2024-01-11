const { drawImage } = require('../common')

function styleUrlPath(name) {
  return `./images/giftboxboard/${name}`
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
