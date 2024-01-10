const { drawImage } = require('../common')
const path = require('path');
function styleUrlPath(name) {
  return path.resolve(__dirname, `../images/redpacketboard/${name}`)
  // return `./images/redpacketboard/${name}`
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
