var socket = io();


var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala'))
{
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit("EntrarChat", usuario, function(resp){
        //console.log("Usuarios conectados", resp);
        renderizarUsuarios(resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/



// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    //console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();

});

//Escuchar cambios de usuarios (cuando esntra o sale)
socket.on('listaPersonas', function(personas) {

    renderizarUsuarios(personas)
    //console.log('Servidor:', mensaje);

});

//ensajes privados

socket.on('mensajePrivado', function(mensaje){
    console.log("Mensaje privado: ", mensaje)

});