import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor (private documentsService: DocumentsService) {}

  // @Get()
  @MessagePattern('documents_find_all')
  async findAll(): Promise<DocumentDto[]> {
    return this.documentsService.findAll();
  }

  // @Get(':id')
  @MessagePattern('documents_find_by_id')
  async findOne(@Body('id') id: number): Promise<DocumentDto> {
    return this.documentsService.findOne(id);
  }

  // @Post()
  @MessagePattern('documents_create')
  async create(@Body() documentDto: CreateDocumentDto): Promise<DocumentDto> {
    const { type } = documentDto;
    delete documentDto.type;
    return this.documentsService.create(documentDto, type);
  }

  // @Put(':id')
  @MessagePattern('documents_update')
  async update(@Body() documentDto: UpdateDocumentDto): Promise<DocumentDto> {
    console.log('Update contractor request ', { ...documentDto });
    const { id } = documentDto;
    delete documentDto.id;
    return this.documentsService.update(id, documentDto);
  }
}
