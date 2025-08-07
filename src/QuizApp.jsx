import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  Clock,
  BookOpen,
  Trophy,
  Target,
  Play,
  ArrowRight,
} from "lucide-react";

const QuizApp = () => {
  // --- State Management ---
  const [isDark, setIsDark] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const timerRef = useRef(null);

  // Ref for the question card animation
  const questionCardRef = useRef(null);
  const [questionKey, setQuestionKey] = useState(0); // Key to trigger animation on question change

  // --- Quiz Data ---
  const questions = [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language",
      ],
      correct: 0,
      explanation:
        "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
    },
    {
      id: 2,
      question: "Which HTML tag is used to define the document type?",
      options: ["<doctype>", "<!DOCTYPE html>", "<html>", "<document>"],
      correct: 1,
      explanation:
        "<!DOCTYPE html> declares the document type and version of HTML being used, helping browsers render the page correctly.",
    },
    {
      id: 3,
      question: "What is the correct HTML element for the largest heading?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      correct: 2,
      explanation:
        "<h1> represents the largest heading in HTML, typically used for main page titles.",
    },
    {
      id: 4,
      question:
        "Which HTML element is used to specify a footer for a document?",
      options: ["<footer>", "<bottom>", "<section>", "<end>"],
      correct: 0,
      explanation:
        "<footer> is a semantic HTML5 element that represents the footer of a document or section.",
    },
    {
      id: 5,
      question:
        "What is the difference between frontend and backend development?",
      options: [
        "Frontend is server-side, backend is client-side",
        "Frontend is client-side, backend is server-side",
        "They are the same thing",
        "Frontend uses databases, backend uses HTML",
      ],
      correct: 1,
      explanation:
        "Frontend development focuses on the client-side (user interface), while backend development handles server-side logic and databases.",
    },
    {
      id: 6,
      question: "Which HTML element is used for creating hyperlinks?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correct: 1,
      explanation:
        "The <a> (anchor) element is used to create hyperlinks in HTML, with the href attribute specifying the destination.",
    },
    {
      id: 7,
      question: "What is the purpose of the <head> element?",
      options: [
        "To contain visible content",
        "To contain metadata about the document",
        "To create headings",
        "To define the main content area",
      ],
      correct: 1,
      explanation:
        "The <head> element contains metadata about the HTML document, including title, links to stylesheets, and other information not displayed on the page.",
    },
    {
      id: 8,
      question: "Which HTML element is used to create an unordered list?",
      options: ["<ol>", "<ul>", "<list>", "<li>"],
      correct: 1,
      explanation:
        "<ul> creates an unordered (bulleted) list, while <li> elements are used for individual list items.",
    },
    {
      id: 9,
      question: "What is the correct HTML element for inserting a line break?",
      options: ["<break>", "<lb>", "<br>", "<newline>"],
      correct: 2,
      explanation:
        "<br> is a self-closing element that inserts a line break in HTML content.",
    },
    {
      id: 10,
      question:
        "Which attribute is used to provide alternative text for images?",
      options: ["title", "alt", "src", "description"],
      correct: 1,
      explanation:
        "The 'alt' attribute provides alternative text for images, crucial for accessibility and SEO.",
    },
    {
      id: 11,
      question: "What does semantic HTML mean?",
      options: [
        "HTML that looks good",
        "HTML that uses meaningful elements to describe content",
        "HTML that loads faster",
        "HTML that works in all browsers",
      ],
      correct: 1,
      explanation:
        "Semantic HTML uses elements that clearly describe their meaning and content, improving accessibility and SEO.",
    },
    {
      id: 12,
      question: "Which HTML element is used to create a table row?",
      options: ["<row>", "<tr>", "<td>", "<table-row>"],
      correct: 1,
      explanation:
        "<tr> (table row) element is used to create rows in HTML tables.",
    },
    {
      id: 13,
      question: "What is the purpose of the <nav> element?",
      options: [
        "To create navigation links",
        "To define the main content",
        "To create a sidebar",
        "To add styling",
      ],
      correct: 0,
      explanation:
        "The <nav> element is a semantic HTML5 element specifically designed to contain navigation links.",
    },
    {
      id: 14,
      question: "Which HTML element is used to emphasize text?",
      options: ["<strong>", "<em>", "<bold>", "<italic>"],
      correct: 1,
      explanation:
        "<em> provides semantic emphasis to text, typically displayed in italics by browsers.",
    },
    {
      id: 15,
      question: "What is the correct HTML structure for a basic web page?",
      options: [
        "<html><head></head><body></body></html>",
        "<head><body></body></head>",
        "<body><html><head></head></html></body>",
        "<html><body><head></head></body></html>",
      ],
      correct: 0,
      explanation:
        "The correct structure is <html> containing <head> and <body> elements in that order.",
    },
    {
      id: 16,
      question: "Which HTML element is used to create a form?",
      options: ["<input>", "<form>", "<fieldset>", "<submit>"],
      correct: 1,
      explanation:
        "The <form> element is used to create HTML forms that collect user input.",
    },
    {
      id: 17,
      question: "What is the purpose of Chrome DevTools?",
      options: [
        "To write HTML code",
        "To inspect and debug web pages",
        "To create websites",
        "To host websites",
      ],
      correct: 1,
      explanation:
        "Chrome DevTools is a set of developer tools built into Chrome for inspecting, debugging, and optimizing web pages.",
    },
    {
      id: 18,
      question: "Which HTML element represents the main content of a document?",
      options: ["<main>", "<content>", "<primary>", "<central>"],
      correct: 0,
      explanation:
        "<main> is a semantic HTML5 element that represents the main content of a document.",
    },
    {
      id: 19,
      question: "What is the purpose of the <article> element?",
      options: [
        "To create articles only",
        "To represent a standalone piece of content",
        "To add styling",
        "To create paragraphs",
      ],
      correct: 1,
      explanation:
        "<article> represents a standalone piece of content that could be distributed independently.",
    },
    {
      id: 20,
      question: "Which HTML element is used to create a dropdown list?",
      options: ["<dropdown>", "<list>", "<select>", "<option>"],
      correct: 2,
      explanation:
        "<select> creates a dropdown list, with <option> elements for each choice.",
    },
    {
      id: 21,
      question: "What is the role of HTML in frontend development?",
      options: [
        "To add interactivity",
        "To style the webpage",
        "To provide structure and content",
        "To handle server requests",
      ],
      correct: 2,
      explanation:
        "HTML provides the structure and content of web pages, forming the foundation of frontend development.",
    },
    {
      id: 22,
      question:
        "Which HTML element is used to create a text area for multiple lines of input?",
      options: ["<input>", "<textarea>", "<text>", "<multiline>"],
      correct: 1,
      explanation:
        "<textarea> creates a multi-line text input field in HTML forms.",
    },
    {
      id: 23,
      question: "What is the purpose of the <aside> element?",
      options: [
        "To create the main content",
        "To represent content aside from the main content",
        "To add comments",
        "To create headers",
      ],
      correct: 1,
      explanation:
        "<aside> represents content that is tangentially related to the main content, like sidebars.",
    },
    {
      id: 24,
      question: "Which HTML element is used to create a button?",
      options: ["<btn>", "<button>", "<click>", "<input type='button'>"],
      correct: 1,
      explanation:
        "<button> is the semantic HTML element for creating clickable buttons.",
    },
    {
      id: 25,
      question: "How do browsers render HTML?",
      options: [
        "From bottom to top",
        "All at once",
        "From top to bottom, parsing the DOM",
        "Randomly",
      ],
      correct: 2,
      explanation:
        "Browsers parse HTML from top to bottom, building the DOM (Document Object Model) tree as they go.",
    },
    {
      id: 26,
      question: "What is the purpose of the <section> element?",
      options: [
        "To create sections in a document",
        "To add styling",
        "To create paragraphs",
        "To define navigation",
      ],
      correct: 0,
      explanation:
        "<section> is a semantic element that represents a distinct section of content within a document.",
    },
    {
      id: 27,
      question: "Which HTML element is used to create an ordered list?",
      options: ["<ul>", "<ol>", "<list>", "<order>"],
      correct: 1,
      explanation: "<ol> creates an ordered (numbered) list in HTML.",
    },
    {
      id: 28,
      question: "What is the purpose of the <label> element in forms?",
      options: [
        "To style form elements",
        "To associate text with form controls",
        "To submit forms",
        "To validate input",
      ],
      correct: 1,
      explanation:
        "<label> associates descriptive text with form controls, improving accessibility and usability.",
    },
    {
      id: 29,
      question: "Which HTML element is used to embed videos?",
      options: ["<video>", "<movie>", "<media>", "<embed>"],
      correct: 0,
      explanation:
        "<video> is the HTML5 element specifically designed for embedding video content.",
    },
    {
      id: 30,
      question: "What is the correct way to comment in HTML?",
      options: [
        "// This is a comment",
        "/* This is a comment */",
        "<!-- This is a comment -->",
        "# This is a comment",
      ],
      correct: 2,
      explanation: "HTML comments are written as <!-- comment text -->",
    },
    {
      id: 31,
      question: "Which HTML element is used to create table headers?",
      options: ["<header>", "<th>", "<td>", "<thead>"],
      correct: 1,
      explanation:
        "<th> (table header) is used to create header cells in HTML tables.",
    },
    {
      id: 32,
      question: "What is the purpose of indentation in HTML?",
      options: [
        "To make code load faster",
        "To improve code readability and maintainability",
        "To reduce file size",
        "To add styling",
      ],
      correct: 1,
      explanation:
        "Proper indentation makes HTML code more readable and easier to maintain, though it doesn't affect functionality.",
    },
    {
      id: 33,
      question: "Which HTML element is used to embed audio files?",
      options: ["<sound>", "<audio>", "<music>", "<media>"],
      correct: 1,
      explanation:
        "<audio> is the HTML5 element for embedding audio content in web pages.",
    },
    {
      id: 34,
      question: "What is the purpose of VS Code in web development?",
      options: [
        "To host websites",
        "To serve as a code editor and development environment",
        "To test websites",
        "To design graphics",
      ],
      correct: 1,
      explanation:
        "VS Code is a powerful code editor that provides features like syntax highlighting, debugging, and extensions for web development.",
    },
    {
      id: 35,
      question: "Which HTML element is used to create a table?",
      options: ["<table>", "<tab>", "<grid>", "<data>"],
      correct: 0,
      explanation:
        "<table> is the HTML element used to create tables for displaying tabular data.",
    },
    {
      id: 36,
      question: "What is the purpose of the <span> element?",
      options: [
        "To create line breaks",
        "To group inline elements for styling",
        "To create paragraphs",
        "To add headings",
      ],
      correct: 1,
      explanation:
        "<span> is an inline element used to group content for styling purposes without adding semantic meaning.",
    },
    {
      id: 37,
      question: "Which HTML element represents strong importance?",
      options: ["<strong>", "<bold>", "<important>", "<emphasis>"],
      correct: 0,
      explanation:
        "<strong> indicates strong importance, seriousness, or urgency of its contents.",
    },
    {
      id: 38,
      question: "What is the purpose of GitHub in web development?",
      options: [
        "To edit code",
        "To host and version control code",
        "To style websites",
        "To test websites",
      ],
      correct: 1,
      explanation:
        "GitHub provides git-based version control and hosting for code repositories, essential for collaborative development.",
    },
    {
      id: 39,
      question: "Which HTML element is used to create table cells?",
      options: ["<cell>", "<tc>", "<td>", "<data>"],
      correct: 2,
      explanation:
        "<td> (table data) creates individual cells within table rows.",
    },
    {
      id: 40,
      question: "What is accessibility (a11y) in web development?",
      options: [
        "Making websites look good",
        "Making websites load faster",
        "Making websites usable by people with disabilities",
        "Making websites responsive",
      ],
      correct: 2,
      explanation:
        "Accessibility (a11y) ensures websites are usable by people with disabilities, following WCAG guidelines.",
    },
    {
      id: 41,
      question: "Which HTML element is used to create paragraphs?",
      options: ["<paragraph>", "<p>", "<text>", "<para>"],
      correct: 1,
      explanation: "<p> is the HTML element used to create paragraphs of text.",
    },
    {
      id: 42,
      question: "What is the purpose of Live Server extension?",
      options: [
        "To edit HTML",
        "To provide live reload functionality during development",
        "To host production websites",
        "To validate HTML",
      ],
      correct: 1,
      explanation:
        "Live Server provides a local development server with live reload functionality, automatically refreshing the browser when files change.",
    },
    {
      id: 43,
      question: "Which HTML element is used to create text input fields?",
      options: ["<textfield>", "<input>", "<text>", "<field>"],
      correct: 1,
      explanation:
        "<input> with appropriate type attributes creates various form input fields, including text inputs.",
    },
    {
      id: 44,
      question: "What is the purpose of the <header> element?",
      options: [
        "To create headings only",
        "To represent introductory content or navigation",
        "To add styling",
        "To create the document head",
      ],
      correct: 1,
      explanation:
        "<header> represents introductory content, typically containing navigation aids, headings, or branding.",
    },
    {
      id: 45,
      question: "Which HTML attribute is required for images?",
      options: ["title", "alt", "src", "width"],
      correct: 2,
      explanation:
        "The 'src' attribute is required for <img> elements as it specifies the image source URL.",
    },
    {
      id: 46,
      question: "What is the difference between <em> and <i> elements?",
      options: [
        "No difference, they're identical",
        "<em> is semantic emphasis, <i> is presentational",
        "<i> is semantic emphasis, <em> is presentational",
        "Both are deprecated",
      ],
      correct: 1,
      explanation:
        "<em> provides semantic emphasis (meaning), while <i> is primarily for presentational italics without semantic meaning.",
    },
    {
      id: 47,
      question: "Which HTML element is used to group form controls?",
      options: ["<group>", "<fieldset>", "<formgroup>", "<section>"],
      correct: 1,
      explanation:
        "<fieldset> groups related form controls together, often with a <legend> element for the group title.",
    },
    {
      id: 48,
      question: "What is the purpose of the DOCTYPE declaration?",
      options: [
        "To specify the HTML version",
        "To add styling",
        "To create the document structure",
        "To add metadata",
      ],
      correct: 0,
      explanation:
        "The DOCTYPE declaration tells the browser which version of HTML the document uses, ensuring proper rendering.",
    },
    {
      id: 49,
      question:
        "Which HTML element is best for creating a list of navigation links?",
      options: [
        "<div> with links",
        "<nav> with <ul> and <li>",
        "Just <a> elements",
        "<menu> element",
      ],
      correct: 1,
      explanation:
        "A <nav> element containing <ul> and <li> elements provides the most semantic and accessible navigation structure.",
    },
    {
      id: 50,
      question: "What is the purpose of the <legend> element?",
      options: [
        "To create legends for images",
        "To provide a caption for a <fieldset>",
        "To add tooltips",
        "To create footnotes",
      ],
      correct: 1,
      explanation:
        "<legend> provides a caption or title for a <fieldset> element, describing the group of form controls.",
    },
    {
      id: 51,
      question: "Which HTML input type is used for email addresses?",
      options: [
        "<input type='text'>",
        "<input type='email'>",
        "<input type='mail'>",
        "<input type='address'>",
      ],
      correct: 1,
      explanation:
        "<input type='email'> provides email-specific validation and keyboard optimization on mobile devices.",
    },
    {
      id: 52,
      question: "What is the correct way to structure a table with headers?",
      options: [
        "<table><tr><th></th></tr><tr><td></td></tr></table>",
        "<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>",
        "Both A and B are correct",
        "Neither is correct",
      ],
      correct: 2,
      explanation:
        "Both structures are valid. The second provides better semantic structure with <thead> and <tbody> elements.",
    },
    {
      id: 53,
      question:
        "Which HTML element is used to create definitions in a description list?",
      options: ["<dd>", "<dt>", "<dl>", "<def>"],
      correct: 0,
      explanation:
        "<dd> (description details) contains the definition in a description list, paired with <dt> (description term).",
    },
    {
      id: 54,
      question:
        "What is the purpose of the 'for' attribute in <label> elements?",
      options: [
        "To specify styling",
        "To associate the label with a form control",
        "To add validation",
        "To group labels",
      ],
      correct: 1,
      explanation:
        "The 'for' attribute associates a label with a form control by matching the control's 'id' attribute.",
    },
    {
      id: 55,
      question:
        "Which HTML element is used to create a clickable area within an image map?",
      options: ["<area>", "<map>", "<region>", "<click>"],
      correct: 0,
      explanation:
        "<area> defines clickable areas within an image map, used with the <map> element.",
    },
    {
      id: 56,
      question: "What is the difference between block and inline elements?",
      options: [
        "No difference",
        "Block elements start on new lines, inline elements don't",
        "Inline elements start on new lines, block elements don't",
        "Block elements are deprecated",
      ],
      correct: 1,
      explanation:
        "Block elements (like <div>, <p>) start on new lines and take full width, while inline elements (like <span>, <a>) don't break the flow.",
    },
    {
      id: 57,
      question: "Which HTML element is best for displaying code snippets?",
      options: ["<pre>", "<code>", "<pre><code>", "<script>"],
      correct: 2,
      explanation:
        "Using <pre><code> together preserves whitespace and formatting while semantically marking the content as code.",
    },
    {
      id: 58,
      question:
        "What is the purpose of the 'alt' attribute beyond accessibility?",
      options: [
        "Only for accessibility",
        "Also for SEO and when images fail to load",
        "Only for styling",
        "Only for validation",
      ],
      correct: 1,
      explanation:
        "The 'alt' attribute improves accessibility, SEO, and provides fallback text when images fail to load.",
    },
    {
      id: 59,
      question:
        "Which HTML element should be used for important disclaimers or warnings?",
      options: ["<div>", "<p>", "<aside>", "<strong>"],
      correct: 3,
      explanation:
        "<strong> indicates strong importance and is appropriate for warnings or disclaimers that need emphasis.",
    },
    {
      id: 60,
      question: "What makes HTML5 different from previous versions?",
      options: [
        "Only new styling options",
        "New semantic elements and APIs",
        "Only performance improvements",
        "No significant differences",
      ],
      correct: 1,
      explanation:
        "HTML5 introduced semantic elements (<article>, <section>, etc.), new APIs, and improved multimedia support.",
    },
  ];

  // --- Quiz Logic Functions ---
  const startQuiz = () => {
    setIsQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIsQuizCompleted(false);
    setShowExplanations(false);
    setTimeLeft(1800); // Reset timer to 30 minutes
  };

  const submitQuiz = () => {
    setIsQuizCompleted(true);
    clearInterval(timerRef.current);
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIsQuizCompleted(false);
    setShowExplanations(false);
    setTimeLeft(1800); // Reset timer
  };

  // Timer logic
  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            submitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isQuizStarted, isQuizCompleted]);

  const selectAnswer = (questionId, answerIndex) => {
    if (isQuizCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionKey((prev) => prev + 1); // Trigger animation
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setQuestionKey((prev) => prev + 1); // Trigger animation
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const score = calculateScore();
  const getScoreColor = (percentage) => {
    if (percentage > 80) return "text-green-500";
    if (percentage > 50) return "text-yellow-500";
    return "text-red-500";
  };
  const scoreColor = getScoreColor(score.percentage);

  // --- Component Rendering ---
  const mainContainerClasses = `min-h-screen transition-all duration-300 font-inter ${
    isDark
      ? "bg-gray-900 text-white"
      : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  }`;
  const cardClasses = `max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
    isDark ? "bg-gray-800" : "bg-white"
  }`;
  const headerClasses = `flex justify-between items-center mb-8 p-4 md:p-8 ${
    isDark ? "bg-gray-900" : "bg-transparent"
  }`;
  const quizCardClasses = `p-8 space-y-8 ${
    isDark ? "text-white" : "text-gray-800"
  }`;

  // Welcome Screen
  if (!isQuizStarted) {
    return (
      <div className={mainContainerClasses}>
        <div className="container mx-auto px-4 py-8">
          <div className={headerClasses}>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HTML Foundations Quiz
              </h1>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isDark
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                  : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className={cardClasses}>
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
              <div className="text-center animate-fade-in-up">
                <Target className="w-16 h-16 mx-auto mb-4 animate-float" />
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Test Your HTML Knowledge?
                </h2>
                <p className="text-xl opacity-90">
                  Master the fundamentals of web development with our
                  comprehensive quiz.
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                    Quiz Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <span className="font-medium">Total Questions:</span>
                      <span className="font-bold text-indigo-600">60</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <span className="font-medium">Question Type:</span>
                      <span className="font-bold text-green-600">
                        Multiple Choice
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <span className="font-medium">Time Limit:</span>
                      <span className="font-bold text-purple-600">
                        30 Minutes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    Topics Covered
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Web Development Fundamentals",
                      "HTML Document Structure",
                      "Semantic HTML Elements",
                      "Forms and Input Elements",
                      "Tables and Lists",
                      "Accessibility Best Practices",
                    ].map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startQuiz}
                  className="group px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto space-x-3"
                >
                  <Play className="w-6 h-6 group-hover:animate-pulse" />
                  <span>Start Quiz</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-6 text-gray-600 dark:text-gray-400">
                  Take your time and read each question carefully. Good luck! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in Progress
  const currentQ = questions[currentQuestion];
  const selectedAnswerIndex = selectedAnswers[currentQ.id];
  const isAnswered = selectedAnswerIndex !== undefined;

  if (!isQuizCompleted) {
    return (
      <div className={mainContainerClasses}>
        <div className="container mx-auto px-4 py-8">
          <div className={headerClasses}>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HTML Foundations Quiz
              </h1>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isDark
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                  : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className={cardClasses}>
            {/* Progress bar and Timer */}
            <div className="mx-8 mt-6">
              <div className="flex justify-between items-center mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                  Time Remaining:
                  <span
                    className={`ml-1 font-bold ${
                      timeLeft < 300
                        ? "text-red-500 animate-pulse"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </span>
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform-origin-left transition-transform duration-500 ease-in-out"
                  style={{ transform: `scaleX(${progress / 100})` }}
                ></div>
              </div>
            </div>

            {/* Quiz content area */}
            <div className={quizCardClasses}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm md:text-base font-semibold text-indigo-600 dark:text-indigo-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>

              {/* Question card with animation */}
              <div
                key={questionKey}
                ref={questionCardRef}
                className="p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up-delay"
              >
                <h3 className="text-2xl font-bold mb-6">{currentQ.question}</h3>
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswerIndex === index;
                    const optionClasses = `
                        p-4 rounded-xl cursor-pointer text-left transition-all duration-300 border-2
                        ${
                          isSelected
                            ? "bg-indigo-500 text-white border-indigo-600 shadow-md transform scale-105"
                            : isDark
                            ? "bg-gray-700 border-gray-600 hover:bg-indigo-600/30"
                            : "bg-gray-100 border-gray-200 hover:bg-indigo-500/10"
                        }
                        `;
                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(currentQ.id, index)}
                        className={`w-full flex items-center justify-between group ${optionClasses}`}
                        aria-pressed={isSelected}
                      >
                        <span className="font-medium text-left">{option}</span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-white text-indigo-500 flex-shrink-0 flex items-center justify-center transition-transform transform scale-100 animate-pop-in">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                    currentQuestion === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400 transform hover:scale-105 shadow-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  }`}
                  aria-label="Previous question"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className={`px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2 ${
                      isAnswered
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isAnswered}
                    aria-label="Next question"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length < questions.length
                    }
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                      Object.keys(selectedAnswers).length < questions.length
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                        : "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 shadow-md"
                    }`}
                    aria-label="Submit quiz"
                  >
                    <span>Submit Quiz</span>
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  return (
    <div className={mainContainerClasses}>
      <div className="container mx-auto px-4 py-8">
        <div className={headerClasses}>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HTML Foundations Quiz
            </h1>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className={cardClasses}>
          {/* Results Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 animate-pop-in" />
            <h2 className="text-4xl font-bold mb-2 animate-fade-in-up">
              Quiz Completed!
            </h2>
            <p className="text-xl opacity-90 animate-fade-in-up delay-100">
              Your score is in!
            </p>
          </div>

          <div className="p-8">
            {/* Score Summary */}
            <div className="text-center mb-8">
              <div
                className="text-7xl font-extrabold mb-2 animate-zoom-in"
                style={{ color: scoreColor }}
              >
                {score.percentage}%
              </div>
              <p className="text-xl font-semibold animate-fade-in-up delay-200">
                You got {score.correct} out of {score.total} questions correct.
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-400 animate-fade-in-up delay-300">
                Time taken: {formatTime(1800 - timeLeft)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 ${
                  showExplanations
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <BookOpen className="w-6 h-6" />
                <span>
                  {showExplanations ? "Hide Explanations" : "View Explanations"}
                </span>
              </button>
              <button
                onClick={resetQuiz}
                className="px-8 py-4 rounded-2xl bg-gray-800 text-white font-bold text-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Restart Quiz</span>
              </button>
            </div>

            {/* Explanation section */}
            {showExplanations && (
              <div className="mt-8 space-y-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-center">
                  Detailed Explanations
                </h3>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  {questions.map((q, index) => {
                    const isUserCorrect = selectedAnswers[q.id] === q.correct;
                    const isAnswered = selectedAnswers[q.id] !== undefined;

                    return (
                      <div
                        key={q.id}
                        className={`p-6 rounded-2xl mb-4 transition-all duration-300 ${
                          isAnswered
                            ? isUserCorrect
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-red-50 dark:bg-red-900/20"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {isAnswered ? (
                            isUserCorrect ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )
                          ) : (
                            <ArrowRight className="w-6 h-6 text-gray-500" />
                          )}
                          <h4 className="font-bold text-lg">
                            {index + 1}. {q.question}
                          </h4>
                        </div>
                        <p className="font-semibold mb-2">
                          Your Answer:
                          <span
                            className={`ml-2 font-normal ${
                              isAnswered
                                ? isUserCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {isAnswered
                              ? q.options[selectedAnswers[q.id]]
                              : "Not answered"}
                          </span>
                        </p>
                        <p className="font-semibold mb-4">
                          Correct Answer:{" "}
                          <span className="text-green-600 font-normal">
                            {q.options[q.correct]}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
