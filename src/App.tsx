import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  ecoFact?: string;
  co2Emission: number;
  type: 'qcm' | 'rebus';
  emojis?: string[]; // Pour les rébus avec emojis
}

interface Badge {
  name: string;
  emoji: string;
  message: string;
  minScore: number;
  maxScore: number;
}

interface Avatar {
  id: string;
  emoji: string;
  name: string;
}

interface UnlockedFact {
  id: number;
  category: string;
  fact: string;
  date: Date;
}

const badges: Badge[] = [
  {
    name: "Graine verte",
    emoji: "🌱",
    message: "Tu débutes, chaque geste compte !",
    minScore: 0,
    maxScore: 2
  },
  {
    name: "Écolo éclairé",
    emoji: "🍃",
    message: "Tu es sur la bonne voie !",
    minScore: 3,
    maxScore: 5
  },
  {
    name: "Héros du climat",
    emoji: "🌍",
    message: "Tu inspires les autres !",
    minScore: 6,
    maxScore: 7
  }
];

const avatars: Avatar[] = [
  { id: "panda", emoji: "🐼", name: "Panda Écolo" },
  { id: "plant", emoji: "🌿", name: "Plante Verte" },
  { id: "cloud", emoji: "☁️", name: "Nuage Souriant" }
];

const categories = [
  { name: 'Énergie', color: '#FFA726' },
  { name: 'Eau', color: '#29B6F6' },
  { name: 'Déchets', color: '#66BB6A' },
  { name: 'Transport', color: '#EC407A' },
  { name: 'Alimentation', color: '#7E57C2' },
  { name: 'Rébus', color: '#9C27B0' }
];

const allQuestions: Question[] = [
  // Catégorie : Énergie (30 questions)
  {
    id: 1,
    type: 'qcm',
    category: "Énergie",
    question: "Quelle est la principale source d'énergie renouvelable en France ?",
    options: ["L'énergie hydraulique", "L'énergie solaire", "L'énergie éolienne"],
    correctAnswer: 0,
    explanation: "L'énergie hydraulique est la principale source d'énergie renouvelable en France, grâce à ses nombreux barrages.",
    ecoFact: "Un téléphone contient jusqu'à 30 métaux rares.",
    co2Emission: 0.5
  },
  {
    id: 2,
    type: 'qcm',
    category: "Énergie",
    question: "Quel est le principal avantage des ampoules LED ?",
    options: [
      "Une consommation d'énergie réduite",
      "Un prix plus bas",
      "Une durée de vie plus courte"
    ],
    correctAnswer: 0,
    explanation: "Les ampoules LED consomment jusqu'à 90% moins d'énergie que les ampoules traditionnelles.",
    ecoFact: "Une ampoule LED peut durer jusqu'à 25 fois plus longtemps qu'une ampoule classique !",
    co2Emission: 0.2
  },
  {
    id: 3,
    type: 'qcm',
    category: "Énergie",
    question: "Quelle est la meilleure façon de réduire sa consommation d'électricité ?",
    options: [
      "Éteindre les appareils en veille",
      "Utiliser des multiprises",
      "Laisser les lumières allumées"
    ],
    correctAnswer: 0,
    explanation: "Les appareils en veille consomment jusqu'à 10% de l'électricité d'un foyer.",
    ecoFact: "Un ordinateur en veille consomme autant d'électricité qu'une ampoule allumée !",
    co2Emission: 0.05
  },
  {
    id: 4,
    type: 'qcm',
    category: "Énergie",
    question: "Quel est le principal avantage des énergies renouvelables ?",
    options: [
      "Elles sont inépuisables",
      "Elles sont moins chères",
      "Elles sont plus faciles à installer"
    ],
    correctAnswer: 0,
    explanation: "Les énergies renouvelables sont inépuisables et ne produisent pas de gaz à effet de serre.",
    ecoFact: "En 2020, les énergies renouvelables ont représenté 26% de la production mondiale d'électricité !",
    co2Emission: 0.3
  },
  {
    id: 5,
    type: 'qcm',
    category: "Énergie",
    question: "Quel est le principal avantage des énergies solaires ?",
    options: [
      "Une source d'énergie inépuisable",
      "Un coût d'installation bas",
      "Une production constante"
    ],
    correctAnswer: 0,
    explanation: "L'énergie solaire est une source d'énergie inépuisable et ne produit pas de gaz à effet de serre.",
    ecoFact: "En une heure, le soleil fournit à la Terre plus d'énergie que l'humanité n'en consomme en une année !",
    co2Emission: 0.1
  },
  {
    id: 26,
    type: 'qcm',
    category: "Énergie",
    question: "Quelle est la durée de vie moyenne d'une éolienne ?",
    options: ["20-25 ans", "10-15 ans", "30-35 ans"],
    correctAnswer: 0,
    explanation: "Une éolienne a une durée de vie moyenne de 20 à 25 ans.",
    ecoFact: "Une éolienne peut alimenter jusqu'à 2000 foyers en électricité !",
    co2Emission: 0.3
  },
  {
    id: 27,
    type: 'qcm',
    category: "Énergie",
    question: "Quel est le principal avantage des panneaux solaires ?",
    options: ["Énergie gratuite et renouvelable", "Installation facile", "Entretien minimal"],
    correctAnswer: 0,
    explanation: "Les panneaux solaires produisent une énergie gratuite et renouvelable.",
    ecoFact: "Un panneau solaire peut produire de l'électricité pendant plus de 25 ans !",
    co2Emission: 0.2
  },
  {
    id: 28,
    type: 'qcm',
    category: "Énergie",
    question: "Quelle est la part des énergies renouvelables dans la consommation d'électricité en France ?",
    options: ["20%", "10%", "30%"],
    correctAnswer: 0,
    explanation: "Les énergies renouvelables représentent environ 20% de la consommation d'électricité en France.",
    ecoFact: "La France vise 40% d'énergies renouvelables d'ici 2030 !",
    co2Emission: 0.3
  },
  {
    id: 29,
    type: 'qcm',
    category: "Énergie",
    question: "Quel est le principal avantage de la géothermie ?",
    options: ["Énergie constante et stable", "Coût d'installation bas", "Production maximale en été"],
    correctAnswer: 0,
    explanation: "La géothermie fournit une énergie constante et stable, indépendante des conditions météorologiques.",
    ecoFact: "La géothermie peut chauffer jusqu'à 2 millions de foyers en France !",
    co2Emission: 0.2
  },
  // Catégorie : Eau (30 questions)
  {
    id: 56,
    type: 'qcm',
    category: "Eau",
    question: "Quelle est la consommation moyenne d'eau par personne et par jour en France ?",
    options: ["150 litres", "50 litres", "300 litres"],
    correctAnswer: 0,
    explanation: "Un Français consomme en moyenne 150 litres d'eau par jour.",
    ecoFact: "Un bain consomme environ 150 litres d'eau, contre 60 litres pour une douche de 5 minutes !",
    co2Emission: 0.005
  },
  {
    id: 6,
    type: 'qcm',
    category: "Eau",
    question: "Quel pourcentage de l'eau sur Terre est de l'eau douce ?",
    options: [
      "2,5%",
      "10%",
      "25%"
    ],
    correctAnswer: 0,
    explanation: "Seulement 2,5% de l'eau sur Terre est de l'eau douce, dont une grande partie est inaccessible (glaciers, neige).",
    ecoFact: "Un robinet qui goutte peut gaspiller jusqu'à 120 litres d'eau par jour !",
    co2Emission: 0.005
  },
  {
    id: 7,
    type: 'qcm',
    category: "Eau",
    question: "Quelle est la meilleure façon de réduire sa consommation d'eau ?",
    options: [
      "Prendre des douches courtes",
      "Laver sa voiture régulièrement",
      "Arroser son jardin en plein soleil"
    ],
    correctAnswer: 0,
    explanation: "Prendre des douches courtes permet d'économiser jusqu'à 100 litres d'eau par rapport à un bain.",
    ecoFact: "Un bain consomme environ 150 litres d'eau, contre 60 litres pour une douche de 5 minutes !",
    co2Emission: 0.005
  },
  {
    id: 8,
    type: 'qcm',
    category: "Eau",
    question: "Quelle est la meilleure façon de réduire sa consommation d'eau chaude ?",
    options: [
      "Installer un mitigeur",
      "Prendre des bains",
      "Laisser couler l'eau chaude"
    ],
    correctAnswer: 0,
    explanation: "Un mitigeur permet de réguler la température de l'eau et d'économiser jusqu'à 30% d'eau chaude.",
    ecoFact: "Chauffer l'eau représente environ 15% de la consommation d'énergie d'un foyer !",
    co2Emission: 0.005
  },
  {
    id: 57,
    type: 'qcm',
    category: "Eau",
    question: "Quelle est la meilleure période pour arroser son jardin ?",
    options: ["Le soir", "Le midi", "Le matin"],
    correctAnswer: 0,
    explanation: "L'arrosage le soir permet d'éviter l'évaporation et d'optimiser l'absorption par les plantes.",
    ecoFact: "L'arrosage le soir permet d'économiser jusqu'à 50% d'eau !",
    co2Emission: 0.005
  },
  {
    id: 58,
    type: 'qcm',
    category: "Eau",
    question: "Quel est le principal polluant des eaux douces en France ?",
    options: ["Les pesticides", "Les déchets plastiques", "Les métaux lourds"],
    correctAnswer: 0,
    explanation: "Les pesticides sont le principal polluant des eaux douces en France.",
    ecoFact: "Un seul gramme de pesticide peut polluer 10 000 litres d'eau !",
    co2Emission: 0.005
  },
  // Catégorie : Déchets (30 questions)
  {
    id: 86,
    type: 'qcm',
    category: "Déchets",
    question: "Combien de temps met un mégot de cigarette à se dégrader ?",
    options: ["1-2 ans", "6 mois", "5 ans"],
    correctAnswer: 0,
    explanation: "Un mégot de cigarette met 1 à 2 ans à se dégrader dans la nature.",
    ecoFact: "Un seul mégot peut polluer jusqu'à 500 litres d'eau !",
    co2Emission: 0.005
  },
  {
    id: 9,
    type: 'qcm',
    category: "Déchets",
    question: "Quelle est la durée de vie moyenne d'un sac en plastique ?",
    options: [
      "450 ans",
      "2 ans",
      "6 mois"
    ],
    correctAnswer: 0,
    explanation: "Un sac en plastique met environ 450 ans à se dégrader dans la nature.",
    ecoFact: "Chaque année, environ 8 millions de tonnes de plastique finissent dans les océans !",
    co2Emission: 0.005
  },
  {
    id: 10,
    type: 'qcm',
    category: "Déchets",
    question: "Quelle est la meilleure façon de réduire ses déchets ?",
    options: [
      "Le compostage",
      "L'incinération",
      "La mise en décharge"
    ],
    correctAnswer: 0,
    explanation: "Le compostage permet de recycler les déchets organiques en engrais naturel.",
    ecoFact: "Les déchets organiques représentent environ 30% de nos poubelles !",
    co2Emission: 0.005
  },
  {
    id: 11,
    type: 'qcm',
    category: "Déchets",
    question: "Quelle est la meilleure façon de réduire sa consommation de papier ?",
    options: [
      "Utiliser le recto-verso",
      "Utiliser plus de papier",
      "Jeter le papier directement"
    ],
    correctAnswer: 0,
    explanation: "L'impression recto-verso permet de réduire de moitié la consommation de papier.",
    ecoFact: "Pour produire une tonne de papier, il faut 17 arbres et 26 000 litres d'eau !",
    co2Emission: 0.005
  },
  {
    id: 87,
    type: 'qcm',
    category: "Déchets",
    question: "Quelle est la durée de vie d'une bouteille en plastique ?",
    options: ["450 ans", "100 ans", "50 ans"],
    correctAnswer: 0,
    explanation: "Une bouteille en plastique met environ 450 ans à se dégrader dans la nature.",
    ecoFact: "Chaque minute, 1 million de bouteilles en plastique sont vendues dans le monde !",
    co2Emission: 0.005
  },
  {
    id: 88,
    type: 'qcm',
    category: "Déchets",
    question: "Quel est le taux de recyclage du verre en France ?",
    options: ["75%", "50%", "90%"],
    correctAnswer: 0,
    explanation: "Le taux de recyclage du verre en France est d'environ 75%.",
    ecoFact: "Recycler une tonne de verre permet d'économiser 660 kg de sable !",
    co2Emission: 0.005
  },
  // Catégorie : Transport (30 questions)
  {
    id: 116,
    type: 'qcm',
    category: "Transport",
    question: "Quelle est la distance moyenne parcourue en voiture par un Français chaque jour ?",
    options: ["30 km", "15 km", "45 km"],
    correctAnswer: 0,
    explanation: "Un Français parcourt en moyenne 30 km par jour en voiture.",
    ecoFact: "Le transport est responsable de 30% des émissions de CO2 en France !",
    co2Emission: 0.5
  },
  {
    id: 12,
    type: 'qcm',
    category: "Transport",
    question: "Quel est le mode de transport le plus écologique pour les trajets courts ?",
    options: [
      "Le vélo",
      "La voiture électrique",
      "Le bus"
    ],
    correctAnswer: 0,
    explanation: "Le vélo est le mode de transport le plus écologique car il ne produit aucune émission et est bon pour la santé.",
    ecoFact: "Un trajet de 5 km en voiture émet environ 1 kg de CO2, contre 0 kg en vélo !",
    co2Emission: 0.005
  },
  {
    id: 13,
    type: 'qcm',
    category: "Transport",
    question: "Quel est le principal avantage du covoiturage ?",
    options: [
      "La réduction des émissions de CO2",
      "La réduction des embouteillages",
      "La réduction des accidents"
    ],
    correctAnswer: 0,
    explanation: "Le covoiturage permet de réduire significativement les émissions de CO2 par personne.",
    ecoFact: "Un trajet en covoiturage avec 3 personnes divise par 3 les émissions de CO2 par passager !",
    co2Emission: 0.005
  },
  {
    id: 14,
    type: 'qcm',
    category: "Transport",
    question: "Quel est le principal avantage des transports en commun ?",
    options: [
      "La réduction des émissions de CO2",
      "La réduction des embouteillages",
      "La réduction des accidents"
    ],
    correctAnswer: 0,
    explanation: "Les transports en commun permettent de réduire significativement les émissions de CO2 par personne.",
    ecoFact: "Un bus rempli peut remplacer jusqu'à 40 voitures sur la route !",
    co2Emission: 0.005
  },
  {
    id: 117,
    type: 'qcm',
    category: "Transport",
    question: "Quelle est la distance moyenne d'un trajet domicile-travail en France ?",
    options: ["26 km", "15 km", "40 km"],
    correctAnswer: 0,
    explanation: "La distance moyenne d'un trajet domicile-travail en France est de 26 km.",
    ecoFact: "Le télétravail pourrait réduire les émissions de CO2 de 30% !",
    co2Emission: 0.5
  },
  {
    id: 118,
    type: 'qcm',
    category: "Transport",
    question: "Quel est le mode de transport le plus utilisé pour les trajets domicile-travail ?",
    options: ["La voiture", "Les transports en commun", "Le vélo"],
    correctAnswer: 0,
    explanation: "La voiture reste le mode de transport le plus utilisé pour les trajets domicile-travail.",
    ecoFact: "Un trajet en voiture sur 3 fait moins de 3 km !",
    co2Emission: 0.5
  },
  // Catégorie : Alimentation (30 questions)
  {
    id: 146,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la part des émissions de CO2 liées à l'alimentation en France ?",
    options: ["25%", "10%", "40%"],
    correctAnswer: 0,
    explanation: "L'alimentation représente 25% des émissions de CO2 en France.",
    ecoFact: "Un repas végétarien émet 2 à 3 fois moins de CO2 qu'un repas avec de la viande !",
    co2Emission: 0.5
  },
  {
    id: 15,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la meilleure façon de réduire son empreinte carbone alimentaire ?",
    options: [
      "Manger local et de saison",
      "Manger des produits importés",
      "Manger des plats préparés"
    ],
    correctAnswer: 0,
    explanation: "Manger local et de saison réduit les émissions liées au transport et à la conservation des aliments.",
    ecoFact: "Un fruit importé par avion émet 10 à 20 fois plus de CO2 qu'un fruit local !",
    co2Emission: 0.005
  },
  {
    id: 16,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la meilleure façon de réduire sa consommation de viande ?",
    options: [
      "Adopter le flexitarisme",
      "Manger plus de viande rouge",
      "Manger plus de viande transformée"
    ],
    correctAnswer: 0,
    explanation: "Le flexitarisme permet de réduire son impact environnemental tout en gardant une alimentation équilibrée.",
    ecoFact: "La production d'un kilo de bœuf émet autant de CO2 qu'un trajet de 60 km en voiture !",
    co2Emission: 0.005
  },
  {
    id: 17,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la meilleure façon de conserver les aliments ?",
    options: [
      "Utiliser des contenants réutilisables",
      "Utiliser du film plastique",
      "Utiliser des sacs en plastique"
    ],
    correctAnswer: 0,
    explanation: "Les contenants réutilisables sont plus écologiques que les emballages jetables.",
    ecoFact: "En France, chaque personne jette en moyenne 20 kg d'emballages alimentaires par an !",
    co2Emission: 0.005
  },
  {
    id: 147,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la part du gaspillage alimentaire dans les déchets ménagers ?",
    options: ["30%", "10%", "50%"],
    correctAnswer: 0,
    explanation: "Le gaspillage alimentaire représente environ 30% des déchets ménagers.",
    ecoFact: "Chaque Français jette en moyenne 20 kg de nourriture par an !",
    co2Emission: 0.5
  },
  {
    id: 148,
    type: 'qcm',
    category: "Alimentation",
    question: "Quelle est la meilleure façon de conserver les fruits et légumes ?",
    options: ["Dans un endroit frais et sec", "Au réfrigérateur", "À température ambiante"],
    correctAnswer: 0,
    explanation: "Les fruits et légumes se conservent mieux dans un endroit frais et sec.",
    ecoFact: "Les fruits et légumes de saison sont 2 à 3 fois moins chers !",
    co2Emission: 0.005
  },
  // Catégorie : Rébus (30 questions)
  {
    id: 176,
    type: 'rebus',
    category: "Rébus",
    question: "Quel concept écologique est représenté par ces emojis ?",
    options: ["Économie circulaire", "Développement durable", "Biodiversité"],
    correctAnswer: 0,
    explanation: "L'économie circulaire vise à réduire les déchets et la consommation de ressources !",
    ecoFact: "L'économie circulaire pourrait créer 300 000 emplois en France d'ici 2030 !",
    co2Emission: 0.005,
    emojis: ["♻️", "🔄", "🌍"]
  },
  {
    id: 18,
    type: 'rebus',
    category: "Rébus",
    question: "Quelle source d'énergie est représentée par ces emojis ?",
    options: ["Énergie solaire", "Énergie éolienne", "Énergie hydraulique"],
    correctAnswer: 0,
    explanation: "Le soleil est une source d'énergie renouvelable et inépuisable !",
    ecoFact: "En une heure, le soleil fournit à la Terre plus d'énergie que l'humanité n'en consomme en une année !",
    co2Emission: 0.1,
    emojis: ["☀️", "⚡"]
  },
  {
    id: 19,
    type: 'rebus',
    category: "Rébus",
    question: "Quel geste écologique est représenté par ces emojis ?",
    options: ["Économiser l'eau", "Nettoyer l'eau", "Stocker l'eau"],
    correctAnswer: 0,
    explanation: "Économiser l'eau est essentiel pour préserver cette ressource précieuse !",
    ecoFact: "Un robinet qui goutte peut gaspiller jusqu'à 120 litres d'eau par jour !",
    co2Emission: 0.005,
    emojis: ["💧", "🚰"]
  },
  {
    id: 20,
    type: 'rebus',
    category: "Rébus",
    question: "Quel concept écologique est représenté par ces emojis ?",
    options: ["Recyclage", "Compostage", "Incinération"],
    correctAnswer: 0,
    explanation: "Le recyclage permet de donner une seconde vie aux matériaux !",
    ecoFact: "Recycler une tonne de papier permet d'économiser 17 arbres !",
    co2Emission: 0.005,
    emojis: ["♻️", "🔄"]
  },
  {
    id: 21,
    type: 'rebus',
    category: "Rébus",
    question: "Quel mode de transport est représenté par ces emojis ?",
    options: ["Vélo électrique", "Voiture électrique", "Scooter électrique"],
    correctAnswer: 0,
    explanation: "Le vélo électrique est un excellent compromis entre effort et écologie !",
    ecoFact: "Un vélo électrique émet 10 fois moins de CO2 qu'une voiture !",
    co2Emission: 0.005,
    emojis: ["🚲", "⚡"]
  },
  {
    id: 22,
    type: 'rebus',
    category: "Rébus",
    question: "Quel concept alimentaire est représenté par ces emojis ?",
    options: ["Agriculture biologique", "Agriculture intensive", "Agriculture locale"],
    correctAnswer: 0,
    explanation: "L'agriculture biologique respecte l'environnement et la biodiversité !",
    ecoFact: "Les produits bio contiennent en moyenne 30% d'antioxydants en plus !",
    co2Emission: 0.005,
    emojis: ["🌱", "🚜"]
  },
  {
    id: 23,
    type: 'rebus',
    category: "Rébus",
    question: "Quel geste écologique est représenté par ces emojis ?",
    options: ["Composter", "Recycler", "Réutiliser"],
    correctAnswer: 0,
    explanation: "Le compostage permet de transformer les déchets organiques en engrais naturel !",
    ecoFact: "30% de nos déchets ménagers peuvent être compostés !",
    co2Emission: 0.005,
    emojis: ["🍎", "🌍"]
  },
  {
    id: 24,
    type: 'rebus',
    category: "Rébus",
    question: "Quel mode de transport est représenté par ces emojis ?",
    options: ["Covoiturage", "Autopartage", "Location"],
    correctAnswer: 0,
    explanation: "Le covoiturage permet de réduire les émissions de CO2 et les embouteillages !",
    ecoFact: "Un trajet en covoiturage avec 3 personnes divise par 3 les émissions de CO2 par passager !",
    co2Emission: 0.005,
    emojis: ["🚗", "👥"]
  },
  {
    id: 25,
    type: 'rebus',
    category: "Rébus",
    question: "Quel concept écologique est représenté par ces emojis ?",
    options: ["Énergie renouvelable", "Énergie fossile", "Énergie nucléaire"],
    correctAnswer: 0,
    explanation: "Les énergies renouvelables sont inépuisables et respectueuses de l'environnement !",
    ecoFact: "En 2020, les énergies renouvelables ont représenté 26% de la production mondiale d'électricité !",
    co2Emission: 0.005,
    emojis: ["💨", "☀️"]
  },
  {
    id: 177,
    type: 'rebus',
    category: "Rébus",
    question: "Quel concept écologique est représenté par ces emojis ?",
    options: ["Zéro déchet", "Recyclage", "Compostage"],
    correctAnswer: 0,
    explanation: "Le zéro déchet vise à réduire au maximum la production de déchets !",
    ecoFact: "Un Français produit en moyenne 500 kg de déchets par an !",
    co2Emission: 0.005,
    emojis: ["🚫", "🗑️", "♻️"]
  },
  {
    id: 178,
    type: 'rebus',
    category: "Rébus",
    question: "Quel mode de transport est représenté par ces emojis ?",
    options: ["Tramway", "Métro", "Bus"],
    correctAnswer: 0,
    explanation: "Le tramway est un mode de transport écologique et efficace !",
    ecoFact: "Un tramway peut transporter jusqu'à 300 passagers !",
    co2Emission: 0.005,
    emojis: ["🚊", "🌱", "⚡"]
  }
];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(true);
  const [showEcoFact, setShowEcoFact] = useState(false);
  const [currentEcoFact, setCurrentEcoFact] = useState("");
  const [unlockedFacts, setUnlockedFacts] = useState<UnlockedFact[]>([]);
  const [showUnlockedFacts, setShowUnlockedFacts] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState("");
  const shareImageRef = useRef<HTMLDivElement>(null);
  const [totalCo2Emission, setTotalCo2Emission] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#FFE0E0');
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);

  const selectRandomQuestions = (category: string) => {
    const categoryQuestions = allQuestions.filter(q => q.category === category);
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setQuestions(selectRandomQuestions(category));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelection(false);
  };

  const getCurrentBadge = () => {
    return badges.find(badge => score >= badge.minScore && score <= badge.maxScore) || badges[0];
  };

  const getBackgroundColor = (unlockedFactsCount: number, totalCategories: number) => {
    const percentage = (unlockedFactsCount / totalCategories) * 100;
    if (percentage <= 20) return '#FFE0E0'; // Rouge clair
    if (percentage <= 40) return '#FFD6A5'; // Orange clair
    if (percentage <= 60) return '#FDFFB6'; // Jaune clair
    if (percentage <= 80) return '#CAFFBF'; // Vert clair
    return '#9BF6FF'; // Vert vif
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setCurrentExplanation(questions[currentQuestion].explanation);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setTotalCo2Emission(prev => prev + questions[currentQuestion].co2Emission);
    }
  };

  const isCategoryAccessible = (categoryName: string) => {
    // Toutes les catégories sont accessibles sauf si elles sont déjà complétées
    return !completedCategories.includes(categoryName);
  };

  const handleNextQuestion = () => {
    setShowEcoFact(false);
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      if (score === questions.length) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const newFact: UnlockedFact = {
          id: Date.now(),
          category: selectedCategory,
          fact: `Félicitations ! Tu as maîtrisé la catégorie ${selectedCategory} ! Voici un fait écolo : ${randomQuestion.ecoFact}`,
          date: new Date()
        };
        setUnlockedFacts(prev => {
          const newFacts = [...prev, newFact];
          setBackgroundColor(getBackgroundColor(newFacts.length, categories.length));
          return newFacts;
        });
        setCompletedCategories(prev => [...prev, selectedCategory]);
      }
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedCategory("");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setShowAvatarSelection(false);
  };

  const generateShareImage = async () => {
    if (!shareImageRef.current) return;

    try {
      const canvas = await html2canvas(shareImageRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'eco-quiz-score.png';
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      alert('Une erreur est survenue lors de la génération de l\'image.');
    }
  };

  const ShareImage: React.FC = () => {
    const badge = getCurrentBadge();
    
    return (
      <div ref={shareImageRef} className="share-image">
        <div className="share-header">
          <h2>Éco Quiz</h2>
          <p>Score : {score}/{questions.length}</p>
        </div>
        <div className="share-badge">
          <span className="badge-emoji">{badge.emoji}</span>
          <h3>{badge.name}</h3>
          <p>{badge.message}</p>
        </div>
        {selectedAvatar && (
          <div className="share-avatar">
            <span className="avatar-emoji">{selectedAvatar.emoji}</span>
            <p>{selectedAvatar.name}</p>
          </div>
        )}
        <div className="share-footer">
          <p>Joue aussi à l'Éco Quiz ! 🌱</p>
        </div>
      </div>
    );
  };

  const Navbar: React.FC = () => {
    if (!selectedAvatar) return null;
    
    return (
      <nav className="navbar">
        <div className="navbar-avatar">
          <span className="avatar-emoji">{selectedAvatar.emoji}</span>
          <span className="avatar-name">{selectedAvatar.name}</span>
        </div>
        <div className="navbar-facts">
          <button 
            className="facts-button"
            onClick={() => setShowUnlockedFacts(!showUnlockedFacts)}
          >
            Faits débloqués ({unlockedFacts.length})
          </button>
        </div>
      </nav>
    );
  };

  const UnlockedFactsPanel: React.FC = () => {
    if (!showUnlockedFacts) return null;

    return (
      <div className="unlocked-facts-panel">
        <h3>Faits débloqués</h3>
        {unlockedFacts.length === 0 ? (
          <p>Tu n'as pas encore débloqué de faits. Continue à jouer !</p>
        ) : (
          <div className="facts-list">
            {unlockedFacts.map(fact => (
              <div key={fact.id} className="fact-item">
                <span className="fact-category">{fact.category}</span>
                <p className="fact-text">{fact.fact}</p>
                <span className="fact-date">
                  {fact.date.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getCo2Interpretation = (co2: number) => {
    if (co2 <= 5) return "Excellent ! Ton empreinte carbone est très faible.";
    if (co2 <= 10) return "Bien ! Tu as une bonne empreinte carbone.";
    if (co2 <= 15) return "Moyen. Il y a encore des progrès à faire.";
    return "À améliorer. Ton empreinte carbone est élevée.";
  };

  if (showAvatarSelection) {
    return (
      <div className="avatar-selection">
        <h2>Choisis ton avatar écolo !</h2>
        <div className="avatars-container">
          {avatars.map(avatar => (
            <div
              key={avatar.id}
              className="avatar-option"
              onClick={() => handleAvatarSelect(avatar)}
            >
              <span className="avatar-emoji">{avatar.emoji}</span>
              <p>{avatar.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ backgroundColor }}>
      <Navbar />
      <UnlockedFactsPanel />
      
      {!selectedCategory ? (
        <div className="intro-screen">
          <h1>Bienvenue jeune éco-héros ! 🌿</h1>
          <p>Le monde a besoin de toi. Réponds aux questions pour prouver ta valeur dans cette mission pour la planète.</p>
          <div className="categories">
            {categories.map(category => {
              const isCompleted = completedCategories.includes(category.name);
              return (
                <button
                  key={category.name}
                  onClick={() => !isCompleted && handleCategorySelect(category.name)}
                  style={{ 
                    backgroundColor: category.color,
                    opacity: isCompleted ? 0.5 : 1,
                    cursor: isCompleted ? 'not-allowed' : 'pointer'
                  }}
                  className={`category-button ${isCompleted ? 'completed locked' : ''}`}
                  disabled={isCompleted}
                >
                  {category.name}
                  {isCompleted && (
                    <>
                      <span className="lock-icon">🔒</span>
                      <span className="check-icon">✓</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : quizCompleted ? (
        <div className="results">
          <h2>Quiz terminé !</h2>
          <div className="badge-display">
            <span className="badge-emoji">{getCurrentBadge().emoji}</span>
            <h3>{getCurrentBadge().name}</h3>
            <p>{getCurrentBadge().message}</p>
          </div>
          <p>Score final : {score}/{questions.length}</p>
          <div className="co2-result">
            <h3>Empreinte carbone</h3>
            <p>Tu as généré {totalCo2Emission.toFixed(1)} kg de CO₂</p>
            <p className="co2-interpretation">{getCo2Interpretation(totalCo2Emission)}</p>
          </div>
          <div className="share-options">
            <button onClick={generateShareImage} className="share-button">
              Télécharger mon score en image
            </button>
          </div>
          <button onClick={handleRestart} className="restart-button">
            Retour aux catégories
          </button>
          <ShareImage />
        </div>
      ) : (
        <div className="quiz-container">
          <div className="progress">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="question">
            {questions[currentQuestion]?.type === 'rebus' ? (
              <div className="rebus-container">
                <div className="rebus-emojis">
                  {questions[currentQuestion].emojis?.map((emoji, index) => (
                    <span key={index} className="rebus-emoji">
                      {emoji}
                    </span>
                  ))}
                </div>
                <h2>{questions[currentQuestion].question}</h2>
              </div>
            ) : (
              <h2>{questions[currentQuestion]?.question}</h2>
            )}
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={selectedAnswer === index ? "selected" : ""}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {showExplanation && (
            <div className="explanation">
              <h3>Explication :</h3>
              <p>{currentExplanation}</p>
            </div>
          )}
          {showEcoFact && (
            <div className="eco-fact">
              <h3>Le savais-tu ?</h3>
              <p>{currentEcoFact}</p>
            </div>
          )}
          {selectedAnswer !== null && (
            <button onClick={handleNextQuestion} className="next-button">
              {currentQuestion < questions.length - 1 ? "Question suivante" : "Terminer"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App; 