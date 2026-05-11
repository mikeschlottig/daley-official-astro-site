import type { ImageMetadata } from 'astro';
import batGuano from '../assets/images/bat-guano.jpg';
import rockDust from '../assets/images/rock-dust.jpg';
import kelpMeal from '../assets/images/kelp-meal.jpg';
import wormCastings from '../assets/images/worm-castings.jpg';
import daleysCavern from '../assets/images/daleys-cavern.png';
import daleysBoneMeal from '../assets/images/daleys-bone-meal.png';
import daleysAngelOfGypsum from '../assets/images/daleys-angel-of-gypsum.png';
import daleysMycorrhizalHighway from '../assets/images/daleys-mycorrhizal-highway.png';
import daleysSeabirdGuano from '../assets/images/daleys-seabird-guano.png';
import farmLandscape from '../assets/images/farm-landscape.jpg';
import compostHands from '../assets/images/compost-hands.jpg';
import soilMix from '../assets/images/soil-mix.jpg';
import flowerGarden from '../assets/images/flower-garden.jpg';
import happyGardener from '../assets/images/happy-gardener.jpg';
import heroGarden from '../assets/images/hero-garden.jpg';
import tomatoGarden from '../assets/images/tomato-garden.jpg';
import fertilizerBlend from '../assets/images/fertilizer-blend.jpg';
import fishBoneMeal from '../assets/images/fish-bone-meal.jpg';

export const siteImages: Record<string, ImageMetadata> = {
  'bat-guano.jpg': batGuano,
  'rock-dust.jpg': rockDust,
  'kelp-meal.jpg': kelpMeal,
  'worm-castings.jpg': wormCastings,
  'daleys-cavern.png': daleysCavern,
  'daleys-bone-meal.png': daleysBoneMeal,
  'daleys-angel-of-gypsum.png': daleysAngelOfGypsum,
  'daleys-mycorrhizal-highway.png': daleysMycorrhizalHighway,
  'daleys-seabird-guano.png': daleysSeabirdGuano,
  'farm-landscape.jpg': farmLandscape,
  'compost-hands.jpg': compostHands,
  'soil-mix.jpg': soilMix,
  'flower-garden.jpg': flowerGarden,
  'happy-gardener.jpg': happyGardener,
  'hero-garden.jpg': heroGarden,
  'tomato-garden.jpg': tomatoGarden,
  'fertilizer-blend.jpg': fertilizerBlend,
  'fish-bone-meal.jpg': fishBoneMeal,
};
