exports.definition = {
  config: {
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
    },
    adapter: {
      type: 'sql',
      collection_name: 'photoRecord',
      idAttribute: 'id'
    }
  },
  extendModel: function(Model) {
    _.extend(Model.prototype, {
    });

    return Model;
  },
  extendCollection: function(Collection) {
    _.extend(Collection.prototype, {
      comparator: function(photo) {
        return -(photo.get('id'));
      },
      fetch: function(options) {
        options = options ? _.clone(options) : {};
        options.reset = true;
        return Backbone.Collection.prototype.fetch.call(this, options);
      }
    });

    return Collection;
  }
};
