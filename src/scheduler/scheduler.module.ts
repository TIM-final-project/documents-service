import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DocumentsModule } from 'src/documents/documents.module';
import { DocumentsService } from 'src/documents/documents.service';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DocumentsModule
  ],
  providers: [SchedulerService]
})
export class SchedulerModule {}