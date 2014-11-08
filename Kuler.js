https = require('https');
var apikey = null, cookie = null;
var apikeyRetrieved = false;
var cookieRetrieved = false;
var sessionExpire = 31 * 60;
var userId = '4416648';
var timeFrame = 'month';
var themeList = {};

var recent = '/api/v2/themes?filter=public&startIndex=0&maxNumber=36&sort=create_time&time={TIMEFRAME}',
        mostPopular = '/api/v2/themes?filter=public&startIndex=0&maxNumber=36&sort=like_count&time={TIMEFRAME}&metadata=all',
        mostUsed = '/api/v2/themes?filter=public&startIndex=0&maxNumber=36&sort=view_count&time={TIMEFRAME}',
        userTheme = '/api/v2/search?startIndex=0&maxNumber=36&q={"author_id":"{USERID}"}&metadata=all';


function mboxGenerateId() {
    return (new Date).getTime() + "-" + Math.floor(Math.random() * 999999)
}

//"check#true#1415467341|session#1415467292844-198647#1415469332"
//"check#true#1415467341|session#1415467292844-198647#expires"

/*https.get('https://color.adobe.com', function(res) {
 test(res);
 x = 1;
 
 }).on('error', function(e) {
 console.log('Cannot connect color.adobe.com');
 });
 */

apiRequest = https.get('https://color.adobe.com/resource/js/index.js', function(res) {
    res.setEncoding('utf8');
    var datastring = '';

    res.on('data', function(chunk) {
        datastring += chunk;
    });

    res.on('end', function() {
        if (datastring.length > 0) {
            try {
                apikey = /apikey:"[0-9a-fA-F]+"/.exec(datastring)[0].replace(/"/g, '').split(':')[1];
                console.log(apikey);
                getThemes(mostUsed);
                getThemes(mostPopular);
                getThemes(userTheme);
            } catch (e) {
                console.error('cannot retrive api key');
            }

        } else {
            console.error('Cannot retrive api key');
        }
    });
}).on('error', function(e) {
    console.error('Cannot get index script');
});
apiRequest.end();

function getThemes(category) {
    var url = category
            .replace('{USERID}',userId)
            .replace('{TIMEFRAME}', timeFrame);
    var options = {
        host: 'color.adobe.com',
        port: 443,
        path: url,
        method: 'GET',
        headers: {
            'Host': 'color.adobe.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.52 Safari/537.36',
            'x-api-key': apikey
        }
    };
    var jsonRequest = https.request(options, function(res) {
        res.setEncoding('utf8');
        var datastring = '';

        res.on('data', function(chunk) {
            datastring += chunk;
        });

        res.on('end', function() {
            if (datastring.length > 0) {
                try {
                    themeList = JSON.parse(datastring);
                    console.log(themeList);
                } catch (e) {
                    console.error('Cannot parse list');
                }
            } else {
                console.error('Cannot retrive list');
            }
        });
    }).on('error', function(e) {
        console.error('Cannot connect to retrive list');
        console.error(e);
    });
    
    jsonRequest.end();
}