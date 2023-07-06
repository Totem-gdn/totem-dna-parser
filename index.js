const totemCommonFiles = require('totem-common-files')
const Web3 = require('web3');

const Registers = {
	HIGH: 'high',
	LOW: 'low'
}

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

  getExponentialValue (index, register) {
    const start = index * 32;
    const end = start + 32

    const partBin = this.binary.slice(start, end);

    const high = partBin.slice(0, 16)
    const low = partBin.slice(16, partBin.length)

    switch (register) {
      case Registers.HIGH:
        return parseInt(high, 2)
      case Registers.LOW:
        return parseInt(low, 2)
      default: 
        throw new Error('Register can be HIGH or LOW')
    }
  }

  getExponentialValueProbability (value) {
    return 1 - Math.exp(-value / 7057);
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

  _parseHexString (hexStr) {
       // Declare a lookup table for hexadecimal values 
    let hexTable = { 
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', 
        '4': '0100', '5': '0101', '6': '0110', '7': '0111', 
        '8': '1000', '9': '1001', 'a': '1010', 'b': '1011', 
        'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111' 
    } 
  
    // Initialize a variable to store binary string 
    let binStr = ''; 
  
    // Convert each hexadecimal character 
    // to its binary equivalent 
    for (let i = 0; i < hexStr.length; i++) 
        binStr += hexTable[hexStr[i]]; 
  
    // Return the converted binary string 
    return binStr; 
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
  ContractHandler,
  Registers
}