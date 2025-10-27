import { DataType, DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface IUserCreate extends Optional<IUser, "id"> {}

export class User extends Model<IUser, IUserCreate> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Users",
        modelName: "User",
      }
    );

    return User;
  }
}
