window.ParticleSelection = [];
window.Playing = true;
window.GridSize = 32;

export const Particles = {
    Proton: {
        Name: "Proton",
        Color: "rgb(255, 90, 90)",
        Radius: 0.5,
        Charge: 8,
        Mass: 4
    },
    Neutron: {
        Name: "Neutron",
        Color: "rgb(90, 90, 255)",
        Radius: 0.5,
        Charge: 8,
        Mass: 12
    },
    Electron: {
        Name: "Electron",
        Color: "rgb(90, 90, 90)",
        Radius: 0.5,
        Charge: 8,
        Mass: 2
    },
    Positron: {
        Name: "Positron",
        Color: "rgb(255, 255, 90)",
        Radius: 1.5,
        Charge: 32,
        Mass: 100
    }
};

export const ControlPanel = document.querySelector(".ControlPanel");
export const Playground = document.querySelector(".Playground");

export class Vector2 {
    constructor(Vector = [0, 0]) {
        this.Vector = Vector;
    }

    get Angle() {
        return Math.atan2(this.Vector[1], this.Vector[0]) * (180 / Math.PI);
    }

    get Magnitude() {
        return Math.sqrt(Math.pow(this.Vector[0], 2) + Math.pow(this.Vector[1], 2));
    }
}

export class Vector4 {
    constructor(Vector = [0, 0, 0, 0]) {
        this.Vector = Vector;
    }

    get Magnitude() {
        return Math.sqrt(
            Math.pow(this.Vector[2] - this.Vector[0], 2) +
            Math.pow(this.Vector[3] - this.Vector[1], 2)
        );
    }

    get Angle() {
        const X1 = this.Vector[0];
        const Y1 = this.Vector[1];
        const X2 = this.Vector[2];
        const Y2 = this.Vector[3];
        return Math.atan2(Y2 - Y1, X2 - X1);
    }
}

export class Particle {
    constructor(
        Particle = {
            Name: "",
            Position: new Vector2([0, 0]),
            Velocity: new Vector2([0, 0]),
            Radius: 1,
            Color: "rgb(255, 255, 255)"
        }
    ) {
        this.Particle = Particle;
    }

    Append() {
        const Particle = document.createElement("div");
        Particle.style.left = `${(this.Particle.Position.Vector[0] - (this.Particle.Radius * window.GridSize) / 2)}px`;
        Particle.style.top =  `${(this.Particle.Position.Vector[1] - (this.Particle.Radius * window.GridSize) / 2)}px`;
        Particle.style.width = `${this.Particle.Radius * window.GridSize}px`;
        Particle.style.backgroundColor = this.Particle.Color;
        Particle.classList.add("Particle", this.Particle.Name);
        Playground.appendChild(Particle);
    
        Object.keys(this.Particle).forEach(Key => {
            if (typeof this.Particle[Key] === "object") {
                Particle.setAttribute(Key, `[${this.Particle[Key].Vector}]`);
            } else {
                Particle.setAttribute(Key, this.Particle[Key]);
            }
        });
    
        return Particle;
    }    

    Remove() {
        const Part = Playground.querySelector(`.Particle.${this.Particle.Name}`);
        if (Part) Part.remove();
    }

    Resize(Radius) {
        const Part = Playground.querySelector(`.Particle.${this.Particle.Name}`);
        if (Part) {
            this.Particle.Radius = Radius;
            Part.style.width = `${Radius * window.GridSize}px`;
            Part.style.height = `${Radius * window.GridSize}px`;
        }
    }

    UpdateVelocity(Force = new Vector2()) {
        this.Particle.Velocity.Vector[0] = Force.Vector[0];
        this.Particle.Velocity.Vector[1] = Force.Vector[1];
    }

    UpdatePosition(Delta = new Vector2()) {
        this.Particle.Position.Vector[0] += this.Particle.Velocity.Vector[0] * Delta.Vector[0];
        this.Particle.Position.Vector[1] += this.Particle.Velocity.Vector[1] * Delta.Vector[1];
    }

    static RemoveFromPosition(Position = new Vector2([0, 0]), Radius = 0) {
        const ParticlesToRemove = Array.from(Playground.children).filter(Part => {
            const Left = parseInt(Part.style.left.replace("px", ""), 10);
            const Top = parseInt(Part.style.top.replace("px", ""), 10);
            const PartRadius = parseInt(Part.style.width.replace("px", ""), 10) / 2;
            const PartCenterX = Left + PartRadius;
            const PartCenterY = Top + PartRadius;
            const Distance = Math.sqrt(
                Math.pow(PartCenterX - Position.Vector[0], 2) + Math.pow(PartCenterY - Position.Vector[1], 2)
            );
            return Distance <= PartRadius + Radius;
        });
        ParticlesToRemove.forEach(Part => Part.remove());
    }
}