"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectRandomWord = void 0;
const words = [
    "Sun", "Moon", "Star", "Tree", "Flower", "House", "Cloud", "Ball", "Hat",
    "Chair", "Shoe", "Lamp", "Apple", "Book", "Fish", "Key", "Leaf", "Clock",
    "Car", "Door", "Bicycle", "Airplane", "Giraffe", "Helicopter", "Television",
    "Cupcake", "Guitar", "Train", "Waterfall", "Camera", "Ice Cream", "Turtle",
    "Shark", "Rocket", "Castle", "Bridge", "Tractor", "Parrot", "Octopus",
    "Statue of Liberty", "Roller Coaster", "Lighthouse", "Pyramid", "Volcano",
    "Fireworks", "Satellite", "Hot Air Balloon", "Telescope", "Ferris Wheel",
    "Chameleon", "Skyscraper", "Chess Board", "Anchor", "Windmill"
];
const selectRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
};
exports.selectRandomWord = selectRandomWord;
