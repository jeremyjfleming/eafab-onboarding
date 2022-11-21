import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';
import { Http2ServerRequest } from 'http2';
import { UpdateEmployeeAsUserDTO } from 'lib/dtos';
import * as utils from 'lib/utils';

let prisma: PrismaClient = new PrismaClient();

@WebSocketGateway({
  cors: {
    origin: 'eafab.digisignonline.com',
  },
})
@WebSocketGateway()
export class EmployeeGateway {
  @SubscribeMessage('employee')
  handleMessage(@MessageBody() payload: UpdateEmployeeAsUserDTO): void {
    prisma.$connect();

    utils.checkIdStatus(prisma, payload.userId);

    try {
      prisma.employee.update({
        where: {
          userId: payload.userId,
          secretKey: payload.secretKey
        }, 
        data: payload 
      })
    } catch (e) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
  }
}
