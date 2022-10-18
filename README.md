# totem-dna-parser

Node module for parsing DNA of Totem Assets

# Installation

npm install --save git+https://github.com/Totem-gdn/totem-dna-parser

# Get Default JSON

const { DNAParser } = require('totem-dna-parser')

const defaultAvatarJson = DNAParser.defaultAvatarJson
const defaultGemJson = DNAParser.defaultGemJson
const defaultItemJson = DNAParser.defaultItemJson

# Get all possible properties for JSON

const { DNAParser } = require('totem-dna-parser')

const parser = new DNAParser(JSON, DNA)

const properties = parser.getFilterPropertiesList()

# Get field

const { DNAParser } = require('totem-dna-parser')

const parser = new DNAParser(JSON, DNA)

const result = parser.getField(ID)

# Get Item Rarity

const { DNAParser } = require('totem-dna-parser')

const rarity = new DNAParser().getItemRarity(ITEM_ID)

# Working with contract

const { ContractHandler } = require('totem-dna-parser')

const contractHandler = new ContractHandler(url, contract)

const DNA = await contractHandler.getDNA(id)
