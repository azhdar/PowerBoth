var socket = io.connect('/');

socket.on('message', function(message) {
    console.log('[server/message] ' + message);
});

socket.on('power', function(power) {
    console.log(power);
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

function pad2(num) {
    return (num < 10 ? '0' : '') + num;
}


