# Slappy Goat

**Tap. Leap. Survive.**  
A portrait Android Flappy-style game starring a 3D goat, junk-loot rewards, and animated scenery.

<p align="center">
  <img src="docs/screenshot.png" alt="Slappy Goat title screen" width="320" />
</p>

---

## About the game

You are a goat with questionable life choices and excellent vertical commitment.  
Tap to leap through teal (or neon, or desert…) pipes. Miss, and gravity writes the eulogy.

Between flights you collect **absurdist sidewalk loot** from a Vegas-style spin machine — plastic bags, pizza slices, expired milk, and other treasures that definitely belong in a museum.

### Features

| Feature | Description |
|--------|-------------|
| **3D goat** | Stylized Three.js goat with flapping ears, kicking legs, and bleats |
| **Portrait play** | Built for phones, locked portrait orientation |
| **Scenery themes** | Meadow Day, Night Pasture, Golden Hour, Snow Peaks, Desert Dunes, Neon Night |
| **Vegas rewards** | Every **5 pipes** earns a spin; collect 20 junk items |
| **Juice** | Particles, haptics, procedural SFX/music, confetti on new bests |
| **Offline** | Bundled Three.js — no network needed to play |

### Controls

| Action | Input |
|--------|--------|
| Start | **Play** / **Play Again** |
| Leap | Tap the screen (during a run) |
| Pause | ❚❚ button |
| Scenery | Home → **Scenery** |
| Collection | Home → **View Rewards** |

### Rewards catalog (20)

Plastic Bag · Aluminum Can · Cigarette Butts · Rusty Nails · Grass Clippings · Cardboard Box · Loose Change · Pocket Lint · Drywall Chunks · Rubber Bands · Watermelon · Slice of Pizza · Hot Dog · Cheeseburger · Old Newspaper · Dirty Socks · Oatmeal · Used Gum · Expired Milk · Broken Glass

Owned items show in full color; locked ones are greyed and blurred until you win them.

---

## Download

**Android APK (debug build):**

- [`dist/SlappyGoat.apk`](dist/SlappyGoat.apk)

Install with:

```bash
adb install -r dist/SlappyGoat.apk
```

Or copy the file to your phone and open it (allow install from unknown sources).

> Package ID: `com.slappybird.goat` · Min SDK 24

---

## Play in browser

```bash
cd www
python3 -m http.server 8765
```

Open [http://localhost:8765](http://localhost:8765) (use a tall window / phone mode).

---

## Build from source

Requirements: Node.js, JDK 17+, Android SDK.

```bash
export JAVA_HOME=/path/to/jdk   # e.g. Android Studio JBR
export ANDROID_HOME=/path/to/Android/Sdk
export PATH="$JAVA_HOME/bin:$PATH"

npm install
npx cap sync android
cd android && ./gradlew assembleDebug
```

APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Copy to dist:

```bash
cp android/app/build/outputs/apk/debug/app-debug.apk dist/SlappyGoat.apk
```

### Emulator

```bash
emulator -avd SlappyGoat_Phone -gpu host   # or your AVD name
adb install -r dist/SlappyGoat.apk
adb shell am start -n com.slappybird.goat/.MainActivity
```

---

## Project layout

```text
slappy-goat-android/
├── www/                 # Game (HTML / CSS / Three.js)
├── android/             # Capacitor Android shell
├── dist/SlappyGoat.apk  # Installable build
├── docs/screenshot.png  # Title screen capture
├── capacitor.config.json
└── package.json
```

### Stack

- [Three.js](https://threejs.org/) r170 (bundled)
- [Capacitor](https://capacitorjs.org/) Android WebView
- Vanilla JS — no game framework

---

## License

MIT — go forth and slap responsibly.
