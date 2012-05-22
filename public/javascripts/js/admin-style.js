/**
 * @author Quirijn Groot Bluemink
 * @author Matthias Van Wambeke
 */

var workspace = backbone();
var goDeeper = true;
var parentType = "";
var currentParentName = ""

$(document).ready(function() {
	workspace.navigate("", {
		trigger : true
	});
	$('#checkAll').live('click', function() {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$('#bulk-execute').click(function() {
		var action = $(this).prev().val();
		switch(action) {
			case "approve":
				approveAllSelected();
				if(!('#checkAll:checkbox[checked]').length) {
					('#checkAll').removeAttr("checked");
				}
				break;
			case "remove":
				removeAllSelected();
				$(this).prev().val("-1");
				if(!('#checkAll:checkbox[checked]').length) {
					('#checkAll').removeAttr("checked");
				}
				break;
			default:
				console.log("Select an action");
		}
	});
	
	$(document).on("click",".icon-eye-open",function(){
		var item = $(this);
		if(!$(this).parent().parent().next().hasClass("infoMeta")){
			$('.infoMeta').remove()
			loadData(driPath +"objects/" + $(this).attr("data-id"), function(data) {
				displayData(data,item)
			});
			
		}
		else{
			$('.infoMeta').remove()
		}
		
		
		
	})

	$('.removeItem').live("click", function() {
		$this = $(this)
		id = $(this).attr("data-id");
		var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
		if(confirmDialog == true) {
			removeItem(id, function(id) {
				$("#" + id).remove();
			})
		}
	});
	$('.approveItem').live("click", function() {
		$this = $(this)
		$this.attr("disabled", "disabled");
		$this.addClass('disabled')
		$this.attr("value", "Approving");
		id = $(this).attr("data-id");
		approveItem(id, function(err, data) {
			if(err) {
				$this.removeAttr("disabled");
				$this.removeClass('disabled')
				$this.attr("value", "Approve");
			} else {
				$this.attr("value", "Approved");
			}
		});
	});
	$("tbody a").live("click", function() {
		goDeeper = true;
		parentType = $(this).attr("data-type");
		currentParentName = $(this).text()
	});
	$('.btnCompareFedora').live("click", function(e) {
		console.log("btn")
		var btn = $(e.target)
		var id = btn.attr('data-id')
		window.location = "/compare#compare/"+id
	});
	$(document).on("click", "form .breadcrumb li a", function(event) {
		event.preventDefault()
		$(this).parent().nextAll().remove();
		goDeeper = false;
		$(".row .breadcrumb").append("<li>")
		workspace.navigate("#" + $(this).attr("href"), {
			trigger : true
		});
	});
})

function displayData(data,item){
	var root = "<table class='table-bordered'><thead><th>type</th><th>data</th></thead><tbody>"
	for(var i in data){
	
		if(i != "properties"){
			root += "<tr><td>"+i+"</td><td>"+data[i]+"</td><tr>"
		}
		
	}
	
	for(var i in data.properties) {
		var obj = i;
		root += "<tr><th colspan='2'>" + i + "</th><tr>";
		for(var j in data.properties[i]) {
			var info = data.properties[obj][j]
			for(i in info) {
				root += "<tr><td>" + i + "</td><td>" + info[i] + "</td><tr>"
				if( typeof info[i] == "object") {
					for(var i in info) {
						for(j in info[i]) {
							root += "<tr><td>" + j+ "</td><td>" + info[j] + "</td><tr>" 
						}
					}
				}
			}

		}

	}

	root += "</tbody></table>"
	$(item).parent().parent().after("<tr class='infoMeta'><td colspan='7'>"+root+"</td></tr>")
}

function fillInSpecialDataFields() {

	

}


function loadAdminData(page, amount) {
	$('#loadingDiv').show()
	var link = driPath +"objects?page=" + (page - 1) + "&amount=" + amount + "&callback=?"

	loadData(link, function(items, meta) {
		createPagination(meta)
		$("tbody").empty();
		for(i in items) {
			var fedoraId = (items[i].fedoraId) ? "<div class='input-append'><input type='text' class='span2' disabled value='"+items[i].fedoraId + "' /> <button class='btn btnCompareFedora' data-id='"+items[i]._id +"' type='button' value='compare'>Compare</button></div>" : "-";
			var disabled = (items[i].type == "item") ? "" : "disabled";
			var label = "IN-"+items[i].label.substring(0, amountLblChars);
			var title = "-"
		
			if(( typeof items[i].properties.titleInfo[0]) != "undefined") {
				title = items[i].properties.titleInfo[0].title;
			}
			if(( typeof items[i].fileLocation) != "undefined" && ( typeof items[i].properties.titleInfo[0]) == "undefined") {
				var nameStart = items[i].fileLocation[0].indexOf("/") + 1;
				title = items[i].fileLocation[0].substring(nameStart);
			}

			$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" + 
			"<td><a data-type='" + items[i].type + "' href='#" + items[i]._id + "'>" + title + "</a><i data-id='"+items[i]._id+"'class='icon icon-eye-open'></i></td>" +
			"<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td>" +  
			"<td>" + fedoraId + "</td>" + 
			"<td>" + items[i].type + "</td>" + 
			"<td><input type='button' class='btn btn-success btn-mini approveItem' "+disabled+" value='Approve' data-id='" + items[i]._id + "'/></td>" + 
			"<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
		}
		if(items.length == 0) {
			$("tbody").append("<tr><td colspan='7'>No items available</td></tr>")
		}
		$('#loadingDiv').hide()
	}, function(err) {
		$('#loadingDiv').empty()
		var td = $(document.createElement('td')).attr('colspan', '6').addClass('alert-error').text(err)
		$('#loadingDiv').append(td)
	});
}



function loadChildren(id, page, amount) {
	$("tbody").empty();
	createLoadingRow();

	var link = driPath +"objects/" + id + "/list?page=" + (page - 1) + "&amount=" + amount
	loadData(link, function(items, meta) {
		$("tbody").empty();
		$('#loadingDiv').hide()
		if(items.length == 0) {
			createPagination(meta)
			$("tbody").append("<tr><td colspan='7'>No Children here</td></tr>")

		} else {
			if(meta.numPages > 20) {
				childrenPerPage = meta.numPages;
				loadChildren(id, page, childrenPerPage);
			} else {
				createPagination(meta)
				for(i in items) {

					var fedoraId = (items[i].fedoraId) ? "<div class='input-append'><input type='text' class='span2' disabled value='" + items[i].fedoraId + "' /> <button class='btn btnCompareFedora' data-id='" + items[i]._id + "' type='button' value='compare'>Compare</button></div>" : "-";
					var disabled = (items[i].type == "item") ? "" : "disabled";
					var label = "IN-" + items[i].label.substring(0, amountLblChars);
					var title = "-"
					if(( typeof items[i].properties.titleInfo[0]) != "undefined") {
						title = items[i].properties.titleInfo[0].title;
					}
					if(( typeof items[i].fileLocation) != "undefined" && ( typeof items[i].properties.titleInfo[0]) == "undefined") {
						var nameStart = items[i].fileLocation[0].indexOf("/") + 1;
						title = items[i].fileLocation[0].substring(nameStart);
					}

					if(items[i].status == "approved") {
						$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" +
						"<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title + "</a></td>" +
						"<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td>" +
						"<td>" + fedoraId + "</td>" +
						"<td>" + items[i].type + "</td>" +
						"<td><input type='button' class='btn btn-success btn-mini approveItem disabled' value='Approved' disabled data-id='" + items[i]._id + "'/></td>" +
						"<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
					} else {
						$("tbody").append("<tr id='" + items[i]._id + "'><td><input type='checkbox' data-id='" + items[i]._id + "'></td>" +
						"<td><a data-type='" + items[i].type + "'  href='#" + items[i]._id + "'>" + title+ "</a></td>" +
						"<td><a data-type='" + items[i].type + "'  href='#id/" + items[i]._id + "'>" + label + "</a></td>" +
						"<td>" + fedoraId + "</td>" +
						"<td>" + items[i].type + "</td>" +
						"<td><input type='button' class='btn btn-success btn-mini approveItem' value='Approve' "+disabled+" data-id='" + items[i]._id + "'/></td>" +
						"<td><input type='button' class='btn btn-danger btn-mini removeItem' value='Remove' data-id='" + items[i]._id + "'/></td></tr>")
					}
				}
			}
		}

	}, function(err) {
		$('#loadingDiv').empty()
		var td = $(document.createElement('td'))
		td.attr('colspan', '6')
		td.addClass('alert-error')
		td.text(err)
		$('#loadingDiv').append(td)
	});
}


function approveAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			approveItem($(this).attr("data-id"), function(err, id) {
				if(err) {
					console.log(err);
				} else {
					$(this).attr("value", "Approved");
				}
			})
		});
	}
};


function removeAllSelected() {
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if(confirmDialog == true) {
		$('#series-table tbody input:checked').each(function() {
			removeItem($(this).attr("data-id"), function(id) {
				$("#" + id).remove();
			})
		});
		goDeeper = false; 
	}
};


function removeItem(id, callback) {
	$.ajax({
		type : "get",
		url : socket + driPath +"objects/" + id + "/delete",
		dataType : "jsonp",
		cache : false,
		success : function(data) {
			callback(id);
		},
		error : function(d, r) {
			console.log(d);
			console.log(r);
		}
	});
};

function approveItem(id, callback) {
	$.ajax({
		url : socket + driPath +"objects/" + id + "/approve",
		type : "GET",
		success : function(data) {
			callback(null, data);
		},
		error : function(d, r) {
			callback(r, null);
			console.log(d);
			console.log(r);
		}
	});
};

function backbone() {

	var Workspace = Backbone.Router.extend({
		routes : {
			"" : "collection",
			"/:page" : "collectionPage",
			":id/:page" : "pageRoute",
			":id" : "defaultRoute"
		},
		collection : function() {
			loadAdminData(1, itemsPerPage);
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		collectionPage : function(page) {
			console.log("page" + page)
			loadAdminData(page, itemsPerPage);
			if(!goDeeper) {
				if($(".row .breadcrumb li").size() > 1) {
					$(".row .breadcrumb li:last").remove();
				}
			}
			goDeeper = false;
		},
		defaultRoute : function(id, page) {
			if(goDeeper) {
				$("form .breadcrumb a:last").parent().removeClass("active");
				$(".row .breadcrumb").append("<li class='active'><a href='" + Backbone.history.fragment + "'>" + parentType + ": " + currentParentName + "</a><span class='divider'>/</span></li>");
				goDeeper = false;
			} else {
				$(".row .breadcrumb li:last").remove();
				$("form .breadcrumb a:last").parent().addClass("active");
			}
			loadChildren(id, 1, itemsPerPage);
		},
		pageRoute : function(id, page) {
			
			loadChildren(id, page, itemsPerPage);
		}
	});

	var obj = new Workspace();
	Backbone.history.start();
	return obj

}
