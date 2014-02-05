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
        .option('-n --name [name]', 'Name of project to be generated')
        .option('-a --add [path]', 'Add folder as template (optional -n)')
        .option('-l --list', 'List all saved templates')
        .option('-r --remove [template]', 'Remove template from list')
        .option('-t --build [template]', 'Creates a project with the selected template')
        .option('-s --setup', 'Initializes the included modules at [MODULE_PATH]/.generator')
        .parse(process.argv);

var paths = {source: __dirname + '/../templates', target: __dirname + '/../.generator'},
    copy        = require('../lib/copy')(paths),
    setup       = require('../lib/setup')(paths),
    add       = require('../lib/add')(paths),
    list       = require('../lib/list')(paths),
    remove       = require('../lib/remove')(paths),
    make        = require('../lib/make'),
    render      = require('../lib/render'),
    walk        = require('../lib/walk');

/**
 * Error handler
 */
function stderr (err) {
    console.log(typeof err === 'object' ? err.toString().red : ('Error: ' + err).red);
    process.exit(1);
}

//console.log(program.template, program.name);
//process.exit(0);

/**
 * Execute
 */
// Setup
if (program.setup) {
    setup(function (err) {
        if (err) return stderr(err);
        console.log('Done.'.green);
    });
// Add
} else if (program.add){
    add(program.add, program.name, function (err) {
        if (err) return stderr(err);
        console.log('Done.'.green);
    });
// Remove
} else if (program.remove){
    remove(program.remove, function (err) {
        if (err) return stderr(err);
        console.log(program.remove.bold + ' removed.'.green);
    });
} else if (program.list){
    list();
} else {
    // Check requirements
    if (typeof program.build === 'undefined' || program.name === 'undefined') {
        return stderr('Template (-t) and project name (-n) must be specified. See --help');
    }

    // Replicate the template
    copy(program.build, program.name, function (err, path) {
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