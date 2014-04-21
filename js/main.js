/**
 * Main scripting for INIT website
 *
 * @author Hans Christian Reinl
 * @date 2013-09-30
 */
(function () {
	'use strict';

	var windowHeight = window.innerHeight;

	$(window).on('orientationchange resize', function () {
		windowHeight = window.innerHeight;
	});

	var scrollPosition = 0;

	var scrollUpdate = function () {
		var scroll = window.pageYOffset;

		if (scrollPosition === scroll) {
			window.cancelAnimationFrame(scrollUpdate);

			return false;
		}

		setHeaderTranslate(scroll);

		window.cancelAnimationFrame(scrollUpdate);
	};

	var setHeaderTranslate = function (scroll) {
		$('.hero').css('transform', 'translateY(' + (scroll / 2) + 'px)');
		$('.hero h1').css('transform', 'translateY(' + (scroll / 3) + 'px)');
	};

	/**
	 * Listen to scoll
	 */
	$(window).on('scroll', function () {
		window.requestAnimationFrame(scrollUpdate);
	});

	/**
	 * Hash change: trigger scoll event
	 */
	$(window).on('hashchange', function () {
		setHeaderTranslate(0);
	});

	/**
	 * Navigation
	 */
	$(document).on('click', '.navigation-open, .navigation-close', function (event) {
		event.preventDefault();

		$('.site-navigation').toggleClass('is-active');
	});
}());
