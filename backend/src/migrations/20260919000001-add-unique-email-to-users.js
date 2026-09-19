export async function up(queryInterface) {
  await queryInterface.addConstraint('users', {
    fields: ['email'],
    type: 'unique',
    name: 'users_email_unique',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeConstraint('users', 'users_email_unique');
}
