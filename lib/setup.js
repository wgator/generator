/**
 * Loads the default templates for the current user.
 *
 * @package generator
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var extra   = require('fs-extra'),
    fs      = require('fs');

/**
 * Export
 */
module.exports = function(path) {
    return function (callback) {
        fs.exists(path.target, function (exists) {
            if (exists) console.log('Re-initalizing default templates...'.yellow);
            extra.copy(path.source, path.target, callback);
        });
    };
}