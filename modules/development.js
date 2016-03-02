module.exports = function(async, fs, urlLib, request, cheerio, config, urlSite, code, rl) {
	async.waterfall([
	  function makeNewUrl(callback) { // собираем новый URL
	  	rl.close();
	  	var urlParams = urlLib.parse(urlSite);
			urlParams.pathname += code + '/';

			callback(null, urlLib.format(urlParams));
	  },
	  function getDataOnSite(url, callback) { // получаем данные с сайта
	  	request(url, function (err, response, html) {
			  if (!err && response.statusCode === 200) {
			    var $ = cheerio.load(html);
			    
			    var townName = $('.fcontent h1.wtitle').text();

			    if (townName) {
			    	callback(null, townName);
			    } else {
			    	console.log('Города с указанным вами кодом: ' + code + ' не существует!');
			    	console.log('Введите корректный код');
			   		callback('error: ' + err);
						return;
					}
				}
			});
	  }
	], function writeTownCodeInFile(err) { // читаем данные из файла конфигурации
		if (err) {
			console.error('error: ' + err);
			return;
		}
    fs.writeFile(config, code, function (err) {
      if (err) {
				console.error('error data file: ' + err);
				return;
			}
      console.log('Код города успешшно сохранен в файле config.js');
      console.log('Перейдите в режим \'prodaction\' для получения прогноза погоды!');
    });
	});
}