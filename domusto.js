#!/usr/bin/env node

/*
 * DOMUSTO Home Automation Manager script 
 */

let util = require('util');
let spawn = require('child_process').spawn;
let fs = require('fs');
let jsonfile = require('jsonfile');

const pluginFolder = './src/domusto-plugins';

switch (process.argv[2]) {

    case 'start':
        let nodeStart = spawn('npm', ['start']);
        nodeStart.stdout.on('data', function (data) {
            if (data) {
                process.stdout.write(data);
            }
        });
        break;

    case 'dev':
        let nodeDev = spawn('npm', ['dev']);
        nodeDev.stdout.on('data', function (data) {
            if (data) {
                process.stdout.write(data);
            }
        });
        break;

    case 'plugin':

        switch (process.argv[3]) {

            case 'add':
                if (!process.argv[4]) {
                    console.log('Usage: no github plugin name specified');
                    process.exit()
                }
                cloneRepo(process.argv[4]);
                break;
            case 'remove':
                if (!process.argv[4]) {
                    console.log('Usage: no github plugin name specified');
                    process.exit()
                }
                pluginRemove(process.argv[4]);
                break;
            case 'upgrade':
                pluginUpgrade();
                break;
            case 'list':
                pluginList();
                break;
            default:
                console.log('Usage: domusto plugin add <DOMUSTO plugin name>');
                console.log('Usage: domusto plugin remove <DOMUSTO repo name>');
                break;

        }

        break;

    default:
        console.log(`
-------------------------------------------------------------------------------
                     DOMUSTO Home Automation manager 🏠
-------------------------------------------------------------------------------

DOMUSTO
 domusto start    start DOMUSTO server
 domusto dev      start DOMUSTO server in development mode with live refresh on .ts changes

PLUGIN COMMANDS:
 domusto plugin add <Git repo name>        install plugin by Git repo name e.g. basvdijk/domusto-marantz
 domusto plugin remove <Git repo name>     remove plugin by Git repo name e.g. basvdijk/domusto-marantz
 domusto plugin upgrade                    upgrade all installed DOMUSTO plugins
 domusto plugin list                       list all installed DOMUSTO plugins

 -------------------------------------------------------------------------------
        `);
        break;
}

/**
 * Upgrades installed plugins
 * 
 */
function pluginUpgrade() {

    let plugins = fs.readdirSync(pluginFolder);

    for (plugin of plugins) {
        upgradeRepo(`${pluginFolder}/${plugin}`);
    }

}

/**
 * Lists installed plugins
 * 
 */
function pluginList() {

    let plugins = fs.readdirSync(pluginFolder);

    console.log('Currently installed DOMUSTO plugins:')

    for (pluginName of plugins) {

        let packageJson = `${pluginFolder}/${pluginName}/package.json`;

        jsonfile.readFile(packageJson, function (err, obj) {

            for (package in obj.dependencies) {
                console.log(` ${package}@${obj.dependencies[package]}`);
            }
        
        });

    }

}


/**
 * Remove installed plugin
 * 
 * @param {any} pluginRepo Github repository name e.g. basvdijk/domusto-marantz
 * @returns 
 */
function pluginRemove(pluginRepo) {

    let pluginName = pluginRepo.split('/').reverse()[0];

    if (!fs.existsSync(`${pluginFolder}/${pluginName}`)) {

        warning(`Cannot remove DOMUSTO plugin '${pluginName}', the plugin is not installed`);

    } else {

        let rm = spawn('rm', ['-r', `${pluginFolder}/${pluginName}`]);

        rm.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        rm.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        rm.on('exit', function (code) {
            success(`Successfully removed DOMUSTO plugin ${pluginName}`);
        });

        return rm;
    }

}

/**
 * Install dependencies from package.json 
 * 
 * @param {any} pluginName Name of the plugin e.g. domusto-marantz
 */
function installDependencies(pluginName) {

    let packageJson = `${pluginFolder}/${pluginName}/package.json`;

    let packages = [];

    jsonfile.readFile(packageJson, function (err, obj) {

        for (package in obj.dependencies) {
            packages.push(`${package}@${obj.dependencies[package]}`);
        }

        installNpm(packages);

    });

}

/**
 * Install npm packages
 * 
 * @param {any} packages Array with packages to install 
 */
function installNpm(packages) {

    log('Installing plugin dependencies: ' + packages.join(' '));

    let npm = spawn('npm', ['install', packages.join(' ')]);

    npm.stdout.on('data', function (data) {
        if (data) {
            process.stdout.write(data);
        }
    });

    npm.stderr.on('data', function (data) {
        if (data) {
            process.stdout.write(data);
        }
    });

    npm.on('exit', function (code) {
        if (code === 0) {
            success('Done installing dependencies');
        } else {
            console.log('child process exited with code ' + code);
        }
    });

}

/**
 * Clone repository in plugin folder
 * 
 * @param {any} pluginRepo Repository of plugin on Git e.g. basvdijk/domusto-marantz
 * @returns 
 */
function cloneRepo(pluginRepo) {

    log(`Installing DOMUSTO plugin ${pluginRepo}`);

    let repo = `https://github.com/${pluginRepo}.git`;

    let pluginName = pluginRepo.split('/').reverse()[0];

    if (fs.existsSync(`${pluginFolder}/${pluginName}`)) {

        warning(`Cannot add DOMUSTO plugin '${pluginRepo}', the plugin is already installed`);

    } else {

        let git = spawn('git', ['clone', repo, `${pluginFolder}/${pluginName}`]);

        git.stdout.on('data', function (data) {
            process.stdout.write(data);
        });

        git.stderr.on('data', function (data) {
            process.stdout.write(data);
        });

        git.on('exit', function (code) {

            if (code === 0) {
                installDependencies(pluginName);
            } else {
                console.log('child process exited with code ' + code);
            }

        });

        return git;
    }

}

/**
 * Upgrade repo to latest version
 * 
 * @param {any} pluginRepo Repository path e.g. src/plugins/domusto-marantz
 */
function upgradeRepo(pluginRepo) {

    let git = spawn('git', [`--work-tree=${pluginRepo}`, 'pull']);

    git.stdout.on('data', function (data) {
        console.log('' + data);
    });

    git.stderr.on('data', function (data) {
        console.log('' + data);
    });

    git.on('exit', function (code) {

        if (code === 0) {
            success(`${pluginRepo.split('/').reverse()[0]} upgraded`);
            
        } else {
            console.log('child process exited with code ' + code);
        }

    });


}

function debug(...args) {
    Array.prototype.unshift.call(args);
    console.log.apply(this, args);
}

function log(...args) {
    Array.prototype.unshift.call(args);
    console.log.apply(this, args);
}

function warning(...args) {
    Array.prototype.unshift.call(args, '\x1b[33m' + args[0]);
    Array.prototype.splice.call(args, 1, 1);
    Array.prototype.push.call(args, '\x1b[0m');
    console.log.apply(this, args);
}

function success(...args) {
    Array.prototype.unshift.call(args, '\x1b[32m' + args[0]);
    Array.prototype.splice.call(args, 1, 1);
    Array.prototype.push.call(args, '\x1b[0m');
    console.log.apply(this, args);
}

function error(...args) {
    Array.prototype.unshift.call(args, '\x1b[31m' + args[0]);
    Array.prototype.splice.call(args, 1, 1);
    Array.prototype.push.call(args, '\x1b[0m');
    console.log.apply(this, args);
}
