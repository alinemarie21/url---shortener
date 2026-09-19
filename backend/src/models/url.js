import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Url = sequelize.define(
    'Url',
    {
      short_code: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      original_url: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'urls',
      timestamps: false,
    }
  );

  Url.associate = (models) => {
    Url.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Url.hasMany(models.Click, {
      foreignKey: 'short_code',
      as: 'clicks',
      onDelete: 'CASCADE',
    });
  };

  return Url;
};
