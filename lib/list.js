/**
 * List all saved templates
 *
 * @package generator
 * @author Rafael Correia <rafael.ja.tinha@gmail.com>
 */

/**
 * Dependencies
 */
var fs      = require('fs'),
    colors   = require('colors');

/**
 * Export
 *
 */
module.exports = function(paths) {

    return function (callback) {
        var path = paths.target;
        fs.readdirSync(path).forEach(function(file, index) {
            if(fs.lstatSync(path + '/' + file).isDirectory()) {
                console.log('\t' + file.cyan.bold);   
            }
        });

    };
};