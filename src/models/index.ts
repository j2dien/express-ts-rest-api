import { Sequelize } from "sequelize";
import { Post } from "./post";
import { Comment } from "./comment";

const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.json")[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

Post.initModel(sequelize);
Comment.initModel(sequelize);

// Relasi DB
Post.hasMany(Comment, {
  foreignKey: "post_id",
  as: "comments"
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
  as: "post"
})

export { Sequelize, Post, Comment };
