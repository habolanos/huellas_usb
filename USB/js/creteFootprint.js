$(function(){
    $('#buttonGuardarHuella').hide();
    //LISTAR DBA
    var parameters = {'object':'dbaUser','method':'listDba','parameters':'0'};
    $.ajax({
            url:'../controller/frontController.php',
            type:'POST',
            data:parameters,
            beforeSend: function(objeto){
            $("#response").html("<img src='../images/loader.gif'>");
            },
            success:function(data)
            {
                $("#response").html("");
                var parsed = JSON.parse(data);
                if (parsed.type==='success')
                {   
                    var strPrintout="<option value='0' selected>Seleccionar DBA</option>";
                    //ARMAR STRING
                    for(var x in parsed.data)
                    {
                        //console.warn(parsed.data[x]['nombre_departamento']);
                        strPrintout+="<option value="+parsed.data[x]['ID_DBA']+">"+parsed.data[x]['NAME']+"</option>";  
                    } 
                    $(selectDba).html(strPrintout); 
                }
                else 
                {
                    var strPrintout='';
                    strPrintout+='<div class="alert alert-danger" role="alert">';
                    strPrintout+='<center>'+parsed.msg+'</center>';
                    strPrintout+='</center>';
                    strPrintout+='</div>';
                    $("#response").html(strPrintout);
                }  
            }
    })
});	
/**
* Este metodo para cargar las credenciales
* *@return:json con las variables de las credenciales
* @author:Andres Felipe Quintero 2020-05-18
* @version:1.0
*/
$("#selectDba").change(function(){
    var id=selectDba.value;
    var arrData = new Object();
    arrData.ID_DBA=id;
    if(id!='0'){
        var parameters = {'object':'dbaUser','method':'viewDba','parameters':arrData};
        $.ajax({
                url:'../controller/frontController.php',
                type:'POST',
                data:parameters,
                beforeSend: function(objeto){
                $("#response").html("<img src='../images/loader.gif'>");
                },
                success:function(data)
                {
                    $("#response").html("");
                    var parsed = JSON.parse(data);
                    if (parsed.type==='success')
                    {   
                        $("#strIp").val(parsed.data['0']['IP']);
                        $("#strDbaName").val(parsed.data['0']['NAME']);
                        $("#strUser").val(parsed.data['0']['USER']);
                        $("#strPassword").val(parsed.data['0']['PASSWORD']);
                        $("#tablasData").html('');
                        $("#rutinasData").html('');
                        $("#triggersData").html('');
                        $("#vistasData").html('');
                        $("#versionData").html('');
                        $('#buttonGenerarHuella').show();
                    }
                    else 
                    {
                        var strPrintout='';
                        strPrintout+='<div class="alert alert-danger" role="alert">';
                        strPrintout+='<center>'+parsed.msg+'</center>';
                        strPrintout+='</center>';
                        strPrintout+='</div>';
                        $("#response").html(strPrintout);
                        $("#tablasData").html('');
                        $("#rutinasData").html('');
                        $("#triggersData").html('');
                        $("#vistasData").html('');
                        $("#versionData").html('');
                        $('#buttonGenerarHuella').show();
                    }  
                }
        });
    }else{
        $("#strIp").val('');
        $("#strDbaName").val('');
        $("#strUser").val('');
        $("#strPassword").val('');
    }        
 });   
/**
* @method Este metodo para crear Huella
* @author:Andres Felipe Quintero 2020-05-22
* @return JSON con informacion si se creo o no
* @version:1.0
*/
$("#buttonGenerarHuella").click(function(){
	//console.warn('button');
    if(!(validarCampoSelect(selectDba,1,'Selecionar DBA')== false)){

        //console.warn("entro");
		//ARMAR OBJETO
		var arrData = new Object();
        arrData.ID_DBA=selectDba.value;
        arrData.USER=strUser.value;
        arrData.PASSWORD=strPassword.value;
        arrData.IP=strIp.value;
        arrData.DB_NAME=strDbaName.value;
        //console.warn(arrData);	
        if (confirm('¿Estas seguro que desea generar la Huella'))
        { 
			var parameters = {'object':'footPrint','method':'generarHuella','parameters':arrData};
		    $.ajax({
		            url:'../controller/frontController.php',
		            type:'POST',
		            data:parameters,
		            beforeSend: function(objeto){
		            $("#response").html("<img src='../images/loader.gif'>");
		            },
		            success:function(data)
		            {
		                $("#response").html("");
		                var parsed = JSON.parse(data);
		                console.warn(parsed);
		                if (parsed.type==='success')
		                {   
                           //PINTAR VERSIONES
                            var strPrintoutVersiones='';
                            if(parsed.data.versiones.length > 0){
                                console.warn("entro");
                                for(var x in parsed.data.versiones)
                                    {
                                        //console.warn(x);
                                        //console.warn(parsed.data.tablas[x].TABLA);
                                        strPrintoutVersiones+='<div class="form-row">';
                                        strPrintoutVersiones+='<div class="form-group col-md-3">';
                                        strPrintoutVersiones+='<label for="name">Nombre de la Variable:</label>';
                                        strPrintoutVersiones+='<input type="text" class="form-control" value="'+parsed.data.versiones[x].Variable_name+'" disabled>';
                                        strPrintoutVersiones+='</div>';
                                        strPrintoutVersiones+='<div class="form-group col-md-9">';
                                        strPrintoutVersiones+='<label for="lastname">Codigo sha256</label>';
                                        strPrintoutVersiones+='<input type="text" class="form-control"value="'+parsed.data.versiones[x].sha256+'" disabled>';
                                        strPrintoutVersiones+='</div>';
                                        strPrintoutVersiones+='</div>';
                                    } 
                            }else{
                                    strPrintoutVersiones+='<div class="alert alert-warning" role="alert">';
                                    strPrintoutVersiones+='<center>No Contiene tablas la dba</center>';
                                    strPrintoutVersiones+='</center>';
                                    strPrintoutVersiones+='</div>';
                            }
                            $("#versionData").html(strPrintoutVersiones);  
                           //PINTAR TABLAS
                           //console.warn(parsed.data.tablas);
                           //console.warn(parsed.data.tablas.length);
                           var strPrintoutTablas='';
                           if(parsed.data.tablas.length > 0){
                               //console.warn("entro");
                               for(var x in parsed.data.tablas)
                                {
                                    //console.warn(x);
                                    //console.warn(parsed.data.tablas[x].TABLA);
                                    strPrintoutTablas+='<div class="form-row">';
                                    strPrintoutTablas+='<div class="form-group col-md-3">';
                                    strPrintoutTablas+='<label for="name">Nombre de la Tabla:</label>';
                                    strPrintoutTablas+='<input type="text" class="form-control" value="'+parsed.data.tablas[x].TABLA+'" disabled>';
                                    strPrintoutTablas+='</div>';
                                    strPrintoutTablas+='<div class="form-group col-md-9">';
                                    strPrintoutTablas+='<label for="lastname">Codigo sha256</label>';
                                    strPrintoutTablas+='<input type="text" class="form-control"value="'+parsed.data.tablas[x].sha256+'" disabled>';
                                    strPrintoutTablas+='</div>';
                                    strPrintoutTablas+='</div>';
                                } 
                           }else{
                                strPrintoutTablas+='<div class="alert alert-warning" role="alert">';
                                strPrintoutTablas+='<center>No Contiene tablas la dba</center>';
                                strPrintoutTablas+='</center>';
                                strPrintoutTablas+='</div>';
                           }
                           $("#tablasData").html(strPrintoutTablas); 
                           //PINTAR RUTINAS
                           var strPrintoutRutinas='';
                           if(parsed.data.rutinas.length > 0){
                                //console.warn("entro");
                                for(var x in parsed.data.rutinas)
                                {
                                    //console.warn(x);
                                    //console.warn(parsed.data.tablas[x].TABLA);
                                    strPrintoutRutinas+='<div class="form-row">';
                                    strPrintoutRutinas+='<div class="form-group col-md-3">';
                                    strPrintoutRutinas+='<label for="name">Nombre de la Rutina:</label>';
                                    strPrintoutRutinas+='<input type="text" class="form-control" value="'+parsed.data.rutinas[x].ROUTINE_NAME+'" disabled>';
                                    strPrintoutRutinas+='</div>';
                                    strPrintoutRutinas+='<div class="form-group col-md-2">';
                                    strPrintoutRutinas+='<label for="name">Tipo de rutina:</label>';
                                    strPrintoutRutinas+='<input type="text" class="form-control" value="'+parsed.data.rutinas[x].ROUTINE_TYPE+'" disabled>';
                                    strPrintoutRutinas+='</div>';
                                    strPrintoutRutinas+='<div class="form-group col-md-7">';
                                    strPrintoutRutinas+='<label for="name">Codigo sha256:</label>';
                                    strPrintoutRutinas+='<input type="text" class="form-control" value="'+parsed.data.rutinas[x].sha256+'" disabled>';
                                    strPrintoutRutinas+='</div>';
                                    strPrintoutRutinas+='</div>';
                                } 
                            }else{
                                //console.warn("no encontro rutinas");
                                strPrintoutRutinas+='<div class="alert alert-warning" role="alert">';
                                strPrintoutRutinas+='<center>No contienen rutinas la DBA</center>';
                                strPrintoutRutinas+='</center>';
                                strPrintoutRutinas+='</div>';
                            }
                            $("#rutinasData").html(strPrintoutRutinas);
                            //PINTAR Triggers
                            var strPrintoutTriggers='';
                            if(parsed.data.triggers.length > 0){
                                    //console.warn("entro");
                                    for(var x in parsed.data.triggers)
                                    {
                                        //console.warn(x);
                                        //console.warn(parsed.data.tablas[x].TABLA);
                                        strPrintoutTriggers+='<div class="form-row">';
                                        strPrintoutTriggers+='<div class="form-group col-md-3">';
                                        strPrintoutTriggers+='<label for="name">Nombre del Trigger:</label>';
                                        strPrintoutTriggers+='<input type="text" class="form-control" value="'+parsed.data.triggers[x].TRIGGER_NAME+'" disabled>';
                                        strPrintoutTriggers+='</div>';
                                        strPrintoutTriggers+='<div class="form-group col-md-9">';
                                        strPrintoutTriggers+='<label for="name">Codigo sha256:</label>';
                                        strPrintoutTriggers+='<input type="text" class="form-control" value="'+parsed.data.triggers[x].sha256+'" disabled>';
                                        strPrintoutTriggers+='</div>';
                                        strPrintoutTriggers+='</div>';
                                    } 
                            }else{
                                //console.warn("no encontro rutinas");
                                strPrintoutTriggers+='<div class="alert alert-warning" role="alert">';
                                strPrintoutTriggers+='<center>No contienen triggers la DBA</center>';
                                strPrintoutTriggers+='</center>';
                                strPrintoutTriggers+='</div>';
                            }
                            $("#triggersData").html(strPrintoutTriggers);
                            //PINTAR LAS VISTAS
                            var strPrintoutVistas='';
                            if(parsed.data.vistas.length > 0){
                                    //console.warn("entro");
                                    for(var x in parsed.data.vistas)
                                    {
                                        //console.warn(x);
                                        //console.warn(parsed.data.tablas[x].TABLA);
                                        strPrintoutVistas+='<div class="form-row">';
                                        strPrintoutVistas+='<div class="form-group col-md-3">';
                                        strPrintoutVistas+='<label for="name">Nombre de la vista:</label>';
                                        strPrintoutVistas+='<input type="text" class="form-control" value="'+parsed.data.vistas[x].TABLE_NAME+'" disabled>';
                                        strPrintoutVistas+='</div>';
                                        strPrintoutVistas+='<div class="form-group col-md-9">';
                                        strPrintoutVistas+='<label for="name">Codigo sha256:</label>';
                                        strPrintoutVistas+='<input type="text" class="form-control" value="'+parsed.data.vistas[x].sha256+'" disabled>';
                                        strPrintoutVistas+='</div>';
                                        strPrintoutVistas+='</div>';
                                    } 
                            }else{
                                //console.warn("no encontro rutinas");
                                strPrintoutVistas+='<div class="alert alert-warning" role="alert">';
                                strPrintoutVistas+='<center>No contienen vistas la DBA</center>';
                                strPrintoutVistas+='</center>';
                                strPrintoutVistas+='</div>';
                            }
                            $("#vistasData").html(strPrintoutVistas);
                            //PINTAR MENSAJE DE HUELLA   
                            var strPrintout='';
                            strPrintout+='<div class="alert alert-success" role="alert">';
                            strPrintout+='<center>'+parsed.msg+'</center>';
                            strPrintout+='</center>';
                            strPrintout+='</div>';
                            $("#response").html(strPrintout);
                            //ESNCONDER BOTON DE GUARDAR
                            $('#buttonGenerarHuella').hide();
		                }
		                else if(parsed.type==='errorSession')
		                {
		                    //console.warn('error en session');
		                    //location.href='../index.php';
		                    var strPrintout='';
		                    strPrintout+='<div class="alert alert-danger" role="alert">';
		                    strPrintout+='<center>Recargar session nuevamente</center>';
		                    strPrintout+='<center>'+parsed.msg+'</center>';
		                    strPrintout+='</center>';
		                    strPrintout+='</div>';
		                    $("#response").html(strPrintout);
		                }
		                else 
		                {
		                    var strPrintout='';
		                    strPrintout+='<div class="alert alert-danger" role="alert">';
		                    strPrintout+='<center>'+parsed.msg+'</center>';
		                    strPrintout+='</center>';
		                    strPrintout+='</div>';
		                    $("#response").html(strPrintout);
		                }  
		            }
		    })
		}    
	}	
});