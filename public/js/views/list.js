jQuery(function($) {

	$('.btn-create-item').click(function(e) {
		
		var $form = $(this).closest('form');
		
		$form.find('.form').show();
		
		$form.find('.toolbar-default').hide();
		$form.find('.toolbar-create').show();
		
		$form.find('input[type=text]').first().focus();
		
	});
	
	// Autofocus the search field if there has been a search
	
	if ($('.search-list input').val()) {
		setTimeout(function() {
			$('.search-list input').focus();
		},10);
	}
	
	$('.btn-cancel-create-item').click(function(e) {
		
		var $form = $(this).closest('form');
		
		$form.find('.form').hide();
		
		$form.find('.toolbar-default').show();
		$form.find('.toolbar-create').hide();
		
	});
	
	$('a.control-delete').hover(function(e) {
		$(this).closest('tr').addClass('delete-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('delete-hover');
	});
	
	$('a.control-sort').hover(function(e) {
		$(this).closest('tr').addClass('sort-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('sort-hover');
	});
	
});