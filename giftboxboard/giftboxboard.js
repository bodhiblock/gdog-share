const { createCanvas, loadImage, Image, registerFont, PngConfig } = require('canvas')
const path = require('path')
const fs = require('fs')
const { bondText, drawImage, toNumberFormat } = require('../common')
const { leaderboardBg, styleColor } = require('./bg')

const QRCode = require('qrcode')

class giftboxboard {
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
    this.value = option.value || 0
    this.scale = option.scale || 0.8
    this.canvas = createCanvas(882, 1087)
    this.ctx = this.canvas.getContext('2d')
  }
  data
  async setData(data) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.putImageData(this.tmp, 0, 0)
    this.data = data
    this.text = data.text || ''
    this.value = data.value || 0
    this.ctx.save()
    this.ctx.scale(this.scale, this.scale)
    this.setNameText()
    this.ctx.restore()
  }

  setNameText() {
    this.ctx.save()
    this.ctx.translate(0, 0)
    this.ctx.rotate((350 * Math.PI) / 180)
    this.ctx.textAlign = 'center'
    bondText(this.ctx, 395, 284, [
      {
        text: this.text,
        font: "bold 32px 'Microsoft YaHei UI Light'",
        fillStyle: '#D04040',
      },
    ])
    this.ctx.restore()

    this.ctx.save()
    this.ctx.translate(0, 0)
    this.ctx.rotate((350 * Math.PI) / 174)
    this.ctx.textAlign = 'center'
    bondText(this.ctx, 460, 370, [
      {
        text: this.value,
        font: "bold 106px 'Microsoft YaHei UI Bold'",
        fillStyle: '#FFFFFF',
      },
    ])
    this.ctx.restore()
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
    let imgUrl = path.resolve(`./test/giftboxboard.png`)
    let pngConfig = {
      compressionLevel: compressionLevel,
      filters: this.canvas.PNG_FILTER_NONE,
    }
    let canvas = this.getScaleCanvas()
    fs.writeFileSync(imgUrl, canvas.toBuffer('image/png', pngConfig))
  }
}

module.exports = giftboxboard
