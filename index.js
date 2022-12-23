const totemCommonFiles = require('totem-common-files')
const Web3 = require('web3');

class DNAParser {
  constructor (json, dna) {
    if (typeof json === 'object') {
      this.json = json
    } else {
      try {
        this.json = JSON.parse(json)
      } catch (e) {
        throw 'Invalid JSON'
      }
    }
    this.binary = dna ? this._parseHexString(dna) : ''

    this.types = {
      map: 'Map',
      color: 'Color',
      bool: 'Bool',
      int: 'Int',
      float: 'Float',
      range: 'Range'
    }
  }

  static defaultAvatarJson = totemCommonFiles.avatarFilterJson
  static defaultGemJson = totemCommonFiles.itemFilterJson
  static defaultItemJson = totemCommonFiles.itemFilterJson

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
        result = item && item.values[idx] ? item.values[idx].key : null
        break;
      case 'color':
        const array = sep(partBin, partBin.length / 3).map(bin => parseInt(bin, 2))
        const color = array.join(',')
        const rgb = array.length === 3 ? `rgb(${color})` : `rgba(${color})`
        result = partBin.includes('undefined') ? '#FFD011' : rgb;
        break;
      case 'bool':
        const bool = parseInt(partBin, 2);
        result = item && item.values && item.values.length ? item.values[bool] : bool
        break;
      case 'int':
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
        result = foundedItem ? foundedItem.key : null
        break;
    }

    return result
  }

  getFilterPropertiesList () {
    return this.json.map((j) => {
      return j.id
    })
  }

  getFieldType (id) {
    const field = this.json.find((j) => j.id === id) 

    if (field) {
      return this.types[field.type.toLowerCase()]
    } else {
      return null
    }
  }

  getItemRarity (id) {
    return id % 100
  }

  _parseHexString (str) {
    const lookup = {
      '0': '0000',
      '1': '0001',
      '2': '0010',
      '3': '0011',
      '4': '0100',
      '5': '0101',
      '6': '0110',
      '7': '0111',
      '8': '1000',
      '9': '1001',
      'a': '1010',
      'b': '1011',
      'c': '1100',
      'd': '1101',
      'e': '1110',
      'f': '1111',
      'A': '1010',
      'B': '1011',
      'C': '1100',
      'D': '1101',
      'E': '1110',
      'F': '1111'
    };
    let ret = '';
    for (let i = 0, len = str.length; i < len; i++) {
      if (lookup[str[i]]) {
        ret += ((ret.length === 0 && lookup[str[i]] === '0000') ? '' : lookup[str[i]]);
      }
    }
    return ret;
  }
}

class ContractHandler {
  constructor (nodeUrl, contract) {
    this.contract = contract
    this.web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
  }

  async getDNA (id) {
    const contract = new this.web3.eth.Contract(totemCommonFiles.assets_abi, this.contract)

    const tokenURI = await contract.methods.tokenURI(id).call()

    return tokenURI
  }
}

module.exports = {
  DNAParser,
  ContractHandler
}