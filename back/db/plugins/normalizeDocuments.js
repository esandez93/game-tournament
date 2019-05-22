module.exports = (schema, options) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  // Extend toJSON options
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      // Remove private paths
      if (schema.options.removePrivatePaths !== false) {
        for (const path in schema.paths) {
          if (schema.paths[path].options && schema.paths[path].options.private) {
            if (typeof ret[path] !== 'undefined') {
              delete ret[path];
            }
          }
        }
      }

      // Remove version
      if (schema.options.removeVersion !== false) {
        if (typeof ret.__v !== 'undefined') {
          delete ret.__v;
        }
      }

      // Normalize ID
      if (schema.options.normalizeId !== false) {
        if (ret._id && typeof ret._id === 'object' && ret._id.toString) {
          if (typeof ret.id === 'undefined') {
            ret.id = ret._id.toString();
          }
          delete ret._id;
        }
      }

      // Call custom transform if present
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};
