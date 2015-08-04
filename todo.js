/*
 *  ---- referencing in JS:
 *		
 *		id: <ul id=crumbs-X> and <li id=item-X-Y>
 			-- X is the level of <ul>s this stands at. From crumbs-0 for the main list and up.
 			-- Y is the index within a list.

 		breadcrumbs: <ul breadcrumbs=x-3-5> <li breadcrumbs=x-3-5-1>
 			-- actual full location within the json object
 			-- useful for for linking an event with the data but unhelpful
 			   as cannot be referenced.
 *
 */

 /* setup and common  =============================== */

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$( window ).resize(function() {	
	sizeup();
});

 var todo_list = [], open_breadcrumbs=[], old_breadcrumbs=[], form_history=[], scroll_history=[], form_count=0;

 var multi_crumbs=[], multi_crumbs_text=[]; // Allow multiple breadcrumbs to remain open in vertical mode.

 var recursive_fetched={}, open_edit=false, sort_mode=false, pause_redraw=false, custom_context=true;

 var user_options={fullscreen:false,
 				   colourscheme:'slate',
 				   editmode:false,
 				  };

var vert_indent = 40;

var session=0,this_user=-1;

var first_load=false, thar_be_magic=false, load_from_var=false, public_use=false, read_only=false;

var callbacks=[],redrawing=[];

var todo_blank = {title:'',
 				   unique:0,
 				   tags:{},
 				   details:'',
 				   done:false,
				   icon:'',
				   dateSet:0,
				   dateDue:0,
				   dateComplete:0,
				   children:[]};

var todo_title="list", todo_owner='';

var todo_list = [];

function callback(set, what) {

	if (set) {
		callbacks.push(what);
	} else {

		if (callbacks.length>0) {

			// Run callbacks..
			$.each(callbacks, function (key, value) {

				// New item added, focus the text box.
				if (value.method==='focus_new') {				
					
					setTimeout(function(){ 
						// gives dom a chance to update, autosize fires on
						// focus and needs a set width().						
						$('ul[breadcrumbs="'+value.id+'"] textarea.new').val(''); 
						$('ul[breadcrumbs="'+value.id+'"] textarea.new').focus(); 
						//$('#'+value.id+' textarea.new').focus(); 
					}, 1);
					
				}

				// Next callback here

			});

			callbacks=[]; // clear.

		}

	}

}

/* list drawing =============================== */

function draw_list(crumbs) {

	/*
     * Draws one pane of todos based on crumbs, which is a subset of the open_breadcrumbs. get_breadcrumbs()
     * moves through todo_list until it reaches the end. This seems impractable but allows the bottom level
     * to be drawn in the same way, as it has no index, it is the array!
	 */


	// Get either root or the children of the right level!
	var drawList = get_breadcrumbs(crumbs), crumbIndex = crumbs.length;

	var text_bc=textualize_breadcrumbs(crumbs);
	match_isopen_cache(); // textualise the multi crumbs and cache.

	var ulClass='horizontal', ulStyle='';

	if (user_options.mode==='vertical') {
		ulClass='vertical';
		ulStyle='margin-left: '+(vert_indent * crumbIndex)+'px;';
	}


	// Draws list at the level it is handed.
	var html = "<ul class=\"list "+ulClass+"\" style=\""+ulStyle+"\" id=\"crumbs-"+(crumbIndex)+"\" breadcrumbs=\""+text_bc+"\">";

	// Draw header
	if (crumbIndex===0) {
		// Menu		
		html += "<li class=\"static list_header\">";

			if (runtime=='app') {
			html += "<div class=\"mainmenu app\" title=\"load lists or log out\"><i class=\"fa fa-bars\"></i></div>";
			}
			if (runtime=='web') {
			html += "<div class=\"mainmenu web\" title=\"back to alldone.io\"><i class=\"fa fa fa-arrow-left\"></i></div>";	
			}

		html += "/"+todo_owner+"/"+todo_title;
		if (!read_only) { html += "<div class=\"settings\" title=\"colour and settings\"><i class=\"fa fa-cog\"></i></div>"; }
		html += "<div class=\"controls\">";
		if (thar_be_magic) { html += "<div class=\"magic_refresh\" title=\"refresh magic\"><i class=\"fa fa-magic\"></i></div>";  }
		html += "<div class=\"json_view\" title=\"modify json\"><i class=\"fa fa-file-code-o\"></i></div>";
		
		if (!read_only) {
			html += "<div class=\"sort_toggle";
			if (sort_mode) { html += " on"; }
			html += "\" title=\"reorder\"><i class=\"fa fa-sort\"></i></div>";
		}

		html += "</div></li>";
	} else {
		// Grab previous title
		var parent_todo = fetch_todo(crumbs);
		html += "<li class=\"static list_header close_header\"><i class=\"fa fa-arrow-left\"></i> "+parent_todo.title+"</li>";
	}

	// Draw items
	for (i = 0; i < drawList.length; i++) { 
		
		var item = drawList[i];

		var sublist = [];
		if  (user_options.mode=='vertical') { sublist = match_sublist(multi_crumbs, i); }
		
		html += draw_list_item(item, crumbIndex, i, text_bc, crumbs);

		// Are we in vertical mode, and is this one.. open?
		if (user_options.mode=='vertical') {

			var drawSubList=false;
	
			if (isNumber(redrawing[crumbIndex])) { // the level of the breadcrumbs we're at
				if ((redrawing[crumbIndex]===i)) { // does it match this index?
					//drawSubList=true;
				}
			}

			if (sublist.hit) { drawSubList=true; } // Is it open as a sublist?

					// Making this a recursive function was painful, we 
					// now hand over to draw_list_vertical_sub() to do
					// the next bit

			if (drawSubList) { html += draw_list_vertical_sub(item, i, crumbIndex, text_bc, crumbs, sublist.list); }

		}

	}

	// Draw new
	if (!read_only) {
		html += draw_list_input(crumbIndex, text_bc);
	}

	html += "</ul>";


	return html;

}

		// Sub functions for drawing
		function draw_list_item(item, crumbIndex, itemIndex, text_bc, crumbs) {

			/* item: json object to draw
			   crumbIndex: how many levels we are in (for the id attr)
			   itemIndex: where this item exists in this level (for the id attr)
			   text_bc: the x-4-1-3 breadcrmbs. We add the itemIndex for this reference.
			   crumbs: crumbs handed down from previous function */

		var this_bc = text_bc+"-"+itemIndex;

		// Is it open?
		var liclass="";	
		if (match_isopen(this_bc)) { liclass="open"; }

		var html = "<li id=\"item-"+crumbIndex+"-"+itemIndex+"\" class=\""+liclass+"\" breadcrumbs=\""+this_bc+"\">";

		if (item.editing) {
			//html += '<input class=\"edit\" value=\"'+item.title+'\">';			
			html += "<div class=\"more editing_force\"><i class=\"fa fa-cog fa-fw\"></i></div>";
			html += '<textarea class=\"edit\" type=\"text\" id=\"new-"+crumbIndex+"\" rows=1>'+item.title+'</textarea>';
		} else {
			html += "<div class=\"checkbox\">"+checkbox_please(item.done)+"</div>";
			html += "<label>"+item.title;
			if ( (item.tags) && (item.tags.length>0) ) {
				$.each(item.tags, function(i, val) {
				html += "<div class=\"tag\">"+val+"</div>";
				});
			}
			html += "</label>";
		}

		if (item.children) { 

			var expandCss='expand', arrowDir='right';
			// Is it open?			
			if (isNumber(redrawing[crumbIndex])) { // the level of the breadcrumbs we're at
				if (redrawing[crumbIndex]===i) { // does it match this index?
					expandCss='contract';
					arrowDir='right';
				}
			}

			if (item.editing) {expandCss+=' editing_force';}

			var countDisplay=count_my_children(item.children);
		
			if ((item.children.length>0)||(user_options.editmode)) {
			html += "<div class=\"count\">"+style_count_my_children(countDisplay)+"</div>";
			}

		}

		if ( (!user_options.editmode) && (!read_only) ) {
		html += "<div class=edit_button><i class=\"fa fa-pencil fa-fw\"></i></div>";
		}

		html += "</li>";

		return html;

		}

		function draw_list_input(crumbIndex, text_bc) {
			var html = "<li class=\"static\">";
			html += "<div class=\"checkbox disabled\">"+checkbox_please(false)+"</div> <textarea class=\"new\" type=\"text\" id=\"new-"+crumbIndex+"\" breadcrumbs=\""+text_bc+"\" rows=1></textarea>";
			html += "</li>";

			return html;	
		}

		function draw_list_vertical_sub(item, thisIndex, crumbIndex, text_bc, crumbs, sublist) {

				// +1 and add references for this level. Recursive magic.
				var crumbIndexIncrem = crumbIndex + 1, text_bcIncrem = text_bc + '-' +thisIndex, countIndex = 0;

				var html = "<li id=\"vert-crumbs-"+(crumbIndexIncrem)+"\">";

				html += "<ul class=\"list vertical crumbs-"+(crumbIndexIncrem)+"\" style=\"margin-left: "+(vert_indent)+"px;\" id=\"crumbs-"+(crumbIndexIncrem)+"\" breadcrumbs=\""+text_bc+"\">";
			
				$.each(item.children, function (key, value) {

					// Draw item.
					html += draw_list_item(this, crumbIndexIncrem, countIndex, text_bcIncrem, crumbs);

					// Collect a new sub breadcrumbs list, starting with any that match the
					// current count index.
					var new_sublist = match_sublist(sublist, countIndex), drawSubList=false;
		
					// Is this one open? We can recursively draw sublists.
					if (isNumber(redrawing[crumbIndexIncrem])) { // the level of the breadcrumbs we're at					
						if (redrawing[crumbIndexIncrem]===countIndex) { // does it match this index?	
						//drawSubList=true;
						}
					}		

					if (new_sublist.hit) { drawSubList=true; }

					if (drawSubList) { html += draw_list_vertical_sub(this, countIndex, crumbIndexIncrem, text_bcIncrem, crumbs, new_sublist.hit); }
					

					countIndex++; // keeping track of this index, important for referencing.
				});

				// Input
				if (!read_only) {					
					html += draw_list_input(crumbIndexIncrem, text_bcIncrem);
				}

			html += "</ul></li>";

			return html;

		}

function match_sublist(multi, match) {

	// If we can find match at [0], then we know that level
	// is open. Return a new
	// multibreadcrumbs starting at the next level.
	// this is handed down recusrively.

	var multi_return = [], hit=false;

	$.each(multi, function (i, val) {

		// OR statement because else if index is 0, JS returns false.
		if ( ((val[0])||(parseInt(val[0])===0)) &&( val[0]==match ) ) {
			
			// chop off the first and add that.	
			var n = val.slice();	
			n.splice(0, 1);		
			multi_return.push(n);

			// set boolean
			hit=true;

		}

	});

	return {list: multi_return, hit:hit};

}

function match_isopen_cache() {

	// Saves running textualize_breadcrumbs() on the entire multi_crumbs
	// list every time. Caches it and then match_isopen compares with that.

	multi_crumbs_text = [];
	$.each(multi_crumbs, function(i, val) {
		multi_crumbs_text.push(textualize_breadcrumbs(val));
	});	

}

function match_isopen(text_bc) {
	
	// Is text_bc from the current <li> in the cached
	// multi_crumbs_text array? return TRUE.

	var match = false;

	$.each(multi_crumbs_text, function(i, val) {

		if (text_bc===val) { 
			match = true;
		}

	});

	return match;
}


function get_breadcrumbs(crumbs) {

	// helper for draw_list
	// crumbs: array of indexes
	// return: todo_list at that point, .children if it's not the root.

	var now = todo_list;

	// Loop through crumbs, val is each index
	$.each(crumbs, function(i, val) {
		if (now[val]) {
			if (now[val].children) { // Is there children? Update now and carry on!
				now = now[val].children;
			}
		} else {
			console.log('ERROR could not read '+val+' of:');
			console.log(now);
		}
	});

	return now;

}

function textualize_breadcrumbs(crumbs) {
	var txt='x';
	$.each(crumbs, function(i, val) {
		txt+='-'+val;
	});
	return txt;
}

function count_my_children(items) {

	// count non-done children!
	var cDone=0, cNotDone=0;
	$.each(items, function(i, val) {
		if (val.done) {
			cDone++;
		} else {
			cNotDone++;
		}
	});

	return cNotDone;

}

function style_count_my_children(count) {
	if (count===0) {
		return "<i class=\"fa fa-check\"></i>";
	} else {
		return count;
	}
}

/* open and close lists =============================== */

//function expand(id) {
function expand(e) {

	// Set open_breadcrumbs to be the clicked item!
	var bc = breadcrumb_explosion($(e).attr("breadcrumbs"));

	if (user_options.mode==='vertical') {

		// Add to multibreadcrumbs.
		multi_crumbs.push(bc);

	}

	// draw!
	redraw(bc);

}

function close(e) {

	// Get bc of clicked closer, lop off one.
	var bc = breadcrumb_explosion($(e).attr("breadcrumbs"));

	if (user_options.mode==='vertical') {

		close_multi(bc);

	} else {

		bc.splice(-1,1);
		multi_crumbs=[];

	}
	redraw(bc);

}

function close_multi(bc) {

	// grep through multi_crumbs
	multi_crumbs = $.grep(multi_crumbs, function (el, i) {

		// Compare with bc (the closed item's crumbs), if there's a match
		// for the length of bc, then we remove that (return false)
		var match = true;

		for (i = 0; i < bc.length; i++) { 

			if ((el[i])||(parseInt(el[i])===0)) { // exists OR is 0.

				if ( bc[i]!==el[i]) {
					match=false;
				}

			} else {
				match=false;
			}

		}

	if (match) { return false; } // wonderful and clear..
    
    return true;

	});

}

function array_equal(a,b) {

	var is_same = (a.length == b.length) && a.every(function(element, index) {
    return element === b[index]; } );

    return is_same;

}



/* top level functions (ui>todo interactions) =============================== */

function check(e, event, bc_hack) {

	var bc = breadcrumb_explosion($(e).parent().attr("breadcrumbs"));

	var this_todo = todo_from_bc(bc);

	if (this_todo) {

		if(this_todo.done) {
			this_todo.done=false;
		} else {
			this_todo.done=true;
		}

	pause_redraw=true;
	save_to_bc(bc, this_todo);
	pause_redraw=false;

	// update checkbox now
	$('#'+$(e).parent().attr("id")+' div.checkbox').html(checkbox_please(this_todo.done));

		// Do all of them...?
		if (event.shiftKey) {
		recurse_todo(bc, {done_set:true, done:this_todo.done});
		}

	alldone_update_notify();

	update_count(bc);

	}

}


function add(e) {
	// adds a todo!
	if (e) {
		
		// Set values
		var title = $(e).val();

		if ($.trim(title)!=="") {

			// Get location
			var id = $(e).attr("id");
			var bc = $(e).attr("breadcrumbs");
		
				// grab parent for later!
				var parent_ul=$(e).closest( "ul" ).attr("breadcrumbs");

				// Set callback for focusing
				callback(true, {method:'focus_new', id:parent_ul});	

			var id_split = id.split("-");
			var bc_location=id_split[1]; // What breadcrumb step.

			// Build new object
			var new_todo = todo_blank;
			new_todo.title=title;

			// Add
			add_todo(new_todo, breadcrumb_explosion(bc));

			alldone_update_notify();

		}

	}	
}

function modify(e) {
	// updates a todo!
	if ( (e) && (!sort_mode) ) {

		// Is an input already open? If so, close it.
		if (open_edit) { modify_save_open(); }

		// Get location
		var id = $(e).parent().attr("id");
		var id_split = id.split("-");
		var bc_location=id_split[1]; 
		var bc_index=id_split[2];

		var bc = breadcrumb_explosion($(e).parent().attr("breadcrumbs"));

		open_edit=e;
		//modify_todo({editing:true, editingUpdate:true}, bc_location, bc_index);
		modify_todo({editing:true, editingUpdate:true}, bc);

		
		// Bind all clicks to save:
		$( 'body' ).click(function(event) {	
			var saveChanges=false;
			if(!$(event.target).closest('#'+id).length) {
				modify_save_open();
			}			
		});

		$( '.editing_force' ).click(function() {	
			modify_save_open();
		});

		// Try and select the input
		$('#'+id+' textarea.edit').focus();
		$('#'+id+' textarea.edit').select();
			

	}
}

function modify_save_open() {

	if (open_edit) {

		// Get location of item stored in open_edit.
		var id = $(open_edit).parent().attr("id");
		var id_split = id.split("-");
		var bc_location=id_split[1]; 
		var bc_index=id_split[2];

		var bc = breadcrumb_explosion($(open_edit).parent().attr("breadcrumbs"));

		// Get edit contents
		var newTitle=$('#'+id+' textarea.edit').val();
		var modifications=todo_from_bc(bc);

		if ($.trim(newTitle)!=="") { 

			
			modifications.title=newTitle;

			// Switch off editing
			pause_redraw=true;
			//modify_todo({editing:false, editingUpdate:true}, bc_location, bc_index);
			modify_todo({editing:false, editingUpdate:true}, bc);
			pause_redraw=false;

			// Modify the todo
			//modify_todo(modifications, bc_location, bc_index);
			modify_todo(modifications, bc);

			alldone_update_notify();

		} else {
	
			if ((modifications.children)&&(modifications.children.length>0)) {
				
				$('#'+id+' textarea.edit').val('');

				dialog({type:'delete_with_children'});

				$( '#dialog_delete' ).click(function() {	
				// same as below..
			    var bc_parent=breadcrumb_removelast(bc);
				var bc_del_target=breadcrumb_returnlast(bc);
				todo_list = recursive_magic(bc_parent, 0, 'delete', {target:bc_del_target}, todo_list);
				todo_list=recursive_tidy(todo_list);
				redraw(open_breadcrumbs);
				dialog_close();	
				alldone_update_notify();
				});

				$( '#dialog_cancel, #overlay' ).click(function() {
				modify_todo({editing:false, editingUpdate:true}, bc);
			    open_edit=false;	
			    dialog_close();	
				});

			} else {

				// Just delete innit.
				var bc_parent=breadcrumb_removelast(bc);
				var bc_del_target=breadcrumb_returnlast(bc);
				todo_list = recursive_magic(bc_parent, 0, 'delete', {target:bc_del_target}, todo_list);
				todo_list=recursive_tidy(todo_list);
				redraw(open_breadcrumbs);
				alldone_update_notify();
			}

		}
		
		

		// Remove click trigger.
		$( 'body' ).unbind( "click" );
		$( '.editing_force' ).unbind( "click" );
		open_edit=false;

	}

}

// dragging is setup in design.js and sorted() is in data.js

function update_count(bc) {

	// Something has been ticked, can we update the parent's count &
	// potentially, tick that too if it's all complete?

	// lop one off the breadcrumbs.
	bc = breadcrumb_removelast(bc);

	if (bc.length>0) {

		// grab that todo
		var todo = todo_from_bc(bc);

		// grab the count
		if (todo.children) {
			
			var newCount = count_my_children(todo.children);

			// Update count blob if it exists, if not the
			// next redraw will get it.
			var aim = '#item-'+(bc.length-1)+'-'+bc[bc.length-1];
			//if (newCount===0) {
			//	$(aim+' div.count').hide();
			//} else {
				$(aim+' div.count').show();
				$(aim+' div.count').html(style_count_my_children(newCount));
			//}
			//$().css('background-color','lime');
			//console.log('#item-'+(bc.length-1)+'-'+bc[bc.length-1]);

			// Check about passing the check up!
			if (todo.children.length>0) {
				
				if (newCount==0) { //all done! :D

					// check
					if (!todo.done) { $(aim+' div.checkbox').trigger('click'); }

				} else {

					// uncheck
					if (todo.done) { $(aim+' div.checkbox').trigger('click'); }

				}

			}

		}

	}

}


// JSON modify!
function json_mod_start() {
	$('#overlay').show();
	$('#json_jazz').show();

	var json_string=JSON.stringify(todo_list, null, 4);
	$('#json_jazz > textarea').val(json_string);
}

function json_mod_save() {

	var new_json;
	  try {
	    new_json = jQuery.parseJSON($('#json_jazz > textarea').val());
	    todo_list=new_json;		
	    redraw([]);
		json_mod_cancel();
		alldone_update_notify();
	  } catch (e) {
	    // error
	    console.log(e);
	    alert('Error parsing the JSON\r\n"'+e.message+'"\r\n(Error also visible in console).');
	    return;
	  }

	//var new_json=jQuery.parseJSON( $('#json_jazz > textarea').val() );
	
}

function json_mod_cancel() {
	$('#overlay').hide();
	$('#json_jazz').hide();
}

/* beta stress test */
var stress_test_total=0;
function stress_test() {

var r = confirm("Stress Test.\n\rThis will create nearly 20,000 items and also overwrite your current to do list. Proceed?");
if (r == true) {

	// Creates a giant horrible long todo list object, about 20,000 objects.
	var n = [];
	var steps=0;

	console.log('STARTING');
	n=stress_test_sub(n, 0);

	todo_list=n;
	redraw([]);

	console.log('Done. Made '+stress_test_total+' items... sorry.');

}

}

function stress_test_sub(n, steps) {

	var i=0;

	for (i = 0; i < 7; i++) { 

		if(steps===0) {console.log(i+'/6');}

		var n_td=clone_item(todo_blank);
		n_td.title=Math.floor((Math.random() * 10000) + 1);
		n_td.title=n_td.title.toString();

		n[i]=n_td;
		stress_test_total++;

		if (steps<4) {
			n[i].children=stress_test_sub(n[i].children, (steps+1));
		}

	}

	return n;

}