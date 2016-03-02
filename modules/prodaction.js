module.exports = function(async, fs, urlLib, request, cheerio, config, urlSite) {
	async.waterfall([
    function readTownCodeInFile(callback) { // читаем данные из файла конфигурации
      fs.readFile(config, function (err, data) {
        if (err) {
					callback('error: ' + err);
					return;
				}
        callback(null, data.toString());
      });
	  },
	  function makeNewUrl(townCode, callback) { // собираем новый URL
	  	var urlParams = urlLib.parse(urlSite);
			urlParams.pathname += townCode + '/';

			callback(null, urlLib.format(urlParams));
	  },
	  function getDataOnSite(url, callback) { // получаем данные с сайта
	  	request(url, function (err, response, html) {
			  if (!err && response.statusCode === 200) {
			    var $ = cheerio.load(html);
			    
			    var townName = $('.fcontent h1.wtitle').text();
					var weater = '';
			    
			    $('.fcontent .wsection table').first().find('tr.wrow').each(function(i) {
			    	if ( i < 4) {
				    	weater += ( $(this).find('th').text().trim()) 
				    		? $(this).find('th').text().trim() 
				    		: '';
				    	weater += ' ';
							weater += ( $(this).find('.temp .value.c').text().trim() ) 
								? $(this).find('.temp .value.c').text().trim() 
								: '';
				    	weater += '  ';
			    	}
					});

			    callback(null, townName, weater);
			  } else {
			   	callback('error: ' + err);
					return;
				}
			});
	  }
	], function dataOut(err, townName, weater) { // вывод данных о погоде
		console.log('Сегодня ' + townName + ': ' + weater);
	});
}