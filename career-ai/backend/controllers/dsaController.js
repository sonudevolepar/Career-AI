const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

// ============================================
// MAIN CODE RUNNER
// ============================================

const runCode = (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Code is required",
    });
  }

  if (!language) {
    return res.status(400).json({
      success: false,
      message: "Programming language is required",
    });
  }

  const tempFolder = path.join(__dirname, "../temp");

  try {
    // Create temp folder
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder, { recursive: true });
    }

    // ========================================
    // JAVA
    // ========================================

    if (language === "Java") {
      return runJava(code, tempFolder, res);
    }

    // ========================================
    // PYTHON
    // ========================================

    if (language === "Python") {
      return runPython(code, tempFolder, res);
    }

    // ========================================
    // JAVASCRIPT
    // ========================================

    if (language === "JavaScript") {
      return runJavaScript(code, tempFolder, res);
    }

    // ========================================
    // C++
    // ========================================

    if (language === "C++") {
      return runCpp(code, tempFolder, res);
    }

    return res.status(400).json({
      success: false,
      message: `Unsupported language: ${language}`,
    });
  } catch (error) {
    console.error("Code Execution Error:", error);

    cleanup(tempFolder);

    return res.status(500).json({
      success: false,
      type: "server_error",
      message: "Failed to execute code",
    });
  }
};

// ============================================
// JAVA
// ============================================

const runJava = (code, tempFolder, res) => {
  const javaFile = path.join(tempFolder, "Main.java");

  try {
    fs.writeFileSync(javaFile, code);

    console.log("=================================");
    console.log("Running Java code...");
    console.log("=================================");

    execFile(
      "javac",
      [javaFile],
      { timeout: 10000 },
      (compileError, stdout, stderr) => {
        if (compileError) {
          cleanup(tempFolder);

          return res.status(400).json({
            success: false,
            type: "compile_error",
            output: stderr || compileError.message,
          });
        }

        execFile(
          "java",
          ["-cp", tempFolder, "Main"],
          { timeout: 5000 },
          (runError, stdout, stderr) => {
            cleanup(tempFolder);

            if (runError) {
              return res.status(400).json({
                success: false,
                type: "runtime_error",
                output: stderr || runError.message,
              });
            }

            return res.status(200).json({
              success: true,
              type: "success",
              output: stdout,
            });
          }
        );
      }
    );
  } catch (error) {
    cleanup(tempFolder);

    return res.status(500).json({
      success: false,
      type: "server_error",
      message: error.message,
    });
  }
};

// ============================================
// PYTHON
// ============================================

const runPython = (code, tempFolder, res) => {
  const pythonFile = path.join(tempFolder, "main.py");

  try {
    fs.writeFileSync(pythonFile, code);

    console.log("=================================");
    console.log("Running Python code...");
    console.log("=================================");

    execFile(
      "python",
      [pythonFile],
      { timeout: 5000 },
      (runError, stdout, stderr) => {
        cleanup(tempFolder);

        if (runError) {
          return res.status(400).json({
            success: false,
            type: "runtime_error",
            output: stderr || runError.message,
          });
        }

        return res.status(200).json({
          success: true,
          type: "success",
          output: stdout,
        });
      }
    );
  } catch (error) {
    cleanup(tempFolder);

    return res.status(500).json({
      success: false,
      type: "server_error",
      message: error.message,
    });
  }
};

// ============================================
// JAVASCRIPT
// ============================================

const runJavaScript = (code, tempFolder, res) => {
  const jsFile = path.join(tempFolder, "main.js");

  try {
    fs.writeFileSync(jsFile, code);

    console.log("=================================");
    console.log("Running JavaScript code...");
    console.log("=================================");

    execFile(
      "node",
      [jsFile],
      { timeout: 5000 },
      (runError, stdout, stderr) => {
        cleanup(tempFolder);

        if (runError) {
          return res.status(400).json({
            success: false,
            type: "runtime_error",
            output: stderr || runError.message,
          });
        }

        return res.status(200).json({
          success: true,
          type: "success",
          output: stdout,
        });
      }
    );
  } catch (error) {
    cleanup(tempFolder);

    return res.status(500).json({
      success: false,
      type: "server_error",
      message: error.message,
    });
  }
};

// ============================================
// C++
// ============================================

const runCpp = (code, tempFolder, res) => {
  const cppFile = path.join(tempFolder, "main.cpp");
  const exeFile = path.join(tempFolder, "main.exe");

  try {
    fs.writeFileSync(cppFile, code);

    console.log("=================================");
    console.log("Compiling C++ code...");
    console.log("=================================");

    execFile(
      "g++",
      [cppFile, "-o", exeFile],
      { timeout: 10000 },
      (compileError, stdout, stderr) => {
        if (compileError) {
          cleanup(tempFolder);

          return res.status(400).json({
            success: false,
            type: "compile_error",
            output: stderr || compileError.message,
          });
        }

        console.log("Running C++ code...");

        execFile(
          exeFile,
          [],
          { timeout: 5000 },
          (runError, stdout, stderr) => {
            cleanup(tempFolder);

            if (runError) {
              return res.status(400).json({
                success: false,
                type: "runtime_error",
                output: stderr || runError.message,
              });
            }

            return res.status(200).json({
              success: true,
              type: "success",
              output: stdout,
            });
          }
        );
      }
    );
  } catch (error) {
    cleanup(tempFolder);

    return res.status(500).json({
      success: false,
      type: "server_error",
      message: error.message,
    });
  }
};

// ============================================
// CLEANUP
// ============================================

const cleanup = (folder) => {
  try {
    if (!fs.existsSync(folder)) {
      return;
    }

    const files = fs.readdirSync(folder);

    files.forEach((file) => {
      const filePath = path.join(folder, file);

      if (
        file.endsWith(".java") ||
        file.endsWith(".class") ||
        file.endsWith(".py") ||
        file.endsWith(".js") ||
        file.endsWith(".cpp") ||
        file.endsWith(".exe")
      ) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.log(
            "Could not delete:",
            filePath
          );
        }
      }
    });
  } catch (error) {
    console.log("Cleanup error:", error.message);
  }
};

module.exports = {
  runCode,
};

//ghjfuyf//