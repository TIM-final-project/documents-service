import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TYPEORM } from '../../environments';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			...TYPEORM,
			type: 'mysql',
			entities: ['dist/**/*.entity{ .ts,.js}'],
			synchronize: true,
            autoLoadEntities: true,
			keepConnectionAlive: true,
			logging: true
		};
	}
}