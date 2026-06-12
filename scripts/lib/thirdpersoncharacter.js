/// @file thirdpersoncharacter.js
/// Module for a third person character.
///
/// Movement, mouse look, and jumping are driven by WebVerse's built-in
/// desktop rig locomotion (the same approach the MyWorlds client uses).
/// The rig moves the character smoothly and frame-rate independently —
/// no per-tick scripted SetPosition/Move calls, which caused movement
/// to stutter and snap back when keys were released.
///
/// This module is responsible for:
///   - Creating the character entity
///   - Registering it as the rig's avatar (Input.SetAvatarEntityByTag)
///   - Enabling WASD motion, mouse look, jumping, and gravity
///   - Switching between desktop and VR modes
///   - Broadcasting position/rotation for multiplayer

function FinishLoadingCharacter(character) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.characterEntity = Entity.Get(context.characterEntityID);
    context.OnLoaded();
}

class ThirdPersonCharacter {
    /// @param {string} name Name (and entity tag) for the character.
    /// @param {string} id Entity ID. Auto-generated if null.
    /// @param {float} minZ Unused (rig clamps vertical look to -90/90). Kept for compatibility.
    /// @param {float} maxZ Unused (rig clamps vertical look to -90/90). Kept for compatibility.
    /// @param {float} motionMultiplier Movement speed multiplier. Rig speed = multiplier * 40 m/s.
    /// @param {float} rotationMultiplier Look sensitivity multiplier. Rig sensitivity = multiplier * 20.
    /// @param {Vector3} position Spawn position.
    /// @param {function} onLoaded Callback invoked with the character entity ID once loaded.
    /// @param {string} mode "desktop" or "vr".
    /// @param {boolean} findGround Whether gravity and ground-finding are enabled.
    constructor(name, id = null, minZ = -90, maxZ = 90, motionMultiplier = 0.1,
        rotationMultiplier = 0.1, position = Vector3.zero, onLoaded = null,
        mode = "desktop", findGround = true) {
        this.characterName = name;
        this.motionMultiplier = motionMultiplier;
        this.rotationMultiplier = rotationMultiplier;
        this.findGround = findGround;
        this.characterEntity = null;
        this.inVRMode = false;

        this.characterEntityID = null;
        if (id != null)
        {
            this.characterEntityID = id;
        }
        else
        {
            this.characterEntityID = UUID.NewUUID().ToString();
        }

        this.OnLoaded = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (onLoaded != null) {
                onLoaded(context.characterEntityID);
            }

            var entity = context.characterEntity;
            entity.SetInteractionState(InteractionState.Physical);
            entity.fixHeight = context.findGround;
            entity.SetPhysicalProperties(new EntityPhysicalProperties(
                null, null, null, context.findGround, null));

            if (mode === "vr" || Input.IsVR) {
                context.EnterVRMode();
            }
            else {
                context.EnterDesktopMode();
            }

            // Movement/look tuning.
            Input.movementSpeed = context.motionMultiplier * 40;
            Input.lookSpeed = context.rotationMultiplier * 20;

            // Multiplayer presence.
            entity.EnablePositionBroadcast(0.25);
            entity.EnableRotationBroadcast(0.25);
        }

        /// @function ThirdPersonCharacter.EnterDesktopMode
        /// Hand the character to the desktop rig, which drives WASD movement,
        /// mouse look, and jumping natively.
        this.EnterDesktopMode = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
            var entity = context.characterEntity;

            entity.PlaceCameraOn();
            Camera.SetPosition(new Vector3(0, 1.5, -2.75), true);
            Input.SetAvatarEntityByTag(context.characterName);
            Input.SetRigOffset(new Vector3(0, 1.5, -2.75));
            Input.wasdMotionEnabled = true;
            Input.mouseLookEnabled = true;
            Input.jumpEnabled = true;
            Input.gravityEnabled = context.findGround;
            entity.SetVisibility(true, false);
            context.inVRMode = false;
        }

        /// @function ThirdPersonCharacter.EnterVRMode
        /// Attach the character to the VR rig. VR stick locomotion is handled
        /// natively via the joystick-motion control flag.
        this.EnterVRMode = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
            var entity = context.characterEntity;

            Input.AddRigFollower(entity);
            Input.SetRigOffset(new Vector3(0, 0, 0));
            Input.gravityEnabled = false;
            entity.SetVisibility(false, false);
            context.inVRMode = true;
        }

        /// @function ThirdPersonCharacter.CharacterUpdate
        /// Periodic maintenance: switches between desktop and VR modes when
        /// a headset is connected or disconnected.
        this.CharacterUpdate = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (context.characterEntity == null) {
                return;
            }

            if (Input.IsVR) {
                if (!context.inVRMode) {
                    context.EnterVRMode();
                }
            }
            else {
                if (context.inVRMode) {
                    Input.RemoveRigFollower(context.characterEntity);
                    context.EnterDesktopMode();
                }
            }
        }

        this.GetPosition = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (context.characterEntityID != null) {
                var ce = Entity.Get(context.characterEntityID);
                if (ce != null) {
                    return ce.GetPosition(false);
                }
            }

            return Vector3.zero;
        }

        Context.DefineContext("thirdPersonCharacterContext", this);

        this.characterEntity = CharacterEntity.Create(null, position,
            Quaternion.identity, Vector3.one, false, name, this.characterEntityID, "FinishLoadingCharacter");

        Time.SetInterval(`
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (context == null) {
                Logging.LogError("[ThirdPersonCharacter] Unable to get context.");
            }
            else {
                context.CharacterUpdate();
            }`,
            0.25);
    }

    /// @function ThirdPersonCharacter.SetMotionMultiplier
    /// Set the motion multiplier for the third person character.
    /// @param {float} multiplier The multiplier to apply. Must be greater than 0.
    SetMotionMultiplier(multiplier) {
        this.motionMultiplier = multiplier;
        Input.movementSpeed = multiplier * 40;
        Context.DefineContext("thirdPersonCharacterContext", this);
    }

    /// @function ThirdPersonCharacter.JumpCharacter
    /// Perform a jump on the character by the provided amount.
    /// @param {float} amount The amount by which to jump.
    JumpCharacter(amount) {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.characterEntity.Jump(amount);
    }

    /// @function ThirdPersonCharacter.SetMotionModeFree
    /// Set the motion mode to free (flying, no gravity).
    SetMotionModeFree() {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.findGround = false;
        if (context.characterEntity != null) {
            context.characterEntity.SetPhysicalProperties(new EntityPhysicalProperties(
                null, null, null, false, null));
            context.characterEntity.fixHeight = false;
            context.characterEntity.SetInteractionState(InteractionState.Static);
        }
        Input.gravityEnabled = false;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }

    /// @function ThirdPersonCharacter.SetMotionModePhysical
    /// Set the motion mode to physical (gravity and ground interaction).
    SetMotionModePhysical() {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.findGround = true;
        if (context.characterEntity != null) {
            context.characterEntity.SetPhysicalProperties(new EntityPhysicalProperties(
                null, null, null, true, null));
            context.characterEntity.fixHeight = true;
            context.characterEntity.SetInteractionState(InteractionState.Physical);
        }
        Input.gravityEnabled = true;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }
}
