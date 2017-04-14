var ranks = [];

(function() {
    var script = document.createElement("SCRIPT");
    script.src = 'https://code.jquery.com/jquery-3.1.0.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };
    checkReady(function(jq) {
        getRanks(jq);
    });
})();

function getPosition(str, m, i) {
   return str.split(m, i).join(m).length;
}

function cbFunc(data) {
    if ( data.results[0] ) {
        data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

        var rank_pos = getPosition(data, 'infoText', 8);
        var rank_re = /\<b>(\d{1,4})&#xd;/;
        var rank_slice = data.slice(rank_pos, rank_pos+80);
        var rank_match = rank_slice.match(rank_re);
        if(rank_match){
            var rank = rank_match[1];
            ranks.push(rank);
        }
        else{
            ranks.push(0)
        }
    }
}
function getRanks(jq){
    var players = jq('.player-name');

    function requestCrossDomain( jq, site, index ) {
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=cbFunc';
        jq.ajax({
          type: 'get',
          dataType: "jsonp",
          jsonp: 'callback',
          jsonpCallback: 'cbFunc',
          url: yql,
          success: function(){
            if(index == players.length){
                players.each(function(i, player){
                    var rank = ranks[i];
                    player.children[0].innerHTML += ' ('+rank+')';
                })
                return;
            }
            var player = players[index].children[0];
            var url = player.href;
            requestCrossDomain(jq, url, index+1);
          }
        });
    }
    var player = players[0].children[0];
    var url = player.href;
    requestCrossDomain(jq, url, 1);
}

function rankPosition(your_rank){
    sorted_ranks = ranks.map(function(i){return parseInt(i)}).sort(function(a, b){return b-a});
    return sorted_ranks.indexOf(your_rank);
}