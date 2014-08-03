'use strict';

/* jshint ignore:start */
(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-53461628-1', 'auto');
ga('send', 'pageview');
/* jshint ignore:end */

$('body').scrollspy({ target: '#bs-example-navbar-collapse-1', offset: 110 });

function scrollToSection(section) {
  event.preventDefault();
  $('body').animate({scrollTop: $('#' + section).offset().top - 100 });
}

$(document).on('click','.navbar-collapse.in',function(e) {
  if($(e.target).is('a')) {
    $(this).collapse('hide');
  }
});
