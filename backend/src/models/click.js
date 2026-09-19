import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Click = sequelize.define(
    'Click',
    {
      click_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      short_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clicked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'clicks',
      timestamps: false,
    }
  );

  Click.associate = (models) => {
    Click.belongsTo(models.Url, {
      foreignKey: 'short_code',
      as: 'url',
    });
  };

  return Click;
};
