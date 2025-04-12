import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class Coordinate {
  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  lat: number;

  @Prop({ required: true, type: Number })
  lng: number;
}

export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);

@Schema({ _id: false })
export class Distance {
  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: String })
  text: string;
}

export const DistanceSchema = SchemaFactory.createForClass(Distance);

@Schema({ _id: false })
export class Duration {
  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: String })
  text: string;
}

export const DurationSchema = SchemaFactory.createForClass(Duration);

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true, type: String, unique: true })
  routeId: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  travelMode: string;

  @Prop({ type: DistanceSchema, required: true })
  distance: Distance;

  @Prop({ type: DurationSchema, required: true })
  duration: Duration;

  @Prop({ type: CoordinateSchema, required: true })
  origin: Coordinate;

  @Prop({ type: CoordinateSchema, required: true })
  destination: Coordinate;

  @Prop({ type: [CoordinateSchema], default: [] })
  waypoints: Coordinate[];

  @Prop({ type: [CoordinateSchema], required: true })
  path: Coordinate[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: String })
  userId: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
