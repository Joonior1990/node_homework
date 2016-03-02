var fs = require('fs');
var async = require('async');
var urlLib = require('url');
var request = require('request');
var cheerio = require('cheerio');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var prodaction = require('./modules/prodaction');
var development = require('./modules/development');

var config = './config/config.js';
var urlSite = 'https://www.gismeteo.ru/city/daily/';
var text = 'Укажите код города, погоду которого вам хочется узнать (gismeteo.ru) [код города/n]';

var env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'prodaction';
if (env == 'development') {
	rl.question(text, function(answer) {
		if (answer == 'n') {
			console.log('До скорых встреч!')
			rl.close();
		} else {
			development(async, fs, urlLib, request, cheerio, config, urlSite, answer, rl);
		}
	}); 
}
if (env == 'prodaction' ) {
	console.log('Получение данных о погоде с сайта gismeteo.ru');
	console.log('Для смены города выберите режим разработчика (development)');
	prodaction(async, fs, urlLib, request, cheerio, config, urlSite);
	rl.close();
}
