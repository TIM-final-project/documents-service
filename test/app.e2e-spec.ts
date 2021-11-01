import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DocumentsModule } from 'src/documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesModule } from 'src/types/types.module';
import { Connection, Repository } from 'typeorm';
import { DocumentEntity } from 'src/documents/document.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<DocumentEntity>;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DocumentsModule,
        TypesModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'username',
          password: '',
          database: 'documents-service',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
    }).compile()
  
    app = module.createNestApplication()
    // app.useLogger(new TestLogger()) // more on this line is below
    await app.init()
    repository = module.get('DocumentRepository')

  })

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM document_entity;`);
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      // Pre-populate the DB with some dummy users
      await repository.save([
        { name: 'test-name-0' },
        { name: 'test-name-1' },
      ]);
  
      // Run your end-to-end test
      const { body } = await supertest.agent(app.getHttpServer())
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(body).toEqual([
        { id: expect.any(Number), name: 'test-name-0' },
        { id: expect.any(Number), name: 'test-name-1' },
      ]);
    });
  });


});
