'use strict';

$(function() {
  var background = $('<img>').attr('src', '/img/bg.png');

  background.load(function() {
    $('body').addClass('cover');
    $('.container').removeClass('none');

    var logo = $('#logo');
    var contact = $('#contact');

    logo.addClass('animated bounceIn');
    contact.addClass('animated fadeIn');
  });
});
