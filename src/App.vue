<script>
import currencies from "./data.js";

export default {
  data() {
    return {
      values: "",
      currencies: currencies,
      qty: 1,
      loading: true,
      selected1: {
        Currency: " US Dollar",
        Name: "Dollar",
        Symbol: "$",
        ISO: "USD",
      },
      selected2: {
        Currency: " Brazilian real",
        Name: "Real",
        Symbol: "R$",
        ISO: "BRL",
      },
      lastUpdated: null,
      isChecked: false,
      theme: {
        false: "light",
        true: "dark",
      },
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch(
          "https://cdn.moneyconvert.net/api/latest.json"
        );
        const data = await response.json();
        this.values = data["rates"];
        let date = new Date(data["lastupdate"]);
        this.lastUpdated =
          date.toLocaleDateString("pt-BR") +
          " - " +
          date.toLocaleTimeString("pt-BR");
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    convertCurrency() {
      if (this.showResult) {
        return (
          (this.values[this.selected2["ISO"]] /
            this.values[this.selected1["ISO"]]) *
          this.qty
        ).toFixed(2);
      }
    },
    invert() {
      let temp = this.selected2;
      this.selected2 = this.selected1;
      this.selected1 = temp;
    },
  },
  computed: {
    showResult() {
      return this.selected1 && this.selected2;
    },
    currency1() {
      return this.selected1["Symbol"];
    },
    currency2() {
      return this.selected2["Symbol"];
    },
    formattedQty() {
      return parseFloat(this.qty).toFixed(2);
    },
  },
  watch: {
    isChecked() {
      document
        .querySelector("html")
        .setAttribute("data-bs-theme", this.theme[this.isChecked]);
      localStorage.setItem("theme", this.isChecked);
    },
  },
  created() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    const storageTheme = localStorage.getItem("theme");

    if ((storageTheme === "true") | (storageTheme == "false")) {
      this.isChecked = storageTheme;
    }

    this.loadData();
  },
};
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center mt-5">
    <div
      class="spinner-border text-primary"
      style="width: 3rem; height: 3rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else class="container my-3 px-3 pt-3">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="d-flex justify-content-between mb-3">
          <h1>Conversor de Moedas</h1>
          <div class="d-flex align-items-center">
            <i class="bi bi-brightness-high me-2"></i>
            <div class="form-check form-switch">
              <input
                id="theme"
                class="form-check-input"
                type="checkbox"
                role="switch"
                v-model="isChecked"
              />
            </div>
            <i class="bi bi-moon-stars"></i>
          </div>
        </div>
        <div class="form-floating mb-3">
          <input
            v-model="qty"
            type="number"
            class="form-control"
            id="montante"
            placeholder="Montante"
          />
          <label for="montante">Montante</label>
        </div>
        <div class="form-floating mb-3">
          <select
            id="select1"
            class="form-select"
            v-model="selected1"
            aria-label="Default select example"
          >
            <option v-for="item in currencies" :value="item" :key="item.ISO">
              {{ item.ISO }} - {{ item.Currency }}
            </option>
          </select>
          <label for="select1">Selecione uma moeda</label>
        </div>
        <div class="form-floating mb-3">
          <select
            id="select2"
            class="form-select"
            v-model="selected2"
            aria-label="Default select example"
          >
            <option v-for="item in currencies" :value="item" :key="item.ISO">
              {{ item.ISO }} - {{ item.Currency }}
            </option>
          </select>
          <label for="select2">Selecione uma moeda</label>
        </div>
        <div class="d-flex align-items-center mb-3">
          <button @click="invert" class="btn btn-primary">
            <i class="bi bi-arrow-left-right"></i>
            Inverter
          </button>
        </div>
        <div v-if="showResult" class="mb-3">
          <p class="fs-1">
            <strong>{{ currency1 }} {{ formattedQty }}</strong> é igual a
            <strong> {{ currency2 }} {{ convertCurrency() }}</strong>
          </p>
        </div>
        <div class="d-flex justify-content-between">
          <p class="fs-6">Última Atualização: {{ lastUpdated }}</p>
          <p>
            Fonte:
            <a
              href="https://moneyconvert.net/pages/api"
              target="_blank"
              alt="MoneyConvert Link"
              >MoneyConvert</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
