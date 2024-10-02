import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from 'src/config/interceptors/success_response.interceptor';
import { MenuItemsService } from './menu_items.service';
import {
  CreateMenuItemDTO,
  UpdateFieldDTO,
  UpdateMenuItemDTO,
} from './menu_items.dto';
import { MenuItems } from './menu_items.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseFilters(CustomExceptionFilter)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('api/menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Post('')
  async createMenuItem(
    @Body() createMenuItemDTO: CreateMenuItemDTO,
  ): Promise<MenuItems> {
    return this.menuItemsService.createOne(createMenuItemDTO);
  }

  @Post('/sub/:id/:subItemId')
  async addSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number
  ): Promise<MenuItems> {
    return this.menuItemsService.addSubEntity(id, subItemId);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('')
  async getAllMenuItems(
    @Query('sortOrder') sort_order: string,
  ): Promise<MenuItems[]> {
    return this.menuItemsService.findAll(sort_order);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('public/scope')
  async getAllMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sortOrder') sort_order: any,
  ): Promise<MenuItems[]> {
    return this.menuItemsService.findAllByScope(scope, sort_order);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('private/scope')
  async getPrivateMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sortOrder') sort_order: any,
  ): Promise<MenuItems[]> {
    return this.menuItemsService.findAllPrivateByScope(scope, sort_order);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('single/:id')
  async getMenuItemById(@Param('id') id: number): Promise<MenuItems | null> {
    return this.menuItemsService.findOneById(id);
  }

  @Patch('toggle/:id')
  async toggleOneField(
    @Param('id') id: number,
    @Query('field') field: string,
  ): Promise<MenuItems | null> {
    return this.menuItemsService.toggleField(id, field);
  }

  @Patch('delete/:id')
  async softDeleteMenuItem(@Param('id') id: number): Promise<MenuItems | null> {
    return this.menuItemsService.softDelete(id);
  }

  @Patch('field/:id')
  async updateOneField(
    @Param('id') id: number,
    @Body() updateFieldDTO: UpdateFieldDTO,
  ): Promise<MenuItems | null> {
    const { field, value } = updateFieldDTO;
    return this.menuItemsService.updateField(id, field, value);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id') id: number,
    updateMenuItemDTO: UpdateMenuItemDTO,
  ): Promise<MenuItems | null> {
    return this.menuItemsService.updateMultipleFields(id, updateMenuItemDTO);
  }

  @Delete(':id')
  async removeMenuItem(@Param('id') id: number): Promise<void> {
    return this.menuItemsService.remove(id);
  }

  @Delete('/sub/:id/:subItemId')
  async removeSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number
  ): Promise<MenuItems> {
    return this.menuItemsService.removeSubEntity(id, subItemId);
  }
}
