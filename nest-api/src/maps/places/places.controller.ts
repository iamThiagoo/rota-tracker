import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async findPlaces(@Query('text') text: string) {
    return await this.placesService.findPlaces(text);
  }
}
