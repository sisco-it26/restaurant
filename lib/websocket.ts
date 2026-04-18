import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer | null = null

export function initializeWebSocket(server: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join:admin', () => {
      socket.join('admin')
      console.log('Client joined admin room:', socket.id)
    })

    socket.on('join:kitchen', () => {
      socket.join('kitchen')
      console.log('Client joined kitchen room:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

export function emitOrderCreated(order: any) {
  if (!io) return
  io.to('admin').to('kitchen').emit('order:created', order)
}

export function emitOrderUpdated(order: any) {
  if (!io) return
  io.to('admin').to('kitchen').emit('order:updated', order)
}

export function emitOrderStatusChanged(orderId: string, status: string) {
  if (!io) return
  io.to('admin').to('kitchen').emit('order:status_changed', { orderId, status })
}
