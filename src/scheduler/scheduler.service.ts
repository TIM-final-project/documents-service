import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DocumentsService } from 'src/documents/documents.service';
import { DocumentDto } from 'src/documents/dto/document.dto';
import { States } from 'src/enums/states.enum';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private documentsService: DocumentsService
  ){}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    let ts = Date.now();
    let date = new Date(ts);
    const documentsExpired: DocumentDto[] = await this.documentsService.findAll({after: date});

    documentsExpired.forEach(doc => {
        if(doc.state == States.ACCEPTED){
            this.documentsService.updateState(doc.id, States.EXPIRED);
        }

        if(doc.state == States.PENDING){
            this.documentsService.updateState(doc.id, States.REJECTED);
        }
    });

  }

}