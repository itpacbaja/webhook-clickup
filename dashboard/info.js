function getInfo(param1,param2) {

	var info = {'token': "pk_3013429_M0V9FI7AF7Y6762RINOZKCNKPA2XYLUD",
				'team': "3003982",
				'spaces': {'projeto': "3006396", 'adm': "3006905"},
                'projects_id': {'projeto': "3171135", 'adm': "3183969"},

				'dados_DriveId': "1YnQ6UCHamoEmDJsNj8clhx6m1NO-yik0IeMG9zxafCI",

				'plan_tarefas': "Tarefas",
				'plan_membros': "Membros",
				'plan_subsistemas': "Subsistemas",
				'plan_datas_de_inicio': "Datas de início",
				'plan_atrasos': "Atrasos",

                'plan_dash': "Dash",
				'plan_ids': "IDs",
				'plan_essa_semana': "Essa semana",
				'plan_atrasadas': "Atrasadas"}

    if (param2 == null) { return info[param1] } else { return info[param1][param2].toString(); } }


// informações sobre o ClickUp e API

function getToken() { return "pk_3013429_M0V9FI7AF7Y6762RINOZKCNKPA2XYLUD"; }

function getTeamID() { return "3074663"; }

function getSpaceID() { return "3151661";}

function getSpaceIDs() {
  
  var id_projeto = "3151661";
  var id_adm = "3151665";
  var string =  (id_projeto + "&space_ids%5B%5D=" + id_adm).toString();
  
  return string; }

// Arquivo com todos os dados

function Pasta_Dados() { return "1YnQ6UCHamoEmDJsNj8clhx6m1NO-yik0IeMG9zxafCI";}

// informações sobre as planilhas de dados

function Plan_Tarefas() { return "Tarefas"; }

function Plan_Membros() { return "Membros"; }

function Plan_Subsistemas() { return "Subsistemas"; }

function Plan_DatasInicio() { return "Datas de início"; }

// informações as planilhas dos painéis

function Plan_IDs() { return "IDs"; }

function Plan_Semana() { return "Essa semana"; }

function Plan_Atraso() { return "Atrasadas"; }

