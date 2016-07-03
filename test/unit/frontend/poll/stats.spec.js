const expect = require('expect.js');
import {calculateStats, calculatePollOptions} from '../../../../public/js/lib/stats/service';

const players = [
	{
		"name" : "Michał Biskup",
		"picture" : "img/tychy/players/biskup_michal.png",
		"option" : "biskup_michal",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Dawid Błanik",
		"picture" : "img/tychy/players/blanik_dawid.png",
		"option" : "blanik_dawid",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Łukasz Bocian",
		"picture" : "img/tychy/players/bocian_lukasz.png",
		"option" : "bocian_lukasz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Tomasz Boczek",
		"picture" : "img/tychy/players/boczek_tomasz.png",
		"option" : "boczek_tomasz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Mateusz Bukowiec",
		"picture" : "img/tychy/players/bukowiec_mateusz.png",
		"option" : "bukowiec_mateusz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Daniel Duda",
		"picture" : "img/tychy/players/duda_daniel.png",
		"option" : "duda_daniel",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Paweł Florek",
		"picture" : "img/tychy/players/florek_pawel.png",
		"option" : "florek_pawel",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Seweryn Gancarczyk",
		"picture" : "img/tychy/players/gancarczyk_seweryn.png",
		"option" : "gancarczyk_seweryn",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Michał Glanowski",
		"picture" : "img/tychy/players/glanowski_michal.png",
		"option" : "glanowski_michal",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Tomasz Górkiewicz",
		"picture" : "img/tychy/players/gorkiewicz_tomasz.png",
		"option" : "gorkiewicz_tomasz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Łukasz Grzeszczyk",
		"picture" : "img/tychy/players/grzeszczyk_lukasz.png",
		"option" : "grzeszczyk_lukasz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Marcin Grzybek",
		"picture" : "img/tychy/players/grzybek_marcin.png",
		"option" : "grzybek_marcin",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Mateusz Grzybek",
		"picture" : "img/tychy/players/grzybek_mateusz.png",
		"option" : "grzybek_mateusz",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Stepan Hriśkyj",
		"picture" : "img/tychy/players/hriskyj_stepan.png",
		"option" : "hriskyj_stepan",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Marek Igaz",
		"picture" : "img/tychy/players/igaz_marek.png",
		"option" : "igaz_marek",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Jakub Kiwior",
		"picture" : "img/tychy/players/kiwior_jabub.png",
		"option" : "kiwior_jabub",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Piotr Kokoszka",
		"picture" : "img/tychy/players/kokoszka_piotr.png",
		"option" : "kokoszka_piotr",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Łukasz Krzczuk",
		"picture" : "img/tychy/players/krzczuk_lukasz.png",
		"option" : "krzczuk_lukasz",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Łukasz Krzycki",
		"picture" : "img/tychy/players/krzycki_lukasz.png",
		"option" : "krzycki_lukasz",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Łęszczak Michał",
		"picture" : "img/tychy/players/leszczak_michal.png",
		"option" : "leszczak_michal",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Maciej Mańka",
		"picture" : "img/tychy/players/manka_maciej.png",
		"option" : "manka_maciej",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Mateusz Mączyński",
		"picture" : "img/tychy/players/maczynski_mateusz.png",
		"option" : "maczynski_mateusz",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Damian Nieśmiałowski",
		"picture" : "img/tychy/players/niesmialowski_damian.png",
		"option" : "nieśmiałowski_damian",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Artur Pląsowski",
		"picture" : "img/tychy/players/plasowski_artur.png",
		"option" : "plasowski_artur",
		"enabled" : true,
		"order" : 1
	},
	{
		"name" : "Marcin Radziewicz",
		"picture" : "img/tychy/players/radziewicz_marcin.png",
		"option" : "radziewicz_marcin",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Bartosz Rutkowski",
		"picture" : "img/tychy/players/rutkowski_bartosz.png",
		"option" : "rutkowski_bartosz",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Wojciech Szumilas",
		"picture" : "img/tychy/players/szumilas_wojciech.png",
		"option" : "szumilas_wojciech",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Daniel Tanżyna",
		"picture" : "img/tychy/players/tanzyna_daniel.png",
		"option" : "tanzyna_daniel",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Adam Varadi",
		"picture" : "img/tychy/players/varadi_adam.png",
		"option" : "varadi_adam",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Marcin Wodecki",
		"picture" : "img/tychy/players/wodecki_marcin.png",
		"option" : "wodecki_marcin",
		"enabled" : false,
		"order" : 1
	},
	{
		"name" : "Mariusz Zganiacz",
		"picture" : "img/tychy/players/zganiacz_mariusz.png",
		"option" : "zganiacz_mariusz",
		"enabled" : false,
		"order" : 1
	}
];

describe('#calculate stats tests', function () {
	it('calculateStats should return not active records in stats', function () {
        var poll = {
            data: {
                votes: {
                    option1 : 3,
                    option2 : 7
                },
                options: [
                    { option: 'option1', enabled: false},
                    { option: 'option2', enabled: true}
                ]
            }
        };

        var result = calculateStats(poll);

        expect(result).to.eql({
           option2: { value: 7, percentage : 100, option: 'option2'}
        });
    });

	it('#calculateStats1', function () {
		var input = {
			"data": {
				"votes": {},
                options: []
			}
		};

		var result = calculateStats(input);
		expect(result).to.eql({});
	});

	it('#calculateStats2', function () {
		var input = {
			"data": {
				"votes": {
					"niepolomice": 1,
					"tychy": 9
				},
                options: [
                    { option: 'niepolomice', enabled: true},
                    { option: 'tychy', enabled: true}
                ]
			}
		};

		var result = calculateStats(input);
		expect(result).to.eql({
			niepolomice: {option: 'niepolomice', value: 1, percentage: 10},
			tychy: {option: 'tychy', value: 9, percentage: 90}
		});
	});

	it('#calculateStats3', function () {
		var input = {
			"data": {
				"votes": {
					"niepolomice": 5
				},
                options: [
                    { option: 'niepolomice', enabled: true},
                    { option: 'tychy', enabled: true}
                ]
			}
		};

		var result = calculateStats(input);
		expect(result).to.eql({
			niepolomice: {option: 'niepolomice', value: 5, percentage: 100}
		});
	});

	it('#calculateStats4', function () {
		var input = {
			"data": {
				"votes": {
					"test1": 3,
					"test2": 4,
					"test3": 1,
					"test4": 2
				},
                options: [
                    { option: 'test1', enabled: true},
                    { option: 'test3', enabled: true},
                    { option: 'test2', enabled: true},
                    { option: 'test4', enabled: true}
                ]
			}
		};

		var result = calculateStats(input);
		expect(result).to.eql({
			test1: {option: 'test1', value: 3, percentage: 30},
			test2: {option: 'test2', value: 4, percentage: 40},
			test3: {option: 'test3', value: 1, percentage: 10},
			test4: {option: 'test4', value: 2, percentage: 20}
		});
	});

    it.only('#calculateStats5', function () {
        var input = {
            "data": {
                "votes": {
                    "miasto": 523,
                    "buty": 25,
                    "lord": 3
                },
                options: [
                    { option: 'miasto', enabled: true},
                    { option: 'lord', enabled: true},
                    { option: 'buty', enabled: true}
                ]
            }
        };

        var result = calculateStats(input);
        expect(result).to.eql({
            miasto: {option: 'miasto', value: 523, percentage: 94},
            lord: {option: 'lord', value: 3, percentage: 0},
            buty: {option: 'buty', value: 25, percentage: 4}
        });
    });

	it('#calculatePollOptions1', function () {
		var input = {
			"data": {
				"options": [
					{
						"order": 1,
						"name": "Puszcza Niepołomice",
                        enabled: true,
						"option": "niepolomice",
						"picture": "img/tychy/puszcza-logo.png"
					},
					{
						"name": "GKS Tychy",
						"order": 0,
						"option": "tychy",
                        enabled: true,
						"picture": "img/tychy/tychy-logo.png"
					}
				],
				"votes": {
					"niepolomice": 6,
					"tychy": 9
				}
			}
		};
		var _this = { stats : calculateStats(input), options : input.data.options, optionsOriginal : Object.assign({}, input.data).options};

		calculatePollOptions.call(_this);

		expect(_this.option1).to.be(input.data.options[0]);
		expect(_this.option2).to.be(input.data.options[1]);
		expect(_this.value1).to.be(6);
		expect(_this.value2).to.be(9);
		expect(_this.percentage1).to.be(40);
		expect(_this.percentage2).to.be(60);
	});


	it('#calculatePollOptions2', function () {
		var input = {
			"data": {
				"options": players,
				"votes": {
					"plasowski_artur": 1,
					"blanik_dawid": 3,
					"grzybek_mateusz": 2,
					"gancarczyk_seweryn": 4
				}
			}
		};
		var _this = { stats : calculateStats(input), options : input.data.options, optionsOriginal : Object.assign({}, input.data).options};

		calculatePollOptions.call(_this);

		expect(_this.options.length).to.be(2);
		expect(_this.option1).to.be(input.data.options.filter(option => option.option === 'gancarczyk_seweryn').pop());
		expect(_this.option2).to.be(input.data.options.filter(option => option.option === 'blanik_dawid').pop());
		expect(_this.value1).to.be(4);
		expect(_this.value2).to.be(3);
		expect(_this.percentage1).to.be(40);
		expect(_this.percentage2).to.be(30);
	});
});