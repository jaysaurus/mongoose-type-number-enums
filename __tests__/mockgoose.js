module.exports = {
  Schema: {
    Types: {
      a: 'test'
    }
  },
  SchemaType: {
    call: (observed, b, c, d) => {
      observed = true;
    }
  }
};
