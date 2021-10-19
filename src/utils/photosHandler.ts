import { Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import * as fs from "fs";
import { EntityEnum } from "src/enums/entity.enum";
const mime = require('mime');

const logger = new Logger('Photos Utils');

export function savePhotos(photos: Array<string>, entityType: EntityEnum, entityId: number, documentType: number, tts: Date){

  let entityTypeName = EntityEnum[entityType]

  let date = tts.toLocaleDateString().replace(/\//g,"-") + "T" + tts.toLocaleTimeString();

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

export async function getPhoto(entityType: EntityEnum, entityId: number, documentType: number ): Promise<string[]>{

  let entityTypeName = EntityEnum[entityType]
  
  let path ='./photos/'+ entityTypeName.toLocaleLowerCase() + 
              '/' + entityId + 
              '/'+ documentType ;

  var photos: Array<string> = [];

  if (!fs.existsSync(path)){
    logger.debug(`path ${path} not found`);
    throw new RpcException("No se encontro ningun archivo asociado al documento");
  }

  var dirs = fs.readdirSync(path);
  if(!dirs.length){
    throw new RpcException("No se encontro ningun archivo asociado al documento");
  }

  dirs.sort();     
  path = path + `/${dirs[0]}`;

  var files = fs.readdirSync(path);
  if(!files.length){
    throw new RpcException("No se encontro ningun archivo asociado al documento");
  }

  for (const file of files) {
    let mimeType = mime.getType(path + '/' + `${file}`);
    
    let photo = fs.readFileSync(path + '/' + `${file}`, 'base64');

    photo = "data:" + mimeType + ';base64,' + photo
    
    photos.push(photo);
  }

  return photos;

}

export function isBase64(str: string) {
  if (str ==='' || str.trim() ===''){ return false; }

  return Buffer.from(str, 'base64').toString('base64') === str
}

export function isValidFormat(str: string) {
  if (str === '' || str.trim() ===''){ return false; }
  str = str.replace("data:","").replace(";base64","");
  logger.debug(`photo format: ${str}`)
  const validFormats = ["image/jpg", "image/jpeg", "application/pdf", "image/png"]

  return validFormats.includes(str);
}