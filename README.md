# Git World Template

A virtual world as a git repository. Fork it, edit it, push it — your world goes live on GitHub Pages.

## What Is This?

This repo contains a complete virtual world defined in [VEML](https://github.com/Five-Squared-Interactive/VEML) (Virtual Environment Markup Language). When you push to `main`, GitHub Actions downloads the WebVerse runtime, bundles it with your world content, and deploys everything to GitHub Pages. Your world is accessible at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`.

No server required. No build tools to install. Just edit and push.

## Quick Start

1. **Fork** this repository
2. Go to **Settings > Pages** and set Source to **GitHub Actions**
3. Push any change (or manually trigger the workflow)
4. Visit `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Project Structure

```
world.veml                  # World definition (entities, sky, lighting, etc.)
scripts/
  init.js                   # Player character setup
  bridge.js                 # HTML panel <-> world messaging
  lib/
    thirdpersoncharacter.js # Character controller library
panels/
  welcome.html              # Screen-space UI overlay
index.html                  # WebGL runtime loader page
.github/workflows/
  deploy.yml                # CI: downloads runtime + deploys to Pages
```

## Editing Your World

### The VEML File

`world.veml` is the heart of your world. It's XML that describes everything: sky, lighting, terrain, objects, and UI.

**Add an object** — insert an entity in the `<environment>` section:

```xml
<entity xsi:type="cubemesh" tag="my-box" id="my-box">
  <transform xsi:type="scaletransform">
    <position x="5" y="1" z="5" />
    <rotation x="0" y="0" z="0" w="1" />
    <scale x="2" y="2" z="2" />
  </transform>
  <color>#FF5722</color>
</entity>
```

**Available primitive types:** `cubemesh`, `spheremesh`, `cylindermesh`, `conemesh`, `planemesh`, `capsule`

**Use a 3D model** (glTF/GLB):

```xml
<entity xsi:type="mesh" tag="tree" id="oak-1">
  <transform xsi:type="scaletransform">
    <position x="-8" y="0" z="6" />
    <rotation x="0" y="0" z="0" w="1" />
    <scale x="1" y="1" z="1" />
  </transform>
  <mesh-name>oak</mesh-name>
  <mesh-resource>https://cdn.example.com/models/oak.glb</mesh-resource>
</entity>
```

### Transforms

All transforms use quaternion rotation (`x`, `y`, `z`, `w`). Identity rotation (no rotation) is `x="0" y="0" z="0" w="1"`.

Scale maps directly to world units — a scale of `x="2" y="3" z="2"` gives you a 2m x 3m x 2m object.

### The Sky

The `<lite-procedural-sky>` element controls the atmosphere:

```xml
<lite-procedural-sky sun-entity-tag="sun"
                     day-night-cycle-enabled="false"
                     day-sky-color="#1a5276"
                     day-horizon-color="#e8a87c"
                     clouds-enabled="true"
                     stars-enabled="true"
                     moon-enabled="true" />
```

### HTML Panels

Screen-space UI overlays using standard HTML/CSS/JS. Position and size are specified as percentages of the viewport:

```xml
<entity xsi:type="html" tag="my-panel" id="my-panel"
        url="panels/my-panel.html"
        on-message="OnMyPanelMessage(?)">
  <transform xsi:type="canvastransform">
    <position-percent x="0.02" y="0.02" />
    <size-percent x="0.25" y="0.3" />
  </transform>
</entity>
```

The `on-message` attribute routes messages from the HTML page to a JavaScript function in the world engine.

### Multiplayer

Uncomment the `<synchronizationservice>` block in `world.veml` and provide your own WorldSync/MQTT broker address:

```xml
<synchronizationservice type="vss"
    address="wss://your-mqtt-broker:port"
    id="your-uuid"
    session="your-session-name" />
```

## Controls

| Input | Action |
|-------|--------|
| W/A/S/D | Move |
| Mouse | Look |
| Q | Fly up |
| Z | Fly down |
| Space | Jump |
| VR Sticks | Move + Look |

## How It Works

The deploy workflow (`deploy.yml`) does three things:
1. Downloads a pre-built WebVerse WebGL runtime (~100MB compressed)
2. Copies your world content alongside it
3. Deploys everything as a GitHub Pages artifact

The runtime never enters your git history — your repo stays small.

## License

World content in this template is released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). The WebVerse runtime has its own license — see [WebVerse-Runtime](https://github.com/Five-Squared-Interactive/WebVerse-Runtime).
