/**
 * @author mvanwamb
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
var fs = require('fs');
var image;


exports.show = function(data,vw){
	res = vw;
	meta = data.body;
	var files = data.files;

	// Create a server instance with default host and port
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")

	//console.log(items);
	save(meta,files);
	//gridfs();
}
/*
   Function: Save

   Saves the metadata object

   Parameters:

      data - the metadata object
      files - the files that are uploaded
*/
function save(data,files){
	
	//convert String id to bytes
	data._id = new ObjectId(data._id);
	//remove the surcheck value (checks if there is an image)
	var image = false;
	if(data["surcheck"]){
		image = true;
	}
    delete data["surcheck"]
    //saves the metadata in the items collection
	items.save(data, function(err, value) {
		if(image) {
			//if there is an image it needs to be stored
			gridfs(value._id.toString(), files)
		}
	});
}

/*
   Function: gridfs

   Stores the file into mongodb gridfs

   Parameters:

      id - id of the metadata object
      file - file that needs to be stored
*/
function gridfs(infoId,files) {
	var gridfs = db.gridfs()// name defaults to 'fs'

	// Create new file write stream
	var stream = gridfs.create({
		filename : files.media.name,
		metadata : {id:infoId},
		contentType : files.media.type,
		
		
	}).writeStream()

	// Pipe file to gridfile
	fs.createReadStream(files.media.path).pipe(stream)
	//findId(infoId,files.media.name)
}
/*
   Function: loadImg

   Searches for an images and displays it.

   Parameters:

      id - the id of the file
      name - the filename
      res - the view object (res)

*/
exports.loadImg = function loadImg(id,name,res){
	//setup connection with mongodb
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	//get gridfs object
	var gridfs = db.gridfs()// name defaults to 'fs'
	//search for a file with a certain name and an id
	//new ObjectId coverts the String version of the id into a byte one
	gridfs.findOne({filename:name,_id:new ObjectId(id)}, function(err, file) {
			//sends back the image to the view
			if (!err && file) {
				res.writeHead(200, {'Content-Type': 'image/jpeg'});
                var stream = file.readStream();
                //incase the file couldn't be loaded it logs an error
                stream.on("error", function(err){
                    console.log(err); 
                    
                }).pipe(res);
            }
            //runs if there is an error with finding the file
            else
            {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
		})
}
/*
   Function: findImages

   Searches for all files linked to a metadata object

   Parameters:

      req - request object
      res - result object

   Returns:

      array of the corresponding files.
*/exports.findImages = function findImages(req,res){
	//setting up connection with the server
	var server = new Mongolian;
	db = server.db("mydb");
	items = db.collection("items");
	var gridfs = db.gridfs()
	var files = new Array();
	//search for a file with the id that is provided in the request (in url)
	gridfs.find({metadata:{id:req.params.id}}).forEach(function(file) {
		//converting the id from bytes to a string id
		file._id = file._id.toString();
		files.push(file);
	}, function() {
		//send back the files to the client
		console.log("sendback");
		res.send(files);
	});

}
//gets all the files related to an item
exports.getAll = function getAlItems(res){
	//setup a connection
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// 
	var arr = new Array();
	gridfs.find().forEach(function(file) {
		// do something with a single post
		arr.push(file);
	}, function() {
		res.render('all', {
				items:arr, id:"all", title:"All"
			})
	})


}

/*function findId(id,name){
	console.log(id);
	var query = {
		_id : new ObjectId(id)
	};
	items.findOne(query, function(err, meta) {
		if(err == null) {
			res.locals({
				data : meta
			});
			
			name = 'image/'+id+'/'+name;
			res.render('summary', {
				title : "summary",layout:"layoutOverview",
				url:name, id:"summary"
			})
		}

	})

}*/


exports.edit = function edit(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")

			
	items.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
			console.log(array[item]._id); 
		}
			
		res.render('edit', {
		title : "Edit",id:"edit",series:array
		})
	})
}
exports.getAllSeries = function getAllSeries(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")

			
	items.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
			console.log(array[item]._id); 
		}
			
		res.send(array);
	})
}


exports.items = function(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.find({masterId:id}).sort({ created: 1 }).toArray(function (err, array) {
	for(item in array){
			array[item]._id = array[item]._id.toString();
		}
		res.send(array);
	})
}

exports.item = function(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.findOne({_id:new ObjectId(id)},function (err, array) {
			array._id = array._id.toString();
		res.send(array);
	})
}

exports.createitem = function(req,res){
		var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	var rootItem = {}
	var rootset = false;
	var item = {};
	var items = db.collection("series")
		var files = req.body;
		for(var i in files){
			if(rootset == false){
				if(i == 'name'){
					rootItem[i] = files[i];
				}
				if(i = 'author'){
					//rootItem += i +':"'+files[i]+'"';
					rootItem[i] = files[i];
					rootItem.series = true;
					rootset = true;
				}
			}
			
			if(i != 'name' && i != 'author' && i != 'amount'){
				item[i] = files[i];
			}
			
		}
	console.log(req.body.amount)
	console.log(rootItem);
	console.log(item);
		items.insert(rootItem, function(err, value) {
		     var id = value._id.toString();
			 item.masterId = id;
			
			 for(var i = 0;i<req.body.amount;i++){
			 	item._id = new ObjectId();
			 	items.insert(item,function(err, value) {
			 		if(err){
			 		console.logr(err);
			 		}
			 	});
			 }
		});
		
}
