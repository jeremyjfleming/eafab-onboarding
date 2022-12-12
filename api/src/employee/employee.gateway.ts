import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';
import { UpdateEmployeeAsUserDTO } from 'lib/dtos';
import * as utils from 'lib/utils';
import { DateTime } from 'luxon';
import { EmployeeService } from './employee.service';

let prisma: PrismaClient = new PrismaClient();

@WebSocketGateway({
  cors: {
    origin: 'eafab.digisignonline.com',
  },
})
export class EmployeeGateway {

  constructor(private readonly employeeService: EmployeeService) {}

  @SubscribeMessage('employee')
  async handleMessage(@MessageBody() payload: UpdateEmployeeAsUserDTO): Promise<void> {

    // utils.checkIdStatus(prisma, payload.userId, payload.secretKey);

    if (payload.submitted === true)
    {

      // verify all fields are complete

      let date = DateTime.now().toISO();
      let submitCount = await this.employeeService.getLastSubmitCount();

      let data = {
        submitCount: submitCount,
        formResponse: {
          date: date
        }
      }

      await this.employeeService.updateEmployee(payload.userId, data)
    }

    await this.employeeService.updateEmployee(payload.userId, payload)
  }
}
