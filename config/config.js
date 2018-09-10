
const path = "/motor/sf/car_hero/";
const stagePath = "/motor/inapp/car_hero/";

module.exports = {
    dev: {
      "protocol": "http",
      "host": "0.0.0.0",
      "browserPort": "9090",
      "publicPath": path,
      "autoOpen": `${path}`
    },
  
    prod: {
      "publicPath": `//s3.pstatp.com${path}`
    },

    stage: {
      "publicPath": stagePath,
      "stagePath": stagePath
    }
}