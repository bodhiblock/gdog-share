const {Image, registerFont, CanvasRenderingContext2D } = require("canvas");
const fs = require('fs');
const path = require('path');
const { polyfillPath2D } = require("path2d-polyfill");
const Decimal = require('decimal.js');

global.CanvasRenderingContext2D = CanvasRenderingContext2D;
polyfillPath2D(global);

const styleColor = {
    green : {
        symbol: '#326f60',
        address: '#ffffff',
        ago: '#6ebba5',
        time: ['rgb(40,242,156)', 'rgb(2,192,240)'],
    },

    blue : {
        symbol: '#10788e',
        address: '#ffffff',
        ago: '#175e74',
        time: ['#5450ff', '#55e1ea'],
    },
    purple : {
        symbol: '#7e3b9f',
        address: '#ffffff',
        ago: '#7e3b9f',
        time: ['#c231ff', '#45c9f9'],
    },
    diy : {
        symbol: '#326f60',
        address: '#6ebba5',
        ago: '#6ebba5',
        time: ['rgb(40,242,156)', 'rgb(2,192,240)'],
    },
}

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

function styleUrlPath (name, styleType){
    return `./images/${styleType == 'diy' ? 'green': styleType}/${name}`;
}

async function canvasBg (ctx, styleType){
    function styleUrl (name){
        return styleUrlPath(name, styleType);
    }

    await drawImage(ctx, styleUrl('bg.png'), [0, 0]);

    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.arc(100, 100, 64, 0, 2 * Math.PI);
    ctx.stroke();
    if(styleType == 'blue'){
        await drawImage(ctx, styleUrl('label.png'), [870, 90]);
    }else if(styleType == 'purple'){
        await drawImage(ctx, styleUrl('label.png'), [850, 90]);
    }else if(styleType == 'green'){
        await drawImage(ctx, styleUrl('label.png'), [740, 90]);
    }


    ctx.save();
    ctx.translate(180, 120);
    await drawImage(ctx, styleUrl('icon_calendar1.png'), [0, 0]);
    await drawImage(ctx, styleUrl('icon_contract.png'), [0, 100]);
    // await drawImage(ctx, styleUrl('icon_checkmark.png'), [0, 50]);
    // await drawImage(ctx, styleUrl('icon_cross.png'), [220, 50]);
    // await drawImage(ctx, styleUrl('icon_checkmark.png'), [360, 50]);
    ctx.restore();

    ctx.font = "26px 'Microsoft YaHei UI'";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("opensource", 225, 167);
    ctx.fillText("owner", 440, 167);
    ctx.fillText("honeypot", 580, 167);

    ctx.save();
    ctx.translate(38, 270);
    await drawImage(ctx, styleUrl('marketcap.png'), [0, 0]);
    await drawImage(ctx, styleUrl('price.png'), [360, 0]);
    await drawImage(ctx, styleUrl('liquidity.png'), [720, 0]);

    await drawImage(ctx, styleUrl('holder.png'), [0, 242]);
    await drawImage(ctx, styleUrl('buy.png'), [360, 242]);
    await drawImage(ctx, styleUrl('lplock.png'), [720, 242]);

    ctx.restore();



    ctx.save();
    ctx.translate(38, 800);
    await drawImage(ctx, styleUrl('rectangle.png'), [0, 0]);

    // bondText(ctx, 15, 2, [
    //     {
    //         text: '@pepecoineth',
    //         font: "bold 26px 'Microsoft YaHei UI'",
    //         fillStyle: "#120f14",
    //     },
    //     {
    //         text: '·12h',
    //         font: "26px 'Microsoft YaHei UI'",
    //         fillStyle: "#120f14",
    //     }
    // ]);
    ctx.restore();

    ctx.save();
    ctx.translate(38, 870);
    await drawImage(ctx, styleUrl('icon_calendar2.png'), [0, 0]);
    await drawImage(ctx, styleUrl('icon_followers.png'), [0, 50]);
    await drawImage(ctx, styleUrl('icon_posts.png'), [0, 100]);
    await drawImage(ctx, styleUrl('icon_like.png'), [0, 150]);
    ctx.restore();

    await drawImage(ctx, styleUrl('influence.png'), [400, 800]);

    ctx.save();
    ctx.translate(400, 870);
    await drawImage(ctx, styleUrl('icon_coverage.png'), [0, 0]);
    await drawImage(ctx, styleUrl('icon_mentioned.png'), [0, 50]);
    await drawImage(ctx, styleUrl('icon_reposts.png'), [0, 100]);
    await drawImage(ctx, styleUrl('icon_like.png'), [0, 150]);
    ctx.restore();

    ctx.save();
    ctx.translate(830, 800);
    await drawImage(ctx, styleUrl('qr_code_bg.png'), [0, 0]);
    await drawImage(ctx, styleUrl('gdog.png'), [35, 210]);
    ctx.restore();

    // ctx.save();
    // ctx.beginPath();
    // ctx.arc(102, 102, 60, 0, 2 * Math.PI);
    // ctx.clip();
    // await drawImage(ctx, styleUrl('qr_code.png'), [34, 34, 125, 125]);
    // ctx.restore();

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


module.exports = {drawImage, bondText, canvasBg, styleColor, getAgoTime, styleUrlPath, toNumberFormat};
