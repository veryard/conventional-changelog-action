const core = require('@actions/core')
const gitSemverTags = require('git-semver-tags')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Git extends BaseVersioning {

  bump = (releaseType) => {
    return new Promise((resolve) => {
      const tagPrefix = core.getInput('tag-prefix')
      const prerelease = core.getBooleanInput('pre-release')

      gitSemverTags({ tagPrefix, skipUnstable: !prerelease }, async (err, tags) => {
        if (tags.length > 0) {
          // should work
          tags.sort((a, b) => {
            const aVersion = a.replace(tagPrefix, '');
            const bVersion = b.replace(tagPrefix, '');

            return bVersion.localeCompare(aVersion);
          });
        }
        this.oldVersion = tags.length > 0 ? tags.shift().replace(tagPrefix, '') : null

        // Get the new version
        this.newVersion = await bumpVersion(
          releaseType,
          this.oldVersion,
        )

        // We are done
        resolve()
      })
    })
  }

}
