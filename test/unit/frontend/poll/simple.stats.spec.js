const expect = require('expect.js');
import {calculcateSimplePollOptions, calculcateDifference} from '../../../../public/js/lib/stats/service';
const OPTIONS = [
    {
        'order': 1,
        'name': '30 lat',
        'option': '30',
        firstName: 'FirstName',
        lastName: 'LastName',
        'picture': 'img/tychy/tychy-logo.png'

    },
    {
        'name': '45 lat',
        'order': 2,
        'option': '45',
        'picture': 'img/tychy/tychy-logo.png',
        firstName: 'FirstName',
        lastName: 'LastName'
    },
    {
        'name': '50 lat',
        'order': 3,
        'option': '50',
        'picture': 'img/tychy/tychy-logo.png',
        firstName: 'FirstName',
        lastName: 'LastName'
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
                percentage: 25,
                firstName: 'FirstName',
                lastName: 'LastName',
                'picture': 'img/tychy/tychy-logo.png'
            },
            {
                displayName: '45 lat',
                order: 2,
                percentageCss: '38%',
                percentage: 38,
                firstName: 'FirstName',
                lastName: 'LastName',
                'picture': 'img/tychy/tychy-logo.png'
            },
            {
                displayName: '50 lat',
                order: 3,
                percentageCss: '38%',
                percentage: 38,
                firstName: 'FirstName',
                'picture': 'img/tychy/tychy-logo.png',
                lastName: 'LastName'
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
                percentage: 25,
                firstName: 'FirstName',
                'picture': 'img/tychy/tychy-logo.png',
                lastName: 'LastName'
            },
            {
                displayName: '45 lat',
                order: 2,
                percentageCss: '0%',
                percentage: 0,
                firstName: 'FirstName',
                'picture': 'img/tychy/tychy-logo.png',
                lastName: 'LastName'
            },
            {
                displayName: '50 lat',
                order: 3,
                percentageCss: '38%',
                percentage: 38,
                firstName: 'FirstName',
                'picture': 'img/tychy/tychy-logo.png',
                lastName: 'LastName'
            }
        ]);
    });


    it('#calculcateDifference1', function () {
        var previous = [];
        var nextValues = [{
            "firstName": "Martin",
            "lastName": "Vaculik",
            "order": 1,
            "picture": "img/zuzel-torun/players/SKF_4665.png",
            "percentageCss": "53%",
            "percentage": 53
        }, {
            "firstName": "Greg",
            "lastName": "Hancock",
            "order": 2,
            "picture": "img/zuzel-torun/players/SKF_4652.png",
            "percentageCss": "19%",
            "percentage": 19
        }, {
            "firstName": "Paweł",
            "lastName": "Przedpełski",
            "order": 3,
            "picture": "img/zuzel-torun/players/SKF_4628.png",
            "percentageCss": "11%",
            "percentage": 11
        }, {
            "firstName": "aaaaa",
            "lastName": "Kokoszka0",
            "order": 1,
            "picture": "img/zuzel-torun/players/DSC05159.png",
            "percentageCss": "6%",
            "percentage": 6
        }];


        expect(calculcateDifference(previous, nextValues)).to.eql([0,1,2,3]);
    });

    it('#calculcateDifference1', function () {
        var previous = [{
            "firstName": "Martin",
            "lastName": "Vaculik",
            "order": 1,
            "picture": "img/zuzel-torun/players/SKF_4665.png",
            "percentageCss": "53%",
            "percentage": 2
        }, {
            "firstName": "Greg",
            "lastName": "Hancock",
            "order": 2,
            "picture": "img/zuzel-torun/players/SKF_4652.png",
            "percentageCss": "19%",
            "percentage": 19
        }, {
            "firstName": "Paweł",
            "lastName": "Przedpełski",
            "order": 3,
            "picture": "img/zuzel-torun/players/SKF_4628.png",
            "percentageCss": "11%",
            "percentage": 1
        }];


        var nextValues = [{
            "firstName": "Martin",
            "lastName": "Vaculik",
            "order": 1,
            "picture": "img/zuzel-torun/players/SKF_4665.png",
            "percentageCss": "53%",
            "percentage": 53
        }, {
            "firstName": "Greg",
            "lastName": "Hancock",
            "order": 2,
            "picture": "img/zuzel-torun/players/SKF_4652.png",
            "percentageCss": "19%",
            "percentage": 19
        }, {
            "firstName": "Paweł",
            "lastName": "Przedpełski",
            "order": 3,
            "picture": "img/zuzel-torun/players/SKF_4628.png",
            "percentageCss": "11%",
            "percentage": 11
        }, {
            "firstName": "aaaaa",
            "lastName": "Kokoszka0",
            "order": 1,
            "picture": "img/zuzel-torun/players/DSC05159.png",
            "percentageCss": "6%",
            "percentage": 6
        }];

        expect(calculcateDifference(previous, nextValues)).to.eql([0,2,3]);
    });

    it('#calculcateDifference1', function () {
        var previous = [{
            "firstName": "Martin",
            "lastName": "Vaculik",
            "order": 73,
            "picture": "img/zuzel-torun/players/SKF_4665.png",
            "percentageCss": "53%",
            "percentage": 73
        }, {
            "firstName": "Greg",
            "lastName": "Hancock",
            "order": 2,
            "picture": "img/zuzel-torun/players/SKF_4652.png",
            "percentageCss": "19%",
            "percentage": 19
        }, {
            "firstName": "Paweł",
            "lastName": "Przedpełski",
            "order": 3,
            "picture": "img/zuzel-torun/players/SKF_4628.png",
            "percentageCss": "11%",
            "percentage": 44
        }];


        var nextValues = [{
            "firstName": "Martin",
            "lastName": "Vaculik",
            "order": 1,
            "picture": "img/zuzel-torun/players/SKF_4665.png",
            "percentageCss": "53%",
            "percentage": 53
        }, {
            "firstName": "Greg",
            "lastName": "Hancock",
            "order": 2,
            "picture": "img/zuzel-torun/players/SKF_4652.png",
            "percentageCss": "19%",
            "percentage": 19
        }, {
            "firstName": "Paweł",
            "lastName": "Przedpełski",
            "order": 3,
            "picture": "img/zuzel-torun/players/SKF_4628.png",
            "percentageCss": "11%",
            "percentage": 11
        }, {
            "firstName": "aaaaa",
            "lastName": "Kokoszka0",
            "order": 1,
            "picture": "img/zuzel-torun/players/DSC05159.png",
            "percentageCss": "6%",
            "percentage": 6
        }];

        expect(calculcateDifference(previous, nextValues)).to.eql([3]);
    });
});