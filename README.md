# totem-dna-parser

Node module for parsing DNA of Totem Assets

# Import

const dnaParser = require('dna-parser')

# Get Default JSON

const json = new dnaParser().getDefaultFilter(JSON_TYPE)

# JSON TYPES

- avatar
- item
- gem

# Get all possible properties for JSON

const parser = new dnaParser(JSON, BINARY_DATA)

const properties = parser.getFilterPropertiesList()

# Get field

const parser = new dnaParser(JSON, BINARY_DATA)

const result = parser.getField(ID)
