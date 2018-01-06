#!/usr/bin/env node

/*
 * DOMUSTO Home Automation Manager script 
 * 
 * Author: Bas van Dijk
 * 
 */

let util = require('util');
let spawn = require('child_process').spawn;
let fs = require('fs');
let jsonfile = require('jsonfile');

const pluginFolder = './src/domusto-plugins';

switch (process.argv[2]) {

    case 'start':
        spawn('npm', ['run', 'start'], { stdio: ['inherit', 'inherit', 'inherit'] });
        break;

    case 'dev':
        spawn('npm', ['run', 'dev'], { stdio: ['inherit', 'inherit', 'inherit'] });
        break;

    case 'plugin':

        switch (process.argv[3]) {

            case 'add':
                if (!process.argv[4]) {
                    console.log('Usage: no github plugin name specified');
                    process.exit()
                }
                repoClone(process.argv[4]);
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
            case 'install-deps':
                reInstallDeps();
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
      🔈 💡 🚨 ⛅ ️🌡 🔌 🏠   DOMUSTO Home Automation manager  🏠 🔌 🌡️ ⛅ 🚨 💡 🔈
-------------------------------------------------------------------------------

DOMUSTO
Use ctrl+c to stop server
 domusto start    start server
 domusto dev      start server with live refresh on .ts changes

PLUGIN COMMANDS:
Example: domusto plugin add basvdijk/domusto-marantz

 domusto plugin add [REPO]      install plugin by Git repo name
 domusto plugin remove [REPO]   remove plugin by Git repo name
 domusto plugin upgrade         upgrade all installed DOMUSTO plugins
 domusto plugin install-deps    re-install all plugin dependencies
 domusto plugin list            list all installed DOMUSTO plugins

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
        repoUpgrade(`${pluginFolder}/${plugin}`);
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

        let rm = spawn('rm', ['-r', `${pluginFolder}/${pluginName}`], { stdio: ['inherit', 'inherit', 'inherit'] });

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
function getDependencies(pluginName) {

    let packageJson = `${pluginFolder}/${pluginName}/package.json`;

    let packages = [];

    let obj = jsonfile.readFileSync(packageJson);

    for (package in obj.dependencies) {
        packages.push(`${package}@${obj.dependencies[package]}`);
    }

    return packages;
}

/**
 * Install npm packages
 * 
 * @param {any} packages Array with packages to install 
 */
function installNpmPackages(packages) {

    log('Installing plugin dependencies:');
    log(packages.join(' '));

    let npm = spawn('npm', ['install', ...packages], { stdio: ['inherit', 'inherit', 'inherit'] });

    npm.on('exit', function (code) {
        if (code === 0) {
            success('Done installing dependencies');
        } else {
            console.log('child process exited with code ' + code);
        }
    });

}

/**
 * Upgrade repo to latest version
 * 
 * @param {any} pluginRepo Repository path e.g. src/plugins/domusto-marantz
 */
function reInstallDeps(pluginRepo) {

    let plugins = fs.readdirSync(pluginFolder).filter(function(file) {
        return (file.indexOf('.AppleDouble') === -1) && (file.indexOf('.MD') === -1);
    });

    let dependencies = new Set();

    for (plugin of plugins) {       
        dependencies = [...new Set([...dependencies ,...getDependencies(plugin)])];
    }

    installNpmPackages(dependencies);

}

/**
 * Clone repository in plugin folder
 * 
 * @param {any} pluginRepo Repository of plugin on Git e.g. basvdijk/domusto-marantz
 * @returns 
 */
function repoClone(pluginRepo) {

    log(`Installing DOMUSTO plugin ${pluginRepo}`);

    let repo = `https://github.com/${pluginRepo}.git`;

    let pluginName = pluginRepo.split('/').reverse()[0];

    if (fs.existsSync(`${pluginFolder}/${pluginName}`)) {

        warning(`Cannot add DOMUSTO plugin '${pluginRepo}', the plugin is already installed`);

    } else {

        let git = spawn('git', ['clone', repo, `${pluginFolder}/${pluginName}`], { stdio: ['inherit', 'inherit', 'inherit'] });

        git.on('exit', function (code) {

            if (code === 0) {

                let packages = getDependencies(pluginName);

                if (packages.length > 0) {
                    installNpmPackages(packages);
                }
                
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
function repoUpgrade(pluginRepo) {

    let git = spawn('git', [`--work-tree=${pluginRepo}`, 'pull'], { stdio: ['inherit', 'inherit', 'inherit'] });

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
