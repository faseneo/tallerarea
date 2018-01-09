
function deshabilitabotones(){
    document.getElementById('editar-alumno').style.display = 'none';
    document.getElementById('guardar-alumno').style.display = 'none';
    document.getElementById('actualizar-alumno').style.display = 'none';
}
function limpiaform(){
    $("#aluId").val("");
    $("#aluRut").val("");
    $("#aluPass").val("");
    $("#aluNombre").val("");
    $("#aluApellido").val("");
    $("#aluEmail").val("");
}        
function habilitaform(){
    $("#aluId").prop( "disabled", false );
    $("#aluRut").prop( "disabled", false );
    $("#aluPass").prop( "disabled", false );
    $("#aluNombre").prop( "disabled", false );
    $("#aluApellido").prop( "disabled", false );
    $("#aluEmail").prop( "disabled", false );
}
function deshabilitaform(){
    $("#aluId").prop( "disabled", true );
    $("#aluRut").prop( "disabled", true );
    $("#aluPass").prop( "disabled", true );
    $("#aluNombre").prop( "disabled", true );
    $("#aluApellido").prop( "disabled", true );
    $("#aluEmail").prop( "disabled", true );            
}    
$(document).ready(function(){

    function validarFormulario(){
        var txtRut = document.getElementById('aluRut').value;
        var txtPass = document.getElementById('aluPass').value;
                //Test campo obligatorio
                if(txtRut == null || txtRut.length == 0 || /^\s+$/.test(txtRut)){
                    alert('ERROR: El campo nombre no debe ir vacío o con espacios en blanco');
                    document.getElementById('aluRut').focus();
                    return false;
                }
                if(txtPass == null || txtPass.length == 0 || /^\s+$/.test(txtPass)){
                    alert('ERROR: El campo password no debe ir vacío o con espacios en blanco');
                    document.getElementById('aluPass').focus();
                    return false;
                }                
                return true;
            }          
    //funcion para listar los Alumnos
    var getlista = function (){
        var datax = {
            "Accion":"listar"
        }
        $.ajax({
            data: datax, 
            type: "GET",
            dataType: "json", 
            url: "http://146.83.132.71/miappws/controllers/controlleralumno.php", 
        })
        .done(function( data, textStatus, jqXHR ) {
            $("#listaalumnos").html("");
            if ( console && console.log ) {
                console.log( " data success : "+ data.success 
                    + " \n data msg : "+ data.message 
                    + " \n textStatus : " + textStatus
                    + " \n jqXHR.status : " + jqXHR.status );
            }
            for(var i=0; i<data.datos.length;i++){
                                //$.each(data.datos[i], function(k, v) { console.log(k + ' : ' + v); });
                                console.log('id: '+data.datos[i].id + ' rut: '+data.datos[i].rut);
                                fila = '<tr><td>'+ data.datos[i].rut +'</td>';
                                fila += '<td>'+ data.datos[i].nombre +' '+ data.datos[i].apellido +'</td>';
                                fila += '<td>'+ data.datos[i].email +'</td>';
                                fila += '<td><button id="edita-alumno" type="button" '
                                fila += 'class="btn btn-xs btn-success" data-toggle="modal" data-target="#myModal"'
                                fila += ' onclick="veralumno(\'ver\',\'' + data.datos[i].id + '\')">';
                                fila += 'Ver / Editar</button>';
                                fila += ' <button id="delete-language-modal" name="delete-language-modal" type="button" ';
                                fila += 'class="btn btn-xs btn-danger" data-toggle="modal" data-target="#myModalDelete" ';
                                fila += 'onclick="deletealumno(\''+ data.datos[i].id +'\',\''
                                + data.datos[i].nombre +'\')">';
                                fila += 'Eliminar</button></td></tr>';
                                $("#listaalumnos").append(fila);
                            }
                        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
            if ( console && console.log ) {
                console.log( " La solicitud getlista ha fallado,  textStatus : " +  textStatus 
                    + " \n errorThrown : "+ errorThrown
                    + " \n textStatus : " + textStatus
                    + " \n jqXHR.status : " + jqXHR.status );
            }
        });
    }
    //var veralumno = function (action, aluid){

        //Levanta modal nuevo alumno
        $("#crea-alumno").click(function(e){
            e.preventDefault();
            limpiaform();
            habilitaform();
            $("#Accion").val("registrar");
            $('#myModal').on('shown.bs.modal', function () {
                var modal = $(this);
                modal.find('.modal-title-form').text('Ingreso Alumno');  
                deshabilitabotones();
                $('#guardar-alumno').show();
                $('#aluRut').focus();
            });
        });

        // implementacion boton para guardar alumno
        $("#guardar-alumno").click(function(e){
            e.preventDefault();
            if(validarFormulario()==true){
                var datax = $("#formAlumno").serializeArray();
                $.each(datax, function(i, field){
                    console.log("contenido del form = "+ field.name + ":" + field.value + " ");
                });
                $.ajax({
                    data: datax, 
                    type: "POST",
                    dataType: "json", 
                    url: "http://146.83.132.71/miappws/controllers/controlleralumno.php",  
                })
                .done(function( data, textStatus, jqXHR ) {
                    if ( console && console.log ) {
                        console.log( " data success : "+ data.success 
                            + " \n data msg : "+ data.message 
                            + " \n textStatus : " + textStatus
                            + " \n jqXHR.status : " + jqXHR.status );
                    }
                    $('#myModal').modal('hide');
                    $('#myModalLittle').modal('show');
                    $('#myModalLittle').on('shown.bs.modal', function () {
                        var modal2 = $(this);
                        modal2.find('.modal-title').text('Mensaje del Servidor');
                        modal2.find('.msg').text(data.message);  
                        $('#cerrarModalLittle').focus();
                    });
                    getlista();
                    deshabilitabotones();
                })
                .fail(function( jqXHR, textStatus, errorThrown ) {
                    if ( console && console.log ) {
                        console.log( " La solicitud ha fallado,  textStatus : " +  textStatus 
                            + " \n errorThrown : "+ errorThrown
                            + " \n textStatus : " + textStatus
                            + " \n jqXHR.status : " + jqXHR.status );
                    }
                });
            }
        });
        $("#editar-alumno").click(function(e){
            e.preventDefault();
            $('.modal-title-form').text('Editar Alumno');
            habilitaform();
            deshabilitabotones();
            $('#actualizar-alumno').show();
            $("#Accion").val("actualizar");               
        });

        $("#actualizar-alumno").click(function(e){
                    // Detenemos el comportamiento normal del evento click sobre el elemento clicado
                    e.preventDefault();
                    if(validarFormulario()==true){
                        var datax = $("#formAlumno").serializeArray();
                        /*   $.each(datax, function(i, field){
                            console.log("contenido del form = "+ field.name + ":" + field.value + " ");
                        });*/
                        $.ajax({
                            data: datax,    // En data se puede utilizar un objeto JSON, un array o un query string
                            type: "POST",   //Cambiar a type: POST si necesario
                            dataType: "json",  // Formato de datos que se espera en la respuesta
                            url: "http://146.83.132.71/miappws/controllers/controlleralumno.php",   // URL a la que se enviará la solicitud Ajax
                        })
                        .done(function( data, textStatus, jqXHR ) {
                            if ( console && console.log ) {
                                console.log( " data success : "+ data.success 
                                    + " \n data msg : "+ data.message 
                                    + " \n textStatus : " + textStatus
                                    + " \n jqXHR.status : " + jqXHR.status );
                            }
                            $('#myModal').modal('hide');
                            $('#myModalLittle').modal('show');
                            $('#myModalLittle').on('shown.bs.modal', function () {
                                var modal2 = $(this);
                                modal2.find('.modal-title').text('Mensaje del Servidor');
                                modal2.find('.msg').text(data.message);
                                $('#cerrarModalLittle').focus();                                
                            });
                            getlista();
                            deshabilitabotones();
                        })
                        .fail(function( jqXHR, textStatus, errorThrown ) {
                            if ( console && console.log ) {
                                console.log( " La solicitud ha fallado,  textStatus : " +  textStatus 
                                    + " \n errorThrown : "+ errorThrown
                                    + " \n textStatus : " + textStatus
                                    + " \n jqXHR.status : " + jqXHR.status );
                            }
                        });                        
                    }
                });    
        $("#eliminar-alumno").click(function(e){
            e.preventDefault();
            var datax = $("#formDeleteServicio").serializeArray();
                    /* .each(datax, function(i, field){
                        console.log("contenido del form = "+ field.name + ":" + field.value + " ");
                    });*/
                    $.ajax({
                        data: datax, 
                        type: "POST",
                        dataType: "json", 
                        url: "http://146.83.132.71/miappws/controllers/controlleralumno.php",
                    })
                    .done(function(data,textStatus,jqXHR ) {
                        if ( console && console.log ) {
                            console.log( " data success : "+ data.success 
                                + " \n data msg : "+ data.message 
                                + " \n textStatus : " + textStatus
                                + " \n jqXHR.status : " + jqXHR.status );
                        }
                        $('#myModalDelete').modal('hide');
                        $('#myModalLittle').modal('show');
                        $('#myModalLittle').on('shown.bs.modal', function () {
                            var modal2 = $(this);
                            modal2.find('.modal-title').text('Mensaje del Servidor');
                            modal2.find('.msg').text(data.message);
                            $('#cerrarModalLittle').focus();                                
                        });
                        getlista(); 
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ) {
                        if ( console && console.log ) {
                            console.log( " La solicitud ha fallado,  textStatus : " +  textStatus 
                                + " \n errorThrown : "+ errorThrown
                                + " \n textStatus : " + textStatus
                                + " \n jqXHR.status : " + jqXHR.status );
                        }
                    });
                });
        deshabilitabotones();                
        getlista();

    });
function veralumno(action, aluid){
    deshabilitabotones();
    var datay = {"aluId": aluid,
    "Accion":"obtener" };
    $.ajax({
        data: datay, 
        type: "POST",
        dataType: "json", 
        url: "http://146.83.132.71/miappws/controllers/controlleralumno.php", 
    })
    .done(function(data,textStatus,jqXHR ) {
        if ( console && console.log ) {
            console.log( " data success : "+ data.success 
                + " \n data msg : "+ data.message 
                + " \n textStatus : " + textStatus
                + " \n jqXHR.status : " + jqXHR.status );
        }
        $("#aluId").val(data.datos.id);
        $("#aluRut").val(data.datos.rut);
        $("#aluPass").val(data.datos.pass);
        $("#aluNombre").val(data.datos.nombre);
        $("#aluApellido").val(data.datos.apellido);
        $("#aluEmail").val(data.datos.email);   

        deshabilitaform();
        $("#Accion").val(action);

        $('#myModal').on('shown.bs.modal', function () {
            var modal = $(this);
            if (action === 'actualizar'){
                modal.find('.modal-title-form').text('Actualizar Alumno');
                $('#guardar-alumno').hide();                    
                $('#actualizar-alumno').show();   
            }else if (action === 'ver'){
                modal.find('.modal-title-form').text('Ver Alumno');
                deshabilitabotones();
               $('#editar-alumno').show();   
            }

        });
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
        if ( console && console.log ) {
            console.log( " La solicitud ha fallado,  textStatus : " +  textStatus 
                + " \n errorThrown : "+ errorThrown
                + " \n textStatus : " + textStatus
                + " \n jqXHR.status : " + jqXHR.status );
        }
    });
}        
function deletealumno(idAlumno, nameAlumno){     
    document.formDeleteAlumno.aluId.value = idAlumno;
    document.formDeleteAlumno.nameAlumno.value = nameAlumno;
    document.formDeleteAlumno.Accion.value = "eliminar";
    $('#myModalDelete').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });
}  