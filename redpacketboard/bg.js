const { drawImage } = require('../common')

function styleUrlPath(name) {
  return `./images/redpacketboard/${name}`
}

async function leaderboardBg(ctx) {
  function styleUrl(name) {
    return styleUrlPath(name)
  }

  ctx.save()
  await drawImage(ctx, styleUrl('packet_bg.png'), [0, 0])
  ctx.restore()
}

module.exports = { leaderboardBg, styleUrlPath }
