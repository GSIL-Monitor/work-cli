const Mock = require('mockjs')
module.exports = {
  get_question: () => {
    return Mock.mock({
      "status": 0,
      "prompts": "",
      "data": {
        "question|10-20": /[\u4e00-\u9fa5]/,
        "correct_num|0-3": 0,
        "answers|3": [{
          "id|+1": 0,
          "text|5-12": /[\u4e00-\u9fa5]/
        }]
      },
      "message": "success"
    })
  },

  post_question: () => {
    return Mock.mock({
      "status": 0,
      "prompts": "",
      "data": {
        "question|10-20": /[\u4e00-\u9fa5]/,
        "correct|0-1": true,
        "correct_answer_id|+1": 1,
        "correct_answer|+1": 1,
        "correct_num|0-3": 0,
        "answers|3": [{
          "id|+1": 0,
          "text|5-12": /[\u4e00-\u9fa5]/
        }]
      },
      "message": "success"
    })
  }
}
