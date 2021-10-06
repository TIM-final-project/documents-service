import {Controller, Logger} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { DocumentsByEntityDto } from './dto/documents-by-entity.dto';
import { documentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {

  private logger = new Logger(DocumentsController.name);

  constructor (private documentsService: DocumentsService) {}

  // @Get()
  @MessagePattern('documents_find_all')
  async findAll(query: documentRequestDto): Promise<DocumentDto[]> {
    return this.documentsService.findAll(query);
  }

  // @Get(':id')
  @MessagePattern('documents_find_by_id')
  async findOne(id: number): Promise<DocumentDto> {
    return this.documentsService.findOne(id);
  }

  // @Post()
  @MessagePattern('documents_create')
  async create(documentDto: CreateDocumentDto): Promise<DocumentDto> {
    const { type } = documentDto;
    delete documentDto.type;
    
    
    var photos: Array<string> = [];
    if(!documentDto.photos.length){
      throw new RpcException({message: "Es necesario cargar una foto asociada al documento."});
    }

    documentDto.photos.forEach(photo => {
      photos.push(photo.substring(photo.indexOf(",") + 1));
    });

    return this.documentsService.create(documentDto, type, photos);
  }

  // @Put(':id')
  @MessagePattern('documents_update')
  async update(documentDto: UpdateDocumentDto): Promise<DocumentDto> {
    console.log('Update contractor request ', { ...documentDto });
    const { id } = documentDto;
    delete documentDto.id;
    return this.documentsService.update(id, documentDto);
  }

  // @MessagePattern('documents_by_entity')
  // async findByEntity(dto: DocumentsByEntityDto): Promise<DocumentDto[]> {
  //   console.log('DOCUMENTS BY ENTITY: ', { ...dto });
  //   return this.documentsService.findByEntity(dto.id, dto.type);
  // }

}
