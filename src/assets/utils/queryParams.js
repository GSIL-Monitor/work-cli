export default function (paras) {
  var url = location.search
  var paraString = url.substring(1).split('&')
  var paraObj = {}
  for (var i = 0, len = paraString.length; i < len; i++) {
    var j = paraString[i]
    if (j) {
      paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
    }
  }

  if (!paras) { return paraObj }
  var returnValue = paraObj[paras.toLowerCase()]
  return returnValue ? returnValue.trim() : ''
}
