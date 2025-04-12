// src/routes/routes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './schema/routes.schema';
import { ApiResponse } from 'src/common/api-response';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  private readonly logger = new Logger(RoutesController.name);

  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Route successfully created',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Bad request',
    type: ApiResponse,
  })
  async create(
    @Body() createRouteDto: CreateRouteDto,
  ): Promise<ApiResponse<Route>> {
    try {
      const result = await this.routesService.create(createRouteDto);
      return ApiResponse.success(
        result,
        'Route created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error(`Error creating route: ${error.message}`, error.stack);
      return ApiResponse.error(
        'Failed to create route',
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Add this to your routes.controller.ts

  @Get('search')
  @ApiOperation({ summary: 'Search routes by text' })
  @ApiQuery({
    name: 'searchText',
    required: true,
    description: 'Text to search for in routes',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Routes found successfully',
    type: ApiResponse,
  })
  async searchRoutes(
    @Query('searchText') searchText: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponse<Route[]>> {
    try {
      const routes = await this.routesService.searchRoutes(searchText, {
        limit: +limit,
        page: +page,
      });

      return ApiResponse.success(routes, 'Routes found successfully');
    } catch (error) {
      this.logger.error(
        `Error searching routes: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error(
        'Failed to search routes',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes with optional filtering' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Skip the number of results (for pagination)',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Routes retrieved successfully',
    type: ApiResponse,
  })
  async findAll(
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<ApiResponse<Route[]>> {
    try {
      const routes = await this.routesService.findAll({
        limit: +limit,
        page: +page,
      });

      return ApiResponse.success(routes, 'Routes retrieved successfully');
    } catch (error) {
      this.logger.error(`Error finding routes: ${error.message}`, error.stack);
      return ApiResponse.error(
        'Failed to fetch routes',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Route found',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Route not found',
    type: ApiResponse,
  })
  async findOne(@Param('id') id: string): Promise<ApiResponse<Route>> {
    try {
      const route = await this.routesService.findOne(id);
      if (!route) {
        return ApiResponse.error(
          'Route not found',
          `No route found with ID: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return ApiResponse.success(route, 'Route retrieved successfully');
    } catch (error) {
      this.logger.error(`Error finding route: ${error.message}`, error.stack);
      return ApiResponse.error(
        'Failed to fetch route',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Route updated',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Route not found',
    type: ApiResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<ApiResponse<Route>> {
    try {
      const route = await this.routesService.update(id, updateRouteDto);
      if (!route) {
        return ApiResponse.error(
          'Route not found',
          `No route found with ID: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return ApiResponse.success(route, 'Route updated successfully');
    } catch (error) {
      this.logger.error(`Error updating route: ${error.message}`, error.stack);
      return ApiResponse.error(
        'Failed to update route',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Route deleted',
    type: ApiResponse,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Route not found',
    type: ApiResponse,
  })
  async remove(@Param('id') id: string): Promise<ApiResponse<Route>> {
    try {
      const route = await this.routesService.remove(id);
      if (!route) {
        return ApiResponse.error(
          'Route not found',
          `No route found with ID: ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return ApiResponse.success(route, 'Route deleted successfully');
    } catch (error) {
      this.logger.error(`Error deleting route: ${error.message}`, error.stack);
      return ApiResponse.error(
        'Failed to delete route',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
