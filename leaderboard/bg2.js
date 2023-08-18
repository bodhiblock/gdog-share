const { drawImage } = require("../common");

const styleColor = {
  green: {
    symbol: "#326f60",
    address: "#ffffff",
    ago: "#6ebba5",
    time: ["rgb(40,242,156)", "rgb(2,192,240)"],
  },

  blue: {
    symbol: "#10788e",
    address: "#ffffff",
    ago: "#175e74",
    time: ["#5450ff", "#55e1ea"],
  },
  purple: {
    symbol: "#7e3b9f",
    address: "#ffffff",
    ago: "#7e3b9f",
    time: ["#c231ff", "#45c9f9"],
  },
  diy: {
    symbol: "#326f60",
    address: "#6ebba5",
    ago: "#6ebba5",
    time: ["rgb(40,242,156)", "rgb(2,192,240)"],
  },
};

function styleUrlPath(name) {
  return `./images/rankingboard/${name}`;
}

async function leaderboardBg(ctx) {
  function styleUrl(name) {
    return styleUrlPath(name);
  }

  ctx.save();
  await drawImage(ctx, styleUrl("bg_summary.png"), [0, 0]);
  await drawImage(ctx, styleUrl("line_title.png"), [80, 174]);
  await drawImage(ctx, styleUrl("title_market.png"), [84, 82]);
  await drawImage(ctx, styleUrl("dashboard.png"), [896, 80]);
  await drawImage(ctx, styleUrl("pointer.png"), [960, 138]);
  await drawImage(ctx, styleUrl("icon.png"), [104, 420]);
  await drawImage(ctx, styleUrl("icon_rise.png"), [304, 624]);
  await drawImage(ctx, styleUrl("icon_rise.png"), [634, 624]);
  await drawImage(ctx, styleUrl("icon_fall.png"), [964, 622]);
  ctx.restore();

  ctx.font = "32px 'Microsoft YaHei UI'";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";

  ctx.save();
  ctx.translate(80, 260);
  await drawImage(ctx, styleUrl("rectangle.png"), [0, 0]);
  await drawImage(ctx, styleUrl("rectangle.png"), [330, 0]);
  await drawImage(ctx, styleUrl("rectangle.png"), [662, 0]);

  await drawImage(ctx, styleUrl("rectangle.png"), [0, 232]);
  await drawImage(ctx, styleUrl("rectangle.png"), [330, 232]);
  await drawImage(ctx, styleUrl("rectangle.png"), [662, 232]);

  await drawImage(ctx, styleUrl("line_orange.png"), [18, 428]);
  await drawImage(ctx, styleUrl("line_blue.png"), [350, 428]);
  await drawImage(ctx, styleUrl("line_purple.png"), [680, 428]);

  ctx.restore();

  ctx.save();
  ctx.translate(42, 800);
  await drawImage(ctx, styleUrl("rectangle_transparent1.png"), [0, 0]);
  await drawImage(ctx, styleUrl("frame_summary.png"), [28, 50]);
  await drawImage(ctx, styleUrl("avata_summary.png"), [28, 50]);
  await drawImage(ctx, styleUrl("rectangle_transparent2.png"), [150, 110]);
  // await drawImage(ctx, styleUrl("vector_summary.png"), [166, 122]);
  await drawImage(ctx, styleUrl("qr_code_bg_summary.png"), [960, 60]);
  // await drawImage(ctx, styleUrl("qr_code.png"), [970, 70]);

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
}

module.exports = { leaderboardBg, styleUrlPath, styleColor };
