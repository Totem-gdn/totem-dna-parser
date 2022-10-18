# totem-dna-parser

Node module for parsing DNA of Totem Assets

# Import

const DNAParser = require('dna-parser')

# Get Default JSON

const defaultAvatarJson = DNAParser.defaultAvatarJson
const defaultGemJson = DNAParser.defaultGemJson
const defaultItemJson = DNAParser.defaultItemJson

# Get all possible properties for JSON

const parser = new DNAParser(JSON, BINARY_DATA)

const properties = parser.getFilterPropertiesList()

# Get field

const parser = new DNAParser(JSON, BINARY_DATA)

const result = parser.getField(ID)

# Get Item Rarity

const rarity = new DNAParser().getItemRarity(ITEM_ID)
