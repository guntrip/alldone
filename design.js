var current_hover=0, label_mousedown=false;
/* sizeup =============================== */
var blahblahblah=false;

function sizeup() {

	var scale_by=screenmode();

	if (user_options.mode!=='vertical') {

		// 1/3 for individual lists
		var newWidth = ($(window).width() / scale_by);
		$('ul').outerWidth( newWidth );

		// size wrapper
		var count = $('ul').length;
		$('#wrapper').width( count * newWidth );

		if ($('body').hasClass('vertical')) {
			$('body').removeClass('vertical');
		}

	}

	if (user_options.mode==='vertical') {

		var newWidth = ($(window).width())-(vert_indent*4);

		if (!$('body').hasClass('vertical')) {
			$('body').addClass('vertical');
			$('#wrapper').width('100%');
		}
	}

	// inputs
	var inputWidth=newWidth-100;
	$('input.edit, input.new').width(inputWidth-50); // allow for the icon!
	$('textarea.edit, textarea.new').width(inputWidth);
	$('li label').width(inputWidth); 

}


/* redraw =============================== */

function screenmode() {
	if (user_options.fullscreen) {
		return 1;
	} else {
		if ($('body').width()>1024) {
			return 3;
		} else {
			if ($('body').width()>640) {	
			return 2;
			} else {
			return 1;
			}
		}
	}
}

function redraw(breadcrumbs) {

	if (!pause_redraw) {

		var working_breadcrumbs=[], html="";

		$('body').removeClass()
		$('body').addClass(user_options.colourscheme);

		//console.log(breadcrumbs);
		redrawing=breadcrumbs;
		old_breadcrumbs=open_breadcrumbs;

		retain_forms(false);
		retain_scroll(false);

		if ((user_options.mode=='horizontal')||(!user_options.mode)) {

			// Top level
			html += draw_list(working_breadcrumbs);

			// Draw each stage of the breadcrumbs
			$.each(breadcrumbs, function(i, val) {
				working_breadcrumbs.push(breadcrumbs[i]);
				html += draw_list(working_breadcrumbs);
			});

			// If we're going backwards, we might want to do some scrolling.
			if ( (breadcrumbs.length < open_breadcrumbs.length) && (open_breadcrumbs.length>( screenmode() -1 ) ) ) { // 2, as in 3..

				// Set the open bread crumbs
				open_breadcrumbs=breadcrumbs;
				
				// updateScroll() will update the html when done
				updateScroll(false, breadcrumbs.length, html);

			} else {

				// Set the open bread crumbs
				open_breadcrumbs=breadcrumbs;

				//$('#wrapper').html(html);
				redraw_finalize(html, true);
				
			}

		} else {

			// New vertical mode /!!/
			// doesn't require horrible scrolling.
			
			open_breadcrumbs=breadcrumbs;
			html += draw_list(working_breadcrumbs);

			// Draw each stage of the breadcrumbs
			/*$.each(breadcrumbs, function(i, val) {
				working_breadcrumbs.push(breadcrumbs[i]);
				html += draw_list(working_breadcrumbs);
			});*/

			redraw_finalize(html, true);

		}

	}

}

function redraw_finalize(html, scroll) {

		$('#wrapper').empty().append(html);
		sizeup();
		set_classes();
		assign_clicks();
		retain_forms(true);
		retain_scroll(true);
		sort_setup();
		mobile_update();
	
		// Callbacks.
		callback(false,{});

		if (scroll) { updateScroll(true, 0, ''); }

		if (first_load) {
			magic_scan_init();
			first_load=false;
			if (runtime=='app') { app_window_update(); }
		}

}

function updateScroll(auto, moveto, html) {

	// If auto, scroll to the end. If set, scroll back to moveto and update.

	// Grab measurements
	var count = $('ul').length, width = $('ul').outerWidth(), diff=0;

	var cScroll=$('body').scrollLeft(), cSize=$('#wrapper').width();

	

	// Are we being told where to go? :O
	if (!auto) { 
		// We're setting the LEFT of the screen, so adjust for how many are on the screen!	
		if (screenmode()===1) {	count=moveto;}
		if (screenmode()===2) {	count=moveto-1; }
		if (screenmode()===3) {	count=moveto-2; }		
	} else {
		// Normal operation, scroll to the end.
		count=count-1;		
	}

	//console.log('current: '+cScroll+', width: '+cSize);
	//console.log('scrolling to: '+((count) * width));

	// We don't want to scroll unless they're already at the end.
	var goScroll=true;
	if (old_breadcrumbs.length===open_breadcrumbs.length) {
		// same.				
		goScroll=false;	
	}
	
	if (goScroll) {

		$('html, body').animate({scrollLeft: ((count) * width)}, 500, function() {
	    
			if (!auto) {
				// If auto, we update the wrapper when we're complete and finalize the redraw */
				redraw_finalize(html, false);			
			}

			//console.log('scroled to: '+($('body').scrollLeft()));

	  	});

	}
}

function mobile_update() {

	if( (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent) ) {
		$("li .edit_button").css('display','block');
	} else {
		$("li .edit_button").css('display','');
	}

}

function clear_autosize(e) {
	autosize($('textarea.new, textarea.edit'));
}

/* checkbox  */

function checkbox_please(checked) {
	// return actual internal display
	if (checked) {
		return "<i class=\"fa fa-check fa-fw\"></i>";
	} else {
		return "<i class=\"fa fa-times fa-fw\"></i>";
	}
}



/* set classes and events =============================== */

function assign_clicks() {

	// Unbind
	$( 'li .expand' ).unbind( "click" );
	$( 'li .close' ).unbind( "click" );	
	$( 'li textarea.new' ).unbind( "enterKey" );
	$( 'li textarea.new' ).unbind( "keydown" );
	$( 'li textarea.edit' ).unbind( "enterKey" );
	$( 'li textarea.edit' ).unbind( "keydown" );
	$( 'li label' ).unbind( "keyup" );

	// Expand
	$( 'li .expand' ).click(function() {	
		//expand($(this).parent().attr("id"));
		expand($(this).parent());
	});

	// Contract
	$( 'li .contract' ).click(function() {	
		//expand($(this).parent().attr("id"));
		close($(this).parent());
	});

	// Close
	$( 'li .close' ).click(function() {	
		//close($(this).parent().parent().attr("id"));
		close($(this).parent().parent());
	});

	$( 'li.close_header' ).click(function() {	
		//close($(this).parent().parent().attr("id"));
		close($(this).parent());
	});

	if (!read_only) {

				// Autosize focus
				$('li textarea.new, li textarea.edit').bind("focus",function(e){		
			   		autosize(this);
				});

				// New
				$('li textarea.new').bind("enterKey",function(e){
			   		add(this);   		
				});
				$('li textarea.new').keypress(function(e){
				    if(e.keyCode == 13)
				    {
				        $(this).trigger("enterKey");
				    }
				});


				// Edit save by key press (keydown->keypress to make tint happy)
				// New
				$('li textarea.edit').bind("enterKey",function(e){
			   		modify_save_open();
				});
				$('li textarea.edit').keypress(function(e){
				    if(e.keyCode == 13)
				    {
				        $(this).trigger("enterKey");
				    }
				});
				
				// More dialogue
				$('li .more').click(function() {
					details_dialog(this);
				});

				// Right click for details
				/*$('li label').bind('contextmenu', function(e){		
					if (custom_context) {
				    e.preventDefault();
				    //code
				    context_pop(this, e);
				    return false;
					}
				});*/

				// check
				$('div.checkbox').not('.disabled').click(function(e) {
					check(this, e);
				});

				// header switches

					// sort toggle
					$('div.sort_toggle').click(function() {
						sort_toggle();
					});

	}

	// Open to modify
	if ( (user_options.editmode) && (!read_only) ) {

		$( 'li label' ).click(function() {	
			modify(this);
		});

	} else {

		// Expand/close labels
		$( 'li label' ).not('li.open label, li.static').click(function() {					
			expand($(this).parent());
		});
		$( 'li.open label' ).not('li.static').click(function() {	
			
			close($(this).parent());
		});

		// Expand close li, but not children
		$( 'li' ).not('li.open, li.static').click(function(){
			expand($(this));
		}).children().click(function(e) {
		  return false;
		});
		$( 'li.open' ).not('li.static').click(function(){
			close($(this));
		}).children().click(function(e) {
		  return false;
		});

		// Edit button (uses :hover css)
		$( '.edit_button' ).click(function() {	
			modify(this);
		});

		// Open/close on the count too, useful for 1-mode.
		$( 'li .count' ).not('li.open .count').click(function() {
			expand($(this).parent());
		});
		$( 'li.open .count' ).click(function() {
			close($(this).parent());
		});

	}

		// json
		$('div.json_view').click(function() {
			json_mod_start();
		});

		// magic
		$('div.magic_refresh').click(function() {
			magic_scan_init();
		});

		// settings
		$('div.settings').click(function() {
			settings_dialog();
		});

		if (runtime=='app') {
			$('div.mainmenu.app').click(function() {
			app_lists(true);
			});
		}

		if (runtime=='app') {
			$('div.mainmenu.app').click(function() {
				if (!$('#updating').is(':visible')) {
				app_lists(true);
				} else {
				dialog({type:'still_saving'});
				}
			});
		}

		if (runtime=='web') {
			$('div.mainmenu.web').click(function() {
				if (!$('#updating').is(':visible')) {
				document.location.href = homeuri;
				} else {
				dialog({type:'still_saving'});
				}
			});
		}


	// And the info-hover	
	/*$( "li label" ).hover(
	  function() {

		    window.current_hover=$(this).parent().attr('breadcrumbs');
		    var this_check=$(this).parent().attr('breadcrumbs');
		    var this_id=$(this).parent().attr('id');

		    setTimeout(function(){ 	
				if (window.current_hover===this_check) {
				
					// Cursor has remained. Show nice bubble.
					hover_pop(this_id);
					window.current_hover=0;

				}				
			 }, 1000);

	  }, function() {
	  	// cancel hover.
	    window.current_hover=0;
	  }
	);*/
		

	// Also, classes


}


function set_classes() {
	/*$.each(open_breadcrumbs, function(i, val) {
		$('#item-'+i+'-'+val).addClass('open');
	});*/
}

/* forms and continunity =============================== */


function retain_forms(restore) {

	// Allows page to be redrawn without form content being lost.

	if (!restore) {

		form_history=[];
		form_count=$('li input.new').length;

		$('li input.new').each(function(){
			form_history[$(this).attr("id")]={};
			// Store values
			form_history[$(this).attr("id")].title=$(this).val();
       	});

	}

	if ( (restore) && (form_history) ) {

		var lastinput=0;

		$('li input.new').each(function(){

			if (form_history[$(this).attr("id")]) {				
				var res=form_history[$(this).attr("id")];
				// Return values
				$(this).val(res.title);
				lastinput=this;
			}

		});

		// If there's the same number, then we should clear the last one.	
		if ($('li input.new').length===form_count) { $(lastinput).val(''); }

	}

}

function retain_scroll(restore) {

	// Checks if any of the ULs are scrolled and saves that, then restores it
	if (!restore) {

		scroll_history=[];

		$('ul.list').each(function(){
			
			if ($(this).scrollTop()>0) {			
				scroll_history[$(this).attr("breadcrumbs")]=$(this).scrollTop();
			}

		});	

	} else {
	
		$('ul.list').each(function(){

			var checkBc=$(this).attr("breadcrumbs");

			if (scroll_history[checkBc]) {
				$(this).scrollTop(scroll_history[checkBc]);		
			}
			

		});

	}

}

function context_pop(item, e) {
//e.pageX and e.pageY
var html="<div class=context style=\"top:"+e.pageY+"px; left:"+e.pageX+"px;\">";
	html += "<div onclick=\"settings();\">Details...</div>";
	html += "<div onclick=\"settings();\">Delete</div>";
	html += "<div onclick=\"settings();\">Disable menu</div>";
	html += "</div>";

$('body').append(html);

$( 'body' ).click(function() {	
	$('.context').remove();
});


}

/* set up functions =============================== */

function sort_setup() {

	if (sort_mode) {

		var cw="", cw_count=$("ul.list").length;
		for (i = 0; i < cw_count; i++) { 
			// Will give us one loop for each ul.

			// Make the connectWith
			var cw="";
			for (j = 0; j < cw_count; j++) { 
				if (j!==i) {
					if (cw!=="") { cw+=", ";}
					cw+="#crumbs-"+j;
				}
			}

			$( "#crumbs-"+i).sortable({ 
						"cancel":"li.static",
						"connectWith": cw,
					    "sort":function(event, ui) {
					    	if (ui.placeholder.index()===0) {return false;}
					    },
					    "update":function(event, ui) {
					    	if (this === ui.item.parent()[0]) {
					    	sorted(this, event, ui);
					    	}
					    }
					});

			$( "#crumbs-"+i ).disableSelection();

		}
	
	}

}

function sort_toggle() {
	if (sort_mode) {
		sort_mode=false;
	} else {
		sort_mode=true;
		dialog({type:'sort_beta'});		
	}
	redraw(open_breadcrumbs);
}


/* my own dialogs.. */
function dialog(options) {

var title='', text='', buttons='', bindOverlay=true, bindStandardButtons=true, focusButton='', newclass='';

	if (options.type==='delete_with_children') {
		newclass='question';
		title='<i class=\"fa fa-warning\"></i> This has children. Continue?';
		text='Deleting this item will delete the child items within.';
		buttons='<input type=button value=\"Delete\" id=\"dialog_delete\"> <input type=button value=\"Cancel\" id=\"dialog_cancel\">';
		bindOverlay=false;
		bindStandardButtons=false;
		focusButton='dialog_delete';
	}

	if (options.type==='sort_beta') {
		newclass='question';
		title='<i class=\"fa fa-sort\"></i> Sorting is a beta function!';
		text='If you are doing anything drastic, I recommend you back up first. Please be careful';
		text+=' not to drag any items into their children. Bad things will happen.';
		buttons='<input type=button value=\"Got it.\" id=\"dialog_okay\">';
		bindOverlay=true;
		bindStandardButtons=true;
	}

	if (options.type==='details') {
		newclass='details';
		var deets=details_dialog_gen(options.item);
		title='<i class=\"fa fa-pencil\"></i> Edit';
		text=deets.html;
		buttons="<input type=button value=\"Update\" id=\"dialog_update\"> <input type=button value=\"Cancel\" onclick=\"dialog_close();\">";
		bindStandardButtons=false;
	}

	if (options.type==='settings') {
		// found in with the details dialog.
		newclass='details';
		var deets=settings_dialog_gen();
		title='<i class=\"fa fa-pencil\"></i> List settings';
		text=deets.html;
		buttons="<input type=button value=\"Save\" id=\"dialog_update\"> <input type=button value=\"Cancel\" onclick=\"dialog_close();\">";
		bindStandardButtons=false;
	}

	if (options.type==='login') {
		// found in with the details dialog.
		newclass='details';
		var deets=login_dialog(); // in app.js
		title='<i class=\"fa fa-user\"></i> Login to alldone.io';
		text=deets.html;
		buttons="<input type=button value=\"Login\" id=\"dialog_login\"> <input type=button value=\"Sign up\" id=\"dialog_signup\">";
		bindStandardButtons=false;
		bindOverlay=false;
	}

	if (options.type==='lists') {
		// found in with the details dialog.
		newclass='details';
		var deets=lists_dialog(); // in app.js
		title='<i class=\"fa fa-question-circle\"></i> Select a list';
		text=deets.html;
		buttons="<input type=button value=\"Select\" id=\"dialog_select\"> <input type=button value=\"Create\" id=\"dialog_create\">  <input type=button value=\"Log out\" id=\"dialog_logout\">";
		bindStandardButtons=false;
		if (options.allow_close) {
			bindOverlay=true;
			buttons+=" <input type=button value=\"Cancel\" id=\"dialog_cancel\" onclick=\"dialog_close();\">";
		} else {
			bindOverlay=false;
		}

		buttons+="<div style=\"margin-top:5px;\"><input type=\"checkbox\" id=\"alwaysopen\"> <label for=\"alwaysopen\">Always open this list first</label></div>";

	}

	if (options.type==='error') {
		newclass='question';
		title='<i class=\"fa fa-frown-o \"></i> '+options.title;
		text=options.text;
		buttons='<input type=button value=\"Okay\" id=\"dialog_okay\">';
		bindOverlay=true;
		bindStandardButtons=true;
	}

	if (options.type==='still_saving') {
	newclass='question';
	title='<i class=\"fa fa-cog fa-spin\"></i> Please wait';
	text='Still saving changes. Try again in a moment!';
	buttons='<input type=button value=\"Okay\" id=\"dialog_okay\">';
	bindOverlay=true;
	bindStandardButtons=true;
	}

	if (options.type==='magic') {
		newclass='question';
		title='<i class=\"fa fa-cog fa-spin\"></i> Performing magic <i class=\"fa fa-magic\"></i>';
		text='Updating: '+options.subtext;
		buttons='';
		bindOverlay=false;
		bindStandardButtons=false;
	}

	// Set  items.
	$('#dialog div.title').html(title);
	$('#dialog div.content').html(text);
	$('#dialog div.buttons').html(buttons);

	$("#dialog").addClass(newclass);

	$('#overlay').show();
	$('#dialog').show();

	if (bindOverlay) { $( '#overlay' ).click(function() { dialog_close(); }); }
	if (bindStandardButtons) { $( '#dialog_okay' ).click(function() { dialog_close(); }); }

	if (focusButton!=='') {
		setTimeout(function(){ $('#'+focusButton).focus(); }, 10);
	}

}

function dialog_close() {
	$("#dialog").removeClass();
	$('#dialog').hide();
	$('#overlay').hide();
	$( '#overlay, #dialog_cancel, #dialog_delete, #dialog_okay' ).unbind( "click" );	
}

/* hoverpop-expander */
function hover_pop(e) {

	// get breadcrumbs
	var bc = breadcrumb_explosion($('#'+e).attr('breadcrumbs'));
	var todo = todo_from_bc(bc);

	console.log(todo);

}
