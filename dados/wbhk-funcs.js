function doPost(e) {

// ESSA FUNÇÃO É ACIONADA QUANDO NOSSO WEB APP RECEBE UM POST REQUEST DO WEBHOOK DO CLICKUP

// informações do post request recebido  
var data = JSON.parse(e.postData.contents);
var task_id = data["task_id"];

// adicionar data de início real à planilha
if (data["event"] == "taskStatusUpdated" &&
	data["history_items"][0]["before"].status == "por vir" &&
	data["history_items"][0]["after"].status == ("em andamento" || "entregue"))
{
    var date = new Date(data["history_items"][0]["date"] * 1);
  
	plotWebhookData([task_id, date],getInfo("plan_datas_de_inicio"));
} 

else if (data["event"] == ("taskCommentPosted" || "taskCommentUpdated"))

{
    var comment_text = data["history_items"][0]["comment"]["text_content"];
  
	plotWebhookData(buscarMotivo(task_id,comment_text),getInfo("plan_atrasos"));
}

else if (data["event"] == "taskDeleted")

{
	deletarTarefa(task_id);
}

  return HtmlService.createHtmlOutput("VoaPacBaja");
  // por padrão, devemos retornar uma resposta em html para o ClickUp avisando que recebemos o post request 

}



function doGet(e) {

// por padrão, devemos retornar uma resposta em html para o ClickUp avisando que recebemos o get request 
return HtmlService.createHtmlOutput("VoaPacBaja");}