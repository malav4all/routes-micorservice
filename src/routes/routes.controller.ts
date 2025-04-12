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
  HttpException,
  Logger,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

  // Microservice message patterns
  @MessagePattern('route.create')
  async createRoute(
    @Payload() data: CreateRouteDto,
  ): Promise<ApiResponse<Route>> {
    try {
      const result = await this.routesService.create(data);
      return ApiResponse.success(result, 'Route created successfully');
    } catch (error) {
      this.logger.error(
        `Microservice error creating route: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error('Failed to create route', error.message);
    }
  }

  @MessagePattern('route.findAll')
  async findAllRoutes(@Payload() data: any): Promise<ApiResponse<Route[]>> {
    try {
      const routes = await this.routesService.findAll(data);
      return ApiResponse.success(routes, 'Routes retrieved successfully');
    } catch (error) {
      this.logger.error(
        `Microservice error finding routes: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error('Failed to fetch routes', error.message);
    }
  }

  @MessagePattern('route.findOne')
  async findOneRoute(@Payload() id: string): Promise<ApiResponse<Route>> {
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
      this.logger.error(
        `Microservice error finding route: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error('Failed to fetch route', error.message);
    }
  }

  @MessagePattern('route.update')
  async updateRoute(
    @Payload() data: { id: string; updateData: UpdateRouteDto },
  ): Promise<ApiResponse<Route>> {
    try {
      const route = await this.routesService.update(data.id, data.updateData);
      if (!route) {
        return ApiResponse.error(
          'Route not found',
          `No route found with ID: ${data.id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return ApiResponse.success(route, 'Route updated successfully');
    } catch (error) {
      this.logger.error(
        `Microservice error updating route: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error('Failed to update route', error.message);
    }
  }

  @MessagePattern('route.remove')
  async removeRoute(@Payload() id: string): Promise<ApiResponse<Route>> {
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
      this.logger.error(
        `Microservice error deleting route: ${error.message}`,
        error.stack,
      );
      return ApiResponse.error('Failed to delete route', error.message);
    }
  }
}
