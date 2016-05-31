/**
 * Created by Артем on 06.01.2016.
 */
'use strict'
const NODE_ENV = 'development';//process.env.NODE_ENV || 'development'; 'production'
const webpack = require('webpack');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(grunt) {

    pkg: grunt.file.readJSON('package.json');

    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        less: {
            style: {
                options: {
                    compress: true,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    'build/css/style.css': ['source/less/style.less']
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ["last 2 version", "ie 10"]
            },
            style: {
                src: "build/css/*.css"
            }
        },

        cmq: {
            style: {
                files: {
                    'build/css/style.css': ['build/css/style.css']
                }
            }
        },

        cssmin: {
            style: {
                options: {
                    keepSpecialComments: 0,
                    report: "gzip"
                },
                files: [{
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            }
        },

        clean: {
            build: [
                'build/css',
                'build/img',
                'build/js',
                'build/js/umd',
                'build/*.html',
                'build/*.ico'
            ]
        },

        copy: {
            img: {
                expand: true, // будет обрабатывать и новые файлы если появятся
                cwd: 'source/img/',// папка в которую нужно зайти перед началом выполнения таска
                src: ['**/*.{png,jpg,gif,svg}'], //**-проникнет во все внутренние папки, * возьмет любые файлы с разрешениями указанными после
                dest: 'build/img/'// папка куда следует поместить результат
            },
            favicon: {
                expand: true,
                src: ['source/img/favicons/favicon.ico'],
                dest: 'build/',
                flatten: true,
                filter: 'isFile'
            },
            css_add: {
                expand: true,
                cwd: 'source/css/',
                src: ['**'],
                dest: 'build/css/'
            },
            fonts: {
                expand: true,
                cwd: 'source/fonts/',
                src: ['**'],
                dest: 'build/fonts/'
            }
        },

        imagemin: {
            build: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    src: ['build/img/**/*.{png,jpg,gif,svg}']
                }]
            }
        },

        csscomb:{
            style: {
                expand: true,
                src: ["sourse/less/**/*.less"]
            }
        },

        ucss: {
            target: {
                pages: {
                    crawl: 'build/index.html'
                },
                css: ['build/css/style.css']
            }
        },

        includereplace: {
            html: {
                src: '*.html',
                dest: 'build/',
                expand: true,
                cwd: 'source/'
            }
        },

        svgstore: {
            options: {
                // formatting : {
                //   indent_size: 2
                // },
                includeTitleElement: false
            },
            default : {
                files: {
                    'source/img/sprite.svg': ['source/img/sprite_svg/*.svg'],
                }
            }
        },

        watch: {
            livereload: {
                options: { livereload: true },
                files: ['build/**/*']
            },
            style: {
                files: ['source/less/**/*.less'],
                tasks: ['style'],
                options: {
                    spawn: false
                }
            },
            style_add: {
                files: ['source/css/**/*.css'],
                tasks: ['style'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['source/js/script.js'],
                tasks: ['js'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['source/img/**/*.{png,jpg,gif,svg}'],
                tasks: ['img'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['source/*.html', 'source/_html_inc/*.html'],
                tasks: ['includereplace:html'],
                options: {
                    spawn: false
                }
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'build/css/*.css',
                        'build/js/*.js',
                        'build/img/*.{png,jpg,gif,svg}',
                        'build/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "build/"
                    },
                    // startPath: "/index.html",
                    ghostMode: {
                        clicks: true,
                        forms: true,
                        scroll: false
                    }
                }
            }
        },

        webpack: {
            main: {
                // webpack options
                context: __dirname + '/source', // будет по умолчанию искать все в source
                entry: { //точки входа
                    script: "./js/script"
                },
                output: {
                    path: __dirname + '/build/assets',
                    publicPath: '/assets/',
                    filename: "[name].js",
                    library: "[name]" // возьмутся имена сриптов из точек входа и подставятся вместо name
                },
                watch: NODE_ENV == 'development',

                watchOptions: {
                    aggregateTimeout: 100
                },

                devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

                plugins: [
                    new webpack.NoErrorsPlugin(), //при ошибке не создает ломаные файлы
                    new webpack.DefinePlugin({
                        NODE_ENV: JSON.stringify(NODE_ENV), //
                        LANG: JSON.stringify('ru')
                    }),
                    new webpack.optimize.CommonsChunkPlugin({ //создаст общий файл для подключений на странице
                        name: 'common'
                    })
                ],

                resolve: {
                    moduleDirectories: ['node_modules'],
                    extensions: ['', '.js']
                },

                resolveLoader: {
                    moduleDirectories: ['node_modules'],
                    moduleTemplates: ['*-loader', '*'],
                    extensions: ['', '.js']
                },

                module: {
                    loaders: [
                        {
                            test: /\.jsx?$/,
                            exclude: /(node_modules|bower_components)/,
                            loader: 'babel?presets[]=es2015'
                        },
                        {
                            test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                            loader: 'file?name=[path][name].[ext]'
                        }

                    ]
                }
            }
        }



    });

    grunt.registerTask('default', [
        'style',
        'img',
        'includereplace:html',
        'webpack',
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'style',
        'img',
        'includereplace:html'
    ]);

    grunt.registerTask('style', [
        'copy:css_add',             // копируем добавочные файлы
        'less',                   // компилируем стили в build/css/style.css
        'autoprefixer',                // обрабатываем postcss-ом все файлы .css в build/css/
        'cmq',                    // объединяем медиа-правила в build/css/style.css
        'cssmin'                 // минифицируем
    ]);

    grunt.registerTask('img', [
        'svgstore',               // собираем SVG-спрайт
        'copy:img',               // копируем всё из src/img/ в build/img/
        'copy:favicon',           // копируем favicon
        'imagemin'               // минифицируем картинки в build/img/
    ]);
};

