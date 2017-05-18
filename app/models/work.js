exports.definition = {
  config: {
    columns: {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT',
      cropId: 'INTEGER'
    },
    adapter: {
      type: 'sql',
      collection_name: 'work',
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
      comparator: function(work) {
        return -(work.get('id'));
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
