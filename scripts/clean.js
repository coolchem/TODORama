

var del = require('del');

var paths = del.sync(['coverage',
    'src/**/*.css','!src/client/lib/**/*.css','src/**/*.js','!src/client/lib/**/*.js',
    'test/**/*.js',
    '**/*.map','!node_modules/**/*.map',
    'dist','temp']);


console.log('Deleted files/folders:\n', paths.join('\n'));


