<template>
  <div>
    <h1>Русская рыбалка</h1>
    <button @click="$emit('change-screen', 'locations')">Начать игру</button>
    <button @click="$emit('change-screen', 'shop')">Магазин</button>
  </div>
</template>

<script>
export default {
  name: "MainMenu"
};
</script>

<style scoped>
button {
  padding: 10px;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
}
</style>
