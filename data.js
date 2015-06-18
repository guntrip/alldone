var recursive_hit=false;

/* bc level helpers: =============================== */

function todo_from_bc(bc) {

	// Returns full todo from a item-0-0 id.

	//var id_split = id.split("-");
	//var get_this = breadcrumbs_from_index(id_split[1],id_split[2]);

	recursive_fetched={};
	recursive_magic(bc, 0, 'fetch', {}, todo_list);	
	return recursive_fetched;

}

function save_to_bc(bc, todo) {

	// Overwrites id (item-0-0) with todo.

	//var id_split = id.split("-");
	modify_todo(todo, bc);

}


/* breadcrumb index level helpers ================= */

function add_todo(todo, bc) {

	// Adds todo at bc_location

	//var bc = breadcrumbs_from_index(bc_location, false);

	todo_list = recursive_magic(bc, 0, 'add', todo, todo_list);

	redraw(open_breadcrumbs);

}

//function modify_todo(todo, bc_location, bc_index) {
function modify_todo(todo, bc) {

	// Modifies todo on bc_location at bc_index.

	//var bc = breadcrumbs_from_index(bc_location,bc_index);
	todo_list = recursive_magic(bc, 0, 'mod', todo, todo_list);

	redraw(open_breadcrumbs);

}

function recurse_todo(bc, changes) {

	// Modifies todo on bc_location at bc_index.

	//var bc = breadcrumbs_from_index(bc_location,bc_index);
	todo_list = recursive_magic(bc, 0, 'recurse', changes, todo_list);

	redraw(open_breadcrumbs);

}

function fetch_todo(breadcrumbs) {

	// Fetch a todo from a specific point

	recursive_fetched={};
	recursive_magic(breadcrumbs, 0, 'fetch', {}, todo_list);
	return recursive_fetched;
}

/* hardcore data functions ============================== */

function recursive_magic(breadcrumbs, step, action, item, todo_list_mod) {

	/*
	 *	Move through the todo_list until it finds the target as defined by breadcrumbs and
	 *  does whatever is defined in action & item.
	 *
	 *	breadcrumbs: array of indexes, use breadcrumbs_from_index() to generate.
	 *  step: 0, used for recusrive functionality.
	 *	action: 'add', 'mod'
	 *	item: {object}
	 *	todo_list_mod: the todo_list, used for recusrive functionality
	 *
	 *	This function looks at each level and calls itself to delve deeper!
	 */

	// The recursive_hit var speeds thing up by skipping.
	if (step===0) { recursive_hit=false; }
	if (recursive_hit) { return todo_list_mod; }

	var action_mod=false;
	if ( (action==='mod') || (action==='fetch') || (action==='recurse') ) { action_mod=true; }

	// Are we on the final step of the breadcrumbs OR are we at a deadend?
	// A deadend probably means adding to this list.
	if ((step===(breadcrumbs.length))||(breadcrumbs.length===0)) {

		// Access the array.		
		if (action==='add') {
		todo_list_mod.push(clone_item(item));
		recursive_hit=true;
		return todo_list_mod;
		}

		if (action==='delete') {
		todo_list_mod[item.target].deleting=true;
		todo_list_mod[item.target].title=todo_list_mod[item.target].title+' DELETING';
		recursive_hit=true;
		return todo_list_mod;
		}

	} else {

		// Is the target actually in this list and are we at the very end? If so, if we're modding, do shit!
		if ( (todo_list_mod[breadcrumbs[step]]) && ((step+1)===(breadcrumbs.length)) && (action_mod) ) {

			// Access items.
			if (action==='mod') {
			todo_list_mod[breadcrumbs[step]]=mod_item(todo_list_mod[breadcrumbs[step]], item);
			recursive_hit=true;
			return todo_list_mod;
			}

			if (action==='fetch') {
			recursive_fetched = clone_item(todo_list_mod[breadcrumbs[step]]);
			recursive_hit=true;
			return todo_list_mod;
			}

			if (action==='recurse') {
				if (todo_list_mod[breadcrumbs[step]].children) {
				todo_list_mod[breadcrumbs[step]].children=recursive_child_update(todo_list_mod[breadcrumbs[step]].children, item);
				}
			}

		} else {

			// A bit hard to read, but rather than looping through, just jump in with the right breadcrumb!
			// Check item exists and that it has children, then run the function on those children.
			if ( (todo_list_mod[ breadcrumbs[step] ]) && (todo_list_mod[ breadcrumbs[step] ].children) /*&& (todo_list_mod[ breadcrumbs[step] ].children.length>0)*/ ) {
				todo_list_mod[ breadcrumbs[step] ].children =  recursive_magic(breadcrumbs, (step+1), action, item, todo_list_mod[ breadcrumbs[step] ].children);
			}

			// List through the todo_list_mod in memory
			/*$.each(todo_list_mod, function (key, value) {
			
				// Does the index (key) of this match the target?
				if ( (key==breadcrumbs[step]) ) {

					// Hopefully it has children, so continue the recusrive function by handing "this" to it,
					// meaning any changes propagate down! :)
					if (this.children) {

						//step++; // We now increase step in the function call.
						this.children = recursive_magic(breadcrumbs, (step+1), action, item, this.children);

					}

				}

			});*/

		}

	}

	return todo_list_mod; // fail

}


function recursive_tidy(todo_list_mod) {

	// Loops through, removes any deleting:true

	$.each(todo_list_mod, function (key, value) {

		if (value) {
			if (value.deleting) {
				todo_list_mod.splice(key,1);
				todo_list_mod=recursive_tidy(todo_list_mod);
			} else {
				if (value.children) {
					this.children = recursive_tidy(this.children);
				}
			}
		}

	});

	return todo_list_mod;

}


function recursive_child_update(todo_list_mod, changes) {


	$.each(todo_list_mod, function (key, value) {

		if (value) {
			
				if (changes.done_set) {
					this.done=changes.done;
				}

				if (value.children) {
					this.children = recursive_child_update(this.children, changes);
				}

		}
		
	});

	return todo_list_mod;

}

// Removes reference
function clone_item(i) {
	var io = $.extend(true,{},i);
	return io;
}

// Modifies w/cloning, allows for some quick updates (i.e. editing tag)
function mod_item(a,b) {
	//a: exisint
	//b: incoming
	var c=clone_item(a);

	if (b.editingUpdate) {
		c.editing=b.editing;
	} else {
		c.title=b.title;
		c.done=b.done;
		c.details=b.details;
		c.tags=b.tags;
		c.magic=b.magic;
	}
	
	return c;
}


// makes proper breadcrumbs from simple counts.
function breadcrumbs_from_index(steps,index) {
	//i: parent if we're adding
	//a: specific place
	var bc=[];
	for (i = 0; i < steps; i++) {
		if ((open_breadcrumbs[i])||(open_breadcrumbs[i]===0)) {
			bc.push(open_breadcrumbs[i]);
		}
	}
	if (isNumber(index)) { bc.push(parseInt(index)); }
	return bc;
}

// breadcrumb explosion!
function breadcrumb_explosion(t) {

	var split = t.split("-");	
	var r=[];

	for (i = 0; i < split.length; i++) {
		if (isNumber(split[i])) {
			r.push( parseInt(split[i]) );
		}
	}

	return r;
}

function breadcrumb_removelast(bc) {
	// lops off the last one.
	var bc_2=bc.slice();
	bc_2.splice(-1,1);
	return bc_2;
}
function breadcrumb_returnlast(bc) {
	// returns the last one.
	var bc_2=bc.slice();
	return bc_2[bc_2.length-1];
}


// Sorting bollocks:
function sorted(e, event, ui) {

	/*
	 *	This is a nightmare but kinda logical, the order is super important:
	 *
	 *	As we're recreating at the end, it's possible that the dragged item would be
	 *  recreated as a child and end up duplicated. We need to take steps to avoid that.
	 *
	 *	1. Collect the dragged item, save to 'dragged_item'
	 *	2. Mark the dragged item as deleting. Then recursive_tidy() will catch it even if recreated.
	 *	3. Collect all the other items in the destination list
	 *	4. Mark them as deleting.
	 *	5. Reinsert at destination level in order, switch to dragged_item when it's
	 * 	   id comes up.
	 *	6. Run recursive_tidy() to remove anything set to deleting.
	 *	7. Redraw.
	 *
	 */


	// User has asked to sort, collect the order of the destination.
	var newOrder = $( e ).sortable('toArray');

	// Set up some breadcrumbs now

		// Dragged item.
		/*var target= event.toElement;
		var targetid=$(target).attr("id");
		if (!targetid) { console.log('Sorting error. Did you drag a parent into child? Miss? Eek!'); redraw(open_breadcrumbs); return 0; } // bail!
		var id_split = targetid.split("-");
		var bc_dragged = breadcrumbs_from_index(id_split[1],id_split[2]);
		var bc_dragged_parent = breadcrumbs_from_index(id_split[1],false);*/

		//var target=event.toElement;
		var target=ui.item.context;
		
		var target=$(target).closest('li');
		var targetid=$(target).attr("id");
		if (!targetid) { 
			console.log('Sorting error. Did you drag a parent into child? Miss? Eek! (targetid: '+targetid+')');
			console.log(target);
			redraw(open_breadcrumbs); 
			return 0; 
			} // bail!
		
		var bc_dragged=breadcrumb_explosion($(target).attr("breadcrumbs"));
		var bc_dragged_parent=breadcrumb_removelast(bc_dragged);

		// Destination
		/*var crumbid=$(e).attr("id"); // the <ul>
		var id_dest_split = crumbid.split("-");
		var insert_bc=breadcrumbs_from_index(id_dest_split[1],false);*/

		var insert_bc=breadcrumb_explosion($(e).attr("breadcrumbs"));

	// Collect the dragged item
	recursive_fetched={};
	recursive_magic(bc_dragged, 0, 'fetch', {}, todo_list);	
	var dragged_item=recursive_fetched;

	// Now mark it as deleting so even recreated children get cleared.	
	if (!event.shiftKey) { // holding shift will duplicate! :D
	var bc_del_target=breadcrumb_returnlast(bc_dragged);
	todo_list = recursive_magic(bc_dragged_parent, 0, 'delete', {target:bc_del_target}, todo_list);
	}

	// Collect each item from the array apart from dragged item, store in memory.
	var sort_cache=[];
	$.each(newOrder, function(i, val) {

		if ( (val!=="") && (val!==targetid) ) {
			//var id_split = val.split("-");
			//var bc = breadcrumbs_from_index(id_split[1],id_split[2]);

			var bc = breadcrumb_explosion($('#'+val).attr("breadcrumbs"));

			recursive_fetched={};
			recursive_magic(bc, 0, 'fetch', {}, todo_list);	
			sort_cache[val]=recursive_fetched;

			if (!recursive_fetched.title) { alert('sorting error'); return 0; }

		}

	});
	
	// Now set deleting:true to the whole destination
	$.each(newOrder, function(i, val) {

		if ( (val!=="") && (val!==targetid) ) {
			
			//var id_split = val.split("-");
			//var bc = breadcrumbs_from_index(id_split[1],false);

			var bc = breadcrumb_explosion($('#'+val).attr("breadcrumbs"));
			var bc_del_target=breadcrumb_returnlast(bc);
			bc=breadcrumb_removelast(bc);

			todo_list = recursive_magic(bc, 0, 'delete', {target:bc_del_target}, todo_list);
		}

	});

	// Reinsert in order:
	$.each(newOrder, function(i, val) {

		if (val!=="") {

			if (sort_cache[val]) { // Add from memory list
			todo_list = recursive_magic(insert_bc, 0, 'add', sort_cache[val], todo_list);
			}

			if (val===targetid) { // Add target!
			todo_list = recursive_magic(insert_bc, 0, 'add', dragged_item, todo_list);	
			}

		}

	});

	// Tidy up deleted ones
	todo_list=recursive_tidy(todo_list);

	// Open breadcrumbs should always end up one less than the destination.
	open_breadcrumbs=breadcrumb_removelast(insert_bc);

	// draw
	redraw(open_breadcrumbs);

	alldone_update_notify();

}