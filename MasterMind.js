var colors = [
    'url(Images/Yellow.png)',
    'url(Images/Red.png)',
    'url(Images/Blue.png)',
    'url(Images/Grey.png)',
    'url(Images/Purple.png)',
    'url(Images/Green.png)',
    'url(Images/Black.png)',
    'url(Images/Orange.png)',
];
function getMarkers(tr) {
    var i,
        color,
        whites = 0,
        blacks = 0;
    for (i = 0; i <= $('.selectedColor').length - 1; i++) {
        color = $('.selectedColor').eq(i);
        $(tr)
            .children('.guess')
            .each(function (index) {
                if (
                    !$(color).hasClass('found') &&
                    !$(this).hasClass('found') &&
                    i == index &&
                    $(this).css('background-image') == $(color).css('background-image')
                ) {
                    whites++;
                    $(this).addClass('found');
                    $(color).addClass('found');
                }
            });
    }
    for (i = 0; i <= $('.selectedColor').length - 1; i++) {
        color = $('.selectedColor').eq(i);
        $(tr)
            .children('.guess')
            .each(function () {
                if (
                    !$(color).hasClass('found') &&
                    !$(this).hasClass('found') &&
                    $(this).css('background-image') == $(color).css('background-image')
                ) {
                    blacks++;
                    $(this).addClass('found');
                    $(color).addClass('found');
                }
            });
    }
    $('.selectedColor').removeClass('found');
    return { whites: whites, blacks: blacks };
}
function markRow(tr) {
    var markers = getMarkers(tr),
        matches = 0;
    if (markers.whites) {
        for (; matches < markers.whites; matches++) {
            $(tr).find('.mark').eq(matches).css({
                'background-color': '#fff',
            });
        }
        if (markers.whites == $('.selectedColor').length) {
            //win game
            $('#divSelectedColors').show();
            $('.guess').removeClass('editing');
            alert('You got it in ' + $(tr).children('.tdRowNumber').text() + ' tries!');
            return;
        }
    }
    if (markers.blacks) {
        for (; matches < markers.whites + markers.blacks; matches++) {
            $(tr).find('.mark').eq(matches).css({
                'background-color': '#000',
            });
        }
    }
    $(tr).find('.spnArrow').hide();
    $(tr).next().find('.spnArrow').show();
    $(tr).next().children('.guess').eq(0).addClass('editing');
    if (!$('.editing').length) {
        // no rows left - lose game
        $('#divSelectedColors').show('slow');
        alert('No tries left.\nGame Over!');
    }
}
function selectColor(tdColor) {
    var td = $('.editing'),
        tr = $(td).parent();
    if (!$(td).length) return;
    $('#divAnimate')
        .css({
            'background-image': $(tdColor).css('background-image'),
            width: $(tdColor).width(),
            height: $(tdColor).height(),
            top: $(tdColor).offset().top,
            left: $(tdColor).offset().left,
            display: '',
        })
        .animate(
            {
                width: $(td).width(),
                height: $(td).height(),
                top: $(td).offset().top,
                left: $(td).offset().left,
            },
            500,
            function () {
                $('#divAnimate').css('display', 'none');
                $(td)
                    .css('background-image', $('#divAnimate').css('background-image'))
                    .removeClass('editing')
                    .data('hasColor', true);
                $(tr)
                    .children('.guess')
                    .each(function () {
                        if (!$(this).data('hasColor')) {
                            $(this).addClass('editing');
                            return false;
                        }
                    });
                if (!$('.editing').length) {
                    //last box in row
                    $('#cbAutomaticMarking:checked').length
                        ? markRow(tr)
                        : $(tr).find('button').css('visibility', 'visible');
                }
            }
        );
}
function generateColors() {
    var gameColors = [];
    var unique = $('#cbUniqueColors:checked').length;

    $('.selectedColor').each(function () {
        var color = colors[parseInt((Math.random() * 10) % colors.length)];
        while (unique && gameColors.indexOf(color) != -1) {
            color = colors[parseInt((Math.random() * 10) % colors.length)];
        }
        gameColors.push(color);
        $(this).css('background-image', color);
    });
}
function newGame() {
    $('.guess, .mark').css('background-color', '#ddd');
    $('.guess')
        .removeClass('editing')
        .removeClass('found')
        .data('hasColor', false)
        .css({ 'background-image': '', 'background-color': '' });
    $('.btnMark').css('visibility', 'hidden');
    $('.spnArrow').hide().eq(0).show();
    $('.guess:eq(0)').addClass('editing');
    $('#divSelectedColors').hide();
    generateColors();
}
function clear() {
    if ($(this).hasClass('editing')) return;
    var td = this,
        tdEdit = $(td).parent().find('.editing'),
        btnMark = $(td).parent().find('.btnMark'),
        i,
        matchingPicker;
    if (tdEdit.length || $(btnMark).css('visibility') == 'visible') {
        if ($(td).data('hasColor')) {
            for (i = 0; i < $('.picker').length; i++) {
                if ($(td).css('background-image') == $('.picker').eq(i).css('background-image')) {
                    matchingPicker = $('.picker').eq(i);
                    break;
                }
            }
            $(td).css('background-image', '').data('hasColor', false);
            $('#divAnimate')
                .css({
                    'background-image': $(matchingPicker).css('background-image'),
                    width: $(td).width(),
                    height: $(td).height(),
                    top: $(td).offset().top,
                    left: $(td).offset().left,
                    display: '',
                })
                .animate(
                    {
                        width: $(matchingPicker).width(),
                        height: $(matchingPicker).height(),
                        top: $(matchingPicker).offset().top,
                        left: $(matchingPicker).offset().left,
                    },
                    500,
                    function () {
                        $('#divAnimate').css('display', 'none');
                        $(tdEdit).removeClass('editing').css('background-image', '');
                        $(btnMark).css('visibility', 'hidden');
                        $(td).addClass('editing');
                    }
                );
        } else {
            $(tdEdit).removeClass('editing').css('background-image', '');
            $(btnMark).css('visibility', 'hidden');
            $(td).addClass('editing');
        }
    }
}
$(document).ready(function () {
    var i, tdEdit;
    for (i = 0; i < colors.length; i++) {
        $('#trColorPicker').append(
            '<td style="background-image:' +
                colors[i] +
                '" onclick="selectColor(this);" class="picker">&nbsp;</td>'
        );
    }
    for (i = 0; i < 9; i++) {
        $('#guessTable').append($('#guessTable tr').eq(0).clone());
    }
    $('.tdRowNumber').each(function (index) {
        $(this).text(index + 1);
    });
    $('.guess').click(clear);

    $('#cbAutomaticMarking')
        .attr('checked', !!localStorage.getItem('autoMark') ? 'checked' : '')
        .change(() =>
            localStorage.setItem(
                'autoMark',
                $('#cbAutomaticMarking:checked').length > 0 ? 'true' : ''
            )
        );
    $('#cbUniqueColors')
        .attr('checked', !!localStorage.getItem('uniqueColors') ? 'checked' : '')
        .change(() =>
            localStorage.setItem('uniqueColors', $('#cbUniqueColors:checked').length ? 'true' : '')
        );

    $('tr:has(td.guess)')
        .find('.btnMark')
        .click(function () {
            markRow($(this).parents('tr'));
            $(this).css('visibility', 'hidden');
        });
    $('.openPopup').click(function () {
        $(this)
            .next()
            .toggle('slow')
            .css('top', $(this).offset().top + $(this).height() + 10);
    });
    $('.popup').click(function () {
        $(this).hide('slow');
    });
    $('.spnArrow:eq(0)').show();
    $('.guess:eq(0)').addClass('editing');
    generateColors();
});
