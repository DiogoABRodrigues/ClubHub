// models/Match.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Competition from './Competition';

class Match extends Model {
  public id!: number;
  public teamName!: string;
  public date!: Date;
  public time!: string;
  public homeOrAway!: 'C' | 'F';
  public opponent!: string;
  public result!: string | null;
  public competitionId!: number | null; 
  public round!: string;
  public outcome!: 'V' | 'E' | 'D' | null;
  public status!: 'scheduled' | 'live' | 'played';
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  homeOrAway: {
    type: DataTypes.ENUM('C', 'F'),
    allowNull: false
  },
  opponent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  result: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  competitionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'competitions',
      key: 'id'
    }
  },
  round: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  outcome: {
    type: DataTypes.ENUM('V', 'E', 'D'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'live', 'played'),
    allowNull: false,
    defaultValue: 'scheduled'
  }
}, {
  sequelize,
  modelName: 'Match',
  tableName: 'matches',
  indexes: [
    {
      unique: true,
      fields: ['teamName', 'opponent', 'homeOrAway', 'competitionId']
    },
    {
      fields: ['competitionId']
    },
    {
      fields: ['status']
    }
  ]
});

// Associação
Match.belongsTo(Competition, { foreignKey: 'competitionId', as: 'competitionDetails' });

export default Match;