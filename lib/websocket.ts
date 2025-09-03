// Mock WebSocket for real-time updates - in a real app, connect to a server
let mockWebSocket: any = null

export const initWebSocket = (onMessage: (data: any) => void) => {
  // Simulate WebSocket connection with setInterval for demo
  mockWebSocket = setInterval(() => {
    // Mock real-time updates - in a real app, this would come from the server
    onMessage({ type: 'ping', timestamp: Date.now() })
  }, 5000) // Simulate update every 5 seconds

  return () => {
    if (mockWebSocket) {
      clearInterval(mockWebSocket)
      mockWebSocket = null
    }
  }
}

export const sendWebSocketMessage = (message: any) => {
  // In a real app, send message to WebSocket server
  console.log('WebSocket message sent:', message)
}