import $ from 'jquery';

export function toggleAlert(notification, type) {
	// type "success" shows green bg
	// type "error" shows red bg
	// if(type !== undefined){
	$('.new-task').addClass(type);
	// }
	$('.new-task').text(notification);
	$('.new-task').addClass('show');
	setTimeout(function () {
		$('.new-task').removeClass('show');
		$('.new-task').removeClass(type);
	}, 4000);
}

export function scrollToTop(){
	$("html, body").animate({ scrollTop: 0 }, "slow");
}

