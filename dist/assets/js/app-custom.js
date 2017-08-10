function renderFoundationComponentsJquery(){
	console.log('in JS function: renderFoundationComponentsJquery');

	// datepicker
	// $('.pickdate').fdatepicker({
	// });

	$('.dobpickdate').fdatepicker()
		.on('changeDate', function (ev) {
			// var dob = ev.date;
			// var mm = dob.getMonth() + 1; // getMonth() is zero-based
  			// var dd = dob.getDate() + 1;
  			// var dobStr = [
          	// 	(mm>9 ? '' : '0') + mm, "/",
			// 	(dd>9 ? '' : '0') + dd, "/",
			// 	dob.getFullYear()
         	// 	].join('');
			// $('.dobpickdate').attr('value', dobStr);
			$('.dobpickdate').fdatepicker('hide');
	});

}

function enableTaskListComponents(){
	console.log('in JS function: enableTaskListComponents');

	// show/hide completed tasks
	$('.toggle-completed').click(function() {
		$(this).toggleClass('inverse');
		$('.completed-task-wrapper').slideToggle();
		var $el = $(this);
		$el.text($el.text() == "Show completed tasks" ? "Hide completed tasks": "Show completed tasks");
	});

	// toggle slim view
	$('.toggle-slim').click(function() {
		$(this).toggleClass('active');
		$('.task-item-wrapper').toggleClass('slim');
		$('.task-item .row, .task-item, .main-task-item').toggleClass('align-middle');
	});

	// align middle for task list on patient pages
	if ($('.task-item-wrapper').hasClass('slim')) {
		$('.task-item .row, .task-item, .main-task-item').addClass('align-middle');
	}

	$('.due-date, .reminder').fdatepicker();

	// toggle task priority
	$('.priority').on('click', function() {
		$(this).toggleClass('high');
	});

	// toggle task edit
	$('.task-item-inner-wrapper').on('click',function() {
		$(this).parent().find('.edit-task').toggleClass('expanded');
	});
	$(".calendar .task-details-block, .task-title-left.float-left, .priority, .mark-complete-wrapper,.memberphoto").click(function (event) {
		event.stopPropagation();
	});

	// slide in/out extra add task details
	$('input').on('keyup', function() {
		$('.slidein').css({'left':'0','right':'0'});
	});

	$('input').on('keypress', function() {
		if (event.which == '64') {
			$('.user-list').css('display','block');
		}
		if (event.which == '35') {
			$('.user-list').css('display','block');
		}
		$('.user-list,input').on('click', function() {
			$('.user-list').css('display','none');
		});
	});

}

function closeAddTask(){
	//$('.add').click();
}

// **3**
function enableAutoCompleteForPatients(lookupData) {
	// console.log(lookupData)
	// add task form patient autocomplete
	// http://easyautocomplete.com/guide
	var patients = {
		// data: [ {name: "George Vasquez", mrn: "123-32-21"},
		// 	{name: "Grace Chavez", mrn: "473-32-21"},
		// 	{name: "Pamela Riley", mrn: "383-38-59"},
		// 	{name: "Raymond Curtis", mrn: "433-37-47"}
		// ],
		data: lookupData,
		getValue: function (element) { return $(element).prop("firstName") + " " + $(element).prop("lastName");},
		list: {
			onLoadEvent: function() {
				var addnew = '<li><a class="button small primary float-left" href="">Add new</a></li>';
				$('.easy-autocomplete-container ul').append(addnew);
			},
			onSelectItemEvent: function() {
				var selItemData = $("#add-patient").getSelectedItemData();
				$("#add-patient").val(selItemData.firstName + " " + selItemData.lastName);
				$("#add-patient-id").val(selItemData.patientId);
			},
			match: {enabled: true}
		},
		template: { type: "custom",
			method: function(value, item) {
				return "<span class='data-item'>" + item.mrn + "</span><span class='data-item'>" + item.firstName + " " + item.lastName + "</span>";
			}
		}
	};

	$(".add-patient").easyAutocomplete(patients);
}

function enableAutoCompleteForSubtaskPatients(lookupData) {
	// console.log(lookupData)
	// add task form patient autocomplete
	// http://easyautocomplete.com/guide
	var patients = {
		// data: [ {name: "George Vasquez", mrn: "123-32-21"},
		// 	{name: "Grace Chavez", mrn: "473-32-21"},
		// 	{name: "Pamela Riley", mrn: "383-38-59"},
		// 	{name: "Raymond Curtis", mrn: "433-37-47"}
		// ],
		data: lookupData,
		getValue: function (element) { return $(element).prop("firstName") + " " + $(element).prop("lastName");},
		list: {
			onLoadEvent: function() {
				var addnew = '<li><a class="button small primary float-left" href="">Add new</a></li>';
				$('.easy-autocomplete-container ul').append(addnew);
			},
			onSelectItemEvent: function() {
				var selItemData = $("#add-patient-subtask").getSelectedItemData();
				$("#add-patient-subtask").val(selItemData.firstName + " " + selItemData.lastName);
				$("#add-patient-subtask-id").val(selItemData.patientId);
			},
			match: {enabled: true}
		},
		template: { type: "custom",
			method: function(value, item) {
				return "<span class='data-item'>" + item.mrn + "</span><span class='data-item'>" + item.firstName + " " + item.lastName + "</span>";
			}
		}
	};

	$(".add-patient-subtask").easyAutocomplete(patients);
}

function enableAutoCompleteForAssignedTo(lookupData) {
	var people = {
		data: lookupData,
		getValue: function (element) { return $(element).prop("firstName") + " " + $(element).prop("lastName");},
		list: {
			onLoadEvent: function() {
			},
			onSelectItemEvent: function() {
				var selItemData = $("#assign-task-to").getSelectedItemData();
				$("#assign-task-to").val(selItemData.firstName + " " + selItemData.lastName);
				$("#assign-task-to-id").val(selItemData.userId);
			},
			match: {enabled: true}
		},
		template: { type: "custom",
			method: function(value, item) {
				return ""
					//+ "<span class='member-initials circle medium'>"+item.initials+"</span>"
					+ "<span class='data-item'>"
					+ item.firstName + " " + item.lastName
					+ "</span>";
			}
		}
	};

	$("#assign-task-to").easyAutocomplete(people);

}

function enableAutoCompleteForSubtaskAssignedTo(lookupData) {
	var people = {
		data: lookupData,
		getValue: function (element) { return $(element).prop("firstName") + " " + $(element).prop("lastName");},
		list: {
			onLoadEvent: function() {
			},
			onSelectItemEvent: function() {
				var selItemData = $("#assign-subtask-to").getSelectedItemData();
				$("#assign-subtask-to").val(selItemData.firstName + " " + selItemData.lastName);
				$("#assign-subtask-to-id").val(selItemData.userId);
			},
			match: {enabled: true}
		},
		template: { type: "custom",
			method: function(value, item) {
				return ""
					//+ "<span class='member-initials circle medium'>"+item.initials+"</span>"
					+ "<span class='data-item'>"
					+ item.firstName + " " + item.lastName
					+ "</span>";
			}
		}
	};

	$("#assign-subtask-to").easyAutocomplete(people);

}

function enableAutoCompleteForListMembers(lookupData) {
	var people = {
		data: lookupData,
		getValue: function (element) { return $(element).prop("firstName") + " " + $(element).prop("lastName");},
		list: {
			onLoadEvent: function() {
			},
			onSelectItemEvent: function() {
				var selItemData = $("#add-member-to-list").getSelectedItemData();
				$("#add-member-to-list").val(selItemData.firstName + " " + selItemData.lastName);
				$("#add-member-to-list-id").val(selItemData.userId);
			},
			match: {enabled: true}
		},
		template: { type: "custom",
			method: function(value, item) {
				return ""
					//+ "<span class='member-initials circle medium'>"+item.initials+"</span>"
					+ "<span class='data-item'>"
					+ item.firstName + " " + item.lastName
					+ "</span>";
			}
		}
	};

	$("#add-member-to-list").easyAutocomplete(people);

}

function enableFoundation() {
	$(document).foundation();
}

function toggleDropDown(elementId) {
	$("#"+elementId).foundation('toggle');
}

function toggleTaskForm(){
  $('.add').toggleClass('close');
  $('body').toggleClass('disable-header-scroll');
  if($(this).hasClass('add-list')) {
    $('.add-list use').attr('href', function(index, attr) {
      return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
    });
  }
  $('.add-form-wrapper').slideToggle(300);
  $('.list-filter .controls').toggle();
}

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
			// alert("working")
			// $("p").toggleClass("main");
	});

	// show/hide add task/list form
	// function editForm() {
	// 	$('.add').toggleClass('close');
	// 	$('body').toggleClass('disable-header-scroll');
	// 	if($(this).hasClass('add-list')) {
	// 		$('.add-list use').attr('href', function(index, attr) {
	// 			return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
	// 		});
	// 	}
	// 	$('.add-form-wrapper').slideToggle(300);
	// 	$('.list-filter .controls, .list-wrapper').toggle();
	// };


	$(document).foundation();
	//var elem = new Foundation.DropdownMenu($('#mainmenu'), null);
	//console.log(elem);

	//ensure we remove these from app.js
	// $('.form-floating-label input, .form-floating-label textarea').focusin(function(){
	$(document).on('focusin', '.form-floating-label input, .form-floating-label textarea', function() {
		$(this).closest('.form-floating-label').addClass('has-value');
	});

	// $('.form-floating-label input, .form-floating-label textarea').blur(function(){
	$(document).on('blur', '.form-floating-label input, .form-floating-label textarea', function() {
		if(!$(this).val().length > 0) {
			//$(this).parent().removeClass('has-value');
			$(this).closest('.form-floating-label').removeClass('has-value');
		}
	});

	$(document).on('click', '.search', function() {
		$(".search-field").toggleClass("expand-search");
		$(".search-field").focus();
		$(this).find('use').attr('href', function (index, attr) {
			return attr == '#icon-close' ? '#icon-search' : '#icon-close';
		});
	});

	// add subtasks
	$(document).on('click', '.toggle-add-subtask', function() {
	// $('.add-form').on('click', '.toggle-add-subtask', function() {
		$('.subtask-wrapper').slideToggle(300);
		$('.main-task-wrapper').slideToggle(300);
	});

	// show/hide add task/list form
	$(document).on('click', '.add, .edit-task', function() {
	// $('.add, .edit-task').on('click', function(event) {
		$('.add').toggleClass('close');
		$('body').toggleClass('disable-header-scroll');
		if($(this).hasClass('add-list')) {
			$('.add-list use').attr('href', function(index, attr) {
				return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
			});
		}
		$('.add-form-wrapper').slideToggle(300);
		$('.list-filter .controls').toggle();
		// $('.list-filter .controls, .list-wrapper').toggle();
	//	$('.list-filter .controls').toggle();
	});

	// toggle high priority flag
	$(document).on("click", ".task-item .flag", function () {
		$(this).toggleClass("no-flag");
	});

	$(document).on('click', '.close-button, .close, .confirm', function() {
		$('.reveal-overlay').hide();
	})

	function toggleTaskForm(){
		$('.add').toggleClass('close');
		$('body').toggleClass('disable-header-scroll');
		if($(this).hasClass('add-list')) {
			$('.add-list use').attr('href', function(index, attr) {
				return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
			});
		}
		$('.add-form-wrapper').slideToggle(300);
		$('.list-filter .controls').toggle();
	}

	$(document).on('click', '.show-add-subtask', function () {
		$('.main-task-wrapper').hide();
		$('.subtask-wrapper').slideDown(300);
	});

	// show/hide completed tasks
	$(document).on('click', '.toggle-completed', function() {
		$(this).toggleClass('inverse');
		$('.completed-task-wrapper').slideToggle();
		var $el = $(this);
		$el.text($el.text() == "Show completed tasks" ? "Hide completed tasks": "Show completed tasks");
	});


	// $('.pickdate').fdatepicker({
	// });

	// $(document).on('click', 'div', function () {
	// 	loading();
	// });

	// show/hide add task/list form
// $(document).on('click', '.add, .edit-task', function() {
// 	$('.add').toggleClass('close');
// 	$('body').toggleClass('disable-header-scroll');
// 	var href = $(this).attr('id');
// 	if($(this).hasClass('add-other')) {
// 		$('.add-other use').attr('href', function(index, attr) {
// 			return attr =='#icon-add' ? '#'+href : '#icon-add';
// 		});
// 	}
// 	$('.add-form-wrapper').slideToggle(300);
// 	//	$('.list-filter .controls, .list-wrapper').toggle();
// 	$('.list-filter .controls').toggle();
// });




});
