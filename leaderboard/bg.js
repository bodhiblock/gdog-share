

const {drawImage} = require('../common');


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

function styleUrlPath (name, styleType){
    return `./images/leaderboard/${styleType == 'diy' ? 'green': styleType}/${name}`;
}

async function leaderboardBg (ctx, styleType){
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


module.exports = {leaderboardBg, styleUrlPath, styleColor};