module.exports = {
    directories: {
        scripts: "",
        pages: "src/templates",
    },
    scripts: {
        vendors: [
            "babel-polyfill",
            "react",
            "react-dom"
        ],
        index: "src/containers/index.js",
        answer: "src/containers/answer.js",
        success: "src/containers/success.js",
        backflow: "src/containers/backflow.js",
        limit: "src/containers/limit.js",
        ranklist: "src/containers/ranklist.js",
    },
    pages: {
        "index.html": {
            scripts: {
                body: [ "vendors", "index" ]
            }
        },
        "answer.html": {
            scripts: {
                body: [ "vendors", "answer" ]
            }
        },
        "success.html": {
            scripts: {
                body: [ "vendors", "success" ]
            }
        },
        "backflow.html": {
            scripts: {
                body: [ "vendors", "backflow" ]
            }
        },
        "limit.html": {
            scripts: {
                body: [ "vendors", "limit" ]
            }
        },
        "ranklist.html": {
            scripts: {
                body: [ "vendors", "ranklist" ]
            }
        }
    }
}
