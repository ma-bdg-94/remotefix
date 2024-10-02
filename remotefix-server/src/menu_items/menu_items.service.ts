import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItems } from './menu_items.entity';
import { LessThan, Raw, Repository } from 'typeorm';
import { subDays } from 'date-fns';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItems)
    private menuItemsRepository: Repository<MenuItems>,
  ) {}

  private linkRegex =
    /^(?:(?:https?|ftp):\/\/|#|\/)(?:[\w_-]+(?:\/[\w_-]+)*)?(?:\?[\w_-]+=\w+(&[\w_-]+=\w+)*)?$/;

  async createOne(menuItemData: Partial<MenuItems>): Promise<MenuItems> {
    const { label, link, scope } = menuItemData;
    const existingMenuItem = await this.menuItemsRepository.findOneBy({
      link,
    });

    if (existingMenuItem && menuItemData.link !== '#') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `Menu item with link ${link} already exists in the database!`,
      });
    }

    // validations
    if (!label || !link || !scope) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `
          Could not create new menu item, one or multiple datas are missing:
            ${!label && 'Label (Both in english and arabic).'}
            ${!link && 'Link.'}
            ${!scope && 'Scope (Please choose from the list).'}
          `,
      });
    }
    if (link && !this.linkRegex.test(link)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Could not create new menu item, ${link} seems not a valid link.`,
      });
    }

    const newMenuItem = this.menuItemsRepository.create(menuItemData);
    const existingMenuItemsCount = await this.menuItemsRepository.countBy({
      deleted: false,
    });

    // define some default values
    newMenuItem['position'] = existingMenuItemsCount + 1;
    newMenuItem['subItems'] = menuItemData.subItems
      ? newMenuItem['subItems']
      : [];

    return await this.menuItemsRepository.save(newMenuItem);
  }

  async findAll(sortingDirection: string): Promise<MenuItems[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const menuItemList = await this.menuItemsRepository.find({
      where: { deleted: false },
      order: {
        position: direction,
      },
    });

    if (menuItemList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No menu item found in the database!',
      });
    }

    return menuItemList;
  }

  async findAllByScope(
    scope: string,
    sortingDirection: string,
  ): Promise<MenuItems[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const menuItemList = await this.menuItemsRepository.find({
      where: {
        deleted: false,
        scope,
      },
      order: {
        position: direction,
      },
    });

    if (menuItemList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No menu item found in the database with selected scope: ${scope}`,
      });
    }

    return menuItemList;
  }

  async findAllPrivateByScope(
    scope: string,
    sortingDirection: string,
  ): Promise<MenuItems[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const menuItemList = await this.menuItemsRepository.find({
      where: [
        {
          deleted: false,
          is_private: true,
          scope,
        },
      ],
      order: {
        position: direction,
      },
    });

    if (menuItemList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No menu item found in the database with selected scope: $t{scope}`,
      });
    }

    console.log(menuItemList);

    return menuItemList;
  }

  async findOneById(id: number): Promise<MenuItems | null> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    return menuItem;
  }

  async toggleField(id: number, field: string): Promise<MenuItems | null> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (menuItem[field] === undefined) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not contain field = ${field}.`,
      });
    }

    if (field === 'deleted') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: `Field = ${field} is not togglable.`,
      });
    }

    menuItem[field] = !menuItem[field];
    if (field === 'archived') {
      menuItem['archived_at'] = new Date();
    }
    return await this.menuItemsRepository.save(menuItem);
  }

  async updateField(
    id: number,
    field: string,
    value: any,
  ): Promise<MenuItems | null> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!menuItem[field]) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not contain field = ${field}.`,
      });
    }

    menuItem[field] = value;
    return await this.menuItemsRepository.save(menuItem);
  }

  async updateMultipleFields(
    id: number,
    menuItemData: Partial<MenuItems>,
  ): Promise<MenuItems | null> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (menuItemData.link && !this.linkRegex.test(menuItemData.link)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Could not create new menu item, ${menuItemData.link} seems not a valid link.`,
      });
    }

    const updatedMenuItem = this.menuItemsRepository.merge(
      menuItem,
      menuItemData,
    );
    return await this.menuItemsRepository.save(updatedMenuItem);
  }

  async softDelete(id: number): Promise<MenuItems | null> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    menuItem['deleted'] = true;
    return await this.menuItemsRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    await this.menuItemsRepository.delete(id);
  }

  async addSubEntity(id: number, subEntityId: number): Promise<MenuItems> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    const subMenuItem = await this.menuItemsRepository.findOneBy({
      id: subEntityId,
      scope: Raw((alias) => `:scope = ANY(${alias})`, { scope: 'sub_item' }),
      deleted: false,
    });

    if (!subMenuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${subEntityId} in the database.`,
      });
    }

    menuItem['subItems'].push(subMenuItem.id);
    subMenuItem['position'] = menuItem['subItems'].length + 1;
    return await this.menuItemsRepository.save(menuItem);
  }

  async removeSubEntity(id: number, subEntityId: number): Promise<MenuItems> {
    const menuItem = await this.menuItemsRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    const subMenuItem = await this.menuItemsRepository.findOneBy({
      id: subEntityId,
      scope: Raw((alias) => `:scope = ANY(${alias})`, { scope: 'sub_item' }),
      deleted: false,
    });

    if (!subMenuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${subEntityId} in the database.`,
      });
    }

    const subItemIndex = menuItem['subItems'].indexOf(subMenuItem.id);
    menuItem['subItems'].splice(subItemIndex, 1);
    return await this.menuItemsRepository.save(menuItem);
  }
}
