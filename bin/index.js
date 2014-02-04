#!/usr/bin/env node

/**
 * Command line interface for generator.
 *
 * @package generator
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var colors   = require('colors'),
    program  = require('commander')
    pkg      = require('../package.json'),
    version  = pkg.version;

    program
        .version(version)
        .usage('Usage: $0 -t npm -n myModule')
        .option('-t --template [template]', 'Template name (from [MODULE_PATH]/.generator)')
        .option('-n --name [name]', 'Name of project to be generated')
        .option('-s --setup', 'Initializes the included modules at [MODULE_PATH]/.generator')
        .parse(process.argv);

var map = {source: __dirname + '/../templates', target: __dirname + '/../.generator'},
    copy        = require('../lib/copy')(map),
    make        = require('../lib/make'),
    render      = require('../lib/render'),
    setup       = require('../lib/setup')(map),
    walk        = require('../lib/walk');

/**
 * Error handler
 */
function stderr (err) {
    console.log('Error: '.red + err.red);
    process.exit(1);
}

//console.log(program.template, program.name);
//process.exit(0);

/**
 * Execute
 */
if (program.setup) {
    setup(function (err) {
        if (err) return stderr(err);
        console.log('Done.'.green);
    });
} else {
    // Check requirements
    if (typeof program.template === 'undefined' || program.name === 'undefined') {
        return stderr('Template (-t) and project name (-n) must be specified. See --help');
    }

    // Replicate the template
    copy(program.template, program.name, function (err, path) {
        if (err) return stderr(err);

        // Walk and gather variables
        walk(path, program.name, function (err, result) {
            if (err) return stderr(err);

            // Render the results of the walk
            render(result, function (err) {
                if (err) return stderr(err);
                
                // Post-processing (make)
                make(path, function (err) {
                    if (err) return stderr(err);
                    console.log('Done.'.green);
                });
            });
        });
    });
}