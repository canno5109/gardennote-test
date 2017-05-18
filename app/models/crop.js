exports.definition = {
  config: {
    columns: {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT'
    },
    adapter: {
      type: 'sql',
      collection_name: 'crop',
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
      comparator: function(crop) {
        return -(crop.get('id'));
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
