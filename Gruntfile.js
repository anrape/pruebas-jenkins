module.exports = function(grunt) {

	//loads all grunt tasks specified at the package.json file, also loads time-grunt which needs special require
	//time-grunt task shows how much time has every task used
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var versionData=grunt.file.readJSON('version.json');
	var version = versionData.release;
	var build = versionData.build;
	var tags = versionData.submodulesApp;
	var tagsRa = versionData.submodulesRa;

	grunt.initConfig({
		copy: {
			drupal: {
				files: [{
					expand: true,
					src: ['**/*', '!**/.git/**', '!**/.git*'],
					cwd: 'app/drupal',
					dot: true,
					dest: 'mobile'
				}, {
					expand: true,
					src: 'clear.php',
					cwd: 'app',
					dest: 'mobile/'
				}]
			},
			refresh: {
				files: [{
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-modules',
					dest: 'mobile/sites/all/modules/optima'
				}, {
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-themes',
					dest: 'mobile/sites/all/themes'
				}]
			},
			config: {
				files: [{
					expand: true,
					src: ['**/*'],
					cwd: 'app/default',
					dest: 'mobile/sites/default'
				}]
			},
			build: {
				files: [{
					expand: true,
					src: ['**/*', '!**/.git/**', '!**/.git*'],
					cwd: 'app/drupal',
					dot: true,
					dest: '.tmp'
				}, {
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-modules',
					dest: '.tmp/sites/all/modules/optima'
				}, {
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-themes',
					dest: '.tmp/sites/all/themes'
				}, {
					expand: true,
					src: 'clear.php',
					cwd: 'app',
					dest: 'mobile/'
				}, {
					expand: true,
					src: 'build_locale.php',
					cwd: 'app',
					dest: 'mobile/'
				}]
			},
			external:{
				files: [{
					expand: true,
					cwd: "app/ra-parent/racs-server/target",
					src: '*.war',
					dest: 'builds/<%= theme %>/' + version + "_" + build
				},{
					expand: true,
					cwd: "app/ra-parent/rats-server/target",
					src: '*.war',
					dest: 'builds/<%= theme %>/' + version + "_" + build
				},{
					expand: true,
					cwd: "app/rats-email-templates/target",
					src: '*.jar',
					dest: 'builds/<%= theme %>/' + version + "_" + build
				}]
			},
			test:{
				files: [{
					expand: true,
					dot: true,
					cwd: '.tmp',
					src: '**/*',
					dest: 'mobile'
				}]
			}
		},
		clean: {
			full: ['mobile'],
			refresh: ['mobile/sites/all/modules/optima', 'mobile/sites/all/themes'],
			config: ['mobile/sites/default/files', 'mobile/sites/default/settings.php'],
			temp: ['.tmp']
		},
		sync: {
			watch:{
				files: [{
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-modules',
					dest: 'mobile/sites/all/modules/optima'
				}, {
					expand: true,
					src: ['**/*', '!**/.git/**'],
					cwd: 'app/custom-themes',
					dest: 'mobile/sites/all/themes'
				},{
					expand: true,
					src: ['**/*'],
					cwd: 'app/default',
					dest: 'mobile/sites/default'
				},{
					src: ['clear.php'],
					cwd: 'app',
					dest: 'mobile'
				}]
			}
		},
		watch: {
			test: {
				files: ['app/custom-themes/**/*{.js,.css,.php,.info,.json,.info,.module,.inc}', 'app/custom-modules/**/*{.js,.css,.php,.info,.json,.info,.module,.inc}', 'app/default/**/*{.js,.css,.php,.info,.json,.info,.module,.inc}', 'app/clear.php'],
				tasks: ['sync:watch']
			}
		},
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({
						browsers: ['safari >= 8', 'Android >= 4', 'ie >= 10', 'last 2 versions']
					}), // add vendor prefixes
					require('cssnano')({ reduceIdents: false, zindex: false }) // minify the result
				]
			},
			build: {
				src: ['.tmp/sites/all/modules/optima/**/*.css', '.tmp/sites/all/themes/**/*.css']
			}
		},
		csslint: {
			build: {
				options: {
					'import': false,
					'important': false,
					'adjoining-classes': false,
					'floats': false,
					'fallback-colors': false,
					'box-sizing': false,
					'known-properties': false,
					'compatible-vendor-prefixes': false,
					'vendor-prefix': false,
					'font-sizes': false,
					'box-model': false,
					'gradients': false,
					'text-indent': false,
					'overqualified-elements': false,
					'qualified-headings': false,
					'ids': false,
					'unique-headings': false,
					'bulletproof-font-face': false,
					'display-property-grouping': false,
					'duplicate-background-images': false,
					'universal-selector': false,
					'regex-selectors': false,
					'unqualified-attributes': false,
					'zero-units': false,
					'empty-rules': false,
					'duplicate-properties': false,
					'font-faces': false
				},
				src: ['.tmp/sites/all/modules/optima/**/*.css', '.tmp/sites/all/themes/**/*.css', '!.tmp/sites/all/themes/**/core.css']
			}
		},
		uglify: {
			build: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					compress: {
						sequences: true,
						dead_code: true,
						conditionals: true,
						booleans: true,
						unused: true,
						if_return: true,
						join_vars: true,
						drop_console: true
					}
				},
				files: [{
					expand: true,
					src: ['**/*.js'],
					cwd: '.tmp/sites/all/modules/optima',
					dest: '.tmp/sites/all/modules/optima'
				}, {
					expand: true,
					src: ['**/*.js', '!**/*.min.js'],
					cwd: '.tmp/sites/all/themes',
					dest: '.tmp/sites/all/themes'
				}, {
					expand: true,
					src: ['jquery.mobile-1.3.2.min.js'],
					cwd: '.tmp/sites/all/themes/legolas/js/lib',
					dest: '.tmp/sites/all/themes/legolas/js/lib'
				}
				]
			}
		},
		jshint: {
			options: {
				loopfunc: true,
				evil: true,
				sub: true,
				funcscope: true,
				shadow: true,
				eqnull: true,
				laxbreak: true,
				"-W117": true,
				"-W020": true,
				browser: true,
				devel: true,
				multistr: true,
				proto: true
			},
			files: ['.tmp/sites/all/modules/optima/**/*.js', '.tmp/sites/all/themes/**/*.js', '!.tmp/**/*.min.js']
		},
		imagemin: {
			build: {
				options: {
					optimizationLevel: 5
				},
				files: [{
					expand: true,
					src: ['**/*.{png,jpg,gif}'],
					cwd: '.tmp/sites',
					dest: '.tmp/sites'
				}]
			}
		},
		compress: {
			build: {
				options: {
					archive: 'builds/<%= theme %>/' + version + "_" + build + '/all_' + version + "_" + build + '.tgz'
				},
				files: [{
					expand: true,
					cwd: '.tmp/sites/all',
					src: ['**', '!**/README.txt'],
					dest: 'all/'
				}]
			}
		},
		// Compiles Sass to CSS and generates necessary files if requested
		shell: {
			options: {
				execOptions: {
					maxBuffer: Infinity
				}
			}
		}
	});
	grunt.registerTask('welcome', function(){
		grunt.log.writeln(
"              _=,_\r\n"+
"           o_/6 /#\\\r\n"+
"           \\__ |##/\r\n"+
"            ='|--\\\r\n"+
"              /   #'-.\r\n"+
"              \\#|_   _'-. /\r\n"+
'               |/ \\_( # |"\r\n'+
"              C/ ,--___/\r\n");
	});

	//this task cleans the mobile folder and installs the development version of drupal, modules, themes and default folder with the configuration
	grunt.registerTask('toby', ['clean:full', 'copy:drupal', 'copy:refresh', 'copy:config', 'build_timestamp:local', 'welcome']);
	//this task listen for changes to the app/custom-modules and app/custom-themes folders to upload the changes to mobile folder
	grunt.registerTask('auto-refresh', ['clean:full', 'copy:drupal', 'copy:refresh', 'copy:config', 'build_timestamp:local', 'watch:test']);
	//this task cleans the custom-modules and custom-themes folders of mobile and copies inside the development version
	grunt.registerTask('refresh', ['clean:refresh', 'copy:refresh']);
	//this task cleans the default folder of mobile and copies inside the development version
	grunt.registerTask('refresh-config', ['clean:config', 'copy:config']);
	//this task builds the prod version of the site and copies it into the mobile folder
	grunt.registerTask('test-site', ['clean:temp', 'copy:build', 'csslint', 'postcss', 'jshint', 'uglify', 'imagemin', 'clean:full', 'build_timestamp:build', 'copy:test', 'copy:config', 'clean:temp']);
	//this task builds the site part of this version inside the builds folder
	grunt.registerTask('build-site', ['checkout-tags', 'update_json', 'clean:temp', 'copy:build', 'clean-themes', 'csslint', 'postcss', 'jshint', 'uglify', 'imagemin', 'build_timestamp:build', 'compress', 'clean:temp']);
	//this task builds the backend part of this version inside the builds folder
	grunt.registerTask('build-ra', ['checkout-tags:ra', 'update_json', 'copy:external']);
	//this task builds the release folder of this version inside the builds folder
	grunt.registerTask('build', ['build-site', 'build-ra']);

	//UTILS
	grunt.registerTask('clean-themes', function () {
		var theme = grunt.option('theme');
		if(theme){
			grunt.file.expand({ filter: 'isDirectory' }, '.tmp/sites/all/themes/*').forEach(function (dir) {
				var actualTheme = dir.split("/")[dir.split("/").length-1];
				if(theme != actualTheme && actualTheme != "maintheme"){
					grunt.file.delete(dir);
				}
			});
			grunt.config("theme", theme);
		}else{
			grunt.task.run(['clean:temp']);
			grunt.fail.fatal("No theme specified, please run this task with --theme=[your_theme]");
		}
	});

	grunt.registerTask('checkout-tags', function (option) {
		var theme = grunt.option('theme');
		var current = grunt.option('current');
		var _tags = tags;
		if(typeof option !== 'undefined' && option !== '' && option === 'ra'){
			_tags = tagsRa;
		}
		if(theme){
			if(!current){
				for (var i = 0; i < _tags.length; i++) {
					if(_tags[i].name === 'ra-parent' || _tags[i].name === 'rats-email-templates'){
						grunt.config('shell.' + _tags[i].name, {
							command: ['git fetch', 'cd app/' + _tags[i].name, 'git checkout tags/' + _tags[i].tag, 'mvn clean install'].join(' && ')
						});
					}
					else{
						grunt.config('shell.' + _tags[i].name, {
							command: ['git fetch', 'cd app/' + _tags[i].name, 'git checkout tags/' + _tags[i].tag].join(' && ')
						});
					}
					grunt.task.run(['shell:'+ _tags[i].name]);
				}
			}else{
				for (var i = 0; i < _tags.length; i++) {
					if(_tags[i].name === 'ra-parent' || _tags[i].name === 'rats-email-templates'){
						grunt.config('shell.' + _tags[i].name, {
							command: ['cd app/' + _tags[i].name, 'mvn clean install'].join(' && ')
						});
					}
				}
			}
			grunt.config("theme", theme);
		}else{
			grunt.task.run(['clean:temp']);
			grunt.fail.fatal("No theme specified, please run this task with --theme=[your_theme]");
		}
	});

	grunt.registerTask('update_json', function(){
		var package = grunt.file.readJSON('package.json');
		package.version = version;
		grunt.file.write("package.json", JSON.stringify(package));
	});

	grunt.registerTask('build_timestamp', function(type){
		var version = grunt.file.readJSON('version.json');
		version.date = new Date().getTime();
		if(type == "local"){
			grunt.file.write("mobile/sites/all/version.json", JSON.stringify(version));
		}else{
			grunt.file.write(".tmp/sites/all/version.json", JSON.stringify(version));
		}
	});
};
