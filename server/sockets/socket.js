const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios')

const {crearMensaje } =  require('../utilidades/utilidades')
const usuarios = new Usuarios()
io.on('connection', (client) => {

    client.on('EntrarChat', (usuario, callback)=>{

        if(!usuario.nombre || !usuario.sala){
            return callback({
                error: true,
                mensaje: "El nombre es necesario"
            })
        }
        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        //console.log("usuario conectado ", usuario)
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unió al chat`));
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        callback(usuarios.getPersonasPorSala(usuario.sala))
    });

    client.on('crearMensaje', (data, callback)=>{

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });
    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        if(personaBorrada){
                client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
                client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        }
    });
    //Mensajes privados
    client.on('mensajePrivado', (data)=>{
        let persona = usuarios.getPersona(client.id);
        //to es para enviar a un cliente en específico
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    
    });
    

});


//socket.emit('crearMensaje', {mensaje: 'Hola a todos'})