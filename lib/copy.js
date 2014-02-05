/**
 * Creates a copy of the specified template in the current working directory.
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
 *
 */
module.exports = function(paths) {
    /**
     * @param {String} Template name
     * @param {String} Destination name
     *
     * @return {String} Replica path
     */
    return function (template, name, callback) {
        var source = paths.target + '/' + template,
            dest = process.cwd() + '/' + name;
            console.log(source);
        // Checks
        if (!fs.existsSync(source)) return callback('Template not found.');
        if (fs.existsSync(dest)) return callback('Path already exists.');

        // Copy
        extra.copy(source, dest, function (err) {
            callback(err, dest);
        });
    };
};