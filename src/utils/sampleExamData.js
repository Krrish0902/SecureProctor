/**
 * Sample Exam Data
 * 
 * This file contains sample exam questions for demonstration purposes.
 */

const sampleExamData = {
  title: "Computer Science Fundamentals",
  description: "This exam tests your knowledge of basic computer science concepts.",
  duration: 60, // minutes
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "What is the time complexity of binary search?",
      options: [
        { id: "q1_a", text: "O(1)" },
        { id: "q1_b", text: "O(log n)" },
        { id: "q1_c", text: "O(n)" },
        { id: "q1_d", text: "O(n log n)" }
      ],
      correctAnswer: "q1_b"
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "Which of the following is NOT a primitive data type in JavaScript?",
      options: [
        { id: "q2_a", text: "String" },
        { id: "q2_b", text: "Number" },
        { id: "q2_c", text: "Array" },
        { id: "q2_d", text: "Boolean" }
      ],
      correctAnswer: "q2_c"
    },
    {
      id: "q3",
      type: "text",
      text: "What does the acronym 'HTTP' stand for?",
      correctAnswer: "Hypertext Transfer Protocol"
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "Which sorting algorithm has the best average-case performance?",
      options: [
        { id: "q4_a", text: "Bubble Sort" },
        { id: "q4_b", text: "Insertion Sort" },
        { id: "q4_c", text: "Quick Sort" },
        { id: "q4_d", text: "Selection Sort" }
      ],
      correctAnswer: "q4_c"
    },
    {
      id: "q5",
      type: "text",
      text: "Explain the concept of recursion in programming.",
      correctAnswer: ""
    },
    {
      id: "q6",
      type: "multiple-choice",
      text: "What is the purpose of the 'this' keyword in JavaScript?",
      options: [
        { id: "q6_a", text: "It refers to the current function" },
        { id: "q6_b", text: "It refers to the current object" },
        { id: "q6_c", text: "It refers to the parent function" },
        { id: "q6_d", text: "It refers to the global window object" }
      ],
      correctAnswer: "q6_b"
    },
    {
      id: "q7",
      type: "multiple-choice",
      text: "Which data structure operates on a LIFO (Last In, First Out) principle?",
      options: [
        { id: "q7_a", text: "Queue" },
        { id: "q7_b", text: "Stack" },
        { id: "q7_c", text: "Linked List" },
        { id: "q7_d", text: "Tree" }
      ],
      correctAnswer: "q7_b"
    },
    {
      id: "q8",
      type: "text",
      text: "What is the difference between '==' and '===' operators in JavaScript?",
      correctAnswer: ""
    },
    {
      id: "q9",
      type: "multiple-choice",
      text: "Which of the following is a valid way to declare a variable in JavaScript?",
      options: [
        { id: "q9_a", text: "var x = 5;" },
        { id: "q9_b", text: "let x = 5;" },
        { id: "q9_c", text: "const x = 5;" },
        { id: "q9_d", text: "All of the above" }
      ],
      correctAnswer: "q9_d"
    },
    {
      id: "q10",
      type: "multiple-choice",
      text: "What is the output of the following code?\n\nlet x = 0;\nfor (let i = 0; i < 5; i++) {\n  x += i;\n}\nconsole.log(x);",
      options: [
        { id: "q10_a", text: "0" },
        { id: "q10_b", text: "5" },
        { id: "q10_c", text: "10" },
        { id: "q10_d", text: "15" }
      ],
      correctAnswer: "q10_c"
    }
  ]
};

export default sampleExamData; 