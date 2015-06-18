var magic_update=false;
var ajax_multi=0;

// Called to begin the process
function magic_scan_init() {

	magic_update=false;
	todo_list=magic_scan(todo_list, 0);	

}

// Tracks number of ongoing magics, updates once done.
function magic_attemptupdate() {
	// Has all AJAX come in? If so, give time for all
	// variables to make their way to todo_list and redraw.
	ajax_multi--;

	if (ajax_multi===0) {

		setTimeout(function(){ 	
			window.thar_be_magic=true;	
			redraw(open_breadcrumbs);
			dialog_close();
		}, 250);


	}
}

// Recusrive scan for magic.
function magic_scan(todo_list_mod, step) {

	var first_loop=false;
	if (step===0) { first_loop=true; }

	// Look for magical items.
	$.each(todo_list_mod, function (key, value) {

		if (value) {
			if ((value.magic)) {
				
				this.children=magic_process(value.magic, this.children);

			} else {
				if (value.children) {
					this.children = magic_scan(this.children, (step+1));
				}
			}
		}

	});


	return todo_list_mod;

}



/* magic processes */
function magic_process(magic, mod) {

	if ( (magic.list) && (magic.list==='github_issues') ) {
		mod=magic_github_issues(magic, mod);
	}

	return mod;

}


/* the magic processes */
function magic_github_issues(magic, mod) {

	var uri = "https://api.github.com/repos/"+magic.username+"/"+magic.repo+"/issues"
	var output=[];

	dialog({type:'magic', subtext:'Github Issues'});

	ajax_multi++;

	$.getJSON(uri, "" )
		.done(function( json ) {
		  
			$.each(json, function (key, value) {
				
				var newtodo=clone_item(todo_blank);

				// Search for it. We don't want to remove anything
				if (mod) {
					$.each(mod, function (key2, value2) {
						if (value2.unique==='git_'+value.id) {
							newtodo=clone_item(value2);
						}
					});
				}
				
				newtodo.title=value.title;
				newtodo.unique='git_'+value.id;

				output.push(newtodo);

			});

			magic_attemptupdate();
		  
		})
		.fail(function( jqxhr, textStatus, error ) {
		  var err = textStatus + ', ' + error;
		  dialog({type:'error',title:'Magic issues', text:'Error retrieving github issues from '+uri+' (error: '+err+')'});
		 		  
		});	

	//outside of this() scope.
	magic_update=true;

	return output;

}