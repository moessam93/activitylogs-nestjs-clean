import { Document, Model, FilterQuery } from 'mongoose';
import { IBaseRepository } from '../../../domain/repos/base-repo.interface';
import { BaseSpecification } from '../../../domain/repos/base-sepecs.interface';
import { IBaseMapper } from './mappers/base.mapper.interface';

export class BaseMongooseRepository<TEntity, TId, TDocument extends Document>
  implements IBaseRepository<TEntity, TId>
{
  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly mapper: IBaseMapper<TEntity, TDocument>
  ) {}

  protected buildQuery(spec?: BaseSpecification<TEntity>): any {
    if (!spec || !spec.criteria || spec.criteria.length === 0) {
      return {};
    }

    // Convert specification criteria to MongoDB query
    const query: any = {};
    
    spec.criteria.forEach((criterion) => {
      Object.keys(criterion).forEach((key) => {
        const value = criterion[key];
        
        if (typeof value === 'object' && value !== null) {
          // Handle complex queries
          if (value.lt !== undefined) query[key] = { ...query[key], $lt: value.lt };
          if (value.lte !== undefined) query[key] = { ...query[key], $lte: value.lte };
          if (value.gt !== undefined) query[key] = { ...query[key], $gt: value.gt };
          if (value.gte !== undefined) query[key] = { ...query[key], $gte: value.gte };
          if (value.in !== undefined) query[key] = { $in: value.in };
          if (value.notIn !== undefined) query[key] = { $nin: value.notIn };
          if (value.contains !== undefined) {
            query[key] = { $regex: new RegExp(value.contains, 'i') };
          }
          if (value.startsWith !== undefined) {
            query[key] = { $regex: new RegExp(`^${value.startsWith}`, 'i') };
          }
          if (value.endsWith !== undefined) {
            query[key] = { $regex: new RegExp(`${value.endsWith}$`, 'i') };
          }
          if (value.not !== undefined) query[key] = { $ne: value.not };
          if (value.isSet !== undefined) {
            query[key] = value.isSet ? { $exists: true, $ne: null } : { $exists: false };
          }
        } else {
          // Simple equality
          query[key] = value;
        }
      });
    });

    // Handle search
    if (spec.search) {
      const searchConditions = spec.search.fields.map((field) => ({
        [field as string]: { $regex: new RegExp(spec.search!.term, 'i') },
      }));
      query.$or = searchConditions;
    }

    return query;
  }

  protected buildSort(spec?: BaseSpecification<TEntity>): Record<string, 1 | -1> {
    if (!spec?.orderBy || spec.orderBy.length === 0) {
      return {};
    }

    const sort: Record<string, 1 | -1> = {};
    spec.orderBy.forEach((order) => {
      sort[order.field as string] = order.direction === 'asc' ? 1 : -1;
    });
    
    return sort;
  }

  async findMany(spec?: BaseSpecification<TEntity>): Promise<TEntity[]> {
    const query = this.model.find(this.buildQuery(spec));
    
    if (spec?.orderBy) {
      query.sort(this.buildSort(spec));
    }
    
    if (spec?.pagination) {
      const { skip, take, page, limit } = spec.pagination;
      if (skip !== undefined) query.skip(skip);
      if (take !== undefined) query.limit(take);
      if (page !== undefined && limit !== undefined) {
        query.skip((page - 1) * limit).limit(limit);
      }
    }

    const documents = await query.exec();
    return documents.map(doc => this.mapper.toEntity(doc as TDocument));
  }

  async findOne(spec: BaseSpecification<TEntity>): Promise<TEntity | null> {
    const document = await this.model.findOne(this.buildQuery(spec)).exec();
    return document ? this.mapper.toEntity(document) : null;
  }

  async count(spec?: BaseSpecification<TEntity>): Promise<number> {
    return await this.model.countDocuments(this.buildQuery(spec)).exec();
  }

  async exists(spec: BaseSpecification<TEntity>): Promise<boolean> {
    const document = await this.model.findOne(this.buildQuery(spec)).exec();
    return document !== null;
  }

  async create(entity: TEntity): Promise<TEntity> {
    const document = new this.model(this.mapper.toDocument(entity));
    const savedDocument = await document.save();
    return this.mapper.toEntity(savedDocument);
  }

  async update(entity: TEntity): Promise<TEntity> {
    const documentData = this.mapper.toDocument(entity);
    const id = this.mapper.extractId(entity);
    
    const updatedDocument = await this.model
      .findByIdAndUpdate(id, documentData, { new: true })
      .exec();
    
    if (!updatedDocument) {
      throw new Error(`Entity with id ${id} not found`);
    }
    
    return this.mapper.toEntity(updatedDocument);
  }

  async delete(id: TId): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async createMany(entities: TEntity[]): Promise<TEntity[]> {
    const documents = entities.map(entity => this.mapper.toDocument(entity));
    const savedDocuments = await this.model.insertMany(documents);
    return savedDocuments.map(doc => this.mapper.toEntity(doc as unknown as TDocument));
  }

  async updateMany(entities: TEntity[]): Promise<TEntity[]> {
    const updateOperations = entities.map(entity => {
      const id = this.mapper.extractId(entity);
      const documentData = this.mapper.toDocument(entity);
      
      return this.model.findByIdAndUpdate(id, documentData, { new: true }).exec();
    });

    const updatedDocuments = await Promise.all(updateOperations);
    return updatedDocuments
      .filter(doc => doc !== null)
      .map(doc => this.mapper.toEntity(doc!));
  }

  async deleteMany(ids: TId[]): Promise<void> {
    await this.model.deleteMany({ _id: { $in: ids } }).exec();
  }

  async list(spec?: BaseSpecification<TEntity>): Promise<{
    data: TEntity[];
    total: number;
    totalFiltered: number;
  }> {
    const total = await this.model.countDocuments({}).exec();
    const totalFiltered = await this.count(spec);
    const data = await this.findMany(spec);

    return {
      data,
      total,
      totalFiltered,
    };
  }

}
