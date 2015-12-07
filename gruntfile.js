'use strict';

// 定义模块依赖
var _ = require('lodash');
var defaultAssets = require('./config/assets/default');
var testAssets = require('./config/assets/test');
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
    // 初始化工程配置
    grunt.initConfig({
        // NPM模块依赖
        pkg: grunt.file.readJSON('package.json'),
        // 环境配置（测试/开发/生产）
        env: {
            test: {
                NODE_ENV: 'test'
            },
            dev: {
                NODE_ENV: 'development'
            },
            prod: {
                NODE_ENV: 'production'
            }
        },
        // 监视文件，当CSS和JS代码发生变化时，对代码进行检查，当SCSS
        // 和LESS文件发生变化时，先预编译成CSS代码，再进行CSS代码检查
        watch: {
            serverViews: {
                files: defaultAssets.server.views,
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientViews: {
                files: defaultAssets.client.views,
                options: {
                    livereload: true
                }
            },
            clientJS: {
                files: defaultAssets.client.js,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: defaultAssets.client.css,
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            },
            clientSCSS: {
                files: defaultAssets.client.sass,
                tasks: ['sass', 'csslint'],
                options: {
                    livereload: true
                }
            },
            clientLESS: {
                files: defaultAssets.client.less,
                tasks: ['less', 'csslint'],
                options: {
                    livereload: true
                }
            }
        },
        // 定义服务器端文件监视，如有变化则重启服务器
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: _.union(
                        defaultAssets.server.gruntConfig,
                        defaultAssets.server.views,
                        defaultAssets.server.allJS,
                        defaultAssets.server.config
                    )
                }
            }
        },
        // 定义并发执行的grunt任务
        concurrent: {
            default: ['nodemon', 'watch'],
            debug: ['nodemon', 'watch', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        },
        // 检查JS代码
        jshint: {
            all: {
                src: _.union(
                    defaultAssets.server.gruntConfig,
                    defaultAssets.server.allJS,
                    defaultAssets.client.js,
                    testAssets.tests.server,
                    testAssets.tests.client,
                    testAssets.tests.e2e
                ),
                options: {
                    jshintrc: true,
                    node: true,
                    mocha: true,
                    jasmine: true
                }
            }
        },
        // 检查CSS代码
        csslint: {
            all: {
                src: defaultAssets.client.css
            },
            options: {
                csslintrc: '.csslintrc'
            }
        },
        // 合并客户端AngularJS代码
        ngAnnotate: {
            production: {
                files: {
                    'public/dist/application.js': defaultAssets.client.js
                }
            }
        },
        // 压缩客户端JS代码，但不混淆变量名
        uglify: {
            production: {
                options: {
                    mangle: false
                },
                files: {
                    'public/dist/application.min.js': 'public/dist/application.js'
                }
            }
        },
        // 压缩客户端CSS代码
        cssmin: {
            combine: {
                files: {
                    'public/dist/application.min.css': defaultAssets.client.css
                }
            }
        },
        // 预编译SASS文件成CSS文件
        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: defaultAssets.client.sass,
                    ext: '.css',
                    rename: function (base, src) {
                        return src.replace('/scss/', '/css/');
                    }
                }]
            }
        },
        // 预编译LESS文件成CSS文件
        less: {
            dist: {
                files: [{
                    expand: true,
                    src: defaultAssets.client.less,
                    ext: '.css',
                    rename: function (base, src) {
                        return src.replace('/less/', '/css/');
                    }
                }]
            }
        },
        // Node调试工具配置
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 1337,
                    'web-host': 'localhost',
                    'debug-port': 5858,
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 50,
                    'hidden': []
                }
            }
        },
        // Mocha测试配置
        mochaTest: {
            src: testAssets.tests.server,
            options: {
                reporter: 'spec'
            }
        },
        // Mocha测试覆盖率报告配置
        mocha_istanbul: {
            coverage: {
                src: testAssets.tests.server,
                options: {
                    print: 'detail',
                    coverage: true,
                    require: 'test.js',
                    coverageFolder: 'coverage',
                    reportFormats: ['cobertura','lcovonly'],
                    check: {
                        lines: 40,
                        statements: 40
                    }
                }
            }
        },
        // Karma单元测试配置
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        // Protractor端对端测试配置
        protractor: {
            options: {
                configFile: 'protractor.conf.js',
                keepAlive: true,
                noColor: false
            },
            e2e: {
                options: {
                    args: {}
                }
            }
        },
        // 当本地配置文件local.js不存在时，复制一份本地
        // local.example.js文件作为本地的local.js
        copy: {
            localConfig: {
                src: 'config/env/local.example.js',
                dest: 'config/env/local.js',
                filter: function () {
                    return !fs.existsSync('config/env/local.js');
                }
            }
        }
    });

    // 为Mocha测试覆盖率报告生成事件注册回调
    grunt.event.on('coverage', function(lcovFileContents, done) {
        require('coveralls').handleInput(lcovFileContents, function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    // 加载grunt任务
    require('load-grunt-tasks')(grunt);

    // 注册mkdir:upload任务，创建upload文件夹
    grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
        // 获取回调函数
        var done = this.async();
        grunt.file.mkdir(path.normalize(__dirname + '/modules/users/client/img/profile/uploads'));
        done();
    });

    // 注册mongoose任务，连接到MongoDB实例并加载模型
    grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function () {
        // 获取回调函数
        var done = this.async();

        var mongoose = require('./config/lib/mongoose.js');
        mongoose.connect(function (db) {
            done();
        });
    });

    // 注册server任务，启动服务器
    grunt.task.registerTask('server', 'Starting the server', function () {
        // 获取回调函数
        var done = this.async();

        var path = require('path');
        var app = require(path.resolve('./config/lib/app'));
        var server = app.start(function () {
            done();
        });
    });

    // 注册lint任务，检查所有CSS和JS文件
    grunt.registerTask('lint', ['sass', 'less', 'jshint', 'csslint']);

    // 注册build任务，检查所有CSS和JS文件并压缩成两个工程文件
    grunt.registerTask('build', ['env:dev', 'lint', 'ngAnnotate', 'uglify', 'cssmin']);

    // 注册test系列任务，运行测试代码，其中：
    // test任务：运行Mocha与Karma测试服务器端
    // test:server：只执行服务器端的Mocha测试
    // test:client：只执行客户器端的Karma测试
    grunt.registerTask('test', ['env:test', 'lint', 'mkdir:upload', 'copy:localConfig', 'server', 'mochaTest', 'karma:unit']);
    grunt.registerTask('test:server', ['env:test', 'lint', 'server', 'mochaTest']);
    grunt.registerTask('test:client', ['env:test', 'lint', 'server', 'karma:unit']);

    // 注册coverage任务，生成测试覆盖率报告
    grunt.registerTask('coverage', ['env:test', 'lint', 'mocha_istanbul:coverage']);

    // 注册default任务，在开发模式下运行整个工程
    grunt.registerTask('default', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

    // 注册debug任务，在开发模式下运行整个工程并启动调试工具
    grunt.registerTask('debug', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);

    // 注册prod任务，在生产模式下运行整个工程
    grunt.registerTask('prod', ['build', 'env:prod', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);
};
