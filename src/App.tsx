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

const allQuestions: Question[] = [
  // Catégorie : Énergie
  {
    id: 1,
    category: "Énergie",
    question: "Quelle est la principale source d'énergie renouvelable en France ?",
    options: [
      "L'énergie hydraulique",
      "L'énergie solaire",
      "L'énergie éolienne"
    ],
    correctAnswer: 0,
    explanation: "L'énergie hydraulique est la principale source d'énergie renouvelable en France, grâce à ses nombreux barrages.",
    ecoFact: "Un téléphone contient jusqu'à 30 métaux rares."
  },
  {
    id: 2,
    category: "Énergie",
    question: "Quel est le principal avantage des ampoules LED ?",
    options: [
      "Une consommation d'énergie réduite",
      "Un prix plus bas",
      "Une durée de vie plus courte"
    ],
    correctAnswer: 0,
    explanation: "Les ampoules LED consomment jusqu'à 90% moins d'énergie que les ampoules traditionnelles.",
    ecoFact: "Une ampoule LED peut durer jusqu'à 25 fois plus longtemps qu'une ampoule classique !"
  },
  {
    id: 3,
    category: "Énergie",
    question: "Quelle est la meilleure façon de réduire sa consommation d'électricité ?",
    options: [
      "Éteindre les appareils en veille",
      "Utiliser des multiprises",
      "Laisser les lumières allumées"
    ],
    correctAnswer: 0,
    explanation: "Les appareils en veille consomment jusqu'à 10% de l'électricité d'un foyer.",
    ecoFact: "Un ordinateur en veille consomme autant d'électricité qu'une ampoule allumée !"
  },
  {
    id: 4,
    category: "Énergie",
    question: "Quel est le principal avantage des énergies renouvelables ?",
    options: [
      "Elles sont inépuisables",
      "Elles sont moins chères",
      "Elles sont plus faciles à installer"
    ],
    correctAnswer: 0,
    explanation: "Les énergies renouvelables sont inépuisables et ne produisent pas de gaz à effet de serre.",
    ecoFact: "En 2020, les énergies renouvelables ont représenté 26% de la production mondiale d'électricité !"
  },
  {
    id: 5,
    category: "Énergie",
    question: "Quel est le principal avantage des énergies solaires ?",
    options: [
      "Une source d'énergie inépuisable",
      "Un coût d'installation bas",
      "Une production constante"
    ],
    correctAnswer: 0,
    explanation: "L'énergie solaire est une source d'énergie inépuisable et ne produit pas de gaz à effet de serre.",
    ecoFact: "En une heure, le soleil fournit à la Terre plus d'énergie que l'humanité n'en consomme en une année !"
  },
  // Catégorie : Eau
  {
    id: 6,
    category: "Eau",
    question: "Quel pourcentage de l'eau sur Terre est de l'eau douce ?",
    options: [
      "2,5%",
      "10%",
      "25%"
    ],
    correctAnswer: 0,
    explanation: "Seulement 2,5% de l'eau sur Terre est de l'eau douce, dont une grande partie est inaccessible (glaciers, neige).",
    ecoFact: "Un robinet qui goutte peut gaspiller jusqu'à 120 litres d'eau par jour !"
  },
  {
    id: 7,
    category: "Eau",
    question: "Quelle est la meilleure façon de réduire sa consommation d'eau ?",
    options: [
      "Prendre des douches courtes",
      "Laver sa voiture régulièrement",
      "Arroser son jardin en plein soleil"
    ],
    correctAnswer: 0,
    explanation: "Prendre des douches courtes permet d'économiser jusqu'à 100 litres d'eau par rapport à un bain.",
    ecoFact: "Un bain consomme environ 150 litres d'eau, contre 60 litres pour une douche de 5 minutes !"
  },
  {
    id: 8,
    category: "Eau",
    question: "Quelle est la meilleure façon de réduire sa consommation d'eau chaude ?",
    options: [
      "Installer un mitigeur",
      "Prendre des bains",
      "Laisser couler l'eau chaude"
    ],
    correctAnswer: 0,
    explanation: "Un mitigeur permet de réguler la température de l'eau et d'économiser jusqu'à 30% d'eau chaude.",
    ecoFact: "Chauffer l'eau représente environ 15% de la consommation d'énergie d'un foyer !"
  },
  // Catégorie : Déchets
  {
    id: 9,
    category: "Déchets",
    question: "Quelle est la durée de vie moyenne d'un sac en plastique ?",
    options: [
      "450 ans",
      "2 ans",
      "6 mois"
    ],
    correctAnswer: 0,
    explanation: "Un sac en plastique met environ 450 ans à se dégrader dans la nature.",
    ecoFact: "Chaque année, environ 8 millions de tonnes de plastique finissent dans les océans !"
  },
  {
    id: 10,
    category: "Déchets",
    question: "Quelle est la meilleure façon de réduire ses déchets ?",
    options: [
      "Le compostage",
      "L'incinération",
      "La mise en décharge"
    ],
    correctAnswer: 0,
    explanation: "Le compostage permet de recycler les déchets organiques en engrais naturel.",
    ecoFact: "Les déchets organiques représentent environ 30% de nos poubelles !"
  },
  {
    id: 11,
    category: "Déchets",
    question: "Quelle est la meilleure façon de réduire sa consommation de papier ?",
    options: [
      "Utiliser le recto-verso",
      "Utiliser plus de papier",
      "Jeter le papier directement"
    ],
    correctAnswer: 0,
    explanation: "L'impression recto-verso permet de réduire de moitié la consommation de papier.",
    ecoFact: "Pour produire une tonne de papier, il faut 17 arbres et 26 000 litres d'eau !"
  },
  // Catégorie : Transport
  {
    id: 12,
    category: "Transport",
    question: "Quel est le mode de transport le plus écologique pour les trajets courts ?",
    options: [
      "Le vélo",
      "La voiture électrique",
      "Le bus"
    ],
    correctAnswer: 0,
    explanation: "Le vélo est le mode de transport le plus écologique car il ne produit aucune émission et est bon pour la santé.",
    ecoFact: "Un trajet de 5 km en voiture émet environ 1 kg de CO2, contre 0 kg en vélo !"
  },
  {
    id: 13,
    category: "Transport",
    question: "Quel est le principal avantage du covoiturage ?",
    options: [
      "La réduction des émissions de CO2",
      "La réduction des embouteillages",
      "La réduction des accidents"
    ],
    correctAnswer: 0,
    explanation: "Le covoiturage permet de réduire significativement les émissions de CO2 par personne.",
    ecoFact: "Un trajet en covoiturage avec 3 personnes divise par 3 les émissions de CO2 par passager !"
  },
  {
    id: 14,
    category: "Transport",
    question: "Quel est le principal avantage des transports en commun ?",
    options: [
      "La réduction des émissions de CO2",
      "La réduction des embouteillages",
      "La réduction des accidents"
    ],
    correctAnswer: 0,
    explanation: "Les transports en commun permettent de réduire significativement les émissions de CO2 par personne.",
    ecoFact: "Un bus rempli peut remplacer jusqu'à 40 voitures sur la route !"
  },
  // Catégorie : Alimentation
  {
    id: 15,
    category: "Alimentation",
    question: "Quelle est la meilleure façon de réduire son empreinte carbone alimentaire ?",
    options: [
      "Manger local et de saison",
      "Manger des produits importés",
      "Manger des plats préparés"
    ],
    correctAnswer: 0,
    explanation: "Manger local et de saison réduit les émissions liées au transport et à la conservation des aliments.",
    ecoFact: "Un fruit importé par avion émet 10 à 20 fois plus de CO2 qu'un fruit local !"
  },
  {
    id: 16,
    category: "Alimentation",
    question: "Quelle est la meilleure façon de réduire sa consommation de viande ?",
    options: [
      "Adopter le flexitarisme",
      "Manger plus de viande rouge",
      "Manger plus de viande transformée"
    ],
    correctAnswer: 0,
    explanation: "Le flexitarisme permet de réduire son impact environnemental tout en gardant une alimentation équilibrée.",
    ecoFact: "La production d'un kilo de bœuf émet autant de CO2 qu'un trajet de 60 km en voiture !"
  },
  {
    id: 17,
    category: "Alimentation",
    question: "Quelle est la meilleure façon de conserver les aliments ?",
    options: [
      "Utiliser des contenants réutilisables",
      "Utiliser du film plastique",
      "Utiliser des sacs en plastique"
    ],
    correctAnswer: 0,
    explanation: "Les contenants réutilisables sont plus écologiques que les emballages jetables.",
    ecoFact: "En France, chaque personne jette en moyenne 20 kg d'emballages alimentaires par an !"
  }
];

const categories = [
  { name: 'Énergie', color: '#FFA726' },
  { name: 'Eau', color: '#29B6F6' },
  { name: 'Déchets', color: '#66BB6A' },
  { name: 'Transport', color: '#EC407A' },
  { name: 'Alimentation', color: '#7E57C2' },
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

  const selectRandomQuestions = (category: string) => {
    const categoryQuestions = allQuestions.filter(q => q.category === category);
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setCurrentExplanation(questions[currentQuestion].explanation);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
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
        setUnlockedFacts(prev => [...prev, newFact]);
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
    <div className="app-container">
      <Navbar />
      <UnlockedFactsPanel />
      
      {!selectedCategory ? (
        <div className="intro-screen">
          <h1>Bienvenue jeune éco-héros ! 🌿</h1>
          <p>Le monde a besoin de toi. Réponds aux questions pour prouver ta valeur dans cette mission pour la planète.</p>
          <div className="categories">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </button>
            ))}
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
          <div className="share-options">
            <button onClick={generateShareImage} className="share-button">
              Télécharger mon score en image
            </button>
          </div>
          <button onClick={handleRestart} className="restart-button">
            Recommencer
          </button>
          <ShareImage />
        </div>
      ) : (
        <div className="quiz-container">
          <div className="progress">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="question">
            <h2>{questions[currentQuestion].question}</h2>
            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
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