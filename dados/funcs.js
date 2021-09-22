function plotWebhookData(data_array, spreadsheet) {

  var ss_data = getSpreadsheetData(spreadsheet);
  
  // adicionar nova tarefa em andamento na lista
  var plot = ss_data.concat([data_array]);

  SpreadsheetApp.getActive().getSheetByName(spreadsheet).getRange(3, 1, plot.length, plot[0].length).setValues(plot);

 }

 

function buscarMotivo(task_id,comment_text) {
    
  // texto do comentário em string
  var comment_text = comment_text.toString();
  
  // OBS: formato padrão do comentário: "MOTIVO PESSOAL: Eu estava sobrecarregado e atrasei a entrega."
  
  // caso o comentário possua a palavra-chave MOTIVO, rodar o código
  if (comment_text.indexOf("MOTIVO") > -1) { 
    
    // splitar o texto por espaço e pegar o segundo termo
    var split1 = comment_text.split(" ")[1];
    
    // splitar por ":" e pegar o primeiro termo ("PESSOAL") e deixar minúsculo
    var motivo = split1.split(":")[0].toString().toLowerCase();
    
    // pegar o segundo termo do split ("Eu estava sobrecarregado e atrasei a entrega.)
    var descricao = comment_text.split(": ")[1].toString();
    var descricao = descricao.split("\n")[0].toString().toLowerCase(); // remover quebra de linha
    
    return [task_id, motivo, descricao]; } }



function deletarTarefa(task_id){

  var plan = getInfo("plan_tarefas");
  var ss_data = getSpreadsheetData(plan).filter (

    function filtrarDeletadas(task) {

      if (task[0] == task_id) { return false; }

      else { return true; }

    });
  
  var ss = SpreadsheetApp.getActive().getSheetByName(plan);

  // limpar a planilha para não gerar conflito com os dados pré-existentes na planilha
  ss.getRange(3, 1, 5000, ss_data[0].length).clearContent();
  ss.getRange(3, 1, ss_data.length, ss_data[0].length).setValues(ss_data); 

}



function getSpreadsheetData(spreadsheet){

  var ss = SpreadsheetApp.getActive().getSheetByName(spreadsheet);
  var lr = ss.getLastRow();
  var lc = ss.getLastColumn();
  var ss_data = ss.getRange(3, 1, lr, lc).getValues().filter(removerNulos);

  return ss_data; }



function removerNulos(row) {
  
  if (row[0] == null || row[0] == "") { return false; } 
  
  else { return true; };}