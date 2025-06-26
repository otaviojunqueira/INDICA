import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class CulturalEvent extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public city!: string;
  public state!: string;
  public eventType!: string;
  public category!: string;
  public status!: 'upcoming' | 'ongoing' | 'finished';
  public createdBy!: number; // ID do Ente Federado que criou
  public address?: string;
  public website?: string;
  public contactInfo?: string;
  public imageUrl?: string;
}

CulturalEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    eventType: {
      type: DataTypes.ENUM(
        'Assistencial',
        'Cívico',
        'Comercial',
        'Cultural',
        'Empresarial',
        'Esportivo',
        'Folclórico',
        'Gastronômico',
        'Religioso',
        'Social',
        'Técnico',
        'Outros'
      ),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        'Artístico/Cultural/Folclórico',
        'Científico ou Técnico',
        'Comercial ou Promocional',
        'Ecoturismo',
        'Esportivo',
        'Gastronômico',
        'Junino',
        'Moda',
        'Religioso',
        'Rural',
        'Social/Cívico/Histórico',
        'Outro'
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'finished'),
      allowNull: false,
      defaultValue: 'upcoming',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    address: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    contactInfo: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'CulturalEvent',
    tableName: 'cultural_events',
    timestamps: true,
  }
);

export default CulturalEvent; 