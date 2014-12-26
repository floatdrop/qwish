/* global describe, it */

'use strict';

var qwish = require('../src');
require('should');

describe('basic mode', function () {
    it('should remove whitespaces', function () {
        var input = '  \n  body  {  color  :  red ; background  :  blue  ; \r\n  }  ',
            expected = 'body{color:red;background:blue}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should convert long hex to short hex', function () {
        var input = 'p { color: #ffcc33; }',
            expected = 'p{color:#fc3}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should keep IE long hex as long hex', function () {
        var input = 'body { filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr="#FFF2F2F2", endColorstr="#FFFFFFFF"); }',
            expected = 'body{filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr="#FFF2F2F2",endColorstr="#FFFFFFFF")}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should keep IE 6-digit hex as 6-digit hex', function () {
        var input = 'body { filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr="#F2F2F2", endColorstr="#FFFFFF"); }',
            expected = 'body{filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr="#F2F2F2",endColorstr="#FFFFFF")}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should collaps longhand values to shorthand values', function () {
        var input = 'p { margin: 0px 1px 0px 1px }',
            expected = 'p{margin:0 1px}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should maintain certain longhand values', function () {
        var input = 'p { margin: 11px 1px 1px 1px }',
            expected = 'p{margin:11px 1px 1px 1px}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should maintain certain double-specified longhand values', function () {
        var input = 'p { margin: 12px 12px 2px 12px }',
            expected = 'p{margin:12px 12px 2px 12px}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should not break with @media queries', function () {
        var input = '@media screen and (max-device-width: 480px) {' +
                  '  .column {' +
                  '    float: none;' +
                  '  }' +
                  '}',
            expected = '@media screen and (max-device-width:480px){.column{float:none}}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });

    it('should not break unqualified psuedo-classes', function () {
        var input = 'body :first-child {}',
            expected = 'body :first-child{}',
            actual = qwish.minify(input);

        actual.should.be.eql(expected);
    });
});
