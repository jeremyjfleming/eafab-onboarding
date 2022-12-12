import { HttpException, HttpStatus, NotAcceptableException, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('employee')
  async handleMessage(@MessageBody() payload: UpdateEmployeeAsUserDTO): Promise<void> {

    // utils.checkIdStatus(prisma, payload.userId, payload.secretKey);

    if (payload.submitted === true)
    {
      // verify all form data is complete
      let sectionResponses = (await prisma.employee.findUnique({
        where: {
          userId: payload.userId
        }
      })).formResponses.sectionRepsonses;

      for (let i in sectionResponses) {
        for (let entry in sectionResponses[i]) {
          if (sectionResponses[entry] == "")
            throw new NotAcceptableException({ error: "All form data not complete"})
        }
      }

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
