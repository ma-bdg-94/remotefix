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
import { MenuItemService } from './menu_items.service';
import {
  CreateMenuItemDTO,
  RemoveMenuItemDTO,
  UpdateMenuItemDTO,
} from './menu_items.dto';
import { MenuItem } from './menu_items.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { UpdateFieldDTO } from 'src/base/base.dto';

@UseInterceptors(SuccessResponseInterceptor)
@Controller('api/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseFilters(CustomExceptionFilter)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Post('')
  async createMenuItem(
    @Body() createMenuItemDTO: CreateMenuItemDTO,
  ): Promise<MenuItem> {
    return this.menuItemService.createOne(createMenuItemDTO);
  }

  @Post('/sub/:id/:subItemId')
  async addSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number,
  ): Promise<MenuItem> {
    return this.menuItemService.addSubEntity(id, subItemId);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('')
  async getAllMenuItems(
    @Query('sort_criterion') sort_criterion: keyof MenuItem,
    @Query('sort_value') sort_value: 'ASC' | 'DESC',
    @Query('page_number') page_number: number,
    @Query('per_page') per_page: number,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAll(
      { is_deleted: false },
      sort_criterion,
      sort_value,
      page_number,
      per_page,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('public/scope')
  async getPublicMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sort_criterion') sort_criterion: keyof MenuItem,
    @Query('sort_value') sort_value: 'ASC' | 'DESC',
    @Query('page_number') page_number: number,
    @Query('per_page') per_page: number,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAll(
      { is_deleted: false, is_private: false, scope },
      sort_criterion,
      sort_value,
      page_number,
      per_page,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('private/scope')
  async getPrivateMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sort_criterion') sort_criterion: keyof MenuItem,
    @Query('sort_value') sort_value: 'ASC' | 'DESC',
    @Query('page_number') page_number: number,
    @Query('per_page') per_page: number,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAll(
      { is_deleted: false, is_private: true, scope },
      sort_criterion,
      sort_value,
      page_number,
      per_page,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('single/:id')
  async getMenuItemById(@Param('id') id: number): Promise<MenuItem | null> {
    return this.menuItemService.findOneById(id);
  }

  @Patch('archive/:id')
  async toggleMenuItemArchiveStatus(
    @Param('id') id: number,
  ): Promise<MenuItem | null> {
    return this.menuItemService.toggleField(id, 'is_archived');
  }

  @Patch('privacy/:id')
  async toggleMenuItemPrivacy(
    @Param('id') id: number,
  ): Promise<MenuItem | null> {
    return this.menuItemService.toggleField(id, 'is_private');
  }

  @Patch('soft_delete/:id')
  async softDeleteMenuItem(@Param('id') id: number): Promise<MenuItem | null> {
    return this.menuItemService.toggleField(id, 'is_deleted');
  }

  @Patch('field/:id')
  async updateOneField(
    @Param('id') id: number,
    @Body() updateFieldDTO: UpdateFieldDTO<MenuItem>,
  ): Promise<MenuItem | null> {
    const { field, value } = updateFieldDTO;
    return this.menuItemService.updateField(id, field, value);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id') id: number,
    @Body() updateMenuItemDTO: UpdateMenuItemDTO,
  ): Promise<MenuItem | null> {
    return this.menuItemService.updateEntity(id, updateMenuItemDTO);
  }

  @Delete(':id')
  async removeMenuItem(
    @Param('id') id: number,
    @Body() removeMenuItemDTO: RemoveMenuItemDTO,
  ): Promise<void> {
    return this.menuItemService.remove(id, removeMenuItemDTO);
  }

  @Delete('/sub/:id/:subItemId')
  async removeSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number,
  ): Promise<MenuItem> {
    return this.menuItemService.removeSubEntity(id, subItemId);
  }
}
