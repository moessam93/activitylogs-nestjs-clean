import { Document } from 'mongoose';

export interface IBaseMapper<TEntity, TDocument extends Document> {
  /**
   * Maps a MongoDB document to a domain entity
   */
  toEntity(document: TDocument): TEntity;

  /**
   * Maps a domain entity to a MongoDB document (for creation/updates)
   */
  toDocument(entity: TEntity): Partial<TDocument>;

  /**
   * Extracts the ID from a domain entity
   */
  extractId(entity: TEntity): string;
}
