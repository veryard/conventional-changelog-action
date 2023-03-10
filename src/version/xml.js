const core = require('@actions/core')
const objectPath = require('object-path')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
module.exports = class Xml extends BaseVersioning {

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    // Read the file
    const fileContent = this.read()

    // Parse the file
    let xmlObject

    const parser = new XMLParser();
    try {
      xmlObject = parser.parse(fileContent);
    } catch (error) {
      core.startGroup(`Error when parsing the file '${this.fileLocation}'`)
      core.info(`File-Content: ${fileContent}`)
      core.info(error) // should be 'warning' ?
      core.endGroup()

      xmlObject = {}
    }

    this.oldVersion = objectPath.get(xmlObject, this.versionPath, null)

    // Get the new version
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion,
    )

    core.info(`Bumped file "${this.fileLocation}" from "${this.oldVersion}" to "${this.newVersion}"`)

    // Update the content with the new version
    objectPath.set(xmlObject, this.versionPath, this.newVersion)

    const builder = new XMLBuilder({
      format: true
    });
    // Update the file
    this.update(
      builder.build(xmlObject)
    )
  }

}

