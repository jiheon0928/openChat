import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  /**
   * 소켓 연결되었을 때 호출
   */
  handleConnection(client: Socket) {
    console.log(`✅ 클라이언트 연결됨: ${client.id}`);
  }

  /**
   * 소켓 연결이 끊어졌을 때 호출
   */
  handleDisconnect(client: Socket) {
    console.log(`❌ 클라이언트 연결 종료: ${client.id}`);
  }

  /**
   * 클라이언트로부터 메세지 수신
   * @param data userId, nickname, content
   */
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: number; nickname: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('💬 메세지 수신:', data);

    const { userId, nickname, content } = data;

    const savedMessage = await this.chatService.saveMessage(userId, content);
    console.log('✅ [Gateway] 메세지 저장 완료:', savedMessage);

    this.server.emit('receiveMessage', {
      id: savedMessage.id,
      senderId: savedMessage.sender.id,
      nickname: nickname,
      content: savedMessage.content,
      createdAt: savedMessage.createdAt,
    });
  }
}
