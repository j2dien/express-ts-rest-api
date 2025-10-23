import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface IComment {
  id: number;
  comment: string;
  post_id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ICommentCreate
  extends Optional<IComment, "id" | "createdAt" | "updatedAt"> {}

export class Comment extends Model<IComment, ICommentCreate> implements IComment {
  public id!: number;
  public comment!: string;
  public post_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {}

  static initModel(sequelize: Sequelize): typeof Comment {
    Comment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        comment: DataTypes.STRING,
        post_id: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "Comments",
        modelName: "Comment",
      }
    );
    return Comment;
  }
}
