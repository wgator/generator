/**
 * Removes template from list
 *
 * @package generator
 * @author Rafael Correia <rafael.ja.tinha@gmail.com>
 */

/**
 * Dependencies
 */
var fs      = require('fs'),

    deleteFolderRecursive = function(path) {
        if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach(function(file,index) {
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

/**
 * Export
 *
 */
module.exports = function(paths) {

    return function (template, callback) {
        var path = paths.target + '/' + template;
        // Checks
        if (!template.length ||template.length < 1) return callback('You need to tell me the template name.');
        if (!fs.existsSync(path)) return callback('Template not found.');

        // Copy template
        deleteFolderRecursive(path);
        if (fs.existsSync(path)) return callback('Could not remove template ' + template + '.');
        return callback();
    };
};