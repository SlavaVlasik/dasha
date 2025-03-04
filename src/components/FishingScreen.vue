<template>
  <div>
    <h2>{{ currentLocation.name }}</h2>
    <p>Выберите удочку и наживку.</p>
 
    <h3>Удочки</h3>
    <select v-model="selectedRod">
      <option disabled value="">Выберите удочку</option>
      <option v-for="rod in rods" :key="rod.id" :value="rod">{{ rod.name }}</option>
    </select>

    <h3>Наживки</h3>
    <select v-model="selectedBait">
      <option disabled value="">Выберите наживку</option>
      <option v-for="bait in localBaits" :key="bait.id" :value="bait">{{ bait.name }}</option>
    </select>

 
    <button @click="startFishing" :disabled="!selectedRod || !selectedBait || isFishing">
      Забросить удочку
    </button>
 
    <div v-if="isFishing" class="water" :style="waterStyle">
      <div class="rod" :class="{ throwing: isThrowing, cast: isCasting, default: isRodDefault, returned: isRodReturned }"></div>
      <div v-if="!isCaught" class="bait" :class="{ flying: isBaitFlying, biting: isBaitBiting }">💧</div>
    </div>

    <div v-if="isFishing">
      <p v-if="isBaitBiting">Клюет рыба! Время: {{ biteTimer }} сек</p>
      <button @click="hookFish" :disabled="!isBaitBiting">Подсечь!</button>
      <p v-if="isCaught">Поздравляем, рыба поймана!</p>
    </div>

    <div v-if="!isFishing && inventory.length > 0">
      <h3>Ваш инвентарь</h3>
      <ul>
        <li v-for="(fish, index) in inventory" :key="index">
          {{ fish.name }} x {{ fish.count }}
        </li>
      </ul>
    </div>

    <button @click="$emit('change-screen', 'locations')">Назад</button>
  </div>
</template>

<script>
export default {
  name: "FishingScreen",
  props: ["currentLocation", "rods", "baits", "inventory"],
  data() {
    return {
      localBaits: this.baits.slice(),
      selectedRod: null,
      selectedBait: null,
      isFishing: false,
      isCaught: false,
      isThrowing: false,
      isCasting: false,
      isRodDefault: true,
      isRodReturned: false,
      isBaitFlying: false,
      isBaitBiting: false,
      biteTimer: 2,
      fishingTimer: null
    };
  },
  computed: {
    waterStyle() {
      return {
        backgroundImage: `url(${this.currentLocation ? this.currentLocation.image : ""})`
      };
    },
    totalCatchChance() {
      return (this.selectedRod ? this.selectedRod.catchChance : 0) +
             (this.selectedBait ? this.selectedBait.catchBonus : 0);
    }
  },
  methods: {
    consumeBait() {
    if (this.selectedBait) {
      this.selectedBait.count--;
      if (this.selectedBait.count <= 0) {
        const index = this.localBaits.findIndex(b => b.id === this.selectedBait.id);
        if (index !== -1) {
          this.localBaits.splice(index, 1);
        }
        this.selectedBait = null;
      }
    }
  },
    startFishing() {
      if (!this.selectedRod || !this.selectedBait) {
        alert("Выберите снасти!");
        return;
      }
      this.isFishing = true;
      this.isCaught = false;
      this.isRodDefault = false;
      this.isThrowing = true;
      setTimeout(() => {
        this.isThrowing = false;
        this.isCasting = true;
        this.isBaitFlying = true;
        setTimeout(() => {
          this.isBaitFlying = false;
          this.isCasting = false;
          this.startBitePhase();
        }, 800);
      }, 500);
    },
    startBitePhase() {
      const biteDelay = Math.floor(Math.random() * (7000 - 3000) + 3000);
      setTimeout(() => {
        this.isBaitBiting = true;
        this.biteTimer = 2;
        this.fishingTimer = setInterval(() => {
          if (this.biteTimer > 0) {
            this.biteTimer--;
          } else {
            this.isBaitBiting = false;
            clearInterval(this.fishingTimer);
            // При истечении времени наживка расходуется
            this.consumeBait();
            alert("Рыба сорвалась!");
            this.isFishing = false;
          }
        }, 1000);
      }, biteDelay);
    },
    hookFish() {
      if (!this.isBaitBiting) return;
      clearInterval(this.fishingTimer);
      // При попытке подсечь рыбу наживка расходуется
      this.consumeBait();
      this.isBaitBiting = false;
      const randomChance = Math.random();
      if (randomChance < this.totalCatchChance) {
        this.isCaught = true;
        this.addFishToInventory();
      } else {
        alert("Рыба ускользнула!");
      }
      this.isFishing = false;
      this.isRodReturned = true;
    },
    addFishToInventory() {
      const fishTypes = [
        { name: 'Карп', image: '/assets/carp.jpg' },
        { name: 'Окунь', image: '/assets/perch.jpg' },
        { name: 'Щука', image: '/assets/pike.jpg' }
      ];
      const caughtFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
      caughtFish.count = 1;
      alert(`Поздравляем, вы поймали ${caughtFish.name}!`);
      this.$emit('update-inventory', caughtFish);
    }
  }
};
</script>

<style>
.rod {
  position: absolute;
  bottom: -50px;
  left: 50%;
  width: 5px;
  height: 100px;
  background-color: #6B4F47;
  border-radius: 5px;
  transform-origin: top;
  transition: transform 0.5s ease-in-out;
}

.rod.throwing {
  transform: translateX(-50%) rotate(-30deg);
}

.rod.cast {
  transform: translateX(-50%) rotate(90deg);
}

.rod.default {
  transform: translateX(-50%) rotate(0deg);
}

.rod.returned {
  transform: translateX(-50%) rotate(0deg);
}

.water {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  background-size: cover;
  background-position: center;
}

.bait {
  position: absolute;
  bottom: 20px;
  left: 50%;
  font-size: 24px;
  transition: all 0.8s ease-in-out;
}

.bait.flying {
  transform: translateY(-50px);
}

.bait.biting {
  animation: bite 0.5s ease-in-out infinite;
}

@keyframes bite {
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}
</style>