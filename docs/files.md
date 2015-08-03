Files
===========

##JS files for list editor.

**common.js**

Send/receive functions for web and app, common settings like API address, login object.

**todo.js**

List drawing, array navigation, add/edit/delete top level functions, settings, callback functions.

**design.js**

Interface drawing (calls todo.js draw functions for individual lists), resizing and scrolling for horizontal mode, event assigning, dialogs.

**data.js**

Main recursive function (recursive_magic), helper functions for common recusrive tasks, cloning, breadcrumb helpers (splicing.etc), sorting.

**details.js**

Dialog content.

**web.js**

Loads initial list from page, collects session cookie.

**app.js**

Login and list selection dialogs, other app-stuff for eventual app.