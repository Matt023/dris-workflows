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
console.logg(meta);
	//console.log(items);
	save(meta,files);
	//gridfs();
}

function save(data,files){
	
	console.log(data);
	console.log(files);

	console.log(data);

	items.save(data, function(err, value) {
		if(data["surcheck"] == "on") {
			console.log("images included")
			delete data["surcheck"]
			gridfs(value._id.toString(), files)

		}
	});
}


function gridfs(infoId,files) {
	console.log(files);
	var gridfs = db.gridfs()// name defaults to 'fs'

	// Create new file write stream
	var stream = gridfs.create({
		filename : files.media.name,
		metadata : {id:infoId},
		contentType : files.media.type,
		
		
	}).writeStream()

	// Pipe license file to gridfile
	fs.createReadStream(files.media.path).pipe(stream)
	findId(infoId,files.media.name)
}

exports.loadImg = function loadImg(id,name,res){
	console.log(name)
	console.log(id);
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// name defaults to 'fs'
	console.log(id.toString());
			gridfs.findOne({filename:name,metadata:{id:id}}, function(err, file) {
				console.log(file);
			if (!err && file) {
				res.writeHead(200, {'Content-Type': 'image/jpeg'});
                var stream = file.readStream();
                stream.on("error", function(err){
                    console.log(err); 
                    
                }).pipe(res);
            }
            else
            {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
		})
}exports.findImages = function(req,res){
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	gridfs.find({metadata:{id:req.params.id}}).forEach(function(file) {
		// do something with a single post
		arr.push(file);
		console.log(arr);
	}, function() {
		res.send(array);
	});

}

exports.getAll = function getAlItems(res){
var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// 
	var arr = new Array();
	gridfs.find().forEach(function(file) {
		// do something with a single post
		arr.push(file);
	console.logg(arr);
	}, function() {
		res.render('all', {
				items:arr, id:"all", title:"All"
			})
	})
	console.log("dfqsdqsd");
	console.log(arr);
	

}

function findId(id,name){
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
			console.log(name);
			res.render('summary', {
				title : "summary",layout:"layoutOverview",
				url:name, id:"summary"
			})
		}

	})

}


exports.edit = function edit(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
	console.log(items);

			
	items.find({series:true}).sort({ created: 1 }).toArray(function (err, array) {
		for(item in array){
			array[item]._id = array[item]._id.toString();
			console.log(array[item]._id); 
		}
			
		res.render('test', {
		title : "Edit",id:"test",series:array
		})

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
		console.log(array);
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
		console.log(array);
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
	console.log(req.body);
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
					console.log(rootItem);
				}
			}
			
			if(i != 'name' && i != 'author' && i != 'amount'){
				item[i] = files[i];
			}
			
		}
	console.logo(req.body.amount)
	console.logo(rootItem);
	console.logo(item);
		items.insert(rootItem, function(err, value) {
		console.logg(value);
		     var id = value._id.toString();
			 item.masterId = id;
			
			 for(var i = 0;i<req.body.amount;i++){
			 	item._id = new ObjectId();
			 	items.insert(item,function(err, value) {
			 		if(err){
			 		console.logr(err);
			 		}
			 	console.logg("created");
			 	});
			 }
		});
		
}
