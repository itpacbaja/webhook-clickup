function RegisterWebHook() {

// REGISTRAR WEBHOOK

// importar informações sobre o request  
var TEAM_ID = getInfo("team");  
var URL = "https://api.clickup.com/api/v2/team/" + TEAM_ID + "/webhook"
var TOKEN = getInfo("token");
var endpointURL = commandScriptApp.getService().getUrl(); 

// endpoint url = commandScriptApp.getService().getUrl();

// corpo da request, colocar as especificações do webhook aqui
var body = {
  'endpoint': endpointURL,
  'events': [ 'taskStatusUpdated',
              'taskCommentPosted',
              'taskCommentUpdated',
              'taskDeleted' ] 
            };

// transformar o corpo da request em JSON      
var body = JSON.stringify(body);

// configurãções do request (opções e cabeçalho)
var options = { 'method':'post',
                'contentType': 'application/json',
                'payload': body,
  
      headers: { 'contentType': 'application/json',
              'Authorization': TOKEN}
              }

// realizar o request (registrar webhook)  
var response = UrlFetchApp.fetch(URL, options);

// registrar o conteúdo da request no log
Logger.log(response.getContentText()); }
    
  

function getWebhooks() {
    
// OBTER LISTA COM WEBHOOKS
  
// importar informações sobre o request    
var TEAM_ID = getInfo("team");  
var URL = "https://api.clickup.com/api/v2/team/" + TEAM_ID + "/webhook";
var TOKEN = getInfo("token");

// configurãções do request
var options = {headers: {Authorization: TOKEN}}

// realizar o request (obter webhooks) 
var response = UrlFetchApp.fetch(URL, options);
var info = JSON.parse((response.getContentText()));

// registrar o conteúdo da request no log
Logger.log(info); }
    
    
    
function UpdateWebHook() {

// ATUALIZAR WEBHOOK

// importar informações sobre o request  
var webhook_id = "1MmOp63nlXgluRnxW39Vbi2d9sN3koRnVdFk_pfbubvTvPs2969SZ0LBS";
var URL = "https://api.clickup.com/api/v2/webhook/" + webhook_id;
var TOKEN = getInfo("token");

// corpo da request, redefina as especificações do webhook aqui
var body = {
  'events': [
    'taskUpdated',
    'taskCommentPosted',
    'taskCommentUpdated',
    'taskTagUpdated']
  };

// transformar o corpo da request em JSON        
var body = JSON.stringify(body);

// configurãções do request (opções e cabeçalho)
var options = { 'method':'PUT',
                'contentType': 'application/json',
                'payload': body,
  
      headers: { 'contentType': 'application/json',
              'Authorization': TOKEN
                }
              }

// realizar o request (atualizar webhooks)   
var response = UrlFetchApp.fetch(URL, options);

// registrar o conteúdo da request no log    
Logger.log(response.getContentText()); }



function deleteWebHooks() {

  // DELETAR WEBHOOKS
    
  // importar informações sobre o request 
  var webhook_id = "1YnQ6UCHamoEmDJsNj8clhx6m1NO-yik0IeMG9zxafCI";
  var URL = "https://api.clickup.com/api/v2/webhook/" + webhook_id;
  var TOKEN = getInfo("token");

  // configurãções do request (opções e cabeçalho)
  var options = { 'method':'DELETE',
                  'contentType': 'application/json',
                  headers: {Authorization: TOKEN}}

  // realizar o request (deletar webhook) 
  UrlFetchApp.fetch(URL, options); 
}