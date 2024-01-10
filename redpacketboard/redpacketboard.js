const { createCanvas, loadImage, Image, registerFont, PngConfig } = require('canvas')
const path = require('path')
const fs = require('fs')
const { bondText, drawImage } = require('../common')
const { leaderboardBg, styleColor } = require('./bg')

const QRCode = require('qrcode')

class redpacketboard {
  ctx
  canvas
  tmp
  scale
  text
  value
  async initBg() {
    this.ctx.save()
    this.ctx.scale(this.scale, this.scale)
    await leaderboardBg(this.ctx)
    this.tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale, this.canvas.height / this.scale)
    this.ctx.restore()
  }

  constructor(option) {
    console.log(option, 'option')
    this.text = option.text || ''
    this.value = option.value
    this.scale = option.scale || 0.8
    this.canvas = createCanvas(790, 992)
    this.ctx = this.canvas.getContext('2d')
  }
  data
  async setData(data) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.putImageData(this.tmp, 0, 0)
    this.data = data
    this.ctx.save()
    this.ctx.scale(this.scale, this.scale)
    this.setNameText()
    this.ctx.restore()
  }

  setNameText() {
    this.ctx.textAlign = 'center'
    bondText(this.ctx, 395, 155, [
      {
        text: this.text,
        font: "bold 50px '腾讯字体'",
        fillStyle: '#6E2315',
      },
    ])
    bondText(this.ctx, 395, 252, [
      {
        text: this.value,
        font: "bold 140px '腾讯字体'",
        fillStyle: '#FF4714',
      },
    ])
  }

  getScaleCanvas() {
    if (this.scale != 1) {
      let tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale)
      let canvas = createCanvas(this.canvas.width * this.scale, this.canvas.height * this.scale)
      let ctx = canvas.getContext('2d')
      ctx.putImageData(tmp, 0, 0)
      return canvas
    } else {
      return this.canvas
    }
  }
  getBuffer(compressionLevel = 9) {
    let pngConfig = {
      compressionLevel: compressionLevel,
      filters: this.canvas.PNG_FILTER_NONE,
    }
    let canvas = this.getScaleCanvas()
    return canvas.toBuffer('image/png', pngConfig)
  }

  getPNG(compressionLevel = 9) {
    let imgUrl = path.resolve(`./test/redpacketboard.png`)
    let pngConfig = {
      compressionLevel: compressionLevel,
      filters: this.canvas.PNG_FILTER_NONE,
    }
    let canvas = this.getScaleCanvas()
    fs.writeFileSync(imgUrl, canvas.toBuffer('image/png', pngConfig))
  }
}

module.exports = redpacketboard
