import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor (private documentsService: DocumentsService) {}

  @Get()
  async findAll(): Promise<DocumentDto[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DocumentDto> {
    return this.documentsService.findOne(id);
  }

  @Post()
  async create(@Body() documentDto: CreateDocumentDto): Promise<DocumentDto> {
    return this.documentsService.create(documentDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() documentDto: UpdateDocumentDto): Promise<DocumentDto> {
    return this.documentsService.update(id, documentDto);
  }
}
