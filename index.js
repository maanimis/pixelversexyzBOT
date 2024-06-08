import axios from "axios";

const userConfigs = [
  {
    name: "me",
    "tg-id": "111111111111",
    secret: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    username: "tst",
    initData: "",
    requests: 0,
    errors: 0,
    lastTimestamp: 0,
    nextTimestamp: 0,
    lastClaim: 0,
  },
];

const Sleep = (s) => new Promise((res) => setTimeout(res, s * 1000));

function genTimestamp(waiter, init) {
  return (init && Date.now()) + waiter * 1000;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function banner() {
  let result = [];
  userConfigs.forEach((user) => {
    result.push({
      name: user.name,
      requests: user.requests,
      errors: user.errors,
      lastClaim: user.lastClaim,
    });
  });
  console.clear();
  console.table(result);
}

setInterval(banner, 3_000);

const config = {
  method: "post",
  url: "https://api-clicker.pixelverse.xyz/api/mining/claim",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "tg-id": "",
    secret: "",
    username: "",
    initData: "",
    "Sec-GPC": "1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  },
  referrer: "https://sexyzbot.pxlvrs.io/",
};

let temp, user;
console.log(`\n[+]running@6sec...\n\n`);
await Sleep(10);
while (true) {
  for (user of userConfigs) {
    await Sleep(0.5);
    temp = Date.now();
    if (temp <= user.nextTimestamp) continue;
    config.headers["tg-id"] = user["tg-id"];
    config.headers["secret"] = user["secret"];
    config.headers["username"] = user["username"];
    config.headers["initData"] = user["initData"];
    user.lastTimestamp = temp;
    temp = await axios(config)
      .then(async (response) => {
        ++user.requests;
        user.lastClaim = Math.floor(response.data.claimedAmount);
        user.nextTimestamp =
          new Date(response.data.nextFullRestorationDate).getTime() +
          getRandomInt(1, 5) * 1000;
        return response.data;
      })
      .catch(async (error) => {
        ++user.errors;
        user.nextTimestamp = genTimestamp(
          getRandomInt(10, 15),
          user.nextTimestamp
        );
        // console.log(user.name, ">>>>>>Error:", error);
        return false;
      });
  }
  await Sleep(30);
}
