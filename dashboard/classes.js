// AQUI FICA DESCRITA A DISPOSIÇÃO DOS DADOS DA TABELA

// função que retorna qual a posição de determinado tipo de dado da tabela
function getColumnIndex(param){

  var tasks_table = [ "task_id",
                      "name",
                      "assignee_username",
                      "status",
                      "start_date",
                      "due_date",
                      "folder",
                      "list",
                      "motivo" ]
  
  return tasks_table.indexOf(param.toString()); 

}

function getArrayFromObject(task_object){

  return [  task_object.task_id,
            task_object.name,
            task_object.assignee_username,
            task_object.status,
            task_object.start_date,
            task_object.due_date,
            task_object.folder,
            task_object.list,
            task_object.motivo ]; }


class TaskFromJSON {

  constructor(task,
              subsystems,
              subsystems_ids,
              datas_inicio,
              datas_inicio_ids,
              atrasos,
              atrasos_ids) {

    // id da tarefa
    this.task_id = task.id;

    // nome da tarefa e seu código no Project
    var n = task.name;
    var ns = n.split(" ")[0];
    var nss = n.split(ns + " ")[1];

      if (isNaN(ns))
      {
        this.name = n;
        this.code = "";
      }

        else
          {
            this.name = nss;
            this.code = parseInt(ns);
          }

    // status da tarefa
    this.status = task.status.status;

    // nome do subsistema
    this.subsystem = findMatch( parseInt(task.project.id),
                                subsystems_ids,
                                subsystems,
                                1 ); 

    // espaço do subsistema
    this.space = task.space.id;
    
    // link de acesso da tarefa
    this.link = task.url;

    // criador da tarefa
    this.creator = task.creator.username;

    // Processar responsáveis
    var assignees = task["assignees"];
    if (assignees[0] == undefined){var assignees_usernames = null; var assignees_ids = null}
    else {function mapAssignee(assignee) {return [assignee.username, assignee.id] }
      var assignees = assignees.map(mapAssignee);
      var assignee_username = assignees[random(0,assignees.length - 1)][0];
      var assignees_ids = assignees[0][1].toString();

      for (var i = 1; i < assignees.length; i++){
        var assignee_id = assignees[i][1].toString();
        var assignees_ids = assignees_ids + ";" + assignee_id; }; }

    // Nome de um dos responsáveis (escolhido aleatoariamente)
    this.assignee_username = assignee_username;

    // Lista de IDs dos responsáveis
    this.assignees_ids = assignees_ids;

    // data de atualização
    this.date_upt = new Date(task.date_updated * 1);

    // data de início
    if (task.start_date == null){this.start_date = "";} else {this.start_date = new Date(task.start_date * 1); }

    // data de início real
    this.real_start = findMatch( task.id,
                                 datas_inicio_ids,
                                 datas_inicio,
                                 1 );

    // data de entrega
    if (task.due_date == null){this.due_date = "";} else {this.due_date = new Date(task.due_date * 1); }

    // data de entrega real
    if (task.date_closed == null){this.date_closed = ""; this.date_closed_week = ""; }
    else {this.date_closed = new Date(task.date_closed * 1);
          this.date_closed_week = Utilities.formatDate(this.date_closed, "GMT-03:00", 'w');}

    // data de criação da tarefa
    this.date_created = new Date(task.date_created * 1);

    // definir motivo de atraso
    this.motivo = findMatch( task.id,
                             atrasos_ids,
                             atrasos,
                             1 );

    // definir a descrição do atraso
    this.descricao = findMatch( task.id,
                                atrasos_ids,
                                atrasos,
                                2 ); }

getArray() { // método que retorna um array com as informações da tarefa
    return getArrayFromObject(this); }; }



class TaskFromTable {

  constructor(planilha) {

    // id da tarefa
    this.task_id = planilha[getColumnIndex("task_id")];

    // nome da tarefa
    this.name = planilha[getColumnIndex("name")];

    // Nome de um dos responsáveis (escolhido aleatoariamente)
    this.assignee_username = planilha[getColumnIndex("assignee_username")];

    // status da tarefa
    this.status = planilha[getColumnIndex("status")];
    
    // link de acesso da tarefa
    this.link = planilha[getColumnIndex("link")];

    // criador da tarefa
    this.creator = planilha[getColumnIndex("creator")];

    // Lista de IDs dos responsáveis
    this.assignees_ids = planilha[getColumnIndex("assignees_ids")];

    // data de atualização
    this.date_upt = planilha[getColumnIndex("date_upt")];

    // data de início
    this.start_date = planilha[getColumnIndex("start_date")];

    // data de entrega
    this.due_date = planilha[getColumnIndex("due_date")];

    // data de início real
    this.real_start = planilha[getColumnIndex("real_start")];

    // data de entrega real
    this.date_closed = planilha[getColumnIndex("date_closed")];

    // semana da data de entrega real
    this.date_closed_week = planilha[getColumnIndex("date_closed_week")];

    // data de criação da tarefa
    this.date_created = planilha[getColumnIndex("date_created")];

    // código do Project
    this.code = planilha[getColumnIndex("code")];

    // definir o campo de motivo do atraso, o valor será calculado posteriormente
    this.motivo = planilha[getColumnIndex("motivo")];

    // definir o campo de descricao do atraso, o valor será calculado posteriormente
    this.descricao = planilha[getColumnIndex("descricao")]; }

getArray() { // método que retorna um array com as informações da tarefa
    return getArrayFromObject(this); }; }


