const {Image, registerFont, CanvasRenderingContext2D } = require("canvas");
const fs = require('fs');
const path = require('path');
const { polyfillPath2D } = require("path2d-polyfill");
const Decimal = require('decimal.js');

global.CanvasRenderingContext2D = CanvasRenderingContext2D;
polyfillPath2D(global);

function getAgoTime(timestamp) {
    const millisecondsPerMinute = 60000;
    const millisecondsPerHour = 3600000;
    const millisecondsPerDay = 86400000;

    const date = new Date(timestamp);
    timestamp = Date.now() - date.getTime();
    const days = Math.floor(timestamp / millisecondsPerDay);

    const remainingMilliseconds = timestamp % millisecondsPerDay;

    const hours = Math.floor(remainingMilliseconds / millisecondsPerHour);

    const remainingMillisecondsAfterHours = remainingMilliseconds % millisecondsPerHour;

    const minutes = Math.floor(remainingMillisecondsAfterHours / millisecondsPerMinute);

    if(days < 0){
        return minutes + 'm' + hours + 'h'
    }else{
        return hours + 'h' + days + 'd'
    }

}



registerFont(path.resolve('./font/msyh.ttc'), { family: 'Microsoft YaHei UI' });
registerFont(path.resolve('./font/msyhl.ttc'), { family: 'Microsoft YaHei UI Light' });
registerFont(path.resolve('./font/msyhbd.ttc'), { family: 'Microsoft YaHei UI Bold' });
registerFont(path.resolve('./font/Speedtest-2.ttf'), { family: 'speedtest' });
registerFont(path.resolve('./font/MEDIUM.TTF'), { family: '腾讯字体' });

function drawImage(ctx, url, arr){
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            ctx.drawImage(img, ...arr);
            resolve(img);
        };
        img.onerror = err => { reject(err) };
        img.src = url;
    })
}

function bondText(ctx, x, y, styleText, gap, fixed){
    styleText.forEach(item => {
        ctx.font = item.font;
        ctx.textBaseline = "top";
        ctx.fillStyle = item.fillStyle || '#ffffff';
        let measure = ctx.measureText(item.text);
        ctx.fillText(item.text, x, y + (item.bottom || 0));
        if(fixed){
            x = x + gap;
        }else{
            x = x + measure.width + (gap || 10);
        }

    })
}


function zoomNumber(num, unit, zoom){
    if(Number(num) >= 100 && zoom){
        num = new Decimal(num).toDP(0).toString();
        return [num.slice(0, 1) + num.slice(1, num.length) + unit];
    }else{
        return [num + unit];
    }
}
function toNumberFormat(num, zoom){
    if(!(typeof num === 'number' || typeof num === 'string')){
        return ['0']
    }
    num = Number(num);
    if(!!!num) return ['0'];
    if(num >= 1000000000){
        return zoomNumber(new Decimal(num).div(1000000000).toDP(1).toString(), 'B', zoom);
    }
    if(num >= 1000000){
        return zoomNumber(new Decimal(num).div(1000000).toDP(1).toString(), 'M', zoom);
    }
    if(num >= 1000){
        return zoomNumber(new Decimal(num).div(1000).toDP(1).toString(), 'K', zoom);
    }
    if(num < 1){
        let str = new Decimal(num).toFixed(18).toString();
        let len = str.search(/[123456789]/g);
        if(str.length - len > 4){
            str = str.slice(0, len + 2);
        }
        if (len > 5) {
            let sub = len - 3;
            return ['0.0' ,  sub.toString(), str.slice(len, len + 2)]
        }
    }
    return zoomNumber(new Decimal(num).toDP(2, Decimal.ROUND_DOWN).toString(), '', zoom);
    // return [new Decimal(num).toDP(2, Decimal.ROUND_DOWN).toString()];
}

// console.log(toNumberFormat('1000000000000'));
// console.log(toNumberFormat('100000000'));
// console.log(toNumberFormat('78000'));
// console.log(toNumberFormat('0.0000000013123324'));
// console.log(toNumberFormat('132.23231'));
// console.log(toNumberFormat('sadasdasdsa'));


module.exports = {drawImage, bondText, getAgoTime, toNumberFormat};
