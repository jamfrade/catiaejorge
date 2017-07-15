// WebOLB Gruntfile
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    watch: {
      files: ["src/less/*.less", "src/less/themes/*.less", "src/js/*.js", "src/js/app/*.js", "src/index.html"],
      tasks: ["default"]
    },

    clean: ['build', 'dist'],

    concat: {
      dist: {
        src: ['src/js/app/user.js', 'src/js/app/doc.js', 'src/js/app/lib.js', 'src/js/app/olb.js', 'src/js/app/app.js'],
        dest: 'build/js/app.js',
      },
    },

    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src', src: ['img/**'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['fonts/**'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['bootstrap/**'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['js/*'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['css/*'], dest: 'build' },
          { expand: true, cwd: 'src', src: ['index.html'], dest: 'build' }
        ],
      },
      build_test_data: {
        files: [
          { expand: true, cwd: '.', src: ['test-data/**'], dest: 'build' },
        ],
      },
      dist: {
        files: [
		      { expand: true, cwd: 'src', src: ['img/**'], dest: 'dist' },
          { expand: true, cwd: 'src', src: ['fonts/**'], dest: 'dist' },
          { expand: true, cwd: 'src', src: ['bootstrap/**'], dest: 'dist' },
          { expand: true, cwd: 'src', src: ['js/*'], dest: 'dist' },
          { expand: true, cwd: 'src', src: ['css/*'], dest: 'dist' },
          { expand: true, cwd: 'src', src: ['index.html'], dest: 'dist' }
        ],
      },
      dist_test_data: {
        files: [
          { expand: true, cwd: '.', src: ['test-data/**'], dest: 'dist' },
        ],
      }
    },

    less: {
      development: {
        options: { compress: false },
        files: { "build/css/app.css": "src/less/app.less" }
      },
      production: {
        options: { compress: true },
        files: {
          "build/css/app.min.css": "src/less/app.less",
          "dist/css/app.min.css": "src/less/app.less",
        }
      }
    },

    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
      },
      my_target: {
        files: {
          'build/js/app.min.js': ['build/js/app.js'],
		      'dist/js/app.min.js': ['build/js/app.js']
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            { match: /<link rel="stylesheet" href="css\/app.css">/gi, replacement: '<link rel="stylesheet" href="css/app.min.css">' },
            { match: /<script src="js\/app.js"><\/script>/gi, replacement: '<script src="js/app.min.js"></script>' }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['src/index.html'], dest: 'dist'}
        ]
      }
    },

    hashres: {
      options: {
        fileNameFormat: '${name}.${ext}?${hash}',
        renameFiles: false
      },
      prod: {
        src: [
          'dist/js/app.min.js',
          'dist/css/app.min.css',
          'dist/img/icons/mstile-144x144.png',
          'dist/img/icons/browserconfig.xml',
          'dist/img/icons/apple-touch-icon.png',
          'dist/img/icons/favicon-32x32.png',
          'dist/img/icons/favicon-16x16.png',
          'dist/img/icons/manifest.json',
          'dist/img/icons/favicon.ico'
          ],
        dest: 'dist/index.html',
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },

    // Validate JS code
    jshint: {
      options: {
        jshintrc: 'src/js/.jshintrc'
      },
      core: {
        src: 'src/js/app.js'
      }
    },

    // Validate CSS files
    csslint: {
      options: {
        csslintrc: 'src/less/.csslintrc'
      },
      dist: [
        'build/css/app.css',
      ]
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-image');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('lint', ['jshint', 'csslint']);

  grunt.registerTask('copy_test_data', ['copy:build_test_data', 'copy:dist_test_data']);

  grunt.registerTask('default', ["concat", "copy:build", "copy:dist", "less", "uglify", "replace", "hashres", "htmlmin"]);
};