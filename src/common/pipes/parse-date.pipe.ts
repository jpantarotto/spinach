import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    if (!value) {
      throw new BadRequestException('Date is required');
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
      );
    }

    return date;
  }
}
