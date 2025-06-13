declare module 'sequelize' {
  import { Sequelize as OriginalSequelize, Model as OriginalModel, Optional, DataTypes } from 'sequelize';
  export { OriginalSequelize as Sequelize, OriginalModel as Model, Optional, DataTypes };
}

declare module 'bcryptjs' {
  export function genSalt(rounds: number): Promise<string>;
  export function hash(data: string, salt: string): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
} 