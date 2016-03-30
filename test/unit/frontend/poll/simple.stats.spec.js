const expect = require('expect.js');
import {calculcateSimplePollOptions} from '../../../../public/js/lib/stats/service';
const OPTIONS = [
    {
        'order': 1,
        'name': '30 lat',
        'option': '30',
        'picture': 'img/tychy/tychy-logo.png'
    },
    {
        'name': '45 lat',
        'order': 2,
        'option': '45',
        'picture': 'img/tychy/tychy-logo.png'
    },
    {
        'name': '50 lat',
        'order': 3,
        'option': '50',
        'picture': 'img/tychy/tychy-logo.png'
    }
];

describe('#simple poll logic stats tests', function () {
    it('#calculateStats1', function () {
        var stats = {
            '30': {'option': '30', 'value': 2, 'percentage': 25},
            '45': {'option': '45', 'value': 3, 'percentage': 38},
            '50': {'option': '50', 'value': 3, 'percentage': 38}
        };

        var result = calculcateSimplePollOptions(OPTIONS, stats);
        expect(result).to.eql([
            {
                displayName: '30 lat',
                order: 1,
                percentageCss: '25%',
                percentage: 25
            },
            {
                displayName: '45 lat',
                order: 2,
                percentageCss: '38%',
                percentage: 38
            },
            {
                displayName: '50 lat',
                order: 3,
                percentageCss: '38%',
                percentage: 38
            }
        ]);
    });

    it('#calculateStats2', function () {
        var stats = {
            '30': {'option': '30', 'value': 2, 'percentage': 25},
            '50': {'option': '50', 'value': 3, 'percentage': 38}
        };

        var result = calculcateSimplePollOptions(OPTIONS, stats);
        expect(result).to.eql([
            {
                displayName: '30 lat',
                order: 1,
                percentageCss: '25%',
                percentage: 25
            },
            {
                displayName: '45 lat',
                order: 2,
                percentageCss: '0%',
                percentage: 0
            },
            {
                displayName: '50 lat',
                order: 3,
                percentageCss: '38%',
                percentage: 38
            }
        ]);
    });
});