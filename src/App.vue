<script>
import currencies from './data.js';

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
        };
    },
    methods: {
        async loadData() {
            try {
                const response = await fetch(
                    'https://cdn.moneyconvert.net/api/latest.json'
                );
                const data = await response.json();
                this.values = data['rates'];
                let date = new Date(data['lastupdate']);
                this.lastUpdated =
                    date.toLocaleDateString('pt-BR') +
                    ' - ' +
                    date.toLocaleTimeString('pt-BR');
                this.loading = false;
            } catch (e) {
                console.log(e);
            }
        },
        convertCurrency() {
            if (this.showResult) {
                return (
                    (this.values[this.selected2['ISO']] /
                        this.values[this.selected1['ISO']]) *
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
            return this.selected1['Symbol'];
        },
        currency2() {
            return this.selected2['Symbol'];
        },
        formattedQty() {
            return parseFloat(this.qty).toFixed(2);
        },
    },
    created() {
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
    <div v-else class="container shadow rounded my-5 px-3 pt-3">
        <h1>Conversor de Moedas</h1>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 mt-4">
            <div class="col my-3">
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
            <div class="col my-3">
                <div class="form-floating">
                    <select
                        class="form-select"
                        v-model="selected1"
                        aria-label="Default select example"
                    >
                        <option
                            v-for="item in currencies"
                            :value="item"
                            :key="item.ISO"
                        >
                            {{ item.ISO }} - {{ item.Currency }}
                        </option>
                    </select>
                    <label for="floatingSelect">Selecione uma moeda</label>
                </div>
            </div>
            <div class="col my-3">
                <div class="form-floating">
                    <select
                        class="form-select"
                        v-model="selected2"
                        aria-label="Default select example"
                    >
                        <option
                            v-for="item in currencies"
                            :value="item"
                            :key="item.ISO"
                        >
                            {{ item.ISO }} - {{ item.Currency }}
                        </option>
                    </select>
                    <label for="floatingSelect">Selecione uma moeda</label>
                </div>
            </div>
            <div class="col my-auto">
                <button @click="invert" class="btn btn-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-left-right"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"
                        />
                    </svg>
                    Inverter
                </button>
            </div>
        </div>
        <div v-if="showResult">
            <div class="row mt-4">
                <p class="fs-1">
                    <strong>{{ currency1 }} {{ formattedQty }}</strong> é igual
                    a <strong> {{ currency2 }} {{ convertCurrency() }}</strong>
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
</template>
