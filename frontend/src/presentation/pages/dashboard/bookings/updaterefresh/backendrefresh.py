// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let reservas = [];

// Cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Enviar todas las reservas al conectarse
  socket.emit('reservasIniciales', reservas);
  
  // Escuchar nuevas reservas
  socket.on('nuevaReserva', (reserva) => {
    reservas.push(reserva);
    // Notificar a TODOS los clientes conectados
    io.emit('reservaCreada', reserva);
  });
  
  // Escuchar eliminación de reservas
  socket.on('eliminarReserva', (id) => {
    reservas = reservas.filter(r => r.id !== id);
    io.emit('reservaEliminada', id);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Servidor corriendo en puerto 3001');
});