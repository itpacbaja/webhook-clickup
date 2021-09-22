function UpdateAll() {

  // IMPORTAR DADOS

  var plan_tarefas = getInfo("plan_tarefas");
  var plan_subsistemas = getInfo("plan_subsistemas");
  var plan_datas_de_inicio = getInfo("plan_datas_de_inicio");
  var plan_atrasos = getInfo("plan_atrasos")
  var drive_id = getInfo("dados_DriveId");

  // planilha de tarefas
  var ss = SpreadsheetApp.openById(drive_id).getSheetByName(plan_tarefas);

  // planilha de subsistemas
  var ss_ids = SpreadsheetApp.openById(drive_id).getSheetByName(plan_subsistemas);

  // planilha de datas de início
  var ss_start_dates = SpreadsheetApp.openById(drive_id).getSheetByName(plan_datas_de_inicio);

  // salvar todas as tarefas que estão na planilha em um array
  var planilha_array = getSpreadsheetData(plan_tarefas,drive_id,0);

  // salvar dados como objetos
  var planilha = [];
  for (i = 0; i < planilha_array.length; i++)
    {var planilha = planilha.concat(new TaskFromTable(planilha_array[i])); }

  // pegar data de atualização mais recente da planilha
  if (planilha_array.length == 0){

    var update_cell = null; }

  else {

    var update_cell = planilha[0].date_upt; } // célula onde procurar a data de atualiação mais recente

  var validation_date = 1565805600; // data de referência (formato epoch) para saber se o valor da célula é realmente uma data válida

  // avaliar se o conteúdo da célula é uma data válida, caso contrário, atribuir a data de refêrencia como última atualização
  if ( new Date(update_cell).getTime() > validation_date
       && update_cell != null )

    { var update_planilha = update_cell.getTime(); }

  else

    { var update_planilha = validation_date;};

  // pegar os dados da planilha de subsistemas e IDs
  var subsystems = getSpreadsheetData(plan_subsistemas,drive_id,2);
  var subsystems_ids = subsystems.map(function(row){ return row[0]; })
  
  // importar registro de datas de início
  var datas_inicio = getSpreadsheetData(plan_datas_de_inicio,drive_id,2);
  var datas_inicio_ids = datas_inicio.map(function(row){ return row[0]; }); 

  // importar registro de atrasos
  var atrasos = getSpreadsheetData(plan_atrasos,drive_id,0);
  var atrasos_ids = atrasos.map(function(row){ return row[0]; }); 
  


  // DEFINIR OS PARÂMETROS INICIAIS DO REQUEST

  // pegar a data de agora e defini-la como referência para a API request
  var agora = new Date().getTime();
  var last_update = agora;  

  // criar o array base no qual as informações da url serão armazenadas
  var base = [];
  
  // url da API request e seus parâmetros: time, espaço e token
  var TOKEN = getInfo("token");
  var TEAM_ID = getInfo("team");
  var SPACE_ID = getSpaceIDs();
  var URL_before = "https://api.clickup.com/api/v2/team/" +
                    TEAM_ID +
                   "/task?space_ids%5B%5D=" +
                    SPACE_ID +
                   "&subtasks=true&include_closed=true&order_by=updated&date_updated_lt=";
  var URL_after = "&statuses%5B%5D=parada&statuses%5B%5D=por%20vir&statuses%5B%5D=entregue&statuses%5B%5D=em%20andamento&statuses%5B%5D=atrasada";



  // ITERAÇÃO DE REQUESTS

  do { // aqui vamos puxar bloco por bloco de 100 tarefas e concatená-los em um objeto
    
  // url final da API request
  var API_URL = (URL_before + last_update + URL_after);

  // cabeçalho do request da url
  var options = {headers: {Authorization: TOKEN}}
  
  // puxar os dados da API e converte-los para um formato adequado de processamento
  var response = UrlFetchApp.fetch(API_URL, options);
  var raw = JSON.parse((response.getContentText()));
  var tasks_block = raw["tasks"];

  // concatenar o bloco no array base
  var base = base.concat(tasks_block);
    
  // pegar a data de atualização mais antiga do bloco como referência para a próxima iteração
  var last_update = tasks_block[tasks_block.length - 1].date_updated;

  // boolean para orientar continuação do código

  // se não houver dados em cache na planilha, se basear no tamanho dos blocos
  if (update_planilha == validation_date) {
    if (tasks_block.length == 100){ var is_ok = true; }
    else { var is_ok = false; }; }
  
  // se houver dados em cache, se basear na data de atualização das tarefas 
  else { if (last_update > update_planilha) { var is_ok = true; }
         else { var is_ok = false; }; }
  
      } while ( is_ok == true );
      // enquanto o bloco possuir 100 tarefas,
      // ou enquanto a última atualização do bloco for mais recente que a última atualização da planilha, continuar iterando
  


  // TRATAR DOS DADOS DA API
  
  // função para processar as informações das tarefas e compilar os dados em um array
  
  // salvar dados como objetos
  var new_tasks_data = [];
  
  for (i = 0; i < base.length; i++){
    if ( base[i].date_updated > update_planilha
         &&
         ( base[i].project.id != getInfo("projects_id","projeto")
            &&
           base[i].project.id != getInfo("projects_id","adm") ) ) {
    
    // objeto processado com todos os dados relevantes das tarefas
    var new_tasks_data = new_tasks_data.concat(new TaskFromJSON(base[i],
                                                                subsystems,
                                                                subsystems_ids,
                                                                datas_inicio,
                                                                datas_inicio_ids,
                                                                atrasos,
                                                                atrasos_ids));}}
  
  // ids das tarefas mais recentes
  var recentes_id = new_tasks_data.map(function(task){ return task.task_id; })



  // MONTAR ARRAY COM TODAS AS TAREFAS
  
  // agrupar os ids das tarefas da planilha
  var ids_planilha = planilha.map(function(task){ return task.task_id; });

  // função para filtrar as tarefas antigas do array da planilha, mantendo apenas tarefas inalteradas
  function removeOldTasks(task) { var index = recentes_id.toString().indexOf(task.task_id.toString());

    if (index > -1) { return false; } else { return true; }; }

  // array da planilha sem os dados antigos
  var planilha_new = planilha.filter(removeOldTasks);

  // array com todas as tarefas atualizadas
  var tasks_data = new_tasks_data.concat(planilha_new);



  // CONVERTER OBJETOS EM ARRAYS

  for (i = 0; i < tasks_data.length; i++){ tasks_data[i] = tasks_data[i].getArray(); }


  // PLOTANDO TODAS AS TAREFAS NA PLANILHA

  // limpar a planilha
  ss.getRange(3, 1, 5000, 21).clearContent();

  // plotar os dados na planilha
  ss.getRange(3, 1, tasks_data.length, tasks_data[0].length).setValues(tasks_data);



  // ATUALIZAR FORMATAÇÃO

  // definir planilhas em variáveis para facilitar código
  var ss_atrasos = SpreadsheetApp.getActive().getSheetByName(getInfo("plan_atrasadas"));
  var semana_ss = SpreadsheetApp.getActive().getSheetByName(getInfo("plan_essa_semana"));

  // pegar número de linhas e colunas das planilhas de atraso e painel da semana
  var lr1 = semana_ss.getLastRow();
  var lc1 = semana_ss.getLastColumn();

  var lr2 = ss_atrasos.getLastRow();
  var lc2 = ss_atrasos.getLastColumn();

  // limpar planilhas para evitar bugs
  semana_ss.getRange(5, 2, 500, lc1).clearContent();
  ss_atrasos.getRange(5, 2, 100, lc2).clearContent();

  //ajustar formatação das planilhas                     
  semana_ss.getRange(6, 2, 500, lc1-1).setBorder(false, false, false, false, false, false);
  semana_ss.getRange(6, 2, lr1-5, lc1-1).setBorder(true, true, true, true, true, true);

  ss_atrasos.getRange(5, 2, 100, lc2-1).setBorder(false, false, false, false, false, false);
  ss_atrasos.getRange(5, 2, lr2-4, lc2-1).setBorder(true, true, true, true, true, true); 



  // EMITIR AVISO DE CONCLUSÃO DO SCRIPT
  
  SpreadsheetApp.getActiveSpreadsheet().toast('O dashboard foi atualizado com sucesso', 'ClickUp');

  // ATUALIZAR DATA DE ATUALIZAÇÃO
  
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(getInfo("plan_dash")).getRange(1,4).setValue(new Date(agora * 1)); } 