/* loadermabobs */
var login={};

var uri='http://82.8.225.110/alldone.io/api/';

//var uri='http://www.alldone.io/api/';
var homeuri='http://www.alldone.io/';
var update_notify_count=0;
var runtime='none';

function alldone_login(user,pswd) {

var obj={'request':'login',
		 'user':user,
		 'pswd':pswd};

$('#updating').show();

  var jqxhr = $.post( uri, obj)
  .done(function( data ) {
   
    app_login_complete(jQuery.parseJSON(data));

  	$('#updating').hide();
  })
  .fail(function(xhr, textStatus, errorThrown) {
  	 $('#updating').hide();
    alert(xhr.responseText);
    alert(textStatus);
  });

}

function alldone_grab(slashid) {

// accepts username/blah

var obj={'request':'grab',
		 'session':login.session,
		 'uid':login.uid,
		 'list':slashid};

$('#updating').show();

  var jqxhr = $.post( uri, obj)
  .done(function( data ) {
  
    app_grab_complete(jQuery.parseJSON(data));

  	$('#updating').hide();
  })
  .fail(function() {
  	 $('#updating').hide();
    alert( "error" );
  });

}


function alldone_update_notify() {

	// We don't want to hammer the server, so wait some seconds
	// and restart the counter if we are notified again!

	if (!public_use) {

		update_notify_count++;
		var check = update_notify_count;

		$('#updating').show();
		

		setTimeout(function(){						
						if (update_notify_count===check) {
							alldone_update();
						}
					}, 1000);

	}

}

function alldone_update() {

	update_notify_count=0;

	var prep_data={todo_list:todo_list,
				   colourscheme:user_options.colourscheme,
           mode:user_options.mode};
	
	var obj={'request':'update',
		 'session':login.session,
		 'uid':login.uid,
		 'owner':todo_owner,
		 'uri':todo_title,
		 'data':JSON.stringify(prep_data)};

     console.log(prep_data);

  var jqxhr = $.post( uri, obj)
  .done(function( data ) {    

    $('#updating').hide();

    var json=jQuery.parseJSON(data);


    if (json.result===0) {
    	if (json.error==='login') { 
    		if (runtime==='app') {
    			login={};
    			app_boot();
    		} else {
    			alert('please login again!');
    		}
    	} // reset
	}

  })
  .fail(function() {
    dialog({type:'error',title:'Error saving', text:'Error saving data.'});
    $('#updating').hide();
  });

	

}

// session-ma-bobs
function load_session() {

	if (localStorage.getItem("alldone_session") === null) { 
		login={};
	 } else {		
		login=jQuery.parseJSON(localStorage.alldone_session);
	}

}

function update_session() {		
	 localStorage.alldone_session = JSON.stringify(login);
}

