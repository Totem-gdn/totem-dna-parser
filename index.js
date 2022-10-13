exports.getProperty = function(json, binary, neededKey) {
  const item = json.find((i) => i.id === neededKey)

  if (!item) {
    return null
  }
  const start = item.gene * 32 + item.start
  const end = start + item.length
  
  let result

  const type = item.type.toLowerCase()
  const partBin = binary.slice(start, end);
  const sep = (xs, s) => xs.length ? [xs.slice(0, s), ...sep(xs.slice(s), s)] : []
  switch (type){
    case 'map':
      const idx = parseInt(partBin, 2);
      result = item.values[idx]?.key
      break;
    case 'color':
      const array = sep(partBin, partBin.length / 4).map(bin => parseInt(bin, 2))
      const color = array.join(',')
      const rgb = array.length === 3 ? `rgb(${color})` : `rgba(${color})`
      result = partBin.includes('undefined') ? '#FFD011' : rgb;
      break;
    case 'bool':
      result = parseInt(partBin, 2);
      break;
    case 'float':
      console.log(partBin)
      // const sepArray = sep(partBin, partBin.length / 4).map(bin => parseInt(bin, 2))
      const sepArray = ['0x05','0x07', '0x1B', '0x5C']
      console.log(sepArray)
      const buf = new ArrayBuffer(4);
      const view = new DataView(buf)

      sepArray.forEach((b, i) => {
        view.setUint8(i, b)
      })

      const num = view.getFloat32(0);
      console.log(num)
      break;
    case 'range': 
      const id = parseInt(partBin, 2);
      const foundedItem = item.values.find((i) => i.value[0] <= id && i.value[1] >= id)
      result = foundedItem?.key
      break;
  }

  return result
}