migration.up = function(migrator) {
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
      photo: 'BLOB'
    }
  });
};

migration.down = function(migrator) {};
