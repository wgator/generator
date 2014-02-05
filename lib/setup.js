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
module.exports = function(paths) {
    return function (callback) {
        fs.exists(paths.target, function (exists) {
            if (exists) console.log('Re-initalizing default templates...'.yellow);
            extra.copy(paths.source, paths.target, callback);
        });
    };
};