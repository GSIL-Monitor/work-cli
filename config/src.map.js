module.exports = {
    directories: {
        scripts: "",
        pages: "src/templates",
    },
    scripts: {
        vendors: [
            "react",
            "react-dom"
        ],
        index: "src/containers/index.js"
    },
    pages: {
        "index.html": {
            scripts: {
                body: [ "commons", "vendors", "index" ]
            },
            source: "default.html"
        }
    }
}