/**
 * Grunt configuration
 */
var config = {

	// A banner for distributed files (name, version, license, date)
	banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - MIT License - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %> */',

	destDir: 'dist/',

	// All files that should be checked with JSHint
	jsHintFiles: [
		'Gruntfile.js',
		'js/**/*.js'
	],

	// JavaScript files
	js: {
		files: [
			'js/**/*.js'
		],
		config: 'js/config.js',
		dest: 'dist/<%= pkg.version %>/main.min.js'
	},

	// Sass files
	sass: {
		files: [
			'scss/**/*.scss'
		],
		src: 'scss/main.scss',
		devDest: 'css/main.css',
		dest: 'dist/<%= pkg.version %>/main.min.css'
	},

	// Modernizr files
	modernizr: {
		src: 'components/modernizr/modernizr.js',
		dest: 'dist/<%= pkg.version %>/modernizr.min.js'
	},

	// Images
	img: {
		src: 'img/',
		dest: 'dist/img/'
	}
};

/*
 * Call Grunt configuration
 */
module.exports = function (grunt) {

	'use strict';

	/*
	 * Helper
	 */
	var helper = {};

	helper.sassDev = {};
	helper.sassDev[config.sass.devDest] = config.sass.src;
	helper.sassProd = {};
	helper.sassProd[config.sass.dest] = config.sass.src;

	// Project configuration.
	grunt.initConfig({
		pkg: require('./package'),
		meta: {
			banner: config.banner
		},

		jshint: {
			all: config.jsHintFiles,
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Build modernizr
		modernizr: {
			devFile: config.modernizr.src,
			outputFile: config.modernizr.dest,

			extra: {
				shiv: true,
				mq: true
			},

			// Minify
			uglify: true,

			// Files
			files: config.js.files.concat(config.sass.files)
		},

		sass: {
			dev: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: helper.sassDev
			},
			deploy: {
				options: {
					style: 'compressed',
					banner: config.banner
				},
				files: helper.sassProd

			}
		},

		copy: {
			deploy: {
				files: [{
					src: config.js.files,
					dest: config.destDir
				}]
			}
		},

		// Lossless image optimization
		imagemin: {
			images: {
				options: {
					optimizationLevel: 5
				},
				files: [{
					expand: true,
					cwd: config.img.src,
					src: ['**/*.{png,jpg,gif}'],
					dest: config.img.dest
				}]
			}
		},

		// Server config
		connect: {

			server: {
				options: {
					port: 9001,
					keepalive: true
				}
			}
		},

		watch: {
			scss: {
				files: config.sass.files,
				tasks: 'sass:dev'
			},

			js: {
				files: config.jsHintFiles,
				tasks: ['jshint']
			}
		},

		// Setup concurrent tasks
		concurrent: {
			deploy1: ['jshint', 'modernizr', 'sass:deploy', 'imagemin', 'copy'],
			dev1: ['jshint', 'sass:dev', 'copy'],
		}
	});

	// Load all npm tasks through node-matchdep (fetches all tasks from package.json)
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// A task for development
	grunt.registerTask('dev', ['concurrent:dev1']);

	// A task for deployment
	grunt.registerTask('deploy', ['concurrent:deploy1']);

	// Default task
	grunt.registerTask('default', ['dev']);
};
