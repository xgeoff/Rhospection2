Rhospection.models.ReportItem = Rho.ORM.addModel(function(model) {
	model.modelName("ReportItems");
});

Rhospection.models.Report = Rho.ORM.addModel(function(model) {
  model.modelName("Report");
  //model.enable("sync");
});

function Data_Init() {
	Rho.ORM.databaseFullReset(true, true);
alert('the data is initialized');
	var report = Rhospection.models.Report.create(
	{
		reportid: '1234',
		name:"Test Report",
		author:"gporemba",
		pass:true
	});
	
	Rhospection.models.ReportItem.create(
	{
		report_item_id: '1',
	    reportid: report.get("reportid"),
	    productid:"1234",
	    status:"damaged",
	});
	
	Rhospection.models.ReportItem.create(
	{
		report_item_id: '2',
	    reportid: report.get("reportid"),
	    productid:"4321",
	    status:"fixed",
	});
}

Data_Init();

