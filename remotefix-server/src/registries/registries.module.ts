import { Module } from '@nestjs/common';
import { RegistriesService } from './registries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistriesController } from './registries.controller';
import { Registries } from './registries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registries])],
  providers: [RegistriesService],
  controllers: [RegistriesController],
})
export class RegistriesModule {}
