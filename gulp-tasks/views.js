'use strict'

import { paths } from '../gulpfile.babel'
import gulp from 'gulp'
import pug from 'gulp-pug'
import gulpif from 'gulp-if'
import foldero from 'foldero'
import replace from 'gulp-replace'
import browsersync from 'browser-sync'
import yargs from 'yargs'
import fs from 'fs'

const argv = yargs.argv,
  production = !!argv.production

gulp.task('views', () => {
  let siteData = {}
  if (fs.existsSync(paths.data.src)) {
    siteData = foldero(paths.data.src, {
      recurse: true,
      whitelist: '(.*/)*.+.(json)$',
      loader: function loadAsString(file) {
        var json = {}
        try {
          json = JSON.parse(fs.readFileSync(file, 'utf8'))
        } catch (e) {
          console.log('Error Parsing JSON file: ' + file)
          console.log('==== Details Below ====')
          console.log(e)
        }
        return json
      }
    })
  }

  return gulp
    .src(paths.views.src)
    .pipe(
      pug({
        pretty: true,
        locals: {
          siteData
        }
      })
    )
    .pipe(gulpif(production, replace('.css', '.min.css')))
    .pipe(gulpif(production, replace('.js', '.min.js')))
    .pipe(gulp.dest(paths.views.dist))
    .pipe(browsersync.stream())
})
