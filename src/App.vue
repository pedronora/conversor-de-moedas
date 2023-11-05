<script>
import currencies from './data.js'

export default {
  data() {
    return {
      values: '',
      currencies: currencies,
      qty: 1,
      loading: true,
      selected1: false,
      selected2: false,
      lastUpdated: null,
      isChecked: false,
      theme: {
        false: 'light',
        true: 'dark'
      }
    }
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch('https://cdn.moneyconvert.net/api/latest.json')
        const data = await response.json()
        this.values = data['rates']
        let date = new Date(data['lastupdate'])
        this.lastUpdated =
          date.toLocaleDateString('pt-BR') + ' - ' + date.toLocaleTimeString('pt-BR')
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    convertCurrency() {
      if (this.showResult) {
        return (
          (this.values[this.selected2['ISO']] / this.values[this.selected1['ISO']]) *
          this.qty
        ).toFixed(2)
      }
    },
    invert() {
      let temp = this.selected2
      this.selected2 = this.selected1
      this.selected1 = temp
    }
  },
  computed: {
    showResult() {
      return this.selected1 && this.selected2
    },
    currency1() {
      return this.selected1['Symbol']
    },
    currency2() {
      return this.selected2['Symbol']
    },
    formattedQty() {
      return parseFloat(this.qty).toFixed(2)
    }
  },
  watch: {
    isChecked() {
      document.querySelector('html').setAttribute('data-bs-theme', this.theme[this.isChecked])
      localStorage.setItem('theme', this.isChecked)
    }
  },
  mounted() {
    this.isChecked = localStorage.getItem('theme')
  },
  created() {
    this.loadData()
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center mt-5">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else class="container my-3 px-3 pt-3">
    <div class="d-flex justify-content-between">
      <h1>Conversor de Moedas</h1>
      <div class="d-flex align-items-center">
        <i class="bi bi-brightness-high me-2"></i>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" v-model="isChecked" />
        </div>
        <i class="bi bi-moon-stars"></i>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 mt-4">
      <div class="col my-2">
        <div class="form-floating">
          <input
            v-model="qty"
            type="number"
            class="form-control"
            id="floatingInput"
            placeholder="Montante"
          />
          <label for="floatingInput">Montante</label>
        </div>
      </div>
      <div class="col my-2">
        <div class="form-floating">
          <select class="form-select" v-model="selected1" aria-label="Default select example">
            <option v-for="item in currencies" :value="item" :key="item.ISO">
              {{ item.ISO }} - {{ item.Currency }}
            </option>
          </select>
          <label for="floatingSelect">Selecione uma moeda</label>
        </div>
      </div>
      <div class="col my-2">
        <div class="form-floating">
          <select class="form-select" v-model="selected2" aria-label="Default select example">
            <option v-for="item in currencies" :value="item" :key="item.ISO">
              {{ item.ISO }} - {{ item.Currency }}
            </option>
          </select>
          <label for="floatingSelect">Selecione uma moeda</label>
        </div>
      </div>
      <div class="d-flex align-items-center col my-2">
        <button @click="invert" class="btn btn-primary">
          <i class="bi bi-arrow-left-right"></i>
          Inverter
        </button>
      </div>
    </div>
    <div v-if="showResult">
      <div class="row mt-4">
        <p class="fs-1">
          <strong>{{ currency1 }} {{ formattedQty }}</strong> é igual a
          <strong> {{ currency2 }} {{ convertCurrency() }}</strong>
        </p>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <p class="fs-6">Última Atualização: {{ lastUpdated }}</p>
      </div>
      <div class="col text-end">
        <p class="fs-6">
          Fonte:
          <a href="https://moneyconvert.net/pages/api" target="_blank" alt="MoneyConvert Link"
            >MoneyConvert</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
