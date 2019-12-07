class Errors {
  constructor() {
    this.errors = {};
  }

  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  any() {
    return Object.keys(this.errors).length > 0;
  }

  get(field) {
    if (this.errors[field]) {
      return this.errors[field];
    }
  }

  add(error) {
    this.errors[error.field] = error.msg;
  }

  record(errors) {
    this.errors = errors;
  }

  clear(field) {
    if (field) delete this.errors[field];
    else this.errors = {};
  }
}

export default Errors;
