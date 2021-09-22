function onOpen() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Atualizar tarefas", functionName: "UpdateAll"}];
  ss.addMenu("ClickUp", menuEntries);

  var agora = new Date().getTime();;
  var painel_semana = SpreadsheetApp.getActive().getSheetByName(getInfo("plan_essa_semana"));
  painel_semana.getRange(2,11).setValue(new Date(agora * 1));
  
}


function onEdit(e) {
  
  var activeCell = e.range;
  var r = activeCell.getRow();
  var c = activeCell.getColumn();
  var ss_name = activeCell.getSheet().getName();
  
  if (ss_name == getInfo("plan_essa_semana")
      && r==2 && c==2
      || r==2 && c==5
      || r==2 && c==6
      || r==2 && c==11){
    
    var semana_ss = SpreadsheetApp.getActive().getSheetByName(getInfo("plan_essa_semana"));
    var lr1 = semana_ss.getLastRow();
    var lc1 = semana_ss.getLastColumn();
    
    semana_ss.getRange(6, 2, 1000, lc1-1).setBorder(false, false, false, false, false, false);
    semana_ss.getRange(6, 2, lr1-5, lc1-1).setBorder(true, true, true, true, true, true);}
  
  if (ss_name == getInfo("plan_atrasadas")
      && r==2 && c==5
      || r==2 && c==7
      || r==2 && c==9){
    
    var atrasadas_ss = SpreadsheetApp.getActive().getSheetByName(getInfo("plan_atrasadas"));
    var lr1 = atrasadas_ss.getLastRow();
    var lc1 = atrasadas_ss.getLastColumn();
    
    atrasadas_ss.getRange(6, 2, 1000, lc1-1).setBorder(false, false, false, false, false, false);
    atrasadas_ss.getRange(6, 2, lr1-5,lc1-1).setBorder(true, true, true, true, true, true);}
  
  ;}

function onSelectionChange(e) { 
  
  var activeCell = e.range;
  var r = activeCell.getRow();
  var c = activeCell.getColumn();
  var ss_name = activeCell.getSheet().getName();
  
  if(ss_name == "Tarefas" && r==1 && c==1) {
    
    var semana_ss = SpreadsheetApp.getActive().getSheetByName("Essa semana");
    var lr1 = semana_ss.getLastRow();
    
    semana_ss.getRange(6, 2, 1000, 7).setBorder(false, false, false, false, false, false);
    semana_ss.getRange(6, 2, lr1-5, 7).setBorder(true, true, true, true, true, true);}
  
  var atrasos_ss = SpreadsheetApp.getActive().getSheetByName("Atrasadas");
  var lr2 = atrasos_ss.getLastRow();
  
  atrasos_ss.getRange(5, 2, 1000, 9).setBorder(false, false, false, false, false, false);
  atrasos_ss.getRange(5, 2, lr2-4, 9).setBorder(true, true, true, true, true, true);} 
