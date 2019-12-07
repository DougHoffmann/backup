class FormDirector {
  constructor(form) {
    if (form) return this[form]();
    return {};
  }

  addDriver() {
    return {
      name: {
        label: "Nome",
        placeholder: "ex. José da Silva",
        type: "string",
        required: true,
        value: ""
      },
      license: {
        label: "Carteira de Motorista",
        placeholder: "555-888",
        type: "string",
        required: true,
        value: ""
      },
      salary: {
        label: "Salário",
        placeholder: "968794",
        type: "currency",
        value: 0
      },
      status: {
        type: "switch",
        tag: "Motorista Ativo",
        value: true
      }
    };
  }

  addTruck() {
    return {
      plate: {
        label: "Placa",
        placeholder: "AAA-111",
        type: "string",
        required: true,
        value: ""
      },
      mileage: {
        label: "Kilometragem",
        placeholder: "",
        type: "string",
        value: ""
      },
      driver: {
        label: "Motorista",
        type: "autocomplete",
        placeholder: "José da Silva",
        url: "driver/avaliable",
        field: "name"
      },
      status: {
        type: "switch",
        tag: "Caminhão Ativo",
        value: true
      }
    };
  }

  addFreight() {
    return {
      price: {
        label: "Valor",
        type: "currency",
        value: 0
      },
      depart: {
        label: "Partida",
        type: "city",
        required: true,
        value: {
          name: ""
        }
      },
      arrive: {
        label: "Destino",
        type: "city",
        required: true,
        value: {
          name: ""
        }
      },
      type: {
        label: "Tipo",
        type: "autocomplete",
        url: "type",
        field: "name",
        placeholder: "Ex. Soja"
      },
      openDate: {
        label: "Data de Abertura",
        type: "date",
        value: null
      }
    };
  }

  addCargo() {
    return {
      truck: {
        label: "Caminhão",
        type: "autocomplete",
        placeholder: "CPX-111",
        url: "truck",
        field: "plate"
      },
      km: {
        label: "Nova kilometragem",
        value: 0,
        type: "numeric"
      },
      fuel: {
        label: "Combustivel consumido",
        value: 0,
        type: "numeric"
      },
      weightDepart: {
        label: "Peso Origem",
        value: 0,
        type: "numeric"
      },
      weightArrive: {
        label: "Peso Destino",
        value: 0,
        type: "numeric"
      },
      expenses: {
        label: "Viático",
        value: 0,
        type: "numeric"
      }
    };
  }
  addTire() {
    return {
      cod: {
        label: "Código",
        type: "string",
        required: true,
        value: ""
      },
      brand: {
        label: "Marca",
        type: "autocomplete",
        placeholder: "ex. Bridgestone",
        url: "brand",
        field: "name"
      }
    };
  }

  addPiece() {
    return {
      name: {
        label: "Nome",
        type: "string",
        required: true,
        value: ""
      },

      description: {
        label: "Descrição",
        type: "string",
        required: true,
        value: ""
      },

      price: {
        label: "Preço",
        type: "currency",
        value: 0
      },

      stock: {
        label: "Estoque",
        value: 0,
        type: "string"
      }
    };
  }
}

export default FormDirector;
