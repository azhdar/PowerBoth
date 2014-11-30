var socket = io.connect('/');

socket.on('message', function(message) {
    console.log('[server/message] ' + message);
});

socket.on('power', function(power) {
    for (var i = 1; i <= 4; i++) {
        if ((power[i - 1].off - power[i - 1].on) != 1440) {
            console.log(power[i - 1].on);
            /*$('.items .item:nth-child(' + i + ') .on-area').css('left', int2percent(power[i - 1].on) + '%')
            $('.items .item:nth-child(' + i + ') .on-area').css('right', (100 - int2percent(power[i - 1].off)) + '%')
            $('.items .item:nth-child(' + i + ') .on-area .get-on').html(int2hour(power[i - 1].on));
            $('.items .item:nth-child(' + i + ') .on-area .get-off').html(int2hour(power[i - 1].off));*/

            $('.items .item:nth-child(' + i + ')').css('background-color', '#' + power[i - 1].color);

            $('.items .item:nth-child(' + i + ') .bottom').noUiSlider({
                range: {
                    'min': 0,
                    'max': 1440
                },
                start: [power[i - 1].on, power[i - 1].off],
                connect: true,
                step: 5,
                margin: 1,
                slide: update
            }).change(update)

            $('.items .item:nth-child(' + i + ') .top span.get-on').html(int2hour(power[i - 1].on));
            $('.items .item:nth-child(' + i + ') .top span.get-off').html(int2hour(power[i - 1].off));

            $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to('-inline-', setInt2hour);
            $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to($('.items .item:nth-child(' + i + ') .top span.get-on'), setInt2hour);
            $('.items .item:nth-child(' + i + ') .bottom').Link('upper').to('-inline-', setInt2hour);
            $('.items .item:nth-child(' + i + ') .bottom').Link('upper').to($('.items .item:nth-child(' + i + ') .top span.get-off'), setInt2hour);

            $('.items .item:nth-child(' + i + ') .noUi-handle-lower div').html(int2hour(power[i - 1].on));
            $('.items .item:nth-child(' + i + ') .noUi-handle-upper div').html(int2hour(power[i - 1].off));

            $('.items .item:nth-child(' + i + ') .noUi-background').css('background', '#' + power[i - 1].color);

            $('.items .item:nth-child(' + i + ') span.title').text(power[i - 1].title);

            $('.items .item:nth-child(' + i + ') .bottom').attr('disabled', 'disabled');
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

$(function() {

    $('.items .item').on('click', function() {
        if (!$(this).hasClass('big')) {
            $(this).addClass('big');
            $(this).find('.bottom').removeAttr('disabled');
            $(this).siblings().hide();
        }
    });

    $('.items .item span.close').on('click', function(e) {
        var item = $(this).parent();
        item.removeClass('big');
        item.find('.bottom').attr('disabled', 'disabled');
        item.siblings().show();
        e.stopPropagation();
    });

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

function setInt2hour(num) {
    var h = pad2(Math.floor(num / 60));
    var m = pad2(num - (h * 60));
    $(this).html(int2hour(num));
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


