/**
 * @author mvanwamb
 */

$(document).ready(function() {

	$("#step2,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	$("#fileBox").hide();
	loadBtnActions();
	backbone();
	$("#step1 input[type=radio]").next().next().hide();
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
	for(i in items){
	  root+= "<li><a href='item/"+items[i]._id+"'>"+items[i].title+"</a></li>";
	}
	
	$("#items ul").empty();
	$("#items ul").append(root);
	
	$("#items ul li a").click(function(event) {
		event.preventDefault();
		$("#items ul").removeClass("in");
		$.ajax({
			url : this.pathname,
			success : function(data) {
				fillUpForm(data);
				$("#items ul").addClass("in");
			},
			error : function(d, r) {
				console.log(d);
				console.log(r);
			}
		});
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

		$("#properties button").click(function(){
			$(".dataform").append('<div class="control-group"><label class="control-label">'+$(this).text()+'</label><div class="controls"><input type="'+$(this).next().text()+'" class="input-xlarge" id="input01" name="'+$(this).text()+'"> </div><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
		});
		$(".accordion-heading").click(function(){
			$(".accordion-heading").removeClass("accordion-heading-focus");
			$(this).addClass("accordion-heading-focus");
		})
		$(".breaddisabled").click(function(){ return false});

		$(".breadcrumb a").click(function(){
			
			if(!$(this).hasClass("breaddisabled")){
			$(".breadcrumb a").parent().removeClass("active");
			$(this).parent().addClass("active");
			}
		});
		$(".pager a").click(function(){
			
			
			$(".breadcrumb a").parent().removeClass("active");
			link = $(this).attr("href");
			$(".breadcrumb").find("a").each(function(index){
				if($(this).attr("href") == link){
					$(this).removeClass("breaddisabled")
					$(this).parent().addClass("active");
				}
			});
			
		});
		$("#surcheck").click(function(){
				$("#fileBox").toggle();
		})
		
		$("#step1 input[type=radio]").click(function(){

			$("#step1 input[type=radio]").next().next().hide();
			if($(this).is(":checked")){
			 $("#step1 input[type=radio]:checked").next().next().show();	
			}
		});

		$("#options1 div").not("#options1 div:first-child").hide();
		$("#options1 .icon-plus").parent().click(function(){
			$(this).parent().find("a").hide();
			$(this).parent().next().show();
		});
		$("#options1 .icon-minus").parent().click(function(){
			$(this).parent().hide();
			$(this).parent().prev().find("a").show();
		});
		
		$("#options2 ul li").not("#options2 ul li:first-child").click(function() {
			if($(this).hasClass("selected")){
				$(this).removeClass("selected");
				$(this).parent().parent().next().hide();
			}else{
					  $(this).addClass("selected").siblings().removeClass("selected");
					  $(this).parent().parent().next().show();
			}
		  
		});
		$("#options2 div").not($("#options2 div").eq(0)).hide();
		
		$("#subItem").click(function(){
			$("#itemCreation").submit();
		})
		

}
	
function backbone(){

	var Workspace = Backbone.Router.extend({
	initialize: function(){
			$("#items").hide();
	},
	  routes: {
	    "step1":        "step1",    // #help
	    "step2":        "step2",  // #search/kiwis
	    "step3":        "step3", 
	    "step4":        "step4", 
	   
	  },
	
	  step1: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#items").hide();
	    $("#step1,#step1Info").show();
	  },
	
	  step2: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step2,#step2Info,#items").show();
	    
	  },
	  step3: function(){
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info").hide();
	    $("#step3,#step3Info,#items").show();
	  },
	  step4: function() {
	  	$("#step1,#step2,#step1Info,#step2Info,#step3,#step3Info,#step4,#step4Info,#items").hide();
	    $("#step4,#step4Info").show();
	    
	  },
	
	});
	var w = new Workspace();
	
	Backbone.history.start({root: "/Upload2/"})

	
}

