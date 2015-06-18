/* Web only */

runtime='web';

$( window ).load(function() {	

	if ((load_from_var)&&(load_item)) {

		public_use=false
		read_only=false;

		// Collect session!
		login.session=get_cookie();
		login.uid=load_uid;

		// ALL THE LOADING BITS NEED TO GO INTO
		// APP.JS --> app_grab_complete() complete too.

		if ((load_permission==8)||(load_permission==9)||(load_permission==1)) { public_use=true; }
		if ((load_permission==8)||(load_permission==1)) { read_only=true; }

		if ( (!login.session) && (!public_use) ) { 
			dialog({type:'error',title:'Error', text:'Session not present. Please retry.'});
			return 0;
		}

		
		todo_list = load_item.todo_list;
		todo_title = load_title;
		todo_owner = load_owner;

		user_options.colourscheme = load_item.colourscheme;

		first_load=true;
		redraw([]);

	} else {
	dialog({type:'error',title:'Error', text:'Data not present. Please retry.'});	
	}

});

function get_cookie() {

	var coo=document.cookie.split(';'), r=0;

	$.each(coo, function (key, value) {
		   var trimmed=$.trim(value);
		   var t=trimmed.split('=');
		   if (t[0]==='alldone') {
		   		var s = decodeURIComponent(t[1]);
		   		r = s.split('^');
		   		r = r[1];
		   }

	});

	return r;

}