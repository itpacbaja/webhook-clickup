function getSpreadsheetData(spreadsheet,drive_id,columns){

  var ss = SpreadsheetApp.openById(drive_id).getSheetByName(spreadsheet);
  var lr = ss.getLastRow();
  
  if (columns == 0){ var lc = ss.getLastColumn(); }
  else { var lc = columns; }

  var ss_data = ss.getRange(3, 1, lr, lc).getValues().filter(removerNulos);

  return ss_data; }



 function findMatch(looking_for_this,in_this,find_match_here,in_this_column){

    var index = in_this.indexOf(looking_for_this);
      if (index > -1){ return find_match_here[index][in_this_column]} else { return ""};

  }



// função que remove linhas nulas

function removerNulos(row) {
  
  if (row == null) { return false; } 
  
  else if (row.length > 1)
  
  {
    
    if (row[0] == null || row[0] == "") { return false; }
    
    else { return true; }
  
  }
  
  else { return true; };}



// função que retorna um valor aleatório

function random(min, max) { const num = Math.floor(Math.random() * (max - min + 1)) + min; return num;}



