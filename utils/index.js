/**
 * 对象深拷贝
 * @param {*} obj 
 * @returns 
 * 作者：我是一个小哥哥
 * 链接：https://juejin.cn/post/6844903967923650573
 */
export function deepClone(obj) {
  if (obj === null) return null; //null 的情况
  if (obj instanceof RegExp) return new RegExp(obj); //正则表达式的情况
  if (obj instanceof Date) return new Date(obj); //日期对象的情况
  if (typeof obj == 'Function') return new function (obj) { }; //函数的情况
  if (typeof obj != "object") {
    //非复杂类型,直接返回 也是结束递归的条件
    return obj
  }
  //[].__proto__.constructor=Array()
  //{}.__proto__.constructor=Object()
  //因此处理数组的情况时,可以取巧用这个办法来new新对象
  var newObj = new obj.__proto__.constructor;
  for (var key in obj) {
    newObj[key] = deepClone(obj[key])
  }
  return newObj;
}

/**
 * 是否升级
 * @param {*} o 旧版本号
 * @param {*} n 新版本号
 * @returns 
 */
export function isUpdateVersion(o, n) {
  console.log('[isUpdateVersion](o, n):', o, n)

  const oArr = o.split('.')
  const nArr = n.split('.')
  const len = oArr.length

  for (let i = 0;i < len;++i) {
    const nNum = parseInt(nArr[i])
    const oNum = parseInt(oArr[i])

    //截断处理
    if (nNum == oNum) continue
    else if (nNum > oNum) return true
    else return false
  }

  return false
}
