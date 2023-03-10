const Json = require('./json')
const Git = require('./git')
const Yaml = require('./yaml')
const Toml = require('./toml')
const Pom = require('./pom')

module.exports = (fileExtension) => {
  switch (fileExtension.toLowerCase()) {
    case 'json':
      return new Json()

    case 'yaml':
    case 'yml':
      return new Yaml()

    case 'toml':
      return new Toml()

    case 'git':
      return new Git()

    case 'xml':
        return new Pom()

    default:
      return null
  }
}
