const {createCanvas, loadImage, Image, registerFont, PngConfig} = require('canvas')
const path = require('path');
const fs = require('fs');
const {drawImage, bondText, getAgoTime, toNumberFormat} = require('../common');
const {leaderboardBg, styleUrlPath, styleColor} = require('./bg');

const Decimal = require('decimal.js');
const QRCode = require('qrcode');

class Leaderboard {

    styleType = 'green';

    ctx;
    canvas;
    tmp;
    // green=potential, blue=new, purple=hot, diy=<diy>
    styleColor;
    diyText;
    scale;
    // logo path
    logoPath = "/data/gdogstatic/logo/";
    // QRCode url
    QRUrl = "https://t.g.dog/tgapp/?tokendetail=";

    async initBg() {
        this.ctx.save()
        this.ctx.scale(this.scale, this.scale)
        await leaderboardBg(this.ctx, this.styleType);
        this.tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale , this.canvas.height / this.scale);
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
    constructor(option, logoPath = "/data/gdogstatic/logo/", QRUrl = "https://t.g.dog/tgapp/?tokendetail=") {
        if(typeof option == 'string') option = {styleType: option};
        this.styleType = option.styleType;
        this.diyText = option.diyText || '';
        this.scale = option.scale || 0.8;
        this.logoPath = logoPath;
        this.QRUrl = QRUrl;
        this.canvas = createCanvas(1140, 1080);
        // this.canvas = createCanvas(570, 540);
        this.ctx = this.canvas.getContext('2d');
        this.styleColor = styleColor[option.styleType];
    }

    data;
    async setData(data) {
        // if(this.data){
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.putImageData(this.tmp, 0, 0);
        // }
        this.data =data;
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.setName(data.name, data.symbol);
        this.setAddress(data.token_contract);
        let ago = getAgoTime(data.create_time);
        this.setAgo(ago);
        await this.setSafety(data.audit_info.opensource, data.audit_info.owner_status != 'dropped', !!!data.audit_info.is_honeypot);

        let marketCap = toNumberFormat(data.total_market_cap);
        let price = toNumberFormat(data.price);
        let liquidity = toNumberFormat(data.liquidity);

        this.setDataText(60, 280, marketCap);
        this.setDataText(420, 280, price);
        this.setDataText(770, 280, liquidity);

        let holders = toNumberFormat(data.holders, true);
        let txcount = toNumberFormat(data.txcount, true);
        let buy_count = toNumberFormat(data.buy_count, true);
        let sell_count = toNumberFormat(data.sell_count, true);
        this.setDataText(60, 530, holders);
        this.setDataText(230, 530, txcount);
        this.setDataText(415, 530, buy_count);
        this.setDataText(580, 530, sell_count);


        if (data.lp_lockers && data.lp_lockers.length > 0) {
            let lpCount = 0;
            data.lp_lockers.forEach(item => {
                lpCount += item.amount * 1;
            });
            let lp = new Decimal(lpCount).div(data.lp_totalsupply).toDP(0, Decimal.ROUND_UP).toString();
            this.setDataText(770, 530, [lp, '%']);
        } else {
            this.setDataText(770, 530, [0, '%']);
        }

        if (data.token_lockers && data.token_lockers.length > 0) {
            let tokenCount = 0;
            data.token_lockers.forEach(item => {
                tokenCount += item.amount * 1;
            });
            let token_total_supply = typeof data.token0_total_supply === 'object' ? data.token0_total_supply.$numberDecimal : data.token0_total_supply;
            let token = new Decimal(tokenCount).div(token_total_supply).toDP(0, Decimal.ROUND_UP).toString();
            this.setDataText(910, 530, [token, '%']);
        } else {
            this.setDataText(910, 530, [0, '%']);
        }

        let twitter_info = data.twitter_info || {};
        let twitter_time = '-';
        if (twitter_info.created_at) {
            twitter_time = (new Date(twitter_info.created_at)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
            });
            this.setTwitter(80, 860, ['Joined ' + twitter_time.split(' ')[0], twitter_time.split(' ')[1]], 0);
        } else {
            this.setTwitter(80, 860, ['Joined', '-'], 0);
        }

        this.setTwitter(80, 910, [toNumberFormat(twitter_info.followers_count).join(''), 'Followers']);
        this.setTwitter(80, 960, [toNumberFormat(twitter_info.statuses_count).join(''), 'Posts']);
        this.setTwitter(80, 1010, [toNumberFormat(twitter_info.favourites_count).join(''), 'Likes']);

        let twitter_related = data.twitter_related || {};

        this.setTwitter(440, 860, [toNumberFormat(twitter_related.followers_count).join(''), 'Coverage']);
        this.setTwitter(440, 910, [toNumberFormat(twitter_related.related_count).join(''), 'Mentioned']);
        this.setTwitter(440, 960, [toNumberFormat(twitter_related.retweet_count).join(''), 'Reposts']);
        this.setTwitter(440, 1010, [toNumberFormat(twitter_related.favourites_count).join(''), 'Likes']);

        this.setTime(data.create_time);
        await this.setQRCode(data.token_contract);
        try {
            await this.setAvatar(data.token_contract, data.symbol);
        } catch (e) {
            this.avatarError(data.symbol)
        }
        this.setDiyText();
        this.ctx.restore();

    }

    setDiyText(){
        if(this.styleType == 'diy' && this.diyText){
            this.ctx.save();
            this.ctx.font = "bold 80px 'speedtest'";
            this.ctx.textBaseline = "top";
            this.ctx.fillStyle = "#000000";
            this.ctx.rotate((Math.PI / 180) * -2);
            const gradient = this.ctx.createLinearGradient(740, 40, 900, 50);
            let diyText = this.diyText.length > 8 ? this.diyText.slice(0, 8) + '...' : this.diyText;
            let diyStyleColor = JSON.parse(JSON.stringify(this.styleColor.time)).reverse();
            diyStyleColor.forEach((item, index) => {
                gradient.addColorStop(index, item);
            });
            let measure = this.ctx.measureText(diyText);

            this.ctx.fillStyle = gradient;
            this.ctx.fillText(diyText, this.canvas.width - measure.width - 40, 115);
            this.ctx.restore();
        }
    }

    avatarError(symbol) {
        this.ctx.font = "bold 80px 'Microsoft YaHei UI'";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = "#ffffff";
        let measure = this.ctx.measureText(symbol.slice(0, 1));
        // console.log(measure.width, Math.floor(measure.width / 2));
        this.ctx.fillText(symbol.slice(0, 1), (100 - Math.floor(measure.width / 2)), 50);
    }

    setAvatar(address, symbol) {
        let that = this;
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                that.ctx.save();
                that.ctx.beginPath();
                that.ctx.arc(102, 102, 60, 0, 2 * Math.PI);
                that.ctx.clip();
                that.ctx.drawImage(img, 34, 34, 125, 125);
                that.ctx.restore();
                resolve(img);
            };
            img.onerror = err => {
                reject(err);
            };
            img.src = that.logoPath + address + '.png';

        })
    }

    async setQRCode(text) {
        let that = this;
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(this.QRUrl + text, {width: 160, margin: 0, color: {dark: '#ffffff00', light: "#000000ff"}}, (err, url) => {
                if (err) {
                    reject(err)
                } else {
                    const img = new Image()
                    img.onload = () => {
                        that.ctx.drawImage(img, 848, 818);
                        resolve(img);
                    };
                    img.onerror = err => {
                        reject(err)
                    };
                    img.src = url;
                }
            });
        })

    }

    setTime(date) {
        let t = new Date(date);
        let dateLocal = t.toLocaleDateString('en-US');
        let timeLocal = t.toLocaleTimeString('en-US');

        const gradient = this.ctx.createLinearGradient(740, 40, 900, 50);
        this.styleColor.time.forEach((item, index) => {
            gradient.addColorStop(index, item);
        });
        bondText(this.ctx, 740, 40, [
            {
                text: timeLocal,
                font: "32px 'Microsoft YaHei UI'",
                fillStyle: gradient
            },
            {
                text: "·",
                font: "32px 'Microsoft YaHei UI'",
                fillStyle: gradient
            },
            {
                text: dateLocal,
                font: "32px 'Microsoft YaHei UI'",
                fillStyle: gradient
            }
        ], 15);
    }

    setTwitter(x, y, strAry, zoomIndex) {
        let bondTextStyle = [];
        let fontData = "30px 'Microsoft YaHei UI Light'";
        zoomIndex = zoomIndex >= 0 ? 0 : 1;
        strAry.forEach((item, index) => {
            bondTextStyle.push({
                text: item,
                font: zoomIndex == index ? "24px 'Microsoft YaHei UI Light'" : fontData,
                fillStyle: zoomIndex == index ? '#9a9f99' : "#ffffff",
                bottom: zoomIndex == index ? 6 : 0,
            });
        });
        bondText(this.ctx, x, y, bondTextStyle, 15, );
    }

    async setSafety(opensource, owner, honeypot) {
        this.ctx.save();
        this.ctx.translate(180, 120);
        let checkmark = 'icon_checkmark.png';
        let cross = 'icon_cross.png';
        await drawImage(this.ctx, styleUrlPath(opensource ? checkmark : cross, this.styleType), [0, 50]);
        await drawImage(this.ctx, styleUrlPath(owner ? checkmark : cross, this.styleType), [220, 50]);
        await drawImage(this.ctx, styleUrlPath(honeypot ? checkmark : cross, this.styleType), [360, 50]);
        this.ctx.restore();
    }

    addressX = 225;

    setAddress(address) {
        this.ctx.font = "22px 'Microsoft YaHei UI Light'";
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = this.styleColor.address;
        this.ctx.fillText(address, this.addressX, 220);
    }

    setAgo(ago) {
        bondText(this.ctx, this.addressX, 120, [
            {
                text: ago,
                font: "400 26px 'Microsoft YaHei UI'",
                fillStyle: "#ffffff",
            },
            {
                text: 'ago',
                font: "400 26px 'Microsoft YaHei UI'",
                fillStyle: this.styleColor.ago,
            }
        ]);
    }

    setName(name, symbol) {
        if (name.length > 8) {
            name = name.slice(0, 4) + '...';
        };
        bondText(this.ctx, 180, 45, [
            {
                text: name,
                font: "bold 48px '腾讯字体'",
                fillStyle: "#ffffff",
            },
            {
                text: '$' + symbol,
                font: "bold 48px '腾讯字体'",
                fillStyle: this.styleColor.symbol,
            }
        ]);
        bondText(this.ctx, 45, 802, [
            {
                text: `@${symbol}coineth`,
                font: "bold 26px 'Microsoft YaHei UI'",
                fillStyle: "#120f14",
            },
            {
                text: '·12h',
                font: "26px 'Microsoft YaHei UI'",
                fillStyle: "#120f14",
            }
        ]);
    }

    setDataText(x, y, strAry) {
        let bondTextStyle = [];
        let fontData = "bold 56px 'Microsoft YaHei UI'";
        strAry.forEach((item, index) => {
            bondTextStyle.push({
                text: item,
                font: index == 1 ? "bold 33px 'Microsoft YaHei UI'" : fontData,
                fillStyle: "#ffffff",
                bottom: index == 1 && strAry.length >= 3 ? 30 : index == 1 ? 22 : 0,
            });
        });
        bondText(this.ctx, x, y, bondTextStyle, 5);
    }

    getScaleCanvas (){
        if(this.scale != 1){
            let tmp = this.ctx.getImageData(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale );
            let canvas = createCanvas(this.canvas.width * this.scale, this.canvas.height * this.scale);
            let ctx = canvas.getContext('2d');
            ctx.putImageData(tmp, 0, 0);
            return canvas;
        }else{
            return this.canvas;
        }
    }
    getBuffer(compressionLevel = 9){
        let pngConfig = {
            compressionLevel: compressionLevel, filters: this.canvas.PNG_FILTER_NONE
        };
        let canvas = this.getScaleCanvas();
        return canvas.toBuffer('image/png', pngConfig)
    }

    getPNG(compressionLevel = 9) {
        let imgUrl = path.resolve(`./test/leaderboard_${this.styleType}.png`);
        let pngConfig = {
            compressionLevel: compressionLevel, filters: this.canvas.PNG_FILTER_NONE
        };
        let canvas = this.getScaleCanvas();
        fs.writeFileSync(imgUrl, canvas.toBuffer('image/png', pngConfig));

    }
}


module.exports = Leaderboard;






























