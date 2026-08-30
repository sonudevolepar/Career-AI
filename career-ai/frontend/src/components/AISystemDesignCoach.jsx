import React, { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

// ======================================================
// ARCHITECTURE DIAGRAM
// ======================================================

const ArchitectureDiagram = ({ architecture }) => {
  if (!architecture) {
    return null;
  }

  const components =
    architecture.components || [];

  const requestFlow =
    architecture.requestFlow || [];

  // ====================================================
  // CREATE NODES
  // ====================================================

  const nodes = components.map(
    (component, index) => {
      const columns = 3;

      const column =
        index % columns;

      const row =
        Math.floor(index / columns);

      return {
        id: component.name,

        position: {
          x: column * 330,
          y: row * 180,
        },

        sourcePosition:
          Position.Right,

        targetPosition:
          Position.Left,

        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-gray-800">
                {component.name}
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {component.type}
              </div>
            </div>
          ),
        },

        style: {
          width: 250,
          minHeight: 90,
          borderRadius: 14,
          padding: 16,
          background: "#ffffff",
          border: "2px solid #3b82f6",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        },
      };
    }
  );

  // ====================================================
  // CREATE EDGES
  // ====================================================

  const edges = requestFlow
    .map((flow, index) => {
      const sourceExists =
        components.some(
          (component) =>
            component.name === flow.from
        );

      const targetExists =
        components.some(
          (component) =>
            component.name === flow.to
        );

      if (
        !sourceExists ||
        !targetExists
      ) {
        return null;
      }

      return {
        id: `edge-${index}`,

        source: flow.from,

        target: flow.to,

        label:
          flow.label || "",

        type: "smoothstep",

        animated: true,

        markerEnd: {
          type: MarkerType.ArrowClosed,
        },

        style: {
          strokeWidth: 2,
        },

        labelStyle: {
          fontSize: 11,
          fontWeight: 600,
        },

        labelBgStyle: {
          fill: "#ffffff",
        },
      };
    })
    .filter(Boolean);

  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-4">

        <div>
          <h3 className="text-xl font-bold text-gray-800">
            AI Generated System Architecture
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Interactive architecture diagram
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {nodes.length} components
        </div>

      </div>

      <div
        className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50"
        style={{
          height: "650px",
        }}
      >

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
        >

          <Background />

          <Controls />

          <MiniMap
            pannable
            zoomable
          />

        </ReactFlow>

      </div>

      <div className="mt-3 text-center text-sm text-gray-500">
        You can zoom, pan and inspect the architecture.
      </div>

    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const AISystemDesignCoach = () => {
  const [problem, setProblem] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("Beginner");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ====================================================
  // GENERATE SYSTEM DESIGN
  // ====================================================

  const generateSystemDesign = async () => {
    setError("");
    setResult(null);

    if (!problem.trim()) {
      setError(
        "Please enter a system design problem."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/system-design/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              problem:
                problem.trim(),

              difficulty,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "System Design Backend Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to generate system design"
        );
      }

      if (
        !data.success ||
        !data.data
      ) {
        throw new Error(
          "Invalid system design response"
        );
      }

      setResult(data.data);

    } catch (err) {
      console.error(
        "System Design Error:",
        err
      );

      setError(
        err.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-blue-600">
            AI System Design
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Practice system design interviews with AI.
          </p>

        </div>

        {/* INPUT CARD */}

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* PROBLEM */}

          <div className="mb-6">

            <label className="block text-gray-800 font-medium mb-2">
              System Design Problem
            </label>

            <input
              type="text"
              value={problem}
              onChange={(e) =>
                setProblem(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  generateSystemDesign();
                }
              }}
              placeholder="e.g. Design YouTube, Design WhatsApp, Design URL Shortener"
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* DIFFICULTY */}

          <div className="mb-7">

            <label className="block text-gray-800 font-medium mb-2">
              Difficulty Level
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* BUTTON */}

          <div className="flex justify-center">

            <button
              onClick={
                generateSystemDesign
              }
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-8 py-4 rounded-xl transition"
            >

              {loading
                ? "Generating System Design..."
                : "Generate System Design"}

            </button>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center mt-8 text-blue-600 font-medium">
            AI is designing the system...
            Please wait.
          </div>
        )}

        {/* ==================================================
            RESULT
        ================================================== */}

        {result && (
          <div className="mt-10 space-y-6">

            {/* TITLE */}

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-blue-600">
                {result.title}
              </h2>

              <p className="text-gray-700 mt-4">
                {result.problemStatement}
              </p>

            </div>

            {/* ==================================================
                ARCHITECTURE DIAGRAM
            ================================================== */}

            {result.architecture && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  System Architecture
                </h2>

                <p className="text-gray-700 mb-6">
                  {result.architecture.overview}
                </p>

                <ArchitectureDiagram
                  architecture={
                    result.architecture
                  }
                />

                {/* COMPONENT DETAILS */}

                <div className="mt-10">

                  <h3 className="font-semibold text-lg mb-4">
                    Architecture Components
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    {result.architecture.components?.map(
                      (
                        component,
                        index
                      ) => (
                        <div
                          key={index}
                          className="border rounded-xl p-5"
                        >

                          <div className="flex items-center justify-between">

                            <h4 className="font-bold text-blue-600">
                              {
                                component.name
                              }
                            </h4>

                            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                              {
                                component.type
                              }
                            </span>

                          </div>

                          <p className="text-gray-600 mt-2">
                            {
                              component.purpose
                            }
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* REQUEST FLOW */}

                {result.architecture.requestFlow?.length >
                  0 && (
                  <div className="mt-10">

                    <h3 className="font-semibold text-lg mb-4">
                      Request Flow
                    </h3>

                    <div className="space-y-3">

                      {result.architecture.requestFlow.map(
                        (
                          flow,
                          index
                        ) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 border rounded-lg p-4"
                          >

                            <span className="font-bold text-blue-600">
                              {index + 1}
                            </span>

                            <span className="font-medium">
                              {flow.from}
                            </span>

                            <span className="text-gray-400">
                              →
                            </span>

                            <span className="font-medium">
                              {flow.to}
                            </span>

                            {flow.label && (
                              <span className="text-sm text-gray-500 ml-auto">
                                {
                                  flow.label
                                }
                              </span>
                            )}

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ==================================================
                REQUIREMENTS
            ================================================== */}

            {result.requirements && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Requirements
                </h2>

                <h3 className="font-semibold text-lg mb-2">
                  Functional Requirements
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                  {result.requirements.functional?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

                <h3 className="font-semibold text-lg mt-6 mb-2">
                  Non-Functional Requirements
                </h3>

                <ul className="list-disc pl-6 space-y-2">

                  {result.requirements.nonFunctional?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* ==================================================
                CAPACITY
            ================================================== */}

            {result.capacityEstimation && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Capacity Estimation
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>
                      Users:
                    </strong>

                    <p>
                      {
                        result.capacityEstimation.users
                      }
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>
                      Requests / Second:
                    </strong>

                    <p>
                      {
                        result.capacityEstimation
                          .requestsPerSecond
                      }
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>
                      Storage:
                    </strong>

                    <p>
                      {
                        result.capacityEstimation.storage
                      }
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>
                      Bandwidth:
                    </strong>

                    <p>
                      {
                        result.capacityEstimation.bandwidth
                      }
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                DATABASE
            ================================================== */}

            {result.databaseDesign && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Database Design
                </h2>

                <p>
                  <strong>
                    Database:
                  </strong>{" "}
                  {
                    result.databaseDesign.databaseType
                  }
                </p>

                <p className="mt-2 text-gray-600">
                  {
                    result.databaseDesign.reason
                  }
                </p>

                <div className="mt-6 space-y-4">

                  {result.databaseDesign.tablesOrCollections?.map(
                    (
                      table,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        <h3 className="font-bold text-blue-600">
                          {table.name}
                        </h3>

                        <ul className="list-disc pl-6 mt-2">

                          {table.fields?.map(
                            (
                              field,
                              fieldIndex
                            ) => (
                              <li
                                key={
                                  fieldIndex
                                }
                              >
                                {field}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ==================================================
                APIs
            ================================================== */}

            {result.apis && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  API Design
                </h2>

                <div className="space-y-5">

                  {result.apis.map(
                    (
                      api,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border rounded-lg p-5"
                      >

                        <div className="flex gap-3 items-center">

                          <span className="font-bold text-blue-600">
                            {api.method}
                          </span>

                          <code className="bg-gray-100 px-3 py-1 rounded">
                            {api.endpoint}
                          </code>

                        </div>

                        <p className="mt-3">
                          <strong>
                            Purpose:
                          </strong>{" "}
                          {api.purpose}
                        </p>

                        <p className="mt-2">
                          <strong>
                            Request:
                          </strong>{" "}
                          {api.request}
                        </p>

                        <p className="mt-2">
                          <strong>
                            Response:
                          </strong>{" "}
                          {api.response}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ==================================================
                SCALABILITY
            ================================================== */}

            {result.scalability?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Scalability
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.scalability.map(
                    (
                      item,
                      index
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* ==================================================
                RELIABILITY
            ================================================== */}

            {result.reliability?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Reliability
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.reliability.map(
                    (
                      item,
                      index
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* ==================================================
                SECURITY
            ================================================== */}

            {result.security?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Security
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.security.map(
                    (
                      item,
                      index
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* ==================================================
                CACHING
            ================================================== */}

            {result.caching?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Caching
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.caching.map(
                    (
                      item,
                      index
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* ==================================================
                LOAD BALANCING
            ================================================== */}

            {result.loadBalancing && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Load Balancing
                </h2>

                <p className="text-gray-700">
                  {
                    result.loadBalancing
                  }
                </p>

              </div>
            )}

            {/* ==================================================
                BOTTLENECKS
            ================================================== */}

            {result.bottlenecks?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Bottlenecks & Solutions
                </h2>

                <div className="space-y-4">

                  {result.bottlenecks.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        <p>
                          <strong>
                            Problem:
                          </strong>{" "}
                          {item.problem}
                        </p>

                        <p className="mt-2">
                          <strong>
                            Solution:
                          </strong>{" "}
                          {item.solution}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ==================================================
                INTERVIEW EXPLANATION
            ================================================== */}

            {result.interviewExplanation && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  How to Explain in Interview
                </h2>

                <p className="whitespace-pre-line text-gray-700">
                  {
                    result.interviewExplanation
                  }
                </p>

              </div>
            )}

            {/* ==================================================
                FOLLOW-UP
            ================================================== */}

            {result.followUpQuestions?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Interview Follow-up Questions
                </h2>

                <ol className="list-decimal pl-6 space-y-3">

                  {result.followUpQuestions.map(
                    (
                      question,
                      index
                    ) => (
                      <li key={index}>
                        {question}
                      </li>
                    )
                  )}

                </ol>

              </div>
            )}

            {/* ==================================================
                KEY TAKEAWAYS
            ================================================== */}

            {result.keyTakeaways?.length >
              0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Key Takeaways
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.keyTakeaways.map(
                    (
                      item,
                      index
                    ) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AISystemDesignCoach;