var socket = io.connect('/');

socket.on('message', function(message) {
    console.log('[server/message] ' + message);
});

socket.on('powers', function(powers) {
    for (var i = 1; i <= 4; i++) {
        if ((powers[i - 1].off - powers[i - 1].on) != 1440) {
            //console.log(powers[i - 1]);

            $('.items .item:nth-child(' + i + ')').attr('data-id', powers[i - 1].id)

            $('.items .item:nth-child(' + i + ')').css('background-color', '#' + powers[i - 1].color);


            var _start;
            var _connect;
            if (powers[i - 1].on - powers[i - 1].off == 0) {
                _start = [powers[i - 1].on]
                _connect = false
            } else {
                _start = [powers[i - 1].on, powers[i - 1].off]
                _connect = true
            }
            $('.items .item:nth-child(' + i + ') .bottom').noUiSlider({
                range: {
                    'min': 0,
                    'max': 1440
                },
                start: _start,
                connect: _connect,
                step: 5,
                margin: 1,
                slide: update
            }).change(update)

            if (powers[i - 1].on - powers[i - 1].off == 0) {
               
                $('.items .item:nth-child(' + i + ') .top span.get-on').html(int2hour(powers[i - 1].on));
                $('.items .item:nth-child(' + i + ') .top span.get-off').remove()

                $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to('-inline-', setInt2hour);
                $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to($('.items .item:nth-child(' + i + ') .top span.get-on'), setInt2hour);

                $('.items .item:nth-child(' + i + ') .noUi-handle-lower div').html(int2hour(powers[i - 1].on));

            } else {

                $('.items .item:nth-child(' + i + ') .top span.get-on').html(int2hour(powers[i - 1].on));
                $('.items .item:nth-child(' + i + ') .top span.get-off').html(int2hour(powers[i - 1].off));

                $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to('-inline-', setInt2hour);
                $('.items .item:nth-child(' + i + ') .bottom').Link('lower').to($('.items .item:nth-child(' + i + ') .top span.get-on'), setInt2hour);
                $('.items .item:nth-child(' + i + ') .bottom').Link('upper').to('-inline-', setInt2hour);
                $('.items .item:nth-child(' + i + ') .bottom').Link('upper').to($('.items .item:nth-child(' + i + ') .top span.get-off'), setInt2hour);

                $('.items .item:nth-child(' + i + ') .noUi-handle-lower div').html(int2hour(powers[i - 1].on));
                $('.items .item:nth-child(' + i + ') .noUi-handle-upper div').html(int2hour(powers[i - 1].off));
            
            }

            $('.items .item:nth-child(' + i + ') .top').css('color', '#' + powers[i - 1].color);

            $('.items .item:nth-child(' + i + ') .noUi-background').css('background', '#' + powers[i - 1].color);

            $('.items .item:nth-child(' + i + ') span.title').text(powers[i - 1].title);

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

socket.on('power', function(power) {
    console.log(power.id, power.on, power.off)
    $('.items .item:nth-child(' + power.id + ') .bottom').val([power.on, power.off]);
})

$(function() {

    $('.items .item').on('click', function() {
        if (!$(this).hasClass('big')) {
            $(this).addClass('big');
            $(this).find('.bottom').removeAttr('disabled');
            $(this).siblings().hide();
        }
    });

    $('.items .item span.cancel').on('click', function(e) {
        var item = $(this).parent();
        item.removeClass('big');
        item.find('.bottom').attr('disabled', 'disabled');
        item.siblings().show();
        e.stopPropagation();
        socket.emit('refresh', item.attr('data-id'))
    });

    $('.items .item span.close').on('click', function(e) {
        var item = $(this).parent();
        item.removeClass('big');
        item.find('.bottom').attr('disabled', 'disabled');
        item.siblings().show();
        e.stopPropagation();

        var range = $('.items .item:nth-child(' + item.attr('data-id') + ') .bottom').val()
        var on, off
        if (range.length = 1) {
            on = parseInt(range)
            off = on
        } else {
            on = parseInt(range[0])
            off = parseInt(range[1])
        }
        console.log(on, off)
        socket.emit('save', '{"id":' + item.attr('data-id') + ',"on":' + on+ ',"off":' + off + '}')
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


