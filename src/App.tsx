import React, { useState } from 'react';
import './App.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

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
    explanation: "L'énergie hydraulique est la principale source d'énergie renouvelable en France, grâce à ses nombreux barrages."
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
    explanation: "Les ampoules LED consomment jusqu'à 90% moins d'énergie que les ampoules traditionnelles."
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
    explanation: "Les appareils en veille consomment jusqu'à 10% de l'électricité d'un foyer."
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
    explanation: "Les énergies renouvelables sont inépuisables et ne produisent pas de gaz à effet de serre."
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
    explanation: "L'énergie solaire est une source d'énergie inépuisable et ne produit pas de gaz à effet de serre."
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
    explanation: "Seulement 2,5% de l'eau sur Terre est de l'eau douce, dont une grande partie est inaccessible (glaciers, neige)."
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
    explanation: "Prendre des douches courtes permet d'économiser jusqu'à 100 litres d'eau par rapport à un bain."
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
    explanation: "Un mitigeur permet de réguler la température de l'eau et d'économiser jusqu'à 30% d'eau chaude."
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
    explanation: "Un sac en plastique met environ 450 ans à se dégrader dans la nature."
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
    explanation: "Le compostage permet de recycler les déchets organiques en engrais naturel."
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
    explanation: "L'impression recto-verso permet de réduire de moitié la consommation de papier."
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
    explanation: "Le vélo est le mode de transport le plus écologique car il ne produit aucune émission et est bon pour la santé."
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
    explanation: "Le covoiturage permet de réduire significativement les émissions de CO2 par personne."
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
    explanation: "Les transports en commun permettent de réduire significativement les émissions de CO2 par personne."
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
    explanation: "Manger local et de saison réduit les émissions liées au transport et à la conservation des aliments."
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
    explanation: "Le flexitarisme permet de réduire son impact environnemental tout en gardant une alimentation équilibrée."
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
    explanation: "Les contenants réutilisables sont plus écologiques que les emballages jetables."
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuestions(selectRandomQuestions(selectedCategory));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const getResultMessage = () => {
    if (score < 5) return "À améliorer – chaque geste compte !";
    if (score < 8) return "Bien joué – tu es sur la bonne voie !";
    return "Écolo engagé – continue comme ça !";
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Éco Quiz</h1>
          <h2>Es-tu prêt à sauver la planète ?</h2>
        </div>

        {!selectedCategory ? (
          <div className="categories">
            <h3>Choisis une catégorie pour commencer</h3>
            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="category-button"
                  onClick={() => handleCategorySelect(category.name)}
                  style={{ borderColor: category.color }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        ) : !quizCompleted ? (
          <div className="quiz-card">
            <div className="quiz-header">
              <h3>{selectedCategory}</h3>
              <p>Question {currentQuestion + 1} sur {questions.length}</p>
            </div>

            <div className="question">
              <h4>{questions[currentQuestion].question}</h4>
            </div>

            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="feedback">
                <p className={selectedAnswer === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}>
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? '✅ Correct !' : '❌ Incorrect'}
                </p>
                <p className="explanation">{questions[currentQuestion].explanation}</p>
              </div>
            )}

            <div className="navigation">
              <button
                className="next-button"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === questions.length - 1 ? 'Terminer' : 'Question suivante'}
              </button>
            </div>
          </div>
        ) : (
          <div className="result-card">
            <h2>Quiz terminé !</h2>
            <p className="score">Score : {score} sur {questions.length}</p>
            <p className="message">{getResultMessage()}</p>
            <div className="result-buttons">
              <button className="restart-button" onClick={handleRestart}>
                Rejouer
              </button>
              <button 
                className="theme-button" 
                onClick={() => setSelectedCategory("")}
              >
                Changer de thème
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 