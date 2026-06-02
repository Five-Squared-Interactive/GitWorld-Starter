// Bridge between HTML panels and the JINT scripting engine.
// Routes messages from Vuplex HTML entities to world logic.

function OnPanelMessage(message) {
    try {
        var data = JSON.parse(message);
    } catch (e) {
        Logging.Log("[Bridge] Non-JSON message: " + message);
        return;
    }

    if (data.type === "panel-ready") {
        // Welcome panel loaded — send world info back
        var response = JSON.stringify({
            type: "world-info",
            title: "The Overlook",
            version: "1.0"
        });
        var panel = HTMLEntity.Get("welcome-panel");
        if (panel != null) {
            panel.SendMessage(response);
        }
    }
    else if (data.type === "close-panel") {
        var panel = HTMLEntity.Get("welcome-panel");
        if (panel != null) {
            panel.SetVisibility(false);
        }
    }
    else {
        Logging.Log("[Bridge] Unknown message type: " + data.type);
    }
}
