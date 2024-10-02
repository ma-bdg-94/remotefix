import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from './countries.entity';
import { LessThan, Repository } from 'typeorm';
import { CountryTemplate, countries } from './countries.utils';
import { subDays } from 'date-fns';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries)
    private countriesRepository: Repository<Countries>,
  ) {}

  private countryAvailableFlags: string[] = countries?.map(
    (country: CountryTemplate) => country?.flag,
  );

  private countryAvailableISOCodes: string[] = countries?.map(
    (country: CountryTemplate) => country?.isoCode,
  );

  private countryAvailablePhoneCodes: string[] = countries?.map(
    (country: CountryTemplate) => country?.phoneCode,
  );

  async insertOne(countryData: Partial<Countries>): Promise<Countries> {
    const { name, flag, isoCode, phoneCode } = countryData;

    const existingCountry = await this.countriesRepository.findOneBy({
      isoCode,
    });

    if (existingCountry) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message:
          `Country with this ISO 3166 code ${isoCode} already exists in the database!`,
      });
    }

    if (!name || !flag || !isoCode || !phoneCode) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `
                Could not insert new country, one or multiple datas are missing:
                  ${!name && 'Name (Both in english and arabic).'}
                  ${!flag && 'Flag.'}
                  ${!isoCode && 'ISO-3166 code (Alpha 2: Two letters).'}
                  ${
                    !phoneCode &&
                    'Phone specific code (Please include the + sign before).'
                  }
                `,
      });
    }

    if (flag && !this.countryAvailableFlags.includes(flag)) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not insert new country, This seems not a valid flag.`,
      });
    }

    if (isoCode && !this.countryAvailableISOCodes.includes(isoCode)) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not insert new country, ${isoCode} seems not a valid ISO-3166 code.`,
      });
    }

    if (phoneCode && !this.countryAvailablePhoneCodes.includes(phoneCode)) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not insert new country, ${phoneCode} seems not a valid phone code.`,
      });
    }

    countryData.isoCode = countryData.isoCode.toUpperCase();

    const newCountry = this.countriesRepository.create(countryData);
    return await this.countriesRepository.save(newCountry);
  }

  async findAll(): Promise<Countries[]> {
    const countryList = await this.countriesRepository.find({
      where: { deleted: false },
      order: {
        isoCode: 'ASC',
      },
    });

    if (countryList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No country found in the database!',
      });
    }

    return countryList;
  }

  async findOneById(id: number): Promise<Countries | null> {
    const country = await this.countriesRepository.findOneBy({ id });

    if (!country) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a country with id = ${id} in the database.`,
      });
    }

    return country;
  }

  async updateMultipleFields(
    id: number,
    countryData: Partial<Countries>,
  ): Promise<Countries | null> {
    const { isoCode, flag, phoneCode } = countryData;
    const country = await this.countriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (!country) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a country with id = ${id} in the database.`,
      });
    }

    if (isoCode && !this.countryAvailableISOCodes.includes(isoCode)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Could update country, ${isoCode} seems not a valid ISO-3166 code.`,
      });
    }

    if (flag && !this.countryAvailableFlags.includes(flag)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Could not update country, ${flag} seems not a valid flag.`,
      });
    }

    if (phoneCode && !this.countryAvailablePhoneCodes.includes(phoneCode)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: {
          en: `Could update country, ${phoneCode} seems not a valid phone code.`,
        },
      });
    }

    const updatedCountry = this.countriesRepository.merge(country, countryData);
    return await this.countriesRepository.save(updatedCountry);
  }

  async toggleArchive(id: number): Promise<Countries | null> {
    const country = await this.countriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (country) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a country with id = ${id} in the database.`,
      });
    }

    country['archived'] = !country['archived'];
    return await this.countriesRepository.save(country);
  }

  async softDelete(id: number): Promise<Countries | null> {
    const country = await this.countriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (country) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a country with id = ${id} in the database.`,
      });
    }

    country['deleted'] = true;
    return await this.countriesRepository.save(country);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const country = await this.countriesRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (country) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a country with id = ${id} in the database.`,
      });
    }

    await this.countriesRepository.delete(id);
  }
}
