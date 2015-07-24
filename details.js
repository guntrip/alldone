var details_open_bc=[];

/*
 Ideas for magic:
	
  * Github issues (done for public repos)
  * Any JSON (require at least title and an id)
  * CSV
  
*/

function details_dialog(e) {

	dialog({type:'details', item:e});

	autosize($('#dialog .fieldset textarea'));

	$( '#dialog_update' ).click(function() { details_dialog_save(); });
		
}

function details_dialog_gen(e) {

	var obj={}, html='';

	details_open_bc = breadcrumb_explosion($(e).parent().attr("breadcrumbs"));
	var todo=todo_from_bc(details_open_bc);

		// split tags.
		var fleep="";
		if (todo.tags) {
			$.each(todo.tags, function (key, value) {
			if (fleep!=="") {fleep+=", ";}
			fleep+=value;
			});
		}

		html += '<div class=fieldset>';
		html += '<label>Tags</label>';
		html += '<input type=text id=details_tags value="'+fleep+'">';
		html += '</div>';

		var deets="";
		if (todo.details) {
			deets=todo.details;
		}

		html += '<div class=fieldset>';
		html += '<label>Details</label>';
		html += '<textarea rows=1 id=details_details>'+deets+'</textarea>';
		html += '</div>';

		var magic = {};
		if (todo.magic) { magic = todo.magic; }
		var magic_text = JSON.stringify(magic, null, 4);

		html += '<div class=fieldset>';
		html += '<label>Magic</label>';
		html += '<textarea rows=1 id=details_magic>'+magic_text+'</textarea>';
		html += '</div>';

	obj.html=html;

	return obj;

}

function details_dialog_save() {

	// Grab the todo
	var todo=todo_from_bc(details_open_bc);

	// tags
	todo.tags={};
	var tag_input=$('#details_tags').val();
	if (tag_input!=="") {
		var split=tag_input.split(",");
		$.each(split, function (key, value) {
			split[key]=$.trim(value);
		});
	todo.tags=split;
	}

	// details
	var details_input=$('#details_details').val();
	todo.details=details_input;

	// magic
	var magic_input=$('#details_magic').val();
	var new_json={};
	  try {
	    new_json = jQuery.parseJSON(magic_input);	
	    if (magic_input!=="{}") { window.thar_be_magic=true; }
	  } catch (e) {
	    // error
	    alert('Sorry, there was an error parsing your magic json!');
	    return;
	  }

	 todo.magic=new_json;

	 // NOW SAVE!
	 save_to_bc(details_open_bc, todo);
	 dialog_close();
	 alldone_update_notify();


}


// SETTINGS
function settings_dialog() {

	dialog({type:'settings'});

	$( '#dialog_update' ).click(function() { settings_dialog_save(); });
		
}

function settings_dialog_gen() {

	var obj={}, html='';

		// Display mode
		html += '<div class=fieldset>';
		html += '<label>Mode</label>';
		html += '<select id=\"modeselect\">';

			html += "<option value=\"horizontal\""+selected_if_true("horizontal",user_options.mode)+">Horizontal</option>";
			html += "<option value=\"vertical\""+selected_if_true("vertical",user_options.mode)+">Vertical</option>";

		html += "</select>";
		html += '</div>';

		// Scheme
		html += '<div class=fieldset>';
		html += '<label>Scheme</label>';
		html += '<select id=\"colourscheme\">';

			html += "<option value=\"slate\""+selected_if_true("slate",user_options.colourscheme)+">Slate</option>";
			html += "<option value=\"purple\""+selected_if_true("purple",user_options.colourscheme)+">Purple</option>";

		html += "</select>";
		html += '</div>';


		// Edit mode
		html += '<div class=fieldset>';
		html += '<label>Editing</label>';
		html += '<select id=\"editing\">';

			html += "<option value=\"normal\""+selected_if_true(false,user_options.editmode)+">Normal mode</option>";
			html += "<option value=\"click\""+selected_if_true(true,user_options.editmode)+">Click to edit</option>";

		html += "</select>";
		html += '</div>';


		
	obj.html=html;

	return obj;

}

function settings_dialog_save() {

	var check = $('#colourscheme').val();
	user_options.colourscheme=check;

	var check = $('#modeselect').val();
	user_options.mode=check;console.log(check);

	check = $('#editing').val();
	if (check=='click') {
		user_options.editmode=true;
	} else {
		user_options.editmode=false;
	}

	redraw(open_breadcrumbs);
	dialog_close();
	alldone_update_notify();

}

// form bits
function selected_if_true(a,b) {
	if (a==b) { return " selected"; }
}