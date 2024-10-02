import { Module } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { Industries } from './industries.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustriesController } from './industries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Industries])],
  providers: [IndustriesService],
  controllers: [IndustriesController],
})
export class IndustriesModule {}
