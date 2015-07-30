Breadcrumbs
===========

Breadcrumbs are how alldone references items within the multidimensional array.

```
[0 => [ title => 'hello',
		'children => [
					  0 => [ title => 'cat'],
					  1 => [ title => 'helmet'],
					  2 => [ title => 'flannels',
					  		'children' => [ 
					  						0 => [ 'title' => 'frogs'],
					  						1 => [ 'title' => 'wizards']
					  					   ]
					  		]
					  ]],
 1 => [ 'title' => 'rabbits' ] ]
 ```

The breadcrumbs are an array of indices. So, using the example above:

To access *hello* you would use [0]

To access *flannels* you would use [0, 2]

And to access *wizards* you would use [0, 2, 1]

Each DOM element has a breadcrumbs attribute which allows for easy referencing using events.

The current open breadcrumb trail is stored in *open_breadcrumbs*.

When in vertical mode, it's possible for many breadcrumb trails to be open. For this, the variable *multi_crumbs* is used, this is an array of breadcrumb trails.