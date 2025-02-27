export default class Fish {
  constructor(name, image) {
    this.name = name;
    this.image = image;
    this.count = 1; // Начальное количество = 1
  }

  incrementCount() {
    this.count++; // Увеличиваем счетчик
  }
}
