const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

//inicialización de variables
let app = express();
let server = http.Server(app);
let io = socketIO(server);

//arrancando el server
server.listen(3000, function () {
    console.log("server iniciado");
});

//routes
// otra forma para: app.get("/",function(req,res){
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let cantClientConectados = 0;
let clientes = [];

//SocketIO
io.on("connection", function (socket) {
    console.log("nuevo cliente con id: "+socket.id);
    cantClientConectados++;
    clientes.push(socket.id);
    io.emit("cantClienConn",cantClientConectados);

    //= a -->  socket.on("disconnect",function(){
    socket.on("disconnect", () => {
        console.log("cliente desconectado con id: "+socket.id);
        cantClientConectados--;
        io.emit("cantClienConn",cantClientConectados);
    });
    socket.on("mensajeCli", function (data) {
        console.log("mensaje del cliente: " + data);
        switch (data) {
            case "1":
                io.emit("foco","on");
                break;
            case "2":
                io.emit("foco","off");
                break;
        }
    });
    socket.on("mensajeCli2", function (data) {
        console.log("mensaje del cliente input 2: " + data);
    });
});
