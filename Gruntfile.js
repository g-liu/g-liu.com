/*global module:false*/
/*global require*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dist: {
        src: 'site.js'
      }
    },
    validation: {
      dist: {
        options: {
          generateReport: false,
          reportpath: false,
          relaxerror: [
            'The Content-Type was “text/html”. Using the HTML parser.',
            'Using the schema for HTML with SVG 1.1, MathML 3.0, RDFa 1.1, and ITS 2.0 support.'
          ]
        },
        files: {
          src: ['index.html']
        }
      }
    },
    sass: {
      dist: {
        files: {
          'style.css': 'style.scss'
        },
        options: {
          sourcemap: 'none'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('pixrem'),
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      dist: {
        src: 'style.css'
      }
    },
    jade: {
      dist: {
        files: {
          'index.html': ['index.jade']
        }
      }
    },
    clean: {
      dist: ['vendor/**']
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'bower_components',
            src: ['./*/dist/**', './normalize-css/**'], 
            dest: './vendor'
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          'site.min.js': ['site.js']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'style.min.css': ['style.css']
        }
      }
    },
    watch: {
      options: {
        livereload: true,
        livereloadOnError: false
      },
      gruntfile: {
        options: {
          livereload: false
        },
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      html: {
        files: ['index.jade', 'includes/*.jade'],
        tasks: ['jade', 'validation:dist']
      },
      js: {
        files: ['site.js'],
        tasks: ['jshint:dist', 'uglify']
      },
      css: {
        files: ['style.scss'],
        tasks: ['sass:dist', 'postcss:dist', 'cssmin']
      }
    },
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          base: './',
          keepalive: true,
          livereload: true
        }
      }
    },
    concurrent: {
      run: {
        tasks: ['connect', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'copy:dist', 'sass', 'postcss', 'uglify', 'cssmin', 'jade', 'validation']);

  // Serves up the website
  grunt.registerTask('serve', ['default', 'concurrent:run']);

};
