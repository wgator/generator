/**
 * Adds passed folder or current user path to templates
 *
 * @package generator
 * @author Rafael Correia <rafael.ja.tinha@gmail.com>
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

    return function (path, name, callback) {
        var source = (typeof path !== 'boolean' && path) || process.cwd(),
            name = name || source.match(/([^\/]+)\/?$/)[1],
            dest = paths.target + '/' + name;
        // Checks
        if (!fs.existsSync(source)) return callback('Path not found.');
        if (fs.existsSync(dest)) return callback('A template with the same name already exists.');

        // Copy template
        extra.copy(source, dest, function (err) {
            callback(err, dest);
        });
    };
}