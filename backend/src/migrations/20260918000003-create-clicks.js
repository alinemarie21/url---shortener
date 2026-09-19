import { DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('clicks', {
    click_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    short_code: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'urls', key: 'short_code' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clicked_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('clicks');
}
