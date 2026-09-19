const INDEX_NAME = 'clicks_short_code_clicked_at_index';

export async function up(queryInterface) {
  await queryInterface.addIndex('clicks', ['short_code', 'clicked_at'], {
    name: INDEX_NAME,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex('clicks', INDEX_NAME);
}
