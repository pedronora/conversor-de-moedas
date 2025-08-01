<script>
import currencies from "./data.js";

export default {
  data() {
    return {
      values: {}, // Inicializado como objeto vazio, não string
      currencies: currencies,
      qty: 1,
      loading: true,
      errorMessage: null,
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
      // O objeto theme não é mais necessário, pois o isChecked será um booleano
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch(
          "https://cdn.moneyconvert.net/api/latest.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.values = data["rates"];
        let date = new Date(data["lastupdate"]);
        this.lastUpdated =
          date.toLocaleDateString("pt-BR") +
          " - " +
          date.toLocaleTimeString("pt-BR");
        this.loading = false;
      } catch (e) {
        this.errorMessage =
          "Não foi possível buscar os dados. Tente novamente mais tarde. Detalhes: " +
          e.message; // Acessar e.message para erro da rede
        this.loading = false;
      }
    },
    invert() {
      let temp = this.selected2;
      this.selected2 = this.selected1;
      this.selected1 = temp;
    },
    setTheme(isDark) {
      document
        .querySelector("html")
        .setAttribute("data-bs-theme", isDark ? "dark" : "light");
      localStorage.setItem("theme", isDark);
    },
  },
  computed: {
    showResult() {
      // Verifica se values tem as chaves necessárias e se qty é um número válido
      return (
        this.selected1 &&
        this.selected2 &&
        this.values[this.selected1["ISO"]] &&
        this.values[this.selected2["ISO"]] &&
        !isNaN(parseFloat(this.qty))
      );
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
    // convertCurrency agora é uma propriedade computada
    convertedValue() {
      if (this.showResult) {
        return (
          (this.values[this.selected2["ISO"]] /
            this.values[this.selected1["ISO"]]) *
          this.qty
        ).toFixed(2);
      }
      return "0.00"; // Retorna um valor padrão quando não há resultado
    },
  },
  watch: {
    isChecked(newValue) {
      this.setTheme(newValue);
    },
  },
  created() {
    const storageTheme = localStorage.getItem("theme");

    if (storageTheme !== null) {
      // Converte a string "true" ou "false" para booleano
      this.isChecked = storageTheme === "true";
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    // Aplica o tema inicial imediatamente
    this.setTheme(this.isChecked);

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
      <span class="visually-hidden">Carregando...</span>
    </div>
  </div>
  <div v-if="errorMessage" class="error-message alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="!errorMessage && !loading" class="container my-3 px-3 pt-3">
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
            v-model.number="qty"
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
          <label for="select1">Selecione uma moeda de origem</label>
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
          <label for="select2">Selecione uma moeda de destino</label>
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
            <strong> {{ currency2 }} {{ convertedValue }}</strong>
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

<style scoped>
.error-message {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999; /* Garante que a mensagem fique sobre outros elementos */
}
</style>