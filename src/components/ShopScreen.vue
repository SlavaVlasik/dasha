<template>
    <div class="shop-container">
      <h2>Магазин</h2>
      <p>Баланс: {{ balance }} монет</p>
      
      <h3>Пойманная рыба</h3>
      <div class="inventory-items">
        <div v-for="(fish, index) in inventory.getFishes()" :key="index" class="fish-item">
          <img v-if="fish.image" :src="fish.image" alt="Fish Image" class="fish-image" />
          <p>{{ fish.name }} x {{ fish.count }}</p>
          <button @click="$emit('sell-fish-one', fish)">Продать одну</button>
          <button @click="$emit('sell-fish-all', fish)">Продать все</button>
        </div>
      </div>
      
      <h3>Покупка наживок</h3>
      <div class="inventory-items">
        <div v-for="bait in shopBaits" :key="bait.id" class="bait-item">
          <p>{{ bait.name }} - {{ bait.price }} монет</p>
          <button @click="$emit('buy-bait', bait)">Купить</button>
        </div>
      </div>
      
      <button @click="$emit('change-screen', 'menu')">Назад</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ShopScreen",
    props: {
      balance: {
        type: Number,
        required: true
      },
      inventory: {
        type: Object,
        required: true
      },
      shopBaits: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .shop-container {
    text-align: center;
    padding: 20px;
  }
  .inventory-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 15px 0;
  }
  .fish-item, .bait-item {
    background-color: #fff;
    color: #333;
    border-radius: 5px;
    padding: 10px;
    min-width: 120px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .fish-image {
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
    border-radius: 50%;
  }
  button {
    padding: 10px;
    font-size: 16px;
    margin: 5px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007BFF;
    color: rgb(201, 22, 22);
  }
  </style>
  
  