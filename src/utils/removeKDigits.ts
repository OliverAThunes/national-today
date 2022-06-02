// Converts a string number K representation to a real number.
// I.E. 1k becomes 1000
export function unabbrNum(stringNum: string): number {
  var abbrev = ['k', 'm', 'b', 't']
  stringNum = stringNum.toLowerCase()
  var cut = stringNum.slice(-1)
  let number: number = parseFloat(stringNum)
  for (let i = 0; i < abbrev.length; i++) {
    if (abbrev[i] === cut) {
      number = number * 1000 * (i + 1)
    }
  }
  return number
}
