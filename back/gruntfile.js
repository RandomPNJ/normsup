module.exports = function (grunt) {
    "use strict";

    let outDir = 'dist';
    let buildTasks = ['clean', 'concurrent:build'];

    grunt.initConfig({
        watch: {
            ts: {
                files: 'server/**/*.ts',
                tasks: buildTasks
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        },
        clean: ['./' + outDir],
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            run: ['nodemon', 'watch'],
            build: ['ts']
        },
        nodemon: {
            dev: {
                script: outDir + '/app.js',
                watch: [outDir],
                delay: 2000,
                ext: ['js'],
                legacyWatch: true,
                options: {
                    nodeArgs: ['--inspect'],
                    env: {
                        PORT: 8080,
                        NODE_ENV: 'development'
                    }
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', buildTasks);
    grunt.registerTask('default', ['build', 'concurrent:run']);
};