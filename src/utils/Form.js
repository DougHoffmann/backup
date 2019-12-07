import Errors from "./Errors";

class Form {
  constructor(data) {
    this.originalData = data;
    this.errors = new Errors();

    for (let field in data) {
      this[field] = "";
    }
  }

  data() {
    let data = Object.assign({}, this);

    delete data.originalData;
    delete data.errors;

    return data;
  }

  reset() {
    for (let field in this.originalData) {
      this[field] = "";
    }
  }

  submit() {
    alert("submitting");
  }

  onSuccess() {
    //todo on success
    this.errors.clear();
  }
}

export default Form;
