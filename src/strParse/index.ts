/**
 * Возвращает функцию, которая создаст функцию принимающую параметры
 * и возвращающую строку с подставленными значениями
 * @param str
 * @param options
 */
export function strTemplate (str: string, options = {
  separator: '{}'
}) {
  const [leftSeparator, rightSeparator] = getSeparators(options.separator)
  const re = new RegExp(`${leftSeparator}.*?${rightSeparator}`, 'g')
  const paramsNameList = Array.from(str.matchAll(re)).map(res => res[0].replace(leftSeparator, '').replace(rightSeparator, ''))
  return (params: Record<string, any>): string => {
    let result = str
    paramsNameList.forEach(paramName => {
      result = result.replace(leftSeparator + paramName + rightSeparator, params[paramName])
    })
    return result
  }
}

function getSeparators (str: string): [string, string] {
  const arr = str.split('')
  const left = arr.slice(0, arr.length / 2).join('')
  const right = arr.slice(arr.length / 2, arr.length).join('')
  return [left, right]
}
