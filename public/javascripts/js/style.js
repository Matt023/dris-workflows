/**
 * @author mvanwamb
 */

$(document).ready(function() {

	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	$("#fileBox").hide();
	loadBtnActions();
	 
	backbone();
	$("#step2Btn").click(function() {

		$.ajax({
			url : "items/" + $("#step1 select").val(),
			success : function(data) {
				showItems(data);
			},
			error:function(d,r){
				console.log(d);
				console.log(r);
			}
		});
	})
});

function showItems(items){
	var root = "";
	if(items.length ==0){
		root = "<li>No items</li>";
	}
	for(i in items){
	  root+= "<li><a href='item/"+items[i]._id+"'>"+items[i].Title+"</a></li>";
	}
	
	$(".items ul").empty();
	$(".items ul").append(root);
	
	$("#step2Info .items ul li a").click(function(event) {
		event.preventDefault();
		loadSeriesData(this);
	});
}
function loadSeriesData(link){
	$.ajax({
				url : link.pathname,
				success : function(data) {
					fillUpForm(data);
				},
				error : function(d, r) {
					console.log(d);
					console.log(r);
				}
			});
}
function fillUpForm(data){
	$(".dataform").empty();
	for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
        $(".dataform").append('<div class="control-group"><label class="control-label">'+prop+'</label><div class="controls"><input type="text" class="input-xlarge" id="input01" name="'+prop+'" value="'+data[prop]+'"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    }
}
}
function loadBtnActions(){

	$("#properties button").click(function() {
		$(".dataform").append('<div class="control-group"><label class="control-label">' + $(this).text() + '</label><div class="controls"><input type="' + $(this).next().text() + '" class="input-xlarge" id="input01" name="' + $(this).text() + '"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
	});
	$(".accordion-heading").click(function() {
		$(".accordion-heading").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
	})
	$(".breaddisabled").click(function() {
		return false
	});

	$(".breadcrumb a").click(function() {

		if(!$(this).hasClass("breaddisabled")) {
			$(".breadcrumb a").parent().removeClass("active");
			$(this).parent().addClass("active");
		}
	});
	$(".pager a").click(function() {

		$(".breadcrumb a").parent().removeClass("active");
		link = $(this).attr("href");
		$(".breadcrumb").find("a").each(function(index) {
			if($(this).attr("href") == link) {
				$(this).removeClass("breaddisabled")
				$(this).parent().addClass("active");
			}
		});
	});
	$("#surcheck").click(function() {
		$("#fileBox").toggle();
	})

	$("#subItem").click(function() {
		$("#itemCreation").submit();
	})

	$("#createSerieBtn").click(function() {
		$("#serieCreation").submit();
	})

	$('#step3EditBtn').click(function() {
		loadAllImages($("input[name='_id']").val());
	})

	$("#step3Info .items ul li a").live("click", function(event) {

		event.preventDefault();
		loadSeriesData(this);
		loadAllImages($(this).attr("href").substring($(this).attr("href").indexOf("/") + 1));
	});


		
}

function loadAllImages(id){
	$.ajax({
		url : "/list/images/" + id,
		success : function(data) {
			$("#imageContainer").empty();
			for(var file in data) {
				console.log(data[file]._id);
				$("#imageContainer").append("<img src='/image/" + data[file]._id + "/" + data[file].filename + "'>")
			}
		},
		error : function(d, r) {
			console.log(d);
			console.log(r);
		}
	});
	
}
	
function backbone(){

	var Workspace = Backbone.Router.extend({
	  routes: {
	    "step1":        "step1",    // #help
	    "step2":        "step2",  // #search/kiwis
	    "step3":        "step3", 
	    "step4":        "step4", 
	   
	  },
	
	  step1: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step1,#step1Info").show();
	  },
	
	  step2: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step2,#step2Info").show();
	    
	  },
	  step3: function(){
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step3,#step3Info").show();

	  },
	  step4: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step4,#step4Info").show();
	    
	  },
	
	});
	var w = new Workspace();
	
	Backbone.history.start({root: "/Upload2/"})

	
}
