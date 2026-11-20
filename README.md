# 🎮 Memory Flip – Master

> **"Train Your Brain. Challenge Your Memory. Become a Master."**

Welcome to **Memory Flip – Master**, a full-stack web memory card game built with **Java Spring Boot**, an **H2 Persistent Database**, and clean **Vanilla HTML5, CSS3, and JavaScript (ES6+)**.

This guide is designed for beginners. You don't need any prior command-line or backend experience to run, play, and learn from this project.

---

## ⚡ Quick Start: Play in 1 Click!

On Windows 11:

1. Open the project folder:  
   `c:\Users\mayur\OneDrive\Desktop\game.pro`
2. **Double-click `start.bat`**.
3. That's it! The launcher checks your Java environment, starts the backend server, and automatically opens your browser to:  
   👉 **`http://localhost:8080`**
4. To stop the server at any time, simply **double-click `stop.bat`**.

---

## 📚 Beginner's Technical Guide

If you are new to software development, here is a simple explanation of how each piece of this project works together.

### 1. What Java Is
**Java** is a powerful programming language. It is compiled into platform-independent "bytecode" that runs on the **Java Virtual Machine (JVM)**. In this project, Java runs our backend application logic.

### 2. What Spring Boot Is
**Spring Boot** is a modern Java framework that takes away the complexity of building web servers. Instead of manually configuring network sockets, web servers, and database connectors, Spring Boot provides a pre-configured, production-ready server (Apache Tomcat) embedded directly inside your application.

### 3. What Maven Does
**Maven** is the project manager and build tool for Java.
- It automatically downloads libraries and dependencies (such as Spring Web, Spring Data JPA, and the H2 Database engine).
- It compiles all Java source files into runnable `.class` files.
- It packages everything into a single executable `.jar` file (`memory-flip-master-1.0.0.jar`).
- **Maven Wrapper (`mvnw` / `mvnw.cmd`)**: Allows the project to build and run even if Maven is not installed globally on your computer.

### 4. What HTML, CSS, and JavaScript Do
The **Frontend** runs inside your web browser:
- **HTML5 (`index.html`)**: The skeleton and structure of the game (the card grid, buttons, modals, and leaderboards).
- **CSS3 (`css/style.css`)**: The visual styling, dark-navy theme, glowing gradients, responsive layout (Flexbox/Grid), and 3D card-flip animations.
- **JavaScript (`js/`)**: The game's brain in the browser:
  - `game.js`: Controls card flipping, random shuffling, matching detection, the timer, and scoring.
  - `ui.js`: Updates the screen, renders modals, and triggers victory confetti.
  - `audio.js`: Uses the modern Web Audio API to synthesize card-flip sounds, chimes, and victory fanfares without needing external audio files.
  - `api.js`: Sends completed match results to the Java server and retrieves leaderboard rankings.
  - `storage.js`: Remembers your player name, unlocked levels, and audio mute preferences in browser storage.

### 5. What the Database Does
The **Database (H2)** stores persistent information so your high scores, player history, and rankings do not disappear when you turn off your computer:
- It saves player names and unique player IDs.
- It records every completed game session (score, completion time, moves, accuracy, difficulty, stars, and timestamp).
- It stores files on your hard drive at `./data/memoryflipdb.mv.db`.

### 6. How the Frontend Communicates with the Backend
When you finish a game:
1. The browser's JavaScript packages your score into a JSON message:
   ```json
   {
     "playerId": "p-abc123-xyz",
     "playerName": "Alex",
     "difficulty": "MEDIUM",
     "score": 1250,
     "moves": 12,
     "completionTime": 42
   }
   ```
2. The browser sends this message across HTTP using `fetch()` to `POST /api/games/complete`.
3. Spring Boot receives the request in `GameController.java`, validates the data using Jakarta Bean Validation, and asks `GameService.java` to save it.
4. Spring Data JPA writes the record into the H2 database file.
5. When you open the **Leaderboard** or **Statistics** screen, JavaScript sends a `GET /api/leaderboard` request, and Spring Boot responds with the top 10 rankings.

---

## 📁 Project Folder Structure

```
c:\Users\mayur\OneDrive\Desktop\game.pro\
│
├── .maven/                               # Bundled Maven distribution
├── .mvn/wrapper/                         # Maven Wrapper jar and properties
│   ├── maven-wrapper.jar
│   └── maven-wrapper.properties
│
├── src/
│   ├── main/
│   │   ├── java/com/memoryflip/          # Backend Java Source Code
│   │   │   ├── config/                   # WebMvc & CORS configuration
│   │   │   ├── controller/               # REST API Controllers (Game, Leaderboard, Stats, Health)
│   │   │   ├── dto/                      # Data Transfer Objects & Validation rules
│   │   │   ├── entity/                   # JPA Database Entities (Player, GameSession)
│   │   │   ├── exception/                # Global Exception Handler & Error formats
│   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   ├── service/                  # Business Logic Services
│   │   │   └── MemoryFlipApplication.java# Main Application Entry Point
│   │   │
│   │   └── resources/
│   │       ├── static/                   # Frontend Web Application
│   │       │   ├── index.html            # Main HTML with all 8 screens
│   │       │   ├── css/style.css         # Styling, CSS variables, and 3D card transforms
│   │       │   └── js/
│   │       │       ├── api.js            # REST API client
│   │       │       ├── app.js            # Main coordinator & event listeners
│   │       │       ├── audio.js          # Web Audio API sound synthesizer
│   │       │       ├── game.js           # Core game engine & mechanics
│   │       │       ├── storage.js        # Local identity & preference persistence
│   │       │       └── ui.js             # Screen navigation, modals, charts, confetti
│   │       │
│   │       └── application.properties    # H2 Database & server configuration
│   │
│   └── test/
│       ├── java/com/memoryflip/          # JUnit Test Suite
│       │   ├── MemoryFlipApplicationTests.java
│       │   └── controller/GameControllerIntegrationTest.java
│       └── resources/application.properties # In-memory database settings for testing
│
├── data/                                 # Persistent H2 database storage (.mv.db)
├── target/                               # Compiled classes and final executable JAR
│   └── memory-flip-master-1.0.0.jar
│
├── pom.xml                               # Maven project dependencies and build configuration
├── mvnw                                  # Maven wrapper for Linux / macOS
├── mvnw.cmd                              # Maven wrapper for Windows
├── start.bat                             # One-click Windows game launcher
├── stop.bat                              # One-click Windows safe server stopper
└── README.md                             # Beginner's project manual (this file)
```

---

## 🕹️ Game Features & Screens

1. **Screen 1: Landing / Home Screen**:
   - Game title, animated floating cards, and tagline.
   - Quick statistics preview (Games Played, Cleared, Best Score, Best Time).
   - Player profile badge with instant display name customization.
   - Sound FX toggle and menu navigation.
2. **Screen 2: Difficulty Selection**:
   - **Easy (4 × 3 grid)**: 6 pairs, target 45s, 1.0x multiplier.
   - **Medium (4 × 4 grid)**: 8 pairs, target 60s, 1.5x multiplier.
   - **Hard (5 × 4 grid)**: 10 pairs, target 90s, 2.0x multiplier.
   - **Expert (6 × 4 grid)**: 12 pairs, target 120s, 2.5x multiplier.
   - **Progressive Journey**: 20+ levels with dynamic level scaling beyond level 20.
3. **Screen 3: Game Screen (HUD & Board)**:
   - Dynamic 3D card flipping with realistic perspective and depth.
   - Live HUD: Score, Timer, Moves, Matches remaining, Accuracy %, and Streak multiplier fire icon 🔥.
   - **Power-ups**:
     - 💡 **Hint**: Peeks an unrevealed matching pair for 1.2 seconds (-25 pt penalty).
     - 🔀 **Shuffle**: Reshuffles remaining hidden cards (1 use per match).
4. **Screen 4: Pause Screen**:
   - Freezes the timer; lets you resume, restart, or quit to the menu.
5. **Screen 5: Victory Screen**:
   - Celebratory confetti shower and audio fanfare.
   - 1-to-3 Star rating based on speed and accuracy.
   - Full score breakdown (Base points + Speed bonus + Efficiency bonus + Streak multiplier - Penalties).
   - "Next Level" button in progressive mode.
6. **Screen 6: Leaderboard Screen**:
   - Top 10 rankings sorted by score, completion time, and moves.
   - Filter tabs for All, Easy, Medium, Hard, and Expert.
   - Highlights your own entry.
7. **Screen 7: Statistics Dashboard**:
   - Overall career metrics: Games cleared, Win rate, Best score, Average moves and clear time.
   - Interactive **Chart.js** line graph showing your score trends across recent matches.
   - Recent game history log.
8. **Screen 8: How to Play Screen**:
   - Clear rule explanations, streak guidelines, and mathematical scoring formulas.

---

## 🔌 REST API Endpoints

The backend provides clean, RESTful JSON endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Checks backend status and database connectivity |
| `POST` | `/api/games/complete` | Saves a completed game session (validated with Bean Validation) |
| `GET` | `/api/leaderboard` | Returns the global top 10 high scores |
| `GET` | `/api/leaderboard/{difficulty}` | Returns top 10 scores for a specific difficulty |
| `GET` | `/api/stats` | Returns aggregate statistics across all players |
| `GET` | `/api/stats/player/{playerId}` | Returns career statistics for a specific player |
| `GET` | `/api/games/history/{playerId}` | Returns recent match history for a player |
| `GET` | `/h2-console` | Web-based H2 Database browser (sa / blank password) |

---

## 🛠️ Modifying & Customizing the Game

- **Change Card Symbols**: Open `src/main/resources/static/js/game.js` and edit the `SYMBOLS` array (lines 10–15). You can add any emojis or icons you like.
- **Adjust Colors & Theme**: Open `src/main/resources/static/css/style.css` and modify the `:root` variables (`--accent-orange`, `--accent-purple`, `--bg-primary`).
- **Recompile**: After editing Java code, double-click `start.bat` or run:
  ```cmd
  mvnw.cmd package -DskipTests
  ```

---

## ❓ Troubleshooting Common Issues

1. **"Port 8080 is already in use"**:
   - Double-click `stop.bat` to terminate any previous server instances and free the port.
2. **Browser shows "Unable to connect"**:
   - Wait 5–10 seconds for Spring Boot to finish initialization, then refresh the page in your browser.
3. **Data didn't persist**:
   - Verify that the `./data/` folder exists in your project directory. H2 saves its file there as `memoryflipdb.mv.db`.
