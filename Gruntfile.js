module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            build: {
                files: {
                    'build/server.js': 'express/server.js'
                },
                options: {
                    transform: [['babelify', { presets: ["@babel/preset-env"] }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify:build']);
};