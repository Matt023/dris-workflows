/**
 * @author Matthias Van Wambeke
 * 
 *  
 */
var port = 4000;
var socket = 'http://localhost:' + port;

//starts when the main html file is loaded
$(document).ready(function(){
	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	
	loadBtnActions();
	switch(window.location.pathname){
		case "/edit":
				editAction();
				break;
		case "/all":
				loadMediaData();
				break;
	}

});

function loadMediaData(){
	$('#checkAll').click(function () {
		$('#series-table').find(':checkbox').attr('checked', this.checked);
	});
	$('#bulk-execute').click(function () {
		var action = $(this).prev().val();
		switch(action)
		{
		case "remove":
			removeAllSelected();
			$(this).prev().val("-1");
		  break;
		}
	});
	
}
/* Function: editActions

   Loads actions for the edit page
*/
function editAction(){

	$( "form" ).sortable({items:'div.control-group'});
	//loadAllItems();
	//hides the box which allows users to upload files
	$("#fileBox").hide();

	
	
	//Highlights the selected item in the list
	$(".items li").live("click", function() {
		$(".items li").removeClass("accordion-heading-focus");
		$(this).addClass("accordion-heading-focus");
		//highlights the same item in the other steps (when switching between step 2 and 3)
		$(".items li").eq($(this).index()).addClass("accordion-heading-focus");
		$("#list2 li").eq($(this).index()).addClass("accordion-heading-focus");
	})
	
	$("#globalBtn").click(function(event){
		event.preventDefault();
		item = $("#step1 option:selected").parent().attr("label");
		window.location.replace("object/item/" + $("#step1 select").val()+"/global");
	})
	

	$(window).keydown(function(event) {
		if(event.which == 66) {
			event.preventDefault();
			loadPrevItemInList();
		}
		if(event.which == 78) {
			event.preventDefault();
			loadNexItemInList();
		}
		
	});



}
function removeAllSelected(){
	var confirmDialog = confirm("Are you sure you want to continue?\nThis cannot be undone!");
	if (confirmDialog == true)
	{
		$('tbody input:checked').each(function() {
			console.log($(this).attr("data-id"));
			removeItem($(this).attr("data-id"), function(id){
				$("#"+id).remove();
			})
		});
	}

}
function removeItem(id, callback){
	$.ajax({
		url : "/object/media/"+id+"/remove",
		success : function(data) {
			callback(id);
		},
		error:function(d,r){
			console.log(d);
			console.log(r);
		}
	});
}

/*
   Function: loadAllItemsByType

   loads all the items of a cetain type(series,collections,items)

   Parameters:

      type - type of the item (series,collections or items)
      callback - the function to return it to


/*
   Function: showItems

   loads the items that are connected to a certain parentId

   Parameters:

      items - an array which contains all the items to dispay. These items are the parent's object children.
*/
function showItems(items,type,remove){
	console.log("loooad");
	var root = "";

	for(i in items){
		if(!remove){
			root+= "<li><a href='"+type+"/"+items[i]._id+"'>Parent: "+items[i].Title+" "+items[i]._id+"</a></li>";
		}else{
			root+= "<li><a href='"+type+"/"+items[i]._id+"'>"+items[i].Title+" "+items[i]._id+"</a></li>";
		}

	}
	if(!remove){
		$(".items ul").empty();
	}
	console.log(root);
	$(".items ul").append(root);
	

}
/*

/*
   Function: loadData

   Adds a input field to the form (gets triggered by option list).

   Parameters:

      array - data from the propertie to display

*/
function fillUpForm(data) {
	$(".dataform").empty();
	for(var prop in data) {
		if(data.hasOwnProperty(prop)) {
			$(".dataform").append('<div class="control-group"><label class="control-label">' + prop + '</label><div class="controls"><input type="text" class="input-xlarge" id="'+prop+'" name="' + prop + '" value="' + data[prop] + '"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		}
	}
}

function loadBtnActions(){

	//Triggers when there is an option/input that needs to be added to the form
	$("#properties button").click(function() {
		addInputFieldToFrom(this);
		
	});
	//when clicking a dropdown section it makes it "highlighted"
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

	$("#creatItem,#editItem1,#editItem2").click(function(event) {
		if(window.location.pathname == "/edit"){
			postData($("#itemCreation"),'PUT',"application/x-www-form-urlencoded",$('#itemCreation').serializeArray(),socket + $(".items li.accordion-heading-focus").find("a").attr("href"))
		}else{
			var parent = $("#itemEditSelection option:selected").parent().attr("label")
			var link
			if(parent == "collections"){
				
			}else if(parent == "series"){
				amount = $("#amount").val();
				for(var i = 0;i<amount;i++){
				link = socket+"/dev/collections/0/series/"+$("#itemEditSelection").val() +"/items";
				postData($('#itemCreation'),'POST',$('#itemCreation').serializeArray(),link)	
				}		 
			}
			
		}
	})
	
	




	

	$('#step3EditBtn').click(function() {
		loadAllImages($("input[name='_id']").val());
	})

	$("#step3Info .items #list2 li a").live("click", function(event) {
		event.preventDefault();
		loadData(this.pathname,function(data){
			fillUpForm(data)
		});
		loadAllImages($(this).attr("href").substring($(this).attr("href").indexOf("/") + 1));
	});
	$("#step2Info .items ul li a").live("click",function(event) {
		event.preventDefault();
		loadData(this.pathname,function(data){
			fillUpForm(data)
		});
	});

	$("#createItems").live("click", function(event) {
		loadAllItems();
		emptyForm();
	});
	
	
	$("#createCollection,#createSerie").live("click", function(event) {
		$("#successbox").hide();
		emptyForm();
	});	

	$(".nextItemBtn").click(function() {
		loadNexItemInList()
	})



	$(".previousItemBtn").click(function() {
		loadPrevItemInList();
	})
	
	


}

function loadNexItemInList() {
	urlNextItem = $(".items li.accordion-heading-focus").next().find("a").attr("href");
	nextItem = $(".items li.accordion-heading-focus").next();
	if(!nextItem.is("li")) {
		nextItem = $(".items li:first");
		urlNextItem = $(".items li:first").find("a").attr("href");
	}
	$("#list2 li").eq(nextItem.index()).addClass("accordion-heading-focus");
	nextItem.siblings().removeClass("accordion-heading-focus");
	nextItem.addClass("accordion-heading-focus");
	loadData("object/" + urlNextItem + "/get", function(data) {
		fillUpForm(data)
	});
}

function loadPrevItemInList() {
	urlPrevItem = $(".items li.accordion-heading-focus").prev().find("a").attr("href");
	prevItem = $(".items li.accordion-heading-focus").prev();
	if(!prevItem.is("li")) {
		prevItem = $("#step2Info  .items li:last");
		urlPrevItem = $("#step2Info .items li:last").find("a").attr("href");
	}
	$("#list2 li").eq(prevItem.index()).addClass("accordion-heading-focus");
	prevItem.siblings().removeClass("accordion-heading-focus");
	prevItem.addClass("accordion-heading-focus");
	loadData("object/" + urlPrevItem + "/get", function(data) {
		fillUpForm(data)
	});
}

function emptyForm(){
	$(".dataform").empty();
}

function test(){
	alert("test");
}
function addInputFieldToFrom(btn){
	var input = '<div class="control-group"><label class="control-label">' + $(btn).text() + '</label><div class="controls">';
	if($(btn).next().text() == "select"){
		input +=  $(btn).next().next().html();
	}else{
	input += '<input type="' + $(btn).next().text()+ '" class="input-xlarge" id="input01" name="'+ $(btn).text() + '">';
	}
	input += '</div><a class="close" data-dismiss="alert" href="#">&times;</a></div>';
	$(".dataform").append(input);
}

function loadAllImages(id){
	$("#imageContainer").empty();
	loadData("object/media/" + id + "/list", function(data) {
		for(var file in data) {
			$("#imageContainer").append("<img src='object/media/" + data[file]._id + "/get'>")
		}
	});
}
	


