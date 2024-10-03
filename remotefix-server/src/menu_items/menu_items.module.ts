import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { MenuItem } from './menu_items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsController } from './menu_items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuItemsService],
  controllers: [MenuItemsController],
})
export class MenuItemsModule {}
