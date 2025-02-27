<template>
  <div id="app">
    <MainMenu v-if="screen === 'menu'" @change-screen="changeScreen" />
    <FishingLocations
      v-if="screen === 'locations'"
      :locations="locations"
      @change-screen="changeScreen"
      @select-location="selectLocation"
    />
    <FishingScreen 
      v-if="screen === 'fishing'"
      :currentLocation="currentLocation" 
      :rods="rods" 
      :baits="baits" 
      :inventory="inventory" 
      @update-inventory="updateInventory" 
      @catch-fish="catchFish"
    />

    <!-- Кнопка для открытия инвентаря (отображается после выбора локации) -->
    <div v-if="currentLocation" class="inventory-container">
      <button @click="toggleInventory" class="inventory-button">Инвентарь</button>
    </div>

    <!-- Модальное окно инвентаря -->
    <div v-if="showInventory" class="inventory-modal">
      <div class="modal-content">
        <h3>Ваш инвентарь</h3>
        <div class="inventory-items">
          <div v-for="(fish, index) in inventory.getFishes()" :key="index" class="fish-item">
            <img v-if="fish.image" :src="fish.image" alt="Fish Image" class="fish-image"/>
            <p>{{ fish.name }} x {{ fish.count }}</p>
          </div>
        </div>
        <button @click="toggleInventory">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FishingLocations from "./components/FishingLocations.vue";
import FishingScreen from "./components/FishingScreen.vue";
import Inventory from './models/inventory.js';

export default {
  name: "App",
  components: {
    MainMenu,
    FishingLocations,
    FishingScreen
  },
  data() {
    return {
      screen: "menu",
      locations: [
        { id: 1, name: "Озеро", image: "/assets/lake.jpg" },
        { id: 2, name: "Река", image: "/assets/river.jpg" },
        { id: 3, name: "Пруд", image: "/assets/pond.jpg" }
      ],
      rods: [
        { id: 1, name: "Обычная удочка", castTime: 3, catchChance: 0.3 },
        { id: 2, name: "Профессиональная удочка", castTime: 2, catchChance: 0.6 },
        { id: 3, name: "Элитная удочка", castTime: 1, catchChance: 0.9 }
      ],
      baits: [
        { id: 1, name: "Червь", catchBonus: 0.2 },
        { id: 2, name: "Кукуруза", catchBonus: 0.1 },
        { id: 3, name: "Опарыш", catchBonus: 0.3 }
      ],
      currentLocation: null,
      inventory: new Inventory(), // создаём инвентарь
      showInventory: false // флаг для показа модального окна инвентаря
    };
  },
  methods: {
    changeScreen(screen) {
      this.screen = screen;
    },
    selectLocation(location) {
      this.currentLocation = location;
      this.changeScreen("fishing");
    },
    updateInventory(fish) {
      // Добавляем полученную рыбу в инвентарь
      this.inventory.addFish(fish);
      this.$forceUpdate();  // Обновляем компонент с инвентарем
    },
    toggleInventory() {
      this.showInventory = !this.showInventory;
    }
  }
};
</script>

<style>
/* Глобальные стили */
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f0f8ff;
}

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

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.location-image {
  width: 200px;
  cursor: pointer;
  display: block;
  margin: 10px auto;
  border-radius: 10px;
}

select {
  padding: 10px;
  font-size: 16px;
  margin: 10px 0;
  border-radius: 5px;
}

/* Стили для кнопки инвентаря */
.inventory-container {
  position: fixed;
  top: 10px;
  right: 10px;
}

.inventory-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
}

/* Модальное окно инвентаря */
.inventory-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

/* Стили для списка инвентаря */
.inventory-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.fish-item {
  background-color: #fff;
  color: #333;
  border-radius: 5px;
  padding: 10px;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.fish-item:hover {
  transform: scale(1.05);
}

.fish-image {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 50%;
}

/* Остальные стили остаются без изменений */
</style>
