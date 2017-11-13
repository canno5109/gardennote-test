migration.up = function(migrator) {
  try {
    migrator.db.execute('ALTER TABLE photoRecord ADD COLUMN upload BOOLEAN;');
  } catch(e) {
    migrator.dropTable();
    migrator.createTable({
      columns: {
        id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
        user_name: 'TEXT',
        date: 'TEXT',
        crop_name: 'TEXT',
        work: 'TEXT',
        work_reason: 'TEXT',
        technical_supplement: 'TEXT',
        consideration: 'TEXT',
        evidence: 'TEXT',
        photo: 'BLOB',
        upload: 'BOOLEAN'
      }
    });
  }
};

migration.down = function(migrator) {
  migrator.db.execute('ALTER TABLE photoRecord DROP COLUMN upload;');
};

