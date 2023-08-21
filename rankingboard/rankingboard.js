const { createCanvas, loadImage, Image, registerFont, PngConfig } = require("canvas");
const path = require("path");
const fs = require("fs");
const { bondText, drawImage } = require("../common");
const { leaderboardBg, styleColor } = require("./bg2");

const QRCode = require("qrcode");

class rankingboard {
  styleType = "green";
  ctx;
  canvas;
  tmp;
  styleColor;
  diyText;
  scale;
  // logo path
  logoPath = "/data/gdogstatic/logo/";
  // QRCode url
  QRUrl = "https://t.g.dog/tgapp/?tokendetail=";

  async initBg() {
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    await leaderboardBg(this.ctx);
    this.tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale, this.canvas.height / this.scale);
    this.ctx.restore();
  }

  /*
   * option:{
   *   styleType: 'green',  // green=potential, blue=new, purple=hot, diy=<diy>
   *   diyText: 'DIY DEMO' // max length 8
   * }
   * logoPath "/data/gdogstatic/logo/"
   * QRUrl "https://t.g.dog/tgapp/?tokendetail="
   * scale 0.8
   * */
  constructor(
    option
    // logoPath = "/data/gdogstatic/logo/",
    // QRUrl = "https://t.g.dog/tgapp/?tokendetail="
  ) {
    console.log(option, "option");
    if (typeof option == "string") option = { styleType: option };
    this.styleType = option.styleType;
    this.diyText = option.diyText || "";
    this.scale = option.scale || 0.8;
    this.canvas = createCanvas(1140, 1080);
    this.ctx = this.canvas.getContext("2d");
    this.styleColor = styleColor[option.styleType];
  }
  data;
  async setData(data) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(this.tmp, 0, 0);
    this.data = data;
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.setNameText();
    this.setPointer("60");
    this.setDiyText("11/22/23", 78, 190, "40", ["#23d8d8", "#957df0"]);
    this.setTopText("NEW", 106, 288, "60", ["#ffffff", "#61c8c0"], true);
    this.setTopText("10x", 768, 288, "60", ["#ffffff", "#ffcd83"], true);
    this.setTopText("10", 638, 412, "60", ["#ffffff", "#51b973"]);
    this.setTopText("25", 966, 412, "60", ["#ffffff", "#ffcd83"]);
    this.setTopText("1.2", 284, 412, "60", ["#ffffff", "#61c8c0"]);
    this.setLineChart();
    await this.setQRCode(data.token_contract);
    this.ctx.restore();
  }

  setDiyText(text, x, y, size, arr) {
    this.ctx.save();
    this.ctx.font = `"bold ${size}px 'speedtest'"`;
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "#000000";
    let gradient = this.ctx.createLinearGradient(180, 184, 256, 184);
    let diyStyleColor = JSON.parse(JSON.stringify(arr));
    diyStyleColor?.forEach((item, index) => {
      gradient.addColorStop(index, item);
    });
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(text, x, y);
  }

  setTopText(text, x, y, size, arr, type = false) {
    this.ctx.save();
    this.ctx.font = `"bold ${size}px '腾讯字体'"`;
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "#000000";
    //创建渐变
    let gradient;
    if (type) {
      gradient = this.ctx.createLinearGradient(90, 320, 90, 338);
    } else {
      gradient = this.ctx.createLinearGradient(284, 440, 284, 456);
    }
    let diyStyleColor = JSON.parse(JSON.stringify(arr));
    diyStyleColor?.forEach((item, index) => {
      gradient.addColorStop(index, item);
    });
    //填充渐变
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(text, x, y);
  }

  setNameText() {
    this.setbondText(this.ctx, 192, 880, [
      {
        text: "QWERTYUI",
        font: "bold 36px '腾讯字体'",
        fillStyle: "#66b4b4",
      },
      {
        text: "leads the market with a",
        font: "bold 24px '腾讯字体'",
        fillStyle: "#a7a7a7",
      },
      {
        text: "1580%",
        font: "bold 36px '腾讯字体'",
        fillStyle: "#66b4b4",
      },
      {
        text: "surge.",
        font: "bold 24px '腾讯字体'",
        fillStyle: "#a7a7a7",
      },
    ]);
    bondText(this.ctx, 924, 194, [
      {
        text: "Market Sentiment",
        font: "bold 19px '腾讯字体'",
        fillStyle: "#cccccc",
      },
    ]);
    bondText(this.ctx, 104, 516, [
      {
        text: "$6.87B",
        font: "bold 60px '腾讯字体'",
        fillStyle: "#ffffff",
      },
    ]);
    bondText(this.ctx, 435, 516, [
      {
        text: "28.35k",
        font: "bold 60px '腾讯字体'",
        fillStyle: "#ffffff",
      },
    ]);
    bondText(this.ctx, 766, 516, [
      {
        text: "$9.75B",
        font: "bold 60px '腾讯字体'",
        fillStyle: "#ffffff",
      },
    ]);
    bondText(this.ctx, 436, 288, [
      {
        text: "100x",
        font: "bold 60px '腾讯字体'",
        fillStyle: "#fcff6c",
      },
    ]);
    bondText(this.ctx, 100, 610, [
      {
        text: "MARLKET CAP",
        font: "bold 30px '腾讯字体'",
        fillStyle: "#d85b21",
      },
    ]);
    bondText(this.ctx, 430, 610, [
      {
        text: "TRANSACTION",
        font: "bold 30px '腾讯字体'",
        fillStyle: "#2758ee",
      },
    ]);
    bondText(this.ctx, 760, 610, [
      {
        text: "VOLUME",
        font: "bold 30px '腾讯字体'",
        fillStyle: "#9d45f7",
      },
    ]);
  }

  setPointer(value) {
    this.ctx.save();
    this.ctx.translate(1010, 180);
    this.ctx.rotate((Math.PI / 180) * (Number(value) - 30));
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, -50, -30);
    };
    img.src = "./images/rankingboard/pointer.png";
    this.ctx.restore();
    bondText(this.ctx, 1000, 170, [
      {
        text: value,
        font: "bold 18px '腾讯字体'",
        fillStyle: "#ffffff",
      },
    ]);
  }

  setbondText(ctx, x, y, styleText, gap, fixed) {
    styleText.forEach((item) => {
      ctx.font = item.font;
      ctx.textBaseline = "bottom";
      ctx.fillStyle = item.fillStyle || "#ffffff";
      let measure = ctx.measureText(item.text);
      ctx.fillText(item.text, x, y + (item.bottom || 0));
      if (fixed) {
        x = x + gap;
      } else {
        x = x + measure.width + (gap || 10);
      }
    });
  }

  setLineChart(data = [100, 323, 233, 313, 321, 94, 223]) {
    let x0 = 190,
      y0 = 994;
    var maxX = 920,
      maxY = 906;
    this.ctx.beginPath();
    let maxData = Math.max(...data);
    console.log(maxData, "maxData");
    let each = (maxX - x0 - 32) / data.length;
    var yWidht = y0 - maxY - 16;
    console.log(yWidht, "yWidht");
    for (var i = 0; i < data.length; i++) {
      let take = (data[i] / maxData).toFixed(2);
      console.log((maxX + x0 - 32) / data.length, "x0 + 16 + (maxX + x0 - 32) / data.length");
      this.ctx.lineTo(x0 + 16 + each * i, y0 - yWidht * take);
    }
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
  }

  async setQRCode(text) {
    let that = this;
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        this.QRUrl + text,
        { width: 80, margin: 0, color: { dark: "#ffffff00", light: "#000000ff" } },
        (err, url) => {
          if (err) {
            reject(err);
          } else {
            const img = new Image();
            img.onload = () => {
              that.ctx.drawImage(img, 1012, 870);
              resolve(img);
            };
            img.onerror = (err) => {
              reject(err);
            };
            img.src = url;
          }
        }
      );
    });
  }

  getScaleCanvas() {
    if (this.scale != 1) {
      let tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);
      let canvas = createCanvas(this.canvas.width * this.scale, this.canvas.height * this.scale);
      let ctx = canvas.getContext("2d");
      ctx.putImageData(tmp, 0, 0);
      return canvas;
    } else {
      return this.canvas;
    }
  }
  getBuffer(compressionLevel = 9) {
    let pngConfig = {
      compressionLevel: compressionLevel,
      filters: this.canvas.PNG_FILTER_NONE,
    };
    let canvas = this.getScaleCanvas();
    return canvas.toBuffer("image/png", pngConfig);
  }

  getPNG(compressionLevel = 9) {
    let imgUrl = path.resolve(`./test/rankingboard.png`);
    let pngConfig = {
      compressionLevel: compressionLevel,
      filters: this.canvas.PNG_FILTER_NONE,
    };
    let canvas = this.getScaleCanvas();
    fs.writeFileSync(imgUrl, canvas.toBuffer("image/png", pngConfig));
  }
}

module.exports = rankingboard;
