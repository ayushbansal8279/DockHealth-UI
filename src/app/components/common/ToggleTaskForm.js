import React from 'react'

let ToggleTaskForm = function(){
  $('.add').toggleClass('close');
  $('body').toggleClass('disable-header-scroll');
  if($(this).hasClass('add-list')) {
    $('.add-list use').attr('href', function(index, attr) {
      return attr =='#icon-add' ? '#icon-lists' : '#icon-add';
    });
  }
  $('.add-form-wrapper').slideToggle(300);
  $('.list-filter .controls, .list-wrapper').toggle();
}

export default ToggleTaskForm
