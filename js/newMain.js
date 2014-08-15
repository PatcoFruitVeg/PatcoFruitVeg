'use strict';

$(function() {
  var background = new Image();
  background.src = '/img/bg.png';

  background.onload = function() {
    $('body').addClass('cover');
    $('.container').removeClass('none');

    var logo = $('#logo');
    var contact = $('#contact');

    logo.addClass('animated bounceIn');
    contact.addClass('animated fadeIn');
  };
});
