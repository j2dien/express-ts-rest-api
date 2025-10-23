import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IPost {
  id: number;
  title: string;
  description: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IPostCreate
  extends Optional<IPost, "id" | "createdAt" | "deletedAt" | "updatedAt"> {}

export class Post extends Model<IPost, IPostCreate> implements IPost {
  public id!: number;
  public title!: string;
  public description!: string;
  public deletedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Post {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "Posts",
        modelName: "Post",
        paranoid: true, //untuk softdelete
        deletedAt: "deletedAt", //untuk softdelete
      }
    );
    return Post;
  }
}
