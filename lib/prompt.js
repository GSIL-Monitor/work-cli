module.exports =  (name) => {
  return [
    {
      name: "projectName",
      message: "项目名称",
      default: name
    },
    {
      name: "projectDesc",
      message: "项目描述",
      default: ""
    },
    {
      name: "psm",
      message: "请输入PSM(以斜杠分隔, 如: motor/fe/work)",
      default: "motor/fe/work"
    },
    {
      type: "list",
      name: "library",
      choices: ["react", "react-spa", "vue"],
      message: "选择所使用的框架"
    },
    {
      type: "confirm",
      name: "slardar",
      message: "是否接入前端监控？"
    }
  ]
}