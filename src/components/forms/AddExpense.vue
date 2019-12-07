<template>
  <section>
    <form @submit.prevent="submitPiece">
      <div class="columns">
        <div class="column">
          <Autocomplete
            url="piece"
            field="name"
            placeholder="Selecione a peça"
            :preSelect="selected"
            @selected-value="selectPiece"
            ref="autocomplete"
          />
        </div>
        <div class="column is-4">
          <b-input type="number" v-model="qnt" />
        </div>
        <div class="column is-3">
          <b-button type="is-primary" tag="input" native-type="submit" value="Adicionar" expanded></b-button>
        </div>
      </div>
    </form>

    <table class="table is-bordered is-hoverable mt-15" style="width: 100%; ">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Quantidade</th>
          <th>Preço</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(piece, key) in selectedPieces" :key="key">
          <td>{{piece.name}}</td>
          <td>{{piece.qnt}}x</td>
          <td>{{piece.price | currency}}</td>
          <td>{{(piece.price * piece.qnt ) | currency}}</td>
        </tr>
      </tbody>
    </table>
    <p class="is-size-4 has-text-right">Total: {{total | currency}}</p>
    <b-button type="is-primary mt-15" @click="submitExpense" expanded>Salvar</b-button>
  </section>
</template>

<script>
import Autocomplete from "../fields/Autocomplete.vue";

export default {
  components: {
    Autocomplete
  },
  data() {
    return {
      selectedPieces: [],
      selected: null,
      qnt: 0,
      total: 0
    };
  },

  methods: {
    calcTotal() {
      let sum = 0;
      for (let i = 0; i < this.selectedPieces.length; i++) {
        let piece = this.selectedPieces[i];
        sum += piece.price * piece.qnt;
      }
      this.total = sum;
    },

    submitPiece() {
      if (this.selected && this.qnt > 0) {
        this.selectedPieces.push({
          name: this.selected.name,
          price: this.selected.price,
          qnt: this.qnt
        });
        this.selected = null;
        this.qnt = 0;
        this.calcTotal();
      }
    },
    selectPiece(piece) {
      this.selected = piece;
    },
    submitExpense() {
      this.$emit("submit-expense", {
        total: this.total,
        date: Date.now(),
        pieces: this.selectedPieces
      });
    }
  }
};
</script>

<style>
</style>