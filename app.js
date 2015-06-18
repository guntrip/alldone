/*
 *	Self contained version, includes site functionality
 *  and loads differently.
 *
 *	For apps and desktop versions.
 *
 */

 var cached_lists=[];
 runtime='app';

 $( window ).load(function() {	

 		app_boot();

		//first_load=true;
		//redraw([]);
		//alert(':D');
});

 function app_boot() {

 // load_session();

  if ( (login) && (login.session) && (login.uid) ) {

  		// list lists!
  		if (!login.always_open) {
  			app_lists(false);
  		} else {
  			alldone_grab(login.always_open);
  		}

  } else {
 		app_login();
  }

 }

 function app_login() {

 	// launch dialog
 	dialog({type:'login'});

 	// bind buttons
 	$( '#dialog_login' ).click(function() { 
 		alldone_login( $('#login_email').val(), $('#login_password').val());
 	}); 


 	$( '#dialog_signup' ).click(function() { 
 		alert('[beta] please go to http://www.alldone.io/ to sign up :)');
 	});


 }

 function app_login_complete(data) {
 	
 	if (data) {

	 	if (data.result===0) {

	 		 dialog_close();
	 		 dialog({type:'error', title:'Login', text:'Login failed. Please try again!'});
	 		 $( '#dialog_okay' ).click(function() { 
	 		 	dialog_close();
	 		 	app_login();
	 		 });

	 	} else {

	 		// save session and move on..
	 		login.session=data.session;
	 		login.uid=data.uid;
	 		update_session();
	 		dialog_close();
	 		app_boot();

	 	}


 	} else {
 		alert(data);
 	}

 }

 function login_dialog() {

 	var html="";

 	html += '<div class=fieldset>';
	html += '<label>Email</label>';
	html += '<input type=email id=login_email value="">';
	html += '</div>';

	html += '<div class=fieldset>';
	html += '<label>Password</label>';
	html += '<input type=password id=login_password value=>';
	html += '</div>';

 	return {html:html};

 }

 function app_lists(allow_close) {

 	var obj={'request':'lists',
		 'session':login.session,
		 'uid':login.uid};

	$('#updating').show();

	  var jqxhr = $.post( uri, obj)
	  .done(function( data ) {
	    

	    var json = jQuery.parseJSON(data);
	   
	    if (json.result===1) {

	    	cached_lists=json.data;

	    	dialog({type:'lists', allow_close:allow_close});


		 	// bind buttons
		 	$( '#dialog_select' ).click(function() { 
		 		//alldone_login( $('#login_email').val(), $('#login_password').val());
		 		lists_dialog_select();
		 	}); 


		 	$( '#dialog_create' ).click(function() { 
		 		alert('[beta] please go to http://www.alldone.io/ to create lists');
		 	});

		 	$( '#dialog_logout' ).click(function() { 
		 		dialog_close();
		 		login={};
		 		update_session();
		 		app_boot();
		 	});

	    } else {

	    	 if (json.error==='login') { login={}; app_boot(); } // reset

	    	 dialog({type:'error', title:'Error', text:'Unable to fetch lists. Click okay to try again.'});
	 		 $( '#dialog_okay' ).click(function() { 
	 		 	dialog_close();
	 		 	app_boot();
	 		 });

	    }

	  	$('#updating').hide();
	  })
	  .fail(function() {
	  	 $('#updating').hide();
	     alert('error connecting to server');
	  });

 }

 function lists_dialog() {

 	var html = "<select size=10 id=dialog_list>";

 		$.each(cached_lists, function (key, value) {

			html += "<option value=\""+value.username+"/"+value.uri+"\">/"+value.username+"/"+value.uri+"</option>";

		});

 	html += "</select>"

 	return {html:html};

 }

 function lists_dialog_select() {

 	var load = $('#dialog_list').val();

 	if (load!=="") {

 		alldone_grab(load);

 		if($("#alwaysopen").is(':checked')) {
 			login.always_open=load;
 		} else {
 			login.always_open=false;
 		}

 		update_session();

 	}

 }

 function app_grab_complete(data) {

 	if (data) {

 		if (data.result===1) {

 			public_use=false
			read_only=false;

 			// list still needs to be parsed as it will
 			// still be text.
 			todo_data=jQuery.parseJSON(data.list_data);

 			// SET UP 		
 			if ((load_permission==8)||(load_permission==9)||(load_permission==1)) { public_use=true; }
			if ((load_permission==8)||(load_permission==1)) { read_only=true; }

 			todo_title = data.uri;
			todo_owner = data.owner;

 			todo_list = todo_data.todo_list;	
			user_options.colourscheme = todo_data.colourscheme;

			first_load=true; // triggers magic.etc
			redraw([]);

			// and continue..
			dialog_close();
 			

 		} else {

 			dialog({type:'error', title:'Error', text:'Unable to load that list. Please try again or contact alldone.io support.'});
	 		 $( '#dialog_okay' ).click(function() { 
	 		 	dialog_close();
	 		 	app_boot();
	 		 });

 		}

 	}

 }

 function app_window_update() {
 	window.title="/"+todo_owner+"/"+todo_title;
 }