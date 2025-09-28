import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.ts";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone?:string;
  declare role: CreationOptional<"user" | "admin">;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "Please enter your name" },
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: { name: "unique_email", msg: "Email is already registered" },
      validate: {
        notNull: { msg: "Please enter your email" },
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Please enter a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please enter your password" },
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    phone: {
  type: DataTypes.STRING(15),
  defaultValue:"0000000000",
  validate: {
    is: {
      args: /^[0-9()+-\s]*$/, // allows digits, spaces, +, -, ()
      msg: "Phone number contains invalid characters",
    },
    len: {
      args: [7, 15], // adjust min/max length as needed
      msg: "Phone number must be between 7 and 15 digits",
    },
  },
},
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

export default User;
