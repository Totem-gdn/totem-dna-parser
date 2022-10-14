const itemFilterJson = require('./common/filters/totem-item.json')
const avatarFilterJson = require('./common/filters/totem-avatar.json')

module.exports = class DNAParser {
  constructor (json, binary) {
    this.json = json
    this.binary = binary
  }

  getField(key) {
    const item = this.json.find((i) => i.id === key)

    if (!item) {
      return null
    }
    const start = item.gene * 32 + item.start
    const end = start + item.length
    
    let result

    const type = item.type.toLowerCase()
    const partBin = this.binary.slice(start, end);
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
      case 'float': // FOR CHECK!!!
        const sepArray = ['0x05','0x07', '0x1B', '0x5C']
        const buf = new ArrayBuffer(4);
        const view = new DataView(buf)

        sepArray.forEach((b, i) => {
          view.setUint8(i, b)
        })

        const num = view.getFloat32(0);
        result = num
        break;
      case 'range': 
        const id = parseInt(partBin, 2);
        const foundedItem = item.values.find((i) => i.value[0] <= id && i.value[1] >= id)
        result = foundedItem?.key
        break;
    }

    return result
  }

  getDefaultFilter(type) {
    let json
    switch (type) {
      case 'avatar':
        json = avatarFilterJson
        break;
      case 'gem':
        json = itemFilterJson
        break;
      default:
        json = itemFilterJson
        break;
    }

    return json
  }
}