# Build Your First GitWorld

A step-by-step guide to creating, customizing, and deploying your own virtual world using the GitWorld-Starter template. No game engine required — just Git, a text editor, and a GitHub account.

---

## Table of Contents

1. [What Is a GitWorld?](#1-what-is-a-gitworld)
2. [Prerequisites](#2-prerequisites)
3. [Create Your World Repository](#3-create-your-world-repository)
4. [Enable GitHub Pages](#4-enable-github-pages)
5. [Visit Your World](#5-visit-your-world)
6. [Project Structure](#6-project-structure)
7. [Understanding VEML](#7-understanding-veml)
8. [Your First Edit: Customize the World](#8-your-first-edit-customize-the-world)
9. [Adding Entities](#9-adding-entities)
10. [Transforms and the Coordinate System](#10-transforms-and-the-coordinate-system)
11. [Lighting and Atmosphere](#11-lighting-and-atmosphere)
12. [JavaScript Scripting](#12-javascript-scripting)
13. [HTML Panels (UI Overlays)](#13-html-panels-ui-overlays)
14. [Using 3D Models](#14-using-3d-models)
15. [Multiplayer with WorldSync](#15-multiplayer-with-worldsync)
16. [Input Events and Control Flags](#16-input-events-and-control-flags)
17. [Troubleshooting](#17-troubleshooting)
18. [Quick Reference](#18-quick-reference)

---

## 1. What Is a GitWorld?

A GitWorld is a virtual 3D world defined entirely in text files and hosted as a static website. Think of it as a webpage, but instead of HTML rendering a 2D page, **VEML** (Virtual Environment Markup Language) renders a 3D environment.

The core idea: **worlds as websites.**

- Your world is a Git repository
- World content is defined in XML (VEML)
- Interactivity comes from JavaScript
- UI overlays are standard HTML/CSS
- Pushing to `main` deploys your world to GitHub Pages
- Anyone with the URL can visit your world in a browser — no downloads, no installs

When you push a change, a GitHub Actions workflow downloads the WebVerse runtime (a WebGL-based world browser), bundles it with your world content, and deploys everything to GitHub Pages. The runtime never enters your git history, so your repo stays small.

---

## 2. Prerequisites

You need:

- A **GitHub account** (free tier works)
- A **text editor** (VS Code, Sublime, Notepad — anything)
- **Basic familiarity with Git** (commit, push)

That's it. No game engine, no build tools, no SDKs.

---

## 3. Create Your World Repository

1. Go to [github.com/Five-Squared-Interactive/GitWorld-Starter](https://github.com/Five-Squared-Interactive/GitWorld-Starter)
2. Click the green **"Use this template"** button (or **Fork** if you prefer)
3. Name your repository (e.g., `my-world`)
4. Set it to **Public** (required for GitHub Pages on free accounts)
5. Click **Create repository**

You now have your own copy of the starter world.

---

## 4. Enable GitHub Pages

This step is critical — without it, the deploy workflow has nowhere to publish.

1. In your new repository, go to **Settings** (gear icon in the top bar)
2. In the left sidebar, click **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Click **Save**

> **Important:** You must select "GitHub Actions" as the source. The default "Deploy from a branch" option will not work because the workflow uses the Pages artifact API.

---

## 5. Visit Your World

The deploy workflow runs automatically when you push to `main`. Since creating the repo from the template counts as the first push, it should already be running.

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy World to GitHub Pages"
3. Wait for it to complete (usually about 30 seconds)
4. Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

You should see a 3D world with a green ground plane, a stone platform, a small cabin, some trees, floating orbs, and a welcome panel. Use **WASD** to move and the **mouse** to look around.

If you see a loading screen that gets stuck, check [Troubleshooting](#17-troubleshooting).

---

## 6. Project Structure

```
your-repo/
  world.veml                  # The world definition (entities, sky, lighting)
  scripts/
    init.js                   # Player character setup
    bridge.js                 # HTML panel <-> world engine messaging
    lib/
      thirdpersoncharacter.js # Character controller library
  panels/
    welcome.html              # Screen-space UI overlay
  index.html                  # WebGL runtime loader page
  .github/workflows/
    deploy.yml                # CI: downloads runtime + deploys to Pages
```

| File | What It Does | When to Edit |
|------|-------------|--------------|
| `world.veml` | Defines everything visible in the world | Adding/removing/moving objects |
| `scripts/init.js` | Creates the player character | Changing spawn position, movement speed |
| `scripts/bridge.js` | Routes messages between HTML panels and the world | Adding panel interactions |
| `panels/welcome.html` | The welcome overlay UI | Customizing the HUD |
| `index.html` | Loads the WebGL runtime | Rarely — only to change the loading screen |
| `deploy.yml` | GitHub Actions workflow | Rarely — only for advanced deployment changes |

---

## 7. Understanding VEML

VEML (Virtual Environment Markup Language) is an XML format that describes a 3D environment. If you've written HTML, you already know the basics — it's elements with attributes and children.

### Document Structure

Every VEML file follows this structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<veml xmlns="http://www.fivesqd.com/schemas/veml/3.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <!-- Title, scripts, input events, multiplayer config -->
  </metadata>
  <environment>
    <!-- Background, lighting, entities (objects in the world) -->
  </environment>
</veml>
```

- The root element is always `<veml>` (not `<world>`)
- `<metadata>` contains configuration: title, script references, input bindings, multiplayer settings
- `<environment>` contains everything visible: sky, lights, objects, UI panels

### Entities

Everything in the world is an **entity**. Entities have:

- A **type** (`xsi:type`) — what kind of object it is
- A **tag** — a human-readable label for grouping/finding entities
- An **id** — a unique identifier (**must be a valid UUID**)
- A **transform** — position, rotation, and scale in 3D space

```xml
<entity xsi:type="cubemesh" tag="my-box" id="a1b2c3d4-e5f6-7890-abcd-ef1234567890">
  <transform xsi:type="scaletransform">
    <position x="5" y="1" z="5" />
    <rotation x="0" y="0" z="0" w="1" />
    <scale x="2" y="2" z="2" />
  </transform>
</entity>
```

> **Important:** Entity `id` values must be valid UUIDs (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`). Human-readable IDs like `my-box` will cause a runtime error. Generate UUIDs at [uuidgenerator.net](https://www.uuidgenerator.net/) or use your editor's UUID plugin.

---

## 8. Your First Edit: Customize the World

Let's make three changes to see immediate results.

### Change the World Title

Open `world.veml` and find the `<title>` element:

```xml
<title>The Overlook</title>
```

Change it to your world's name:

```xml
<title>My First World</title>
```

### Change the Sky Color

Find the `<lite-procedural-sky>` element and change `day-sky-color`:

```xml
<lite-procedural-sky sun-entity-tag="sun"
                     day-night-cycle-enabled="false"
                     sun-enabled="true" sun-diameter="3"
                     ground-enabled="true" ground-color="#3a5a2a"
                     day-horizon-color="#e8a87c" day-sky-color="#4a0080"
                     clouds-enabled="true" stars-enabled="true"
                     moon-enabled="true" />
```

Try `#4a0080` for a deep purple sky, or `#ff6b35` for a sunset orange.

### Change the Ground Color

Find the ground entity (the one with `tag="ground"`) and update the init script to set its color. While `<color>` tags appear in the VEML, primitive colors are most reliably set via JavaScript. Add this to `scripts/init.js` after the character creation:

```javascript
// Set ground color after a short delay to ensure entities are loaded
Time.SetTimeout(function() {
    var ground = MeshEntity.Get("ground");
    if (ground != null) {
        ground.SetColor("#2d5a1e");  // Dark forest green
    }
}, 2);
```

### Deploy Your Changes

```bash
git add -A
git commit -m "Customize my world"
git push
```

Wait about 30 seconds, then refresh your world URL. You should see your new sky color and title.

---

## 9. Adding Entities

### Primitive Types

VEML includes built-in primitive shapes:

| Type | Shape | Notes |
|------|-------|-------|
| `cubemesh` | Box | 1x1x1 base size |
| `spheremesh` | Sphere | 1m diameter |
| `cylindermesh` | Cylinder | 1m diameter, 1m tall |
| `conemesh` | Cone | 1m diameter base |
| `planemesh` | Flat plane | 1x1, faces up (Y+) |
| `capsule` | Capsule | Cylinder with rounded ends |

### Adding a New Entity

To add a red floating cube above the platform, add this inside `<environment>`:

```xml
<!-- A floating cube above the spawn platform -->
<entity xsi:type="cubemesh" tag="floating-box" id="b7e3f1a2-8c4d-4e5f-9a6b-1c2d3e4f5a6b">
  <transform xsi:type="scaletransform">
    <position x="0" y="3" z="0" />
    <rotation x="0" y="0.383" z="0" w="0.924" />
    <scale x="1" y="1" z="1" />
  </transform>
</entity>
```

Then set its color via JavaScript. Add to `scripts/init.js`:

```javascript
Time.SetTimeout(function() {
    var box = MeshEntity.Get("floating-box");
    if (box != null) {
        box.SetColor("#FF5722");  // Deep orange
        box.SetVisibility(true, true);
    }
}, 2);
```

### Entity Visibility

Entities created via VEML with primitive types may need `SetVisibility(true, true)` called from JavaScript to appear. The first `true` makes the entity visible; the second `true` applies to child objects. This is a known quirk of the runtime — always call it in your init script for entities you want visible.

---

## 10. Transforms and the Coordinate System

### Coordinate System

WebVerse uses a **left-handed Y-up** coordinate system:

- **X** = left/right
- **Y** = up/down
- **Z** = forward/backward
- 1 unit = 1 meter

### Position

Where the entity is in the world:

```xml
<position x="5" y="2" z="10" />
```

This places the entity 5 meters right, 2 meters up, and 10 meters forward from the origin.

### Scale

How large the entity is. All primitives have a base size of 1x1x1, so scale maps directly to world meters:

```xml
<scale x="3" y="0.5" z="3" />
```

This creates an object 3 meters wide, 0.5 meters tall, and 3 meters deep.

### Rotation (Quaternions)

Rotations use **quaternions** — four values (x, y, z, w). If you're not familiar with quaternions, use this cheat sheet:

| Rotation | x | y | z | w |
|----------|---|---|---|---|
| No rotation (identity) | 0 | 0 | 0 | 1 |
| 90 degrees around Y (turn right) | 0 | 0.707 | 0 | 0.707 |
| 180 degrees around Y (face backward) | 0 | 1 | 0 | 0 |
| 45 degrees around Y | 0 | 0.383 | 0 | 0.924 |
| 90 degrees around X (tilt forward) | 0.707 | 0 | 0 | 0.707 |
| 30 degrees around Y | 0 | 0.259 | 0 | 0.966 |

> **Tip:** Search for "quaternion calculator" online to convert from the Euler angles (degrees) you're used to.

---

## 11. Lighting and Atmosphere

### The Procedural Sky

The `<lite-procedural-sky>` element creates a dynamic skybox:

```xml
<background>
  <lite-procedural-sky
    sun-entity-tag="sun"
    day-night-cycle-enabled="false"
    sun-enabled="true"
    sun-diameter="3"
    ground-enabled="true"
    ground-color="#3a5a2a"
    day-horizon-color="#e8a87c"
    day-sky-color="#1a5276"
    clouds-enabled="true"
    stars-enabled="true"
    moon-enabled="true" />
</background>
```

| Attribute | What It Does |
|-----------|-------------|
| `sun-entity-tag` | Links to a light entity for sun direction |
| `day-night-cycle-enabled` | Enables automatic day/night transitions |
| `day-sky-color` | Main sky color (hex) |
| `day-horizon-color` | Color near the horizon |
| `ground-color` | Color of the ground reflection in the sky |
| `clouds-enabled` | Show procedural clouds |
| `stars-enabled` | Show stars (visible at night or dark sky) |
| `moon-enabled` | Show a moon |

### Fog

Add atmospheric fog:

```xml
<effects>
  <lite-fog fog-enabled="true" color="#c8b89a" density="0.004" />
</effects>
```

Lower density (e.g., `0.001`) = subtle haze. Higher density (e.g., `0.02`) = thick fog.

### Directional Light (Sun)

The light entity controls the direction of sunlight and shadows. Its rotation determines the sun angle:

```xml
<entity xsi:type="light" tag="sun" id="YOUR-UUID-HERE">
  <transform xsi:type="scaletransform">
    <position x="0" y="75" z="0" />
    <rotation x="0.4177" y="-0.2506" z="0" w="0.8733" />
    <scale x="1" y="1" z="1" />
  </transform>
</entity>
```

The position doesn't matter much for directional lights — the rotation is what controls where the light comes from.

---

## 12. JavaScript Scripting

WebVerse includes an embedded JavaScript engine (JINT) that runs scripts declared in the VEML metadata. This is how you add interactivity to your world.

### How Scripts Load

Scripts are declared in `<metadata>` and execute in order:

```xml
<script>scripts/lib/thirdpersoncharacter.js</script>
<script>scripts/init.js</script>
<script>scripts/bridge.js</script>
```

The first script loads the character controller library, the second creates the player, and the third handles UI panel messaging.

### Available APIs

The JavaScript runtime provides access to:

| API | What It Does |
|-----|-------------|
| `Entity.Get(tagOrId)` | Find an entity by tag or ID |
| `MeshEntity.Get(tag)` | Get a mesh entity for color/material changes |
| `MeshEntity.Create(...)` | Create a new mesh entity |
| `CharacterEntity.Create(...)` | Create a player character |
| `HTMLEntity.Get(tag)` | Get an HTML panel entity |
| `Camera.SetPosition(vec3, relative)` | Move the camera |
| `Time.SetTimeout(fn, seconds)` | Delayed execution |
| `Time.SetInterval(code, seconds)` | Repeated execution |
| `Logging.Log(message)` | Console logging |
| `UUID.NewUUID()` | Generate a new UUID |
| `HTTPNetworking.Request(...)` | Make HTTP requests |
| `Context.DefineContext(name, obj)` | Store persistent state |
| `Context.GetContext(name)` | Retrieve persistent state |

### Example: Making an Entity Spin

Add a new script file `scripts/spinner.js`:

```javascript
// Spin an entity continuously
var spinAngle = 0;

Time.SetInterval(function() {
    spinAngle += 2;
    var radians = spinAngle * (Math.PI / 180);
    var entity = Entity.Get("floating-box");
    if (entity != null) {
        var sin = Math.sin(radians / 2);
        var cos = Math.cos(radians / 2);
        // Rotate around Y axis
        entity.SetRotation(new Quaternion(0, sin, 0, cos), false);
    }
}.toString(), 0.016);  // ~60 FPS
```

Then add it to your VEML metadata:

```xml
<script>scripts/spinner.js</script>
```

### Example: Entity Interaction via JavaScript

```javascript
// Create a clickable entity that changes color
Time.SetTimeout(function() {
    var orb = MeshEntity.Get("orb");
    if (orb != null) {
        orb.SetColor("#FFD700");      // Start gold
        orb.SetVisibility(true, true);
        orb.SetInteractionState(InteractionState.Static);
    }
}, 2);
```

### The Context System

Since JINT doesn't persist variables across `SetInterval` calls the same way a browser would, use the **Context** system to store state:

```javascript
// Store state
Context.DefineContext("myState", { counter: 0, active: true });

// Retrieve it later
var state = Context.GetContext("myState");
state.counter++;
Context.DefineContext("myState", state);
```

---

## 13. HTML Panels (UI Overlays)

HTML panels are standard web pages rendered as overlays on top of the 3D world. They're perfect for HUDs, menus, settings, and information displays.

### Declaring a Panel in VEML

```xml
<entity xsi:type="html" tag="my-panel" id="YOUR-UUID-HERE"
        url="panels/my-panel.html"
        on-message="OnMyPanelMessage(?)">
  <transform xsi:type="canvastransform">
    <position-percent x="0.02" y="0.02" />
    <size-percent x="0.25" y="0.3" />
  </transform>
</entity>
```

- `url` — path to the HTML file (relative to the repo root)
- `on-message` — JavaScript function that receives messages from the panel
- `position-percent` — top-left corner as a fraction of the viewport (0.0 to 1.0)
- `size-percent` — width and height as a fraction of the viewport

### The Vuplex Bridge

Panels communicate with the world engine through the **Vuplex bridge** — a message-passing system.

**Panel side (HTML/JS):**

```javascript
// Send a message to the world engine
function sendToWorld(data) {
    var msg = JSON.stringify(data);
    if (window.vuplex) {
        window.vuplex.postMessage(msg);
    }
}

// Listen for messages from the world engine
if (window.vuplex) {
    window.vuplex.addEventListener('message', function(event) {
        var data = JSON.parse(event.data);
        // Handle message from world
    });
}
```

**World side (JINT script):**

```javascript
function OnMyPanelMessage(message) {
    var data = JSON.parse(message);

    if (data.type === "button-clicked") {
        Logging.Log("Panel button was clicked!");
        // Send data back to the panel
        var panel = HTMLEntity.Get("my-panel");
        if (panel != null) {
            panel.SendMessage(JSON.stringify({
                type: "update",
                score: 42
            }));
        }
    }
}
```

### Creating a Custom Panel

1. Create `panels/my-panel.html` with standard HTML/CSS/JS
2. Add the Vuplex bridge code for communication
3. Add the `<entity xsi:type="html">` to your VEML
4. Add a message handler function in a script file
5. Reference the handler in the `on-message` attribute

---

## 14. Using 3D Models

For realistic objects, use **glTF/GLB** 3D models instead of primitives.

### Mesh Entity Syntax

```xml
<entity xsi:type="mesh" tag="tree" id="YOUR-UUID-HERE">
  <transform xsi:type="scaletransform">
    <position x="-8" y="0" z="6" />
    <rotation x="0" y="0" z="0" w="1" />
    <scale x="1" y="1" z="1" />
  </transform>
  <mesh-name>oak</mesh-name>
  <mesh-resource>https://your-domain.com/models/oak.glb</mesh-resource>
</entity>
```

- `mesh-name` — a label for the mesh (used for caching)
- `mesh-resource` — URL to the GLB/glTF file (must be publicly accessible via HTTPS with CORS headers)

### Hosting Your Models

Your GLB files need to be hosted at a publicly accessible URL with proper CORS headers. Options:

1. **GitHub Releases** — Upload GLB files as release assets in your repo
2. **GitHub LFS** — Store large files in your repo with Git LFS
3. **A CDN** — Upload to any CDN that serves with `Access-Control-Allow-Origin: *`
4. **Your own server** — Any web server with CORS enabled

> **Note:** You cannot reference files from your repo directly (e.g., `./models/tree.glb`) because the model loader requires an absolute HTTPS URL. The file must be served with CORS headers.

### Finding Free 3D Models

- [Sketchfab](https://sketchfab.com) — Search for free GLB/glTF models
- [Poly Haven](https://polyhaven.com) — CC0 models and textures
- [Kenney](https://kenney.nl) — Game-ready assets (CC0)

Make sure to download in **glTF** or **GLB** format. Other formats (FBX, OBJ) are not supported.

---

## 15. Multiplayer with WorldSync

GitWorlds supports real-time multiplayer through **WorldSync**, a synchronization service built on MQTT. When multiplayer is enabled, players in the same world can see each other's avatars and interact.

### How It Works

1. A **WorldSync session** is created on an MQTT broker
2. Your world's VEML references the session via a **sync ID** and **broker URL**
3. When players load your world, the WebVerse runtime connects to the broker
4. Player positions, rotations, and entity states are synchronized in real-time

### Option A: Automatic Registration (GitWorlds Service)

The deploy workflow automatically registers your world with the GitWorlds service when you push. If the service is reachable, it:

1. Calls `POST /register` to `gitworlds.worldhub.me`
2. Receives a sync ID and broker URL
3. Injects them into your deployed `world.veml`

This happens transparently — you don't need to configure anything. The `REPLACE-WITH-YOUR-UUID` placeholder in the template's VEML is replaced automatically.

> **Note:** If the GitWorlds service is unreachable during deploy, multiplayer will be silently disabled. Your world still works, just without sync.

### Option B: WorldHub Sessions (Manual Control)

If you want more control over your multiplayer sessions — for example, naming sessions, reusing them across worlds, or managing quota — you can create sessions through WorldHub.

**Step 1: Create a WorldHub Account**

1. Go to [worldhub.me](https://worldhub.me)
2. Click **Sign Up** or **Log In** to create/access your WorldHubID account

**Step 2: Create a Sync Session**

1. Once logged in, click your username in the top-right dropdown
2. Select **Sync Sessions**
3. Click **Create Session** and enter a name (e.g., "My World Session")
4. You'll receive a **Sync ID** (UUID) and **Broker URL**
5. Click the copy button next to each value

**Step 3: Configure Your World**

Open `world.veml` and find the `<synchronizationservice>` element in `<metadata>`:

```xml
<synchronizationservice type="vss"
    address="wss://mqtt.webverse.info:55526"
    id="paste-your-sync-id-here"
    session="my-world" />
```

Replace:
- `address` — with the **Broker URL** from your session
- `id` — with the **Sync ID** from your session
- `session` — with a descriptive name for your session

**Step 4: Commit and Push**

```bash
git add world.veml
git commit -m "Enable multiplayer"
git push
```

After the deploy completes, anyone visiting your world URL will be connected to the same multiplayer session.

### Session Limits

Each WorldHub account has a session quota (default: 5 sessions). You can view your quota and manage sessions from the Sync Sessions page. Delete unused sessions to free up quota.

### Disabling Multiplayer

To disable multiplayer, remove or comment out the `<synchronizationservice>` element:

```xml
<!-- <synchronizationservice type="vss" ... /> -->
```

---

## 16. Input Events and Control Flags

### Input Events

Input events connect user actions (keyboard, mouse, VR controllers) to JavaScript functions. They're declared in `<metadata>`:

```xml
<inputevent input="key" event="HandleKeyPress(?);" />
<inputevent input="endkey" event="HandleKeyRelease(?);" />
```

The `?` is replaced with the input value at runtime (e.g., x/y deltas for movement, key name for keypresses).

> **Note:** This template does not wire any input events for movement — WASD
> motion, mouse look, and jumping are handled natively by the WebVerse rig
> once the character is registered as the rig avatar (see
> `scripts/lib/thirdpersoncharacter.js`). Use input events for custom
> interactions like hotkeys or VR controller buttons.

| Input | Triggered By | Value Passed |
|-------|-------------|--------------|
| `move` | WASD / left stick | x, y movement deltas |
| `endmove` | Key release | (none) |
| `look` | Mouse / right stick | x, y look deltas |
| `endlook` | Mouse stop | (none) |
| `key` | Any key press | Key name string |
| `endkey` | Key release | Key name string |
| `leftstickvaluechange` | VR left stick | x, y values |
| `rightstickvaluechange` | VR right stick | x, y values |

### Control Flags

Control flags configure VR-specific behavior:

```xml
<controlflags>
  <left-vr-pointer>teleport</left-vr-pointer>
  <right-vr-pointer>ui</right-vr-pointer>
  <turn-locomotion>snap</turn-locomotion>
  <joystick-motion>true</joystick-motion>
</controlflags>
```

| Flag | Values | Description |
|------|--------|-------------|
| `left-vr-pointer` | `teleport`, `ui`, `false` | Left controller pointer mode |
| `right-vr-pointer` | `teleport`, `ui`, `false` | Right controller pointer mode |
| `turn-locomotion` | `snap`, `smooth`, `false` | VR turn style |
| `joystick-motion` | `true`, `false` | Enable joystick movement |
| `left-grab-move` | `true`, `false` | Grab-to-move with left hand |

---

## 17. Troubleshooting

### "Failed to load runtime" on the loading screen

The GitHub Actions workflow didn't complete, or Pages isn't enabled.

**Fix:** Check the Actions tab for errors. Make sure Pages source is set to "GitHub Actions" (not "Deploy from a branch").

### World loads but shows an empty scene (no objects)

The world.veml file wasn't found or couldn't be parsed.

**Fix:** Check that `world.veml` is in the repository root and is valid XML. Look for unclosed tags or invalid characters.

### FormatException error in the console

An entity `id` attribute is not a valid UUID.

**Fix:** Replace any human-readable IDs (like `id="my-box"`) with valid UUIDs (like `id="a1b2c3d4-e5f6-7890-abcd-ef1234567890"`). Generate them at [uuidgenerator.net](https://www.uuidgenerator.net/).

### Objects don't appear even though they're in the VEML

Primitive entities created in VEML may be invisible by default.

**Fix:** Call `SetVisibility(true, true)` on the entity from JavaScript:

```javascript
Time.SetTimeout(function() {
    var entity = MeshEntity.Get("my-tag");
    if (entity != null) {
        entity.SetVisibility(true, true);
    }
}, 2);
```

### 3D model (GLB) doesn't load

The model URL is unreachable or lacks CORS headers.

**Fix:** Verify the URL is accessible in a browser. The server must return `Access-Control-Allow-Origin: *` in the response headers.

### Multiplayer isn't working

The sync session may not have been created, or the broker URL is wrong.

**Fix:** Check if the `<synchronizationservice>` element in your deployed `world.veml` has actual values (not `REPLACE-WITH-YOUR-UUID`). If using automatic registration, check the deploy workflow logs for warnings about the GitWorlds service being unreachable. If using manual sessions via WorldHub, verify the sync ID and broker URL match your session.

### Page shows 404

GitHub Pages isn't enabled or DNS hasn't propagated.

**Fix:** Verify Pages is enabled in Settings > Pages. Wait a few minutes after the first deploy for DNS propagation.

### High memory usage / browser tab crashes

The WebVerse runtime is a WebGL application and uses significant memory. Complex worlds with many entities or large 3D models can exceed browser memory limits.

**Fix:** Reduce the number of entities, use lower-polygon models, and avoid extremely large textures.

---

## 18. Quick Reference

### Entity Types

| `xsi:type` | Description |
|------------|-------------|
| `cubemesh` | Box primitive |
| `spheremesh` | Sphere primitive |
| `cylindermesh` | Cylinder primitive |
| `conemesh` | Cone primitive |
| `planemesh` | Flat plane primitive |
| `capsule` | Capsule primitive |
| `mesh` | 3D model (GLB/glTF) |
| `light` | Directional/point light |
| `html` | HTML panel overlay |
| `character` | Player character |
| `text` | 3D text |
| `terrain` | Height-mapped terrain |
| `water` | Water surface |

### Common Quaternion Rotations

| Degrees | Axis | x | y | z | w |
|---------|------|---|---|---|---|
| 0 | — | 0 | 0 | 0 | 1 |
| 30 | Y | 0 | 0.259 | 0 | 0.966 |
| 45 | Y | 0 | 0.383 | 0 | 0.924 |
| 90 | Y | 0 | 0.707 | 0 | 0.707 |
| 180 | Y | 0 | 1 | 0 | 0 |
| 90 | X | 0.707 | 0 | 0 | 0.707 |
| 45 | X | 0.383 | 0 | 0 | 0.924 |
| 90 | Z | 0 | 0 | 0.707 | 0.707 |

### Key JavaScript APIs

```javascript
// Find entities
Entity.Get("tag-or-id")
MeshEntity.Get("tag")
HTMLEntity.Get("tag")

// Create entities
MeshEntity.Create(null, position, rotation, scale, false, tag, uuid)
CharacterEntity.Create(null, position, rotation, scale, false, name, uuid, callback)

// Modify entities
entity.SetPosition(new Vector3(x, y, z), false)
entity.SetRotation(new Quaternion(x, y, z, w), false)
entity.SetScale(new Vector3(x, y, z))
entity.SetVisibility(visible, includeChildren)
entity.SetColor("#hex")  // MeshEntity only
entity.SetInteractionState(InteractionState.Static)

// Timing
Time.SetTimeout(fn, seconds)
Time.SetInterval(codeString, seconds)

// State persistence
Context.DefineContext("name", object)
Context.GetContext("name")

// Utilities
UUID.NewUUID().ToString()
Logging.Log("message")

// Networking
HTTPNetworking.Request("GET", url, headers, body, callback)
```

### Controls

| Input | Action |
|-------|--------|
| W / A / S / D | Move forward / left / backward / right |
| Mouse | Look around |
| Space | Jump |
| VR Left Stick | Move |
| VR Right Stick | Look |

---

## Next Steps

- Browse the [VEML Specification](https://github.com/Five-Squared-Interactive/VEML) for the full schema
- Explore the [WebVerse-Runtime](https://github.com/Five-Squared-Interactive/WebVerse-Runtime) source code for advanced API usage
- Check the [JavaScript API Reference](https://github.com/Five-Squared-Interactive/WebVerse-Runtime/blob/main/docs/api/javascript-api.md) for the complete API surface
- Visit [worldhub.me](https://worldhub.me) to discover and visit other worlds
