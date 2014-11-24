var socket = io.connect('/');

socket.on('message', function(message) {
    console.log('[server/message] ' + message);
});

socket.on('power', function(power) {
    for (var i = 1; i <= 4; i++) {
        if ((power[i - 1].off - power[i - 1].on) != 1440) {
            $('.items .item:nth-child(' + i + ') .on-area').css('left', int2percent(power[i - 1].on) + '%')
            $('.items .item:nth-child(' + i + ') .on-area').css('right', (100 - int2percent(power[i - 1].off)) + '%')
            $('.items .item:nth-child(' + i + ') .on-area .get-on').html(int2hour(power[i - 1].on));
            $('.items .item:nth-child(' + i + ') .on-area .get-off').html(int2hour(power[i - 1].off));
            $('.items .item:nth-child(' + i + ')').css('background-color', '#' + power[i - 1].color);
        } else {
            $('.items .item:nth-child(' + i + ')').remove();
        }
    }
});

socket.on('state', function(state) {
    console.log('[server/state] ' + state);
    var json = $.parseJSON(state);
    console.log(json.power, json.isOn, json.isOn?'isOn':'isOff');
    $('button[data-num=' + json.power + ']').removeClass().addClass('"' + json.isOn?'isOn':'isOff' + '"');
});

$(document).ready(function(){
    $('button').on('click', function() {
        var num = $(this).attr('data-num');
        socket.emit('toggle', num);
    });
});

$(function() {

    /*
    $('.bottom.light').noUiSlider({
        range: [0,1440],
        start: [400, 1100],
        connect: true,
        step: 5,
        margin: 1,
        slide: update
    }).change(update)
    */

})

function update(e) {
    var tmp = $('.bottom').val();

    var dh = pad2(Math.floor(tmp[0] / 60));
    var dm = pad2(tmp[0] - (dh * 60));

    var fh = pad2(Math.floor(tmp[1] / 60));
    var fm = pad2(tmp[1] - (fh * 60));

    var t = tmp[1] - tmp[0];
    var th = pad2(Math.floor(t / 60));
    var tm = pad2(t - (th * 60));

    console.log(dh+':'+dm+' -> '+fh+':'+fm+' = '+th+':'+tm);
}

function int2hour(num) {
    var h = pad2(Math.floor(num / 60));
    var m = pad2(num - (h * 60));
    return h + ':' + m;
}

function int2percent(num) {
    return (parseInt(num) * 100) / 1440;
}

function pad2(num) {
    return (num < 10 ? '0' : '') + num;
}


