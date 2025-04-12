// src/routes/routes.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './schema/routes.schema';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from 'src/common/api-response';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(@InjectModel(Route.name) private routeModel: Model<Route>) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    try {
      this.logger.log(`Creating route: ${createRouteDto.name}`);

      // Generate a unique routeId
      const routeId = this.generateRouteId();

      // Create the new route with the generated routeId
      const routeData = {
        ...createRouteDto,
        routeId,
      };

      const createdRoute = new this.routeModel(routeData);
      return await createdRoute.save();
    } catch (error) {
      this.logger.error(`Error creating route: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate a unique route ID
   * This uses a combination of UUID and timestamp for uniqueness
   */
  private generateRouteId(): string {
    const timestamp = new Date().getTime().toString();
    const uuid = uuidv4();
    return `route-${timestamp}-${uuid.substring(0, 8)}`;
  }

  async findAll(filters: { limit?: number; page?: number }): Promise<any> {
    try {
      const { limit = 10, page = 1 } = filters;

      const skip = (page - 1) * limit;

      this.logger.log(
        `Finding routes with filters: ${JSON.stringify(filters)}`,
      );

      const [total, routes] = await Promise.all([
        this.routeModel.countDocuments().exec(),
        this.routeModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
      ]);
      return ApiResponse.success(
        { routes, total },
        'Routes  retrieved successfully',
      );
    } catch (error) {
      this.logger.error(`Error finding routes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      this.logger.log(`Finding route by ID: ${id}`);
      const route = await this.routeModel.findById(id).exec();

      if (!route) {
        this.logger.warn(`Route not found with ID: ${id}`);
      }

      return route;
    } catch (error) {
      this.logger.error(`Error finding route by ID: ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<any> {
    try {
      this.logger.log(`Updating route with ID: ${id}`);
      const updatedRoute = await this.routeModel
        .findByIdAndUpdate(id, updateRouteDto, { new: true })
        .exec();

      if (!updatedRoute) {
        this.logger.warn(`Route not found for update with ID: ${id}`);
      }

      return updatedRoute;
    } catch (error) {
      this.logger.error(`Error updating route with ID: ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<any> {
    try {
      this.logger.log(`Removing route with ID: ${id}`);
      const deletedRoute = await this.routeModel.findByIdAndDelete(id).exec();

      if (!deletedRoute) {
        this.logger.warn(`Route not found for deletion with ID: ${id}`);
      }

      return deletedRoute;
    } catch (error) {
      this.logger.error(`Error deleting route with ID: ${id}`, error.stack);
      throw error;
    }
  }

  // Additional methods can be added here

  async findByTags(tags: string[]): Promise<Route[]> {
    try {
      this.logger.log(`Finding routes by tags: ${tags.join(', ')}`);
      return await this.routeModel
        .find({ tags: { $in: tags } })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error finding routes by tags: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async countRoutes(filters: {
    userId?: string;
    favorites?: boolean;
  }): Promise<number> {
    try {
      const { userId, favorites } = filters;
      const query: any = {};

      if (userId) {
        query.userId = userId;
      }

      if (favorites !== undefined) {
        query.isFavorite = favorites;
      }

      this.logger.log(
        `Counting routes with filters: ${JSON.stringify(filters)}`,
      );
      return await this.routeModel.countDocuments(query).exec();
    } catch (error) {
      this.logger.error(`Error counting routes: ${error.message}`, error.stack);
      throw error;
    }
  }
}
