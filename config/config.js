const path = "/{{psm}}/";

module.exports = {
    path: path,
    dev: {
      "protocol": "http",
      "host": "0.0.0.0",
      "browserPort": "9090",
      "publicPath": path,
      "autoOpen": `${path}index.html`
    },
  
    prod: {
      "publicPath": `//s3.pstatp.com${path}`
    },

    stage: {
      "publicPath": path,
      "stagePath": path
    }
}