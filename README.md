# totem-dna-parser

Node module for parsing DNA of Totem Assets

# Installation

npm install --save git+https://github.com/Totem-gdn/totem-dna-parser

# Get Default JSON

const { DNAParser } = require('totem-dna-parser')

const defaultAvatarJson = DNAParser.defaultAvatarJson

const defaultGemJson = DNAParser.defaultGemJson

const defaultItemJson = DNAParser.defaultItemJson

returns an array of objects with rules for DNA

# Get all possible properties for JSON

const { DNAParser } = require('totem-dna-parser')

const parser = new DNAParser(JSON, DNA)

const properties = parser.getFilterPropertiesList()

returns an array of strings with all possible properties for DNA from JSON.

# Get field

const { DNAParser } = require('totem-dna-parser')

const parser = new DNAParser(JSON, DNA)

const result = parser.getField(ID)

returns decrypted value from DNA

# Get Item Rarity

const { DNAParser } = require('totem-dna-parser')

const rarity = new DNAParser().getItemRarity(ITEM_ID)

returns rarity integer

# Working with contract

const { ContractHandler } = require('totem-dna-parser')

const contractHandler = new ContractHandler(url, contract)

const DNA = await contractHandler.getDNA(id)

returns DNA string

# Enum of Registers which can be used for getExponentialValue

const { Registers } = require('totem-dna-parser')

returns enum {
HIGH: 'high',
LOW: 'low'
}

# Get exponential value

const parser = new DNAParser(JSON, DNA)

parser.getExponentialValue(index, Registers.LOW)

returns exponential value
