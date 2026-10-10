
import React, { useEffect, useState } from "react";
import "./DSACoach.css";

const problems = [
  {
    topic: "Arrays",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9.",
      },
    ],
    hint: "Use a Map to store each number and its index. For every number, check whether target - number already exists.",
    starter: `function twoSum(nums, target) {
  // Write your solution here

}

console.log(twoSum([2, 7, 11, 15], 9));`,
    tests: [
      {
        args: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        call: (fn) => fn([2, 7, 11, 15], 9),
      },
      {
        args: [[3, 2, 4], 6],
        expected: [1, 2],
        call: (fn) => fn([3, 2, 4], 6),
      },
      {
        args: [[3, 3], 6],
        expected: [0, 1],
        call: (fn) => fn([3, 3], 6),
      },
    ],
    functionName: "twoSum",
    time: "O(n) expected",
    space: "O(n) expected",
  },
  {
    topic: "Strings",
    title: "Reverse a String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string and returns the reversed result.",
    examples: [
      {
        input: 's = "hello"',
        output: '"olleh"',
        explanation: "Return the characters in reverse order.",
      },
    ],
    hint: "JavaScript strings can be converted to an array of characters. Think about reverse() and join().",
    starter: `function reverseString(s) {
  // Write your solution here

}

console.log(reverseString("hello"));`,
    tests: [
      {
        args: ["hello"],
        expected: "olleh",
        call: (fn) => fn("hello"),
      },
      {
        args: ["Career AI"],
        expected: "IA reeraC",
        call: (fn) => fn("Career AI"),
      },
      {
        args: [""],
        expected: "",
        call: (fn) => fn(""),
      },
    ],
    functionName: "reverseString",
    time: "O(n)",
    space: "O(n)",
  },
  {
    topic: "Binary Search",
    title: "Binary Search",
    difficulty: "Easy",
    description:
      "Given a sorted array of integers, return the index of target. Return -1 if the target does not exist.",
    examples: [
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
        explanation: "The target 9 is located at index 4.",
      },
    ],
    hint: "Maintain left and right boundaries. Compare the middle element with the target and eliminate half of the search range.",
    starter: `function search(nums, target) {
  // Write your solution here

}

console.log(search([-1, 0, 3, 5, 9, 12], 9));`,
    tests: [
      {
        expected: 4,
        call: (fn) => fn([-1, 0, 3, 5, 9, 12], 9),
      },
      {
        expected: -1,
        call: (fn) => fn([-1, 0, 3, 5, 9, 12], 2),
      },
      {
        expected: 0,
        call: (fn) => fn([5], 5),
      },
    ],
    functionName: "search",
    time: "O(log n)",
    space: "O(1)",
  },
  {
    topic: "Dynamic Programming",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description:
      "You can climb one or two steps at a time. Return the number of distinct ways to reach the top of n stairs.",
    examples: [
      {
        input: "n = 4",
        output: "5",
        explanation: "There are five distinct ways to reach step four.",
      },
    ],
    hint: "The number of ways to reach step n is the sum of the ways to reach steps n - 1 and n - 2.",
    starter: `function climbStairs(n) {
  // Write your solution here

}

console.log(climbStairs(4));`,
    tests: [
      { expected: 2, call: (fn) => fn(2) },
      { expected: 5, call: (fn) => fn(4) },
      { expected: 8, call: (fn) => fn(5) },
    ],
    functionName: "climbStairs",
    time: "O(n)",
    space: "O(1) optimized",
  },
  {
    topic: "Arrays",
    title: "Maximum Element",
    difficulty: "Easy",
    description:
      "Given a non-empty array of integers, return the largest element.",
    examples: [
      {
        input: "nums = [3, 9, 2, 12, 5]",
        output: "12",
        explanation: "12 is the largest element in the array.",
      },
    ],
    hint: "Keep track of the largest value seen so far while traversing the array.",
    starter: `function findMaximum(nums) {
  // Write your solution here

}

console.log(findMaximum([3, 9, 2, 12, 5]));`,
    tests: [
      {
        expected: 12,
        call: (fn) => fn([3, 9, 2, 12, 5]),
      },
      {
        expected: -1,
        call: (fn) => fn([-8, -1, -5]),
      },
      {
        expected: 7,
        call: (fn) => fn([7]),
      },
    ],
    functionName: "findMaximum",
    time: "O(n)",
    space: "O(1)",
  },
  {
    topic: "Linked List",
    title: "Reverse Linked List",
    difficulty: "Medium",
    description:
      "Reverse a singly linked list and return the new head. This exercise uses an array as a simplified input/output representation.",
    examples: [
      {
        input: "head = [1, 2, 3, 4, 5]",
        output: "[5, 4, 3, 2, 1]",
        explanation: "The node order is reversed.",
      },
    ],
    hint: "For the array-based version, reverse the array. A real linked-list solution changes each node's next pointer.",
    starter: `function reverseList(head) {
  // Array-based version of the problem

}

console.log(reverseList([1, 2, 3, 4, 5]));`,
    tests: [
      {
        expected: [5, 4, 3, 2, 1],
        call: (fn) => fn([1, 2, 3, 4, 5]),
      },
      {
        expected: [2, 1],
        call: (fn) => fn([1, 2]),
      },
      {
        expected: [],
        call: (fn) => fn([]),
      },
    ],
    functionName: "reverseList",
    time: "O(n)",
    space: "O(n) for array version",
  },
  {
    topic: "Trees",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description:
      "For a binary tree represented as nested objects, return its maximum depth. A null tree has depth zero.",
    examples: [
      {
        input: "root = { left: {}, right: {} }",
        output: "2",
        explanation: "The root and its children form two levels.",
      },
    ],
    hint: "Use recursion. The depth is one plus the maximum depth of the left and right subtrees.",
    starter: `function maxDepth(root) {
  // Write your solution here

}

console.log(maxDepth({ left: {}, right: {} }));`,
    tests: [
      {
        expected: 0,
        call: (fn) => fn(null),
      },
      {
        expected: 1,
        call: (fn) => fn({}),
      },
      {
        expected: 2,
        call: (fn) => fn({ left: {}, right: {} }),
      },
    ],
    functionName: "maxDepth",
    time: "O(n)",
    space: "O(h) recursion",
  },
];

const topics = [
  "All Topics",
  "Arrays",
  "Strings",
  "Linked List",
  "Trees",
  "Binary Search",
  "Dynamic Programming",
];

const languages = ["JavaScript", "Java", "Python", "C++"];

const starterFor = (problem, language) => {
  if (language === "JavaScript") return problem.starter;

  if (language === "Python") {
    return `class Solution:\n    def ${problem.functionName}(self):\n        # Write your solution here\n        pass`;
  }

  if (language === "Java") {
    return `class Solution {\n    public Object ${problem.functionName}() {\n        // Write your solution here\n        return null;\n    }\n}`;
  }

  return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
};

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remaining = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function safeFormat(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function valuesEqual(actual, expected) {
  return safeFormat(actual) === safeFormat(expected);
}

function executeJavaScript(code, problem) {
  if (code.length > 20000) {
    throw new Error("Code is too long. Please keep your solution under 20,000 characters.");
  }

  // This is a client-side practice runner, not a secure production sandbox.
  // Never use it to execute untrusted code from other users on a server.
  const runFunction = new Function(
    `"use strict";\n${code}\n; return typeof ${problem.functionName} === "function" ? ${problem.functionName} : null;`
  );

  const solution = runFunction();

  if (typeof solution !== "function") {
    throw new Error(
      `Function "${problem.functionName}" was not found. Please use the required function name.`
    );
  }

  return problem.tests.map((test, index) => {
    try {
      const actual = test.call(solution);
      const passed = valuesEqual(actual, test.expected);

      return {
        number: index + 1,
        passed,
        actual: safeFormat(actual),
        expected: safeFormat(test.expected),
      };
    } catch (error) {
      return {
        number: index + 1,
        passed: false,
        actual: error.message || "Runtime error",
        expected: safeFormat(test.expected),
      };
    }
  });
}

export default function DSACoach() {
  const [topic, setTopic] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All");
  const [language, setLanguage] = useState("JavaScript");
  const [problemIndex, setProblemIndex] = useState(0);
  const [code, setCode] = useState(problems[0].starter);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState([]);
  const [output, setOutput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState("Testcases");
  const [attempted, setAttempted] = useState(false);

  const filteredProblems = problems.filter((problem) => {
    const topicMatches = topic === "All Topics" || problem.topic === topic;
    const difficultyMatches =
      difficulty === "All" || problem.difficulty === difficulty;

    return topicMatches && difficultyMatches;
  });

  const problem =
    filteredProblems[Math.min(problemIndex, filteredProblems.length - 1)] ||
    problems[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function resetResults() {
    setResults([]);
    setOutput("");
    setAttempted(false);
    setActiveTab("Testcases");
  }

  function changeProblem(nextIndex, nextList = filteredProblems) {
    if (!nextList.length) return;

    const safeIndex = (nextIndex + nextList.length) % nextList.length;
    const nextProblem = nextList[safeIndex];

    setProblemIndex(safeIndex);
    setCode(starterFor(nextProblem, language));
    setShowHint(false);
    resetResults();
  }

  function handleTopicChange(nextTopic) {
    const nextList = problems.filter((item) => {
      const topicMatches =
        nextTopic === "All Topics" || item.topic === nextTopic;
      const difficultyMatches =
        difficulty === "All" || item.difficulty === difficulty;

      return topicMatches && difficultyMatches;
    });

    setTopic(nextTopic);
    setProblemIndex(0);

    if (nextList.length) {
      setCode(starterFor(nextList[0], language));
    }

    setShowHint(false);
    resetResults();
  }

  function handleDifficultyChange(nextDifficulty) {
    const nextList = problems.filter((item) => {
      const topicMatches = topic === "All Topics" || item.topic === topic;
      const difficultyMatches =
        nextDifficulty === "All" || item.difficulty === nextDifficulty;

      return topicMatches && difficultyMatches;
    });

    setDifficulty(nextDifficulty);
    setProblemIndex(0);

    if (nextList.length) {
      setCode(starterFor(nextList[0], language));
    }

    setShowHint(false);
    resetResults();
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(starterFor(problem, nextLanguage));
    resetResults();
  }

  function handleRun() {
    if (language !== "JavaScript") {
      setActiveTab("Output");
      setOutput(
        `${language} execution is not connected.\n\nThe editor supports writing code, but running and submitting ${language} requires a compiler API or your own backend execution service.`
      );
      return;
    }

    try {
      const capturedResults = executeJavaScript(code, problem);
      setResults(capturedResults);
      setOutput(
        capturedResults
          .map(
            (result) =>
              `Test ${result.number}: ${result.passed ? "Accepted" : "Failed"}\nExpected: ${result.expected}\nActual: ${result.actual}`
          )
          .join("\n\n")
      );
      setActiveTab("Testcases");
      setAttempted(false);
    } catch (error) {
      setResults([]);
      setOutput(`Error: ${error.message}`);
      setActiveTab("Output");
    }
  }

  function handleSubmit() {
    if (language !== "JavaScript") {
      setActiveTab("Output");
      setOutput(
        `Cannot submit ${language} yet. Connect a real code execution backend to compile and validate this language.`
      );
      return;
    }

    try {
      const submissionResults = executeJavaScript(code, problem);
      setResults(submissionResults);
      setAttempted(true);
      setActiveTab("Testcases");

      const passedCount = submissionResults.filter(
        (result) => result.passed
      ).length;

      setOutput(
        passedCount === submissionResults.length
          ? `Accepted\n\nAll ${submissionResults.length} test cases passed.`
          : `Wrong Answer\n\n${passedCount} of ${submissionResults.length} test cases passed.`
      );
    } catch (error) {
      setResults([]);
      setAttempted(true);
      setActiveTab("Output");
      setOutput(`Compilation / Runtime Error\n\n${error.message}`);
    }
  }

  function handleReset() {
    setCode(starterFor(problem, language));
    resetResults();
  }

  function handleNextProblem() {
    changeProblem(problemIndex + 1);
  }

  return (
    <main className="dsa-page">
      <div className="dsa-container">
        <header className="dsa-header">
          <div className="dsa-heading">
            <div className="dsa-brand-icon">🤖</div>
            <div>
              <div className="dsa-eyebrow">
                CAREER AI <span>•</span> LEARN. PRACTICE. GET HIRED.
              </div>
              <h1>DSA Coach</h1>
              <p>Your AI-powered personal DSA learning workspace.</p>
            </div>
          </div>

          <div className="dsa-timer">
            <div className="dsa-timer-icon">◷</div>
            <div>
              <span>TIME ELAPSED</span>
              <strong>{formatTime(elapsed)}</strong>
            </div>
          </div>
        </header>

        <section className="dsa-stats">
          <div className="dsa-stat">
            <span className="dsa-stat-icon blue">▤</span>
            <div>
              <strong>{problems.length}</strong>
              <span>Practice Problems</span>
            </div>
          </div>

          <div className="dsa-stat">
            <span className="dsa-stat-icon purple">⌘</span>
            <div>
              <strong>Run & Submit</strong>
              <span>Test your solution</span>
            </div>
          </div>

          <div className="dsa-stat">
            <span className="dsa-stat-icon green">✓</span>
            <div>
              <strong>Interview</strong>
              <span>Ready Skills</span>
            </div>
          </div>
        </section>

        <section className="dsa-filter-card">
          <div className="dsa-section-heading">
            <div>
              <span className="dsa-section-icon">⚙</span>
              <h2>Practice Setup</h2>
            </div>
            <span className="dsa-live-badge">
              <i /> Workspace Ready
            </span>
          </div>

          <div className="dsa-filter-grid">
            <label className="dsa-field">
              <span>DSA Topic</span>
              <select
                value={topic}
                onChange={(event) => handleTopicChange(event.target.value)}
              >
                {topics.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="dsa-field">
              <span>Difficulty</span>
              <select
                value={difficulty}
                onChange={(event) =>
                  handleDifficultyChange(event.target.value)
                }
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
            </label>

            <label className="dsa-field">
              <span>Programming Language</span>
              <select
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value)}
              >
                {languages.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="dsa-workspace">
          <section className="dsa-question-panel">
            <div className="dsa-panel-top">
              <div>
                <span className="dsa-kicker">
                  {problem.topic.toUpperCase()}
                </span>
                <h2>{problem.title}</h2>
              </div>

              <span className={`dsa-difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
            </div>

            <p className="dsa-question-description">{problem.description}</p>

            {problem.examples.map((example, index) => (
              <div className="dsa-example-card" key={index}>
                <div className="dsa-example-title">
                  <span>▣</span> EXAMPLE {index + 1}
                </div>
                <div className="dsa-example-line">
                  <strong>Input:</strong>
                  <code>{example.input}</code>
                </div>
                <div className="dsa-example-line">
                  <strong>Output:</strong>
                  <code>{example.output}</code>
                </div>
                <div className="dsa-example-explanation">
                  <strong>Explanation:</strong> {example.explanation}
                </div>
              </div>
            ))}

            <div className="dsa-hint-box">
              <button
                className="dsa-hint-toggle"
                onClick={() => setShowHint((current) => !current)}
                type="button"
                aria-expanded={showHint}
              >
                <span>💡</span>
                <span>{showHint ? "Hide Hint" : "Need a hint?"}</span>
                <span className="dsa-hint-arrow">{showHint ? "−" : "+"}</span>
              </button>

              {showHint && <p>{problem.hint}</p>}
            </div>

            <div className="dsa-complexity-card">
              <div>
                <span>⏱</span>
                <div>
                  <small>Time Complexity</small>
                  <strong>{problem.time}</strong>
                </div>
              </div>
              <div>
                <span>◫</span>
                <div>
                  <small>Space Complexity</small>
                  <strong>{problem.space}</strong>
                </div>
              </div>
            </div>

            <div className="dsa-question-footer">
              <span>✦ Keep learning, one problem at a time.</span>
            </div>
          </section>

          <section className="dsa-editor-panel">
            <div className="dsa-editor-heading">
              <div>
                <h2>
                  <span>⌘</span> Code Editor
                </h2>
                <p>{language} Development Workspace</p>
              </div>

              <button
                className="dsa-reset-button"
                onClick={handleReset}
                type="button"
              >
                ↻ Reset Code
              </button>
            </div>

            <div className="dsa-code-window">
              <div className="dsa-code-titlebar">
                <div className="dsa-window-dots">
                  <i />
                  <i />
                  <i />
                </div>

                <span>
                  main.
                  {language === "JavaScript"
                    ? "js"
                    : language === "Python"
                      ? "py"
                      : language === "Java"
                        ? "java"
                        : "cpp"}
                </span>

                <span className="dsa-code-language">{language}</span>
              </div>

              <div className="dsa-code-body">
                <div className="dsa-line-numbers" aria-hidden="true">
                  {code.split("\n").map((_, index) => (
                    <div key={index}>{index + 1}</div>
                  ))}
                </div>

                <textarea
                  className="dsa-code-textarea"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  spellCheck="false"
                  aria-label="Code editor"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  wrap="off"
                />
              </div>

              <div className="dsa-editor-status">
                <span><i /> Editor Ready</span>
                <span>UTF-8</span>
                <span>{language}</span>
              </div>
            </div>

            <div className="dsa-editor-actions">
              <button
                className="dsa-run-button"
                onClick={handleRun}
                type="button"
              >
                ▶ Run Code
              </button>

              <button
                className="dsa-submit-button"
                onClick={handleSubmit}
                type="button"
              >
                ✓ Submit Solution
              </button>

              <button
                className="dsa-clear-button"
                onClick={() => {
                  setOutput("");
                  setResults([]);
                  setAttempted(false);
                }}
                type="button"
              >
                Clear Output
              </button>

              <button
                className="dsa-next-button"
                onClick={handleNextProblem}
                type="button"
              >
                Next Problem →
              </button>
            </div>

            <div className="dsa-output-panel">
              <div className="dsa-output-tabs">
                <div>
                  <button
                    className={activeTab === "Testcases" ? "active" : ""}
                    onClick={() => setActiveTab("Testcases")}
                    type="button"
                  >
                    ▣ Testcases
                  </button>
                  <button
                    className={activeTab === "Output" ? "active" : ""}
                    onClick={() => setActiveTab("Output")}
                    type="button"
                  >
                    ▷ Output
                  </button>
                </div>
                <span>CONSOLE</span>
              </div>

              {activeTab === "Testcases" ? (
                <div className="dsa-test-results">
                  {results.length ? (
                    <>
                      <div className={`dsa-submission-summary ${results.every((item) => item.passed) ? "accepted" : "failed"}`}>
                        <strong>
                          {results.every((item) => item.passed)
                            ? attempted
                              ? "Accepted"
                              : "All tests passed"
                            : attempted
                              ? "Wrong Answer"
                              : "Some tests failed"}
                        </strong>
                        <span>
                          {results.filter((item) => item.passed).length} /{" "}
                          {results.length} test cases passed
                        </span>
                      </div>

                      {results.map((result) => (
                        <div
                          className={`dsa-test-case ${result.passed ? "passed" : "failed"}`}
                          key={result.number}
                        >
                          <div>
                            <strong>
                              {result.passed ? "✓" : "✕"} Test Case{" "}
                              {result.number}
                            </strong>
                            <span>{result.passed ? "Passed" : "Failed"}</span>
                          </div>
                          <p>Expected: {result.expected}</p>
                          <p>Actual: {result.actual}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="dsa-empty-output">
                      <span>⌘</span>
                      <strong>No test results yet</strong>
                      <p>
                        Click Run Code to test your solution or Submit Solution
                        to validate all test cases.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="dsa-output-content">
                  {output || "Your output will appear here after running or submitting your solution."}
                </pre>
              )}
            </div>
          </section>
        </div>

        <footer className="dsa-footer">
          <span>Career AI</span>
          <span>Practice smart. Think clearly. Get interview-ready.</span>
        </footer>
      </div>
    </main>
  );
}
