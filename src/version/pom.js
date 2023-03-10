const core = require('@actions/core')
const objectPath = require('object-path')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Pom extends BaseVersioning {

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
    let pomObject

    const parser = new XMLParser();
    try {
        pomObject = parser.parse(fileContent);
    } catch (error) {
        core.startGroup(`Error when parsing the file '${this.fileLocation}'`)
        core.info(`File-Content: ${fileContent}`)
        core.info(error) // should be 'warning' ?
        core.endGroup()

        pomObject = {}
    }

    // pomObject.project.version = "1.0.0"
    if (pomObject.project && pomObject.project.version) {
        this.oldVersion = pomObject.project.version
    } else {
        this.oldVersion = null
    }

    // Get the new version
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion,
    )

    core.info(`Bumped file "${this.fileLocation}" from "${this.oldVersion}" to "${this.newVersion}"`)

    // Update the content with the new version
    objectPath.set(pomObject, this.versionPath, this.newVersion)
    
    const builder = new XMLBuilder({
        format: true
    });
    const xmlContent = builder.build(pomObject);

    // Update the file
    this.update(
        xmlContent
    )
  }

}

