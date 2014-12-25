/*!
* Qwish - a CSS Compressor
* https://github.com/floatdrop/qwish
* License MIT
*/

'use strict';

var fs = require('fs');

function qwish(css) {
    // allow /*! bla */ style comments to retain copyrights etc.
    var comments = css.match(/\/\*![\s\S]+?\*\//g);

    css = css.trim() // give it a solid trimming to start

        // comments
        .replace(/\/\*[\s\S]+?\*\//g, '')

        // line breaks and carriage returns
        .replace(/[\n\r]/g, '')

        // space between selectors, declarations, properties and values
        .replace(/\s*([:;,{}])\s*/g, '$1')

        // replace multiple spaces with single spaces
        .replace(/\s+/g, ' ')

        // space between last declaration and end of rule
        // also remove trailing semi-colons on last declaration
        .replace(/;}/g, '}')

        // this is important
        .replace(/\s+(!important)/g, '$1')

        // convert longhand hex to shorthand hex
        .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3')

        // Restore Microsoft longhand hex
        .replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4')

        // replace longhand values with shorthand '5px 5px 5px 5px' => '5px'
        .replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1')

        // replace double-specified longhand values with shorthand '5px 2px 5px 2px' => '5px 2px'
        .replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2')

        // replace 0px, 0em, 0%, etc... with 0
        .replace(/([\s|:])[0]+(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/g, '$10');

    // put back in copyrights
    if (comments) {
        comments = comments ? comments.join('\n') : '';
        css = comments + '\n' + css;
    }

    return css;
}

module.exports.exec = function(args) {
    var out, data,
        read = args[0],
        outArgumentIdx = args.indexOf('-o');

    if (outArgumentIdx !== -1) {
        out = args[outArgumentIdx + 1];
    } else {
        out = read.replace(/\.css$/, '.min.css');
    }

    if (args.indexOf('-v') !== -1) {
        console.log('Compressing ' + read + ' to ' + out + '...');
    }

    data = fs.readFileSync(read, 'utf8');
    fs.writeFileSync(out, qwish(data), 'utf8');
};

module.exports.minify = function(css) {
    return qwish(css);
};
