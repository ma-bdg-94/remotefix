import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Addresses } from './addresses.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { subDays } from 'date-fns';
import { Countries } from 'src/countries/countries.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Addresses)
    private addressesRepository: Repository<Addresses>,
    @InjectRepository(Countries)
    private countriesRepository: Repository<Countries>,
  ) {}

  private linkRegex =
    /^(?:(?:https?|ftp):\/\/|#|\/)(?:[\w_-]+(?:\/[\w_-]+)*)?(?:\?[\w_-]+=\w+(&[\w_-]+=\w+)*)?$/;

  async addOne(addressData: Partial<Addresses>): Promise<Addresses> {
    const { state, city, street, coordinates, country } =
      addressData;

    // check currency
    const country_id = await this.countriesRepository.findOneBy({
      id: country.id,
    });
    if (!country_id) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not found a country with id = ${country_id} in the database.`,
      });
    }

    // validations
    if (
      !state ||
      !city ||
      !street ||
      !coordinates
    ) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `
            Could not add new address, one or multiple datas are missing:
              ${!state && 'State or province (Both in english and arabic)'}
              ${!city && 'City or town (Both in english and arabic)'}
              ${!street && 'Street (Both in english and arabic)'}
              ${!coordinates && 'Coordinates (Please spot it on the map).'}
            `,
      });
    }

    const newAddress = this.addressesRepository.create(addressData);
    return await this.addressesRepository.save(newAddress);
  }

  async findAll(): Promise<Addresses[]> {
    const addressList = await this.addressesRepository.find({
      where: { deleted: false },
      order: {
        created_at: 'DESC',
      },
    });

    if (addressList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No address found in the database!',
      });
    }

    return addressList;
  }

  async findOneById(id: number): Promise<Addresses | null> {
    const address = await this.addressesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (address) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an address with id = ${id} in the database.`,
      });
    }

    return address;
  }

  async toggleArchive(id: number): Promise<Addresses | null> {
    const address = await this.addressesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (address) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an address with id = ${id} in the database.`,
      });
    }

    address['archived'] = !address['archived'];
    return await this.addressesRepository.save(address);
  }

  async updateMultipleFields(
    id: number,
    addressData: Partial<Addresses>,
  ): Promise<Addresses | null> {
    const address = await this.addressesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (address) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an address with id = ${id} in the database.`,
      });
    }

    if (
      addressData.postal_code &&
      !this.linkRegex.test(addressData.postal_code)
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Could not update address, ${addressData.postal_code} seems not a valid postal_code.`,
      });
    }

    const updatedAddress = this.addressesRepository.merge(
      address,
      addressData,
    );
    return await this.addressesRepository.save(updatedAddress);
  }

  async softDelete(id: number): Promise<Addresses | null> {
    const address = await this.addressesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (address) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an address with id = ${id} in the database.`,
      });
    }

    address['deleted'] = true;
    return await this.addressesRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const address = await this.addressesRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (address) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an address with id = ${id} in the database.`,
      });
    }

    await this.addressesRepository.delete(id);
  }
}
