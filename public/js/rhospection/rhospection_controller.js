Rhospection.controllers.Report = new function() {

	this.listCallback = function() {
		
		// first do a search for the reports
		var reports = Rhospection.models.Report.find();
		//alert("There are " + reports.length + " reports");
		
		// now populate the UI with the reports data
		
		// first clear the existing list
		$('.list-group').html('');
		
		// now check and see if there are any reports to show
		if (reports.length > 0) {
			Rhospection.reports = reports;
			
			$('.panel').show();
			
			$.get(  
		        "/public/report_list_item.htm",  
		        null,  
		        Rhospection.controllers.Report.row,  
		        "html"  
			);
			
		  } else {
		      $('.panel').hide();
		  }
	};
	
	this.row = function(responseText) {
		var reports = Rhospection.reports;
		var reportIcon = null;
		// show the total number of reports
	    $('.panel-heading').append('<span class="badge pull-right">' + reports.length + ' Reports</span>');

	    start_index = 0;
	    end_index = Rhospection.listRows;
	    
	    if(end_index > reports.length) {
	    	end_index = reports.length;
	    }

	    var listGroup = $(".list-group");
	    
	    var listItem = null;
	    var anchor = null;
	    
	    for(var index=start_index; index < end_index; index++) {

	    	if(reports[index].get('pass')=="true") {
	    		reportIcon = "<i class='pull-left icon icon-ok-circle icon-success icon-large'></i>";
	    	} else {
	    		reportIcon = "<i class='pull-left icon icon-warning-sign icon-warning icon-large'></i>";
	    	}
	    	
	    	var reportid = String(reports[index].get("reportid"));
	    	
	    	var conditions = {
				conditions:{reportid:reportid}
		    };
			
			var reportItemsCount = Rhospection.models.ReportItem.find('count', conditions);
			
	    	listItem = listGroup.append(responseText);
	    	anchor = listItem.find('a');
	    	anchor.click(function(){Rhospection.controllers.Report.show(reportid);});
			anchor.before(reportIcon);
	    	listItem.find(".rhospection-reportid").replaceWith(reportid);
	    	listItem.find(".rhospection-report-name").replaceWith(reports[index].get("name"));
	    	listItem.find(".rhospection-report-author").replaceWith(reports[index].get("author"));
	    	listItem.find(".rhospection-report-items-count").replaceWith(String(reportItemsCount));	
	    }
	    
	    Rhospection.reports = null;
	}
	
	this.list = function() {
		Rhospection.contentCall("/public/report_list.htm", this.listCallback);
	};

	this.showCallback = function() {

		//step 1: create the filter conditions
		var conditions = {
			conditions:{reportid:Rhospection.currentId}
	    };
	    //step 2: query the db for the report
		var report = Rhospection.models.Report.find('first', conditions);
		var heading = $(".panel-heading");
		//step 3: populate the name and author fields on the form
		heading.find(".rhospection-report-name").append(report.get("name"));
		heading.find(".rhospection-report-author").append(report.get("author"));
		
		$.get(  
	        "/public/report_item.htm",  
	        null,  
	        Rhospection.controllers.ReportItems.listCallback,  
	        "html"  
		);
	};
	
	this.show = function(id) {
		Rhospection.currentId = String(id);
		Rhospection.contentCall("/public/report_show.htm", this.showCallback);
	};
	
	this.createCallback = function(responseText) {
		$(".modal-body").html(responseText);
		$('.modal').modal('show');
	};

	this.create = function() {
		$.get(  
	        "/public/report_create.htm",  
	        null,  
	        Rhospection.controllers.Report.createCallback,  
	        "html"
		);
		//Rhospection.contentCall("/public/report_create.htm", null);
	};
	
	this.saveCallback = function() {

		//step 1: create the filter conditions
		var conditions = {
			conditions:{reportid:Rhospection.currentId}
	    };
	    //step 2: query the db for the report
		var report = Rhospection.models.Report.find('first', conditions);
		var heading = $(".panel-heading");
		//step 3: populate the name and author fields on the form
		heading.find(".rhospection-report-name").append(report.get("name"));
		heading.find(".rhospection-report-author").append(report.get("author"));
		
		$.get(  
	        "/public/report_items_show.htm",  
	        null,  
	        Rhospection.controllers.ReportItems.show,  
	        "html"  
		);
		
	};
	
	this.save = function() {
		
		var formInfo = $('#rhospection-report-create').serializeArray();
		var currentDate = new Date();
		var report = Rhospection.models.Report.make();
		
		for(var index = 0;index < formInfo.length;index++) {
			report[formInfo[index].name] = formInfo[index].value;
		}
		
		report["author"] = "gporemba";
		report["date"] = currentDate.getMilliseconds();
		report.save();
		report["reportid"] = report.object();
		report.save();
		Rhospection.currentId = String(report.object());
		
		$.get(  
	        "/public/report_show.htm",  
	        null,  
	        Rhospection.controllers.Report.saveCallback,  
	        "html"  
		);
		
	}
};

Rhospection.controllers.ReportItems = new function() {
	this.listCallback = function(responseText) {

		var conditions = {
			conditions:{reportid:Rhospection.currentId}
	    };

		var reportItems = Rhospection.models.ReportItem.find('all', conditions);

		for(var index = 0; index < reportItems.length; index++) {
			$(".list-group").append(responseText);
			$("#productid").replaceWith(reportItems[index].get("productid"));
			$("#product-status").replaceWith(reportItems[index].get("status"));
		}
	};
	
	this.showCallback = function(responseText) {
		var conditions = {
			conditions:{reportid:Rhospection.currentId}
	    };

		var reportItems = Rhospection.models.ReportItem.find('all', conditions);
		var listGroup = $(".list-group");
		
		for(var index = 0; index < reportItems.length; index++) {
			listGroup.append(responseText);
			listGroup.find("#product-status").replaceWith(reportItems[index].get("status"));
			listGroup.find("#product-id").replaceWith(reportItems[index].get("productid"));
			//listGroup.find("#report-item-id").replaceWith(reportItems[index].object);
		}
	};
	
	this.show = function() {
		
		$.get(  
	        "/public/reportitem_show.htm",  
	        null,  
	        Rhospection.controllers.ReportItems.showCallback,  
	        "html"  
		);

	};
}