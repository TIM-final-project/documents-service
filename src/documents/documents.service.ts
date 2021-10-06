<<<<<<< HEAD
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
=======
import { Injectable, Logger } from '@nestjs/common';
>>>>>>> develop
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { documentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from "fs";
import { EntityEnum } from 'src/enums/entity.enum';
import { RpcException } from '@nestjs/microservices';
import { DocumentDto } from './dto/document.dto';
import * as mmmagic from "promise-mmmagic";
import { doc } from 'prettier';


@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  async findAll(query: documentRequestDto): Promise<DocumentDto[]> {
    const where = query;
    const documents: DocumentEntity[] = await this.documentRepository.find({ 
      where,
      relations: ['type'] 
    });

    if(documents.length){
      
      for (const document of documents) {
        let photos = await this.getPhoto(document.entityType, document.entityId, document.type.id);
        let documentDto: DocumentDto = {...document, photos}        
      }

    }

    return 
  }

  async findOne(id: number): Promise<DocumentDto> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, { relations: ["type"] });

    const photos: Array<string> = await this.getPhoto(document.entityType, document.entityId, document.type.id);

    return {...document, photos };
  }

  async create(documentDto: CreateDocumentDto, type: number, photos: Array<string>): Promise<DocumentEntity> {
    const documentType: DocumentTypeEntity = await this.documentTypeRepository.findOne(type);

    const documents: DocumentEntity[] = await this.documentRepository.find({
      where: {
        entityId: documentDto.entityId,
        entityType: documentDto.entityType,
        type: documentType,
        active: true
      }
    })

    if(documents.length){
      //change active to false
      if(documents.length > 1){
        this.logger.warn("Two documents of the same type were found.");
      }
      documents.forEach(doc => {
        doc.active = false
      });
      this.documentRepository.save(documents);
    }


    const document: DocumentEntity = {
      ...documentDto,
      type: documentType,
    };

    const documentCreated: DocumentEntity = await this.documentRepository.save(document);

    this.savePhotos(photos, documentDto.entityType, documentDto.entityId, documentType.id, documentCreated.created_at);

    
    return documentCreated;
  }

  async update(
    id: number,
    documentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id);
    this.documentRepository.merge(document, documentDto);

    if(!document.type){
      throw new RpcException("No se encontro el tipo de documento.");
    }

    const updatedDocument: DocumentEntity = await this.documentRepository.save(document);

    if(documentDto.photos.length){
      this.savePhotos(documentDto.photos, document.entityType, document.entityId, document.type.id, updatedDocument.updated_at);
    }

    return updatedDocument;
  }

  private savePhotos(photos: Array<string>, entityType: EntityEnum, entityId: number, documentType: number, tts: Date){

    let entityTypeName = EntityEnum[entityType]

    let date = tts.toLocaleDateString().replace(/\//g,"-") + "T" + tts.toLocaleTimeString();

    this.logger.debug(tts.toLocaleString());

    const path ='./photos/'+ entityTypeName.toLocaleLowerCase() + 
                '/' + entityId + 
                '/'+ documentType +
                '/' + date

    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    
    photos.forEach((photo, i) => {
      fs.writeFileSync(path + `/photo_${i}.png` , photo, {encoding: 'base64'});
      
    });
  }

  private async getPhoto(entityType: EntityEnum, entityId: number, documentType: number ): Promise<string[]>{

    var magic = new mmmagic(mmmagic.MAGIC_MIME_TYPE);

    let entityTypeName = EntityEnum[entityType]
    
    let path ='./photos/'+ entityTypeName.toLocaleLowerCase() + 
                '/' + entityId + 
                '/'+ documentType ;

    var photos: Array<string> = [];

    if (!fs.existsSync(path)){
      this.logger.debug(`path ${path} not found`);
      throw new RpcException("No se encontro ningun archivo asociado al documento");
    }

    var dirs = fs.readdirSync(path);
    if(!dirs.length){
      throw new RpcException("No se encontro ningun archivo asociado al documento");
    }

    this.logger.debug(dirs);
    dirs.sort();     
    path = path + `/${dirs[0]}`;

    var files = fs.readdirSync(path);
    if(!files.length){
      throw new RpcException("No se encontro ningun archivo asociado al documento");
    }

    for (const file of files) {
      let mime = await magic
        .detectFile(path + '/' + `${file}`)
      
      let photo = fs.readFileSync(path + '/' + `${file}`, 'base64');

      photo = "data:" + mime + ';base64,' + photo
      
      photos.push(photo);
    }

    return photos;

  }

}
