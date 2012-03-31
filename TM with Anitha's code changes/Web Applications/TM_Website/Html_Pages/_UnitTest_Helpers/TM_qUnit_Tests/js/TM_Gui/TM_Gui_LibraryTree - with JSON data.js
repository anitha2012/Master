module("TM.Gui.LibraryTree - with JSON data");

TM.Debug.reuseLibraryMappingsObject = false;

asyncTest("login As Admin", function() 
	{		
		QUnit.login_as_Admin(
			function(sessionID)
				{					
					notEqual(sessionID, TM.Const.emptyGuid, "valid SessionID: " + sessionID);
					start();
				});
	});

// this test runs quite slow when multiple libraries are loaded (so skipping it for now)
/*
asyncTest("Create LibraryTree with Live data", function() 
{
	stop();
	$("#Canvas").html("<div id='LibraryTreeWithLiveData'>.</div>");	
	var libraryTree = TM.Gui.LibraryTree.open("#LibraryTreeWithLiveData");			
	
	libraryTree.onTreeLoaded = 
		function()  {							
						ok(TM.Gui.LibraryTree.jsTree, "TM.Gui.LibraryTree.jsTree created ok");
						var librariesFound = 0;
						var foldersFound = 0;
						var viewsFound = 0;
						$.each(TM.Gui.LibraryTree.nodes(), function() 
							{
							    var id = $(this).attr('id');
								//ok(id, "found id attribute: " + id);
								var type = $(this).attr('type');
								//ok(type, "found type : " + type);								
								switch(type)
								{
									case "SecurityInnovation.TeamMentor.WebClient.Library_V3":
										var data = $.data[id];
										//ok(data, "found cached data for id:" + id);
										var title = TM.Gui.LibraryTree.title($(this))
										equal(title, data.name, "library title ok: " + data.name);
										librariesFound++;
										break;
									case "SecurityInnovation.TeamMentor.WebClient.Folder_V3":
										var data = $.data[id];
										//ok(data, "found cached data for id");
										var title = TM.Gui.LibraryTree.title($(this))
										equal(title, data.name, "folder title ok: " + data.name);
										foldersFound++;
										break;
									case "SecurityInnovation.TeamMentor.WebClient.View_V3":
										var data = $.data[id];
										//ok(data, "found cached data for id");
										var title = TM.Gui.LibraryTree.title($(this))
										equal(title, data.caption, "view title ok: " + data.caption);
										viewsFound++;
										break;					
								}								
							});
						equal(librariesFound, TM.WebServices.Data.AllLibraries.length	, "found all libraries in treeview");								
						equal(foldersFound	, TM.WebServices.Data.AllFolders.length		, "found all libraries in treeview");		
						equal(viewsFound	, TM.WebServices.Data.AllViews.length		, "found all libraries in treeview");		
						var timeSpan = TM.Debug.TimeSpan_Gui_LibraryTree_CreatedTreeFromWsData;
						ok(timeSpan.getSeconds() < 30, "it took less than 30 seconds to create the table (Crome is < 2s): " + timeSpan.secondsAndMiliSeconds());
						start();
						start();
					};				
					
	var createTree = function()
		{
			libraryTree.create_Tree_FromWsData();			
		}
	
	TM.Events.onFolderStructureLoaded.add(createTree);
	
});  
*/
//the previous test already checks for this (and this in IE takes 10secs)
/*
asyncTest("Check performance of LibraryTree with Live data", function() 
	{			
		$("#Canvas").html("<div id='LibraryTreeWithLiveData'>...loading data...</div>");	
		var libraryTree = TM.Gui.LibraryTree.open("#LibraryTreeWithLiveData");			
		libraryTree.onTreeLoaded = function()  
			{									
				var timeSpan = TM.Debug.TimeSpan_Gui_LibraryTree_CreatedTreeFromWsData;
				ok(timeSpan.getSeconds() < 15, "it took less than 15 seconds to create the table (Crome is < 2s): " + timeSpan.secondsAndMiliSeconds());
				start();
			};
		TM.Events.onFolderStructureLoaded.add(function()
			{
				libraryTree.create_Tree_FromWsData();			
			})		
	});

*/

asyncTest("LibraryTree - create Using JSON", function() 
{		
	$("#Canvas").html("<div id='LibraryTreeWithLiveData'>empty tree</div>");	
	var libraryTree = TM.Gui.LibraryTree.open("#LibraryTreeWithLiveData");			
	libraryTree.onTreeLoaded = 
		function()  {												
						ok(TM.Gui.LibraryTree.jsTree, "TM.Gui.LibraryTree.jsTree created ok");								
						var timeSpan = TM.Debug.TimeSpan_Gui_LibraryTree_CreatedTreeFromJsonData;
						ok(timeSpan.getSeconds() < 15, "it took less than 5 seconds to create the table (Crome is < 2s): " + timeSpan.secondsAndMiliSeconds());						
						start();
					};	
	libraryTree.create_TreeUsingJSON();	
});

asyncTest("LibraryTree - JSON - Add Library", function() 
{		
	$("#Canvas").html("<div id='LibraryTreeWithLiveData'>empty tree</div>");	
	var libraryTree = TM.Gui.LibraryTree.open("#LibraryTreeWithLiveData");			
	
	var data = TM.WebServices.Data;
			
	libraryTree.onTreeLoaded = 
		function()  {	
						var libraryName = QUnit.randomString() + "_testLib"
						var library = data.library(libraryName);						
						ok(isUndefined(library), "test library was not there");
						
						var libraryNode = libraryTree.add_Library_to_Database(libraryName);
						
						TM.Events.onNewLibrary.add(function(libraryV3)
							{								
								ok(libraryV3, "libraryV3 object ok");
								if (libraryV3 == null)
									ok(libraryV3 != null, "libraryV3 was not null");
								else 
								{
									var library = data.library(libraryName);	
									ok(library, "test library was there");		
									ok(libraryV3.libraryId, "libraryV3.libraryId was ok: " + libraryV3.libraryId);
									ok($.data[libraryV3.libraryId] , "$.data[library.libraryId] was there");
									ok($("#" + libraryV3.libraryId).length ==1,"libraryV3.libraryId Html element was there");
								}
								start();
							});
					};	
	
	TM.Events.onFolderStructureLoaded.add(function()
		{			
			libraryTree.create_TreeUsingJSON();	
		}) 			
});


//helper method

var loadDataAndCreateTree = function()
	{
		$("#Canvas").html("<div id='LibraryTreeWithLiveData'>empty tree</div>");	
		var libraryTree = TM.Gui.LibraryTree.open("#LibraryTreeWithLiveData");			
		TM.Events.onFolderStructureLoaded.add(function()
			{
				libraryTree.create_TreeUsingJSON();			
			});
		return libraryTree;
	};

asyncTest("LibraryTree - JSON - Add Library, Folder and View", function() 
	{
		var libraryTree = TM.Gui.LibraryTree;
		var data = TM.WebServices.Data;
		
		var viewInLibraryName = QUnit.randomString() + "_view_inLib";
		
		libraryTree.onTreeLoaded = function()
			{				
				libraryTree.add_Library_to_Database(QUnit.randomString() + "_testLib");			
			};
			
		TM.Events.onNewLibrary.add(function(libraryV3)
			{				
				var folderName = QUnit.randomString() + "_folder";
				var libraryId = libraryV3.libraryId;				
				var folderNode = libraryTree.add_Folder_to_Database(libraryId, undefined,folderName);					
			});		
		
		TM.Events.onNewFolder.add(function(folderV3)
			{								
				ok(folderV3, "folderV3 object ok");
				if (folderV3 == null)
					ok(folderV3 != null, "folderV3 was not null");
				else 
				{									
					var folder = data.folder(folderV3.name);	
					ok(folder, "folder was there");		
					ok(folderV3.folderId, "folderV3.folderId was ok: " + folderV3.folderId);
					ok($.data[folderV3.folderId] , "$.data[folderV3.folderId] was there");
					ok($("#" + folderV3.folderId).length ==1,"folderV3.folderId Html element was there");
					
					var viewName = QUnit.randomString() + "_view";
					libraryTree.add_View_to_Database(folderV3.libraryId, folderV3.folderId, viewName);					
				}				
			});		
			
			TM.Events.onNewView.add(function(viewV3)
			{								
				ok(viewV3, "viewV3 object ok");
				if (viewV3 == null)
					ok(viewV3 != null, "viewV3 was not null");
				else 
				{									
					var view = data.view(viewV3.caption);	
					ok(view, "view was there");		
					ok(viewV3.viewId, "viewV3.viewId was ok: " + viewV3.viewId);
					ok($.data[viewV3.viewId] , "$.data[viewV3.viewId] was there");
					ok($("#" + viewV3.viewId).length ==1,"viewV3.viewId Html element was there");
				}
				
				if (isUndefined(data.view(viewInLibraryName)))			
					libraryTree.add_View_to_Database(viewV3.libraryId, undefined, viewInLibraryName);														
				else
				{
					ok(data.view(viewInLibraryName), "viewInLibraryName was there");
					start();
				}
			});
		loadDataAndCreateTree();		
	});
	
	

	
asyncTest("LibraryTree - JSON - Create & Rename  Library, Folder and View", function() 	
	{
		var libraryTree = TM.Gui.LibraryTree;
		var data = TM.WebServices.Data;
		var randomText = QUnit.randomString();
		
		var createAndRename = function(viewV3)
			{
				var libraryNode = $("#" + viewV3.libraryId);
				var folderNode 	= $("#" + viewV3.folderId);
				var viewNode 	= $("#" + viewV3.viewId);
				ok(libraryNode	, "got libraryNode");
				ok(folderNode	, "got folderNode");
				ok(viewNode		, "got viewNode");
				
				var newLibraryText = libraryTree.title(libraryNode) + " - changed BB";
				var newFolderText  = libraryTree.title(folderNode)  + " - changed BB";
				var newViewText    = libraryTree.title(viewNode)    + " - changed BB";
				
				//TM.WebServices.WS_Libraries.rename_Library(viewV3.libraryId 									, newLibraryText);
				TM.WebServices.WS_Libraries.rename_Folder (viewV3.libraryId , viewV3.folderId					, newFolderText);
				TM.WebServices.WS_Libraries.rename_View	  (viewV3.libraryId , viewV3.folderId, viewV3.viewId	, newViewText);
				
				stop();
				stop();
				stop();
				
				libraryTree.rename_Library_to_Database	(viewV3.libraryId 									, newLibraryText);
				libraryTree.rename_Folder_to_Database	(viewV3.libraryId , viewV3.folderId					, newFolderText);
				libraryTree.rename_View_to_Database		(viewV3.libraryId , viewV3.folderId, viewV3.viewId	, newViewText)
					
				TM.Events.onRenamedLibrary.add(function(libraryV3)
					{
						equal(libraryV3.name, newLibraryText , "library Text was updated");
						start();
					});
					
				TM.Events.onRenamedFolder.add(function(folderV3)
					{
						equal(folderV3.name, newFolderText , "folder Text was updated");
						start();
					});

				TM.Events.onRenamedView.add(function(viewV3)
					{
						equal(viewV3.caption, newViewText , "view Text was updated");
						start();
					});		
				start();
			}
		
		TM.Events.onNewView.	.add(function(viewV3)	   	{ createAndRename(viewV3) });
		TM.Events.onNewFolder 	.add(function(folderV3)  	{ libraryTree.add_View_to_Database	(folderV3.libraryId,  folderV3.folderId , randomText + "_testView"  );});
		TM.Events.onNewLibrary 	.add(function(libraryV3) 	{ libraryTree.add_Folder_to_Database	(libraryV3.libraryId, undefined			, randomText + "_testFolder");});
		libraryTree.onTreeLoaded = function() 		   		{ libraryTree.add_Library_to_Database(randomText + "_testLib"								   			);}
		loadDataAndCreateTree();		
	});
	

asyncTest("LibraryTree - JSON - Create & Delete Library, Folder and View", function() 	
	{
		var libraryTree = TM.Gui.LibraryTree;
		var data = TM.WebServices.Data;
		var randomText = QUnit.randomString() + "_for_deletion_";
		
		var createAndDelete = function(viewV3)
			{
				var libraryNode = $("#" + viewV3.libraryId);
				var folderNode 	= $("#" + viewV3.folderId);
				var viewNode 	= $("#" + viewV3.viewId);							
				
				TM.Events.onRemovedLibrary = function(result)
					{						
						equal(result, true , "library was removed");
						start();
					};							
					
				TM.Events.onRemovedFolder = function(result)
					{						
						equal(result, true , "folder was removed");
						TM.Gui.LibraryTree.remove_Library_from_Database(viewV3.libraryId);							
					};															
				
				TM.Events.onRemovedView = function(result)
					{						
						equal(result, true , "view was removed");
						TM.Gui.LibraryTree.remove_Folder_from_Database(viewV3.libraryId , viewV3.folderId);	
						//start();
					};											
				TM.Gui.LibraryTree.remove_View_from_Database(viewV3.libraryId , viewV3.viewId);	
			}
	
		TM.Events.onNewView 	 .add(function(viewV3)	   { createAndDelete(viewV3) });
		TM.Events.onNewFolder 	 .add(function(folderV3)  { libraryTree.add_View_to_Database	(folderV3.libraryId,  folderV3.folderId , randomText + "_View"  );});
		TM.Events.onNewLibrary 	 .add(function(libraryV3) { libraryTree.add_Folder_to_Database	(libraryV3.libraryId, undefined			, randomText + "_Folder");});
		libraryTree.onTreeLoaded = function() 		   { libraryTree.add_Library_to_Database(randomText + "_Lib"								   			);}
		loadDataAndCreateTree();		
	});

	
asyncTest("LibraryTree - JSON - remove test libraries", function() 		
	{	
		var libraryTree = loadDataAndCreateTree();
		
		var deleteTempLibraries = function(librariesToDelete)
			{								
				if (librariesToDelete.length == 0)				
				{
					start();				
					return;
				}
				var libraryToDelete = librariesToDelete.pop();					
								
				ok(libraryToDelete, "libraryToDelete is ok: " + libraryToDelete.name);				
				libraryTree.remove_Library_from_Database(libraryToDelete.libraryId);											
			}
		
		libraryTree.onTreeLoaded.add(function()
			{						
				var librariesToDelete = jLinq.from(TM.WebServices.Data.AllLibraries)
											 .contains("name","qunit_")
											 .orContains("name","temp_lib_")
											 .select();	
											 
				TM.Events.onRemovedLibrary = function(result)
						{			
							equal(result, true , "library was removed");							
							deleteTempLibraries(librariesToDelete) 
						};
				deleteTempLibraries(librariesToDelete);				
			});		
	});