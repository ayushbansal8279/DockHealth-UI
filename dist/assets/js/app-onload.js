$(document).ready(function() {

// make text editable
// $('body').on('click', '[data-editable]', function() {
// 	var $el = $(this);
// 	var $input = $('<textarea class="comment" />');
// 	var addcomment = '<div class="row expanded collapse comment-wrapper"><div class="columns shrink"><img class="member-photo circle xsmall" src="assets/img/user1.png" alt="name of user"></div><div class="columns"><span class="comment text-light" data-editable>Add a comment...</span></div></div>';
// 	$el.replaceWith( $input );
// 	var button =  $('<button />', {'class':'button primary small', text: 'Post'});
// 	$('textarea').parent().append(button);
// 	var save = function() {
// 		var $n = $('<span class="comment text-light" />').text( $input.val() );
// 		var $d = $('<span class="comment text-light" data-editable />').text( 'Add a comment' );
// 		    if($input.val().trim().length < 1) {
// 				$input.replaceWith( $d );
// 			} else {
// 				$input.replaceWith( $n );
// 				$('.comments-container').append(addcomment);
// 			}
// 			$('.comments-container button').remove();
// 	};
// 	$input.one('blur', save).focus();
// 	$('.comments-container').on('click', 'button', function() {
// 	save();
// 	});
// });

$("#addComment").click(function(){
		alert("working")
		// $("p").toggleClass("main");
});



});
