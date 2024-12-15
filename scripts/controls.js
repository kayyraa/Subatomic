import * as Api from "./api.js";

let Position = new Api.Vector2([0, 0]);
let Removing = false;

document.addEventListener("mousedown", Event => {
    if (Event.button === 2) Removing = true;
    else if (Event.button === 0) Removing = false;
});

document.addEventListener("mouseup", () => {
    Removing = false;
});

document.addEventListener("mousemove", Event => {
    if (Event.target !== Api.Playground) return;

    Position = [
        Event.clientX,
        Event.clientY
    ];

    if (Removing) Api.Particle.RemoveFromPosition(new Api.Vector2(Position), 4);
});

document.addEventListener("click", Event => {
    if (!window.ParticleSelection) return;
    if (Event.target !== Api.Playground) return;

    window.ParticleSelection.Position = new Api.Vector2(Position);
    window.ParticleSelection.Velocity = new Api.Vector2([0, 0]);
    const Particle = new Api.Particle(window.ParticleSelection);
    Particle.Append();
});

document.addEventListener("keydown", Event => {
    if (Event.ctrlKey || Event.metaKey || Event.shiftKey) return;

    const Key = String(Event.key).toUpperCase();
    if (Key === "C") {
        Api.Playground.innerHTML = "";
    }
});

document.addEventListener("contextmenu", Event => {
    Event.preventDefault();
}, { passive: false });

Array.from(Api.ControlPanel.children).forEach(Button => {
    Button.addEventListener("click", () => {
        window.ParticleSelection = Object.values(Api.Particles).find(Particle => Particle.Name === Button.getAttribute("href"));
        Api.ControlPanel.querySelectorAll("[Active]").forEach(OtherButton => {
            OtherButton.removeAttribute("Active");
        });
        Button.setAttribute("Active", "");
    });
});