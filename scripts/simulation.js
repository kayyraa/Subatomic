import * as Api from './api.js';
Object.assign(globalThis, Api);
window.Api = Api;

function SimulationLoop() {
    Array.from(Api.Playground.children).forEach(Particle => {
        let Position = [parseInt(Particle.style.left.replace("px", "")), parseInt(Particle.style.top.replace("px", ""))];
        let Velocity = JSON.parse(Particle.getAttribute("Velocity"));

        const Mass = parseInt(Particle.getAttribute("Mass"));
        const Charge = parseInt(Particle.getAttribute("Charge"));

        Array.from(Api.Playground.children).forEach(OtherParticle => {
            if (OtherParticle === Particle) return;

            const OtherPosition = [parseInt(OtherParticle.style.left.replace("px", "")), parseInt(OtherParticle.style.top.replace("px", ""))];
            const OtherCharge = parseInt(OtherParticle.getAttribute("Charge"));
            const OtherMass = parseInt(OtherParticle.getAttribute("Mass"));
            let OtherVelocity = JSON.parse(OtherParticle.getAttribute("Velocity"));

            const Distance = new Api.Vector4([Position[0], OtherPosition[0], Position[1], OtherPosition[1]]).Magnitude;
            let Force = ((Charge * OtherCharge) - (OtherMass * Mass)) / (Distance * 2);

            if (Math.abs(Charge) === Math.abs(OtherCharge)) Force = Math.abs(Force);
            else Force = -Math.abs(Force);

            const ForceVector = [
                (OtherPosition[0] - Position[0]) / Distance,
                (OtherPosition[1] - Position[1]) / Distance
            ];

            const ChargeFactor = Charge < 0 ? -1 : 1;
            Velocity[0] += ForceVector[0] * (Force * ChargeFactor);
            Velocity[1] += ForceVector[1] * (Force * ChargeFactor);

            const OtherChargeFactor = OtherCharge < 0 ? -1 : 1;
            OtherVelocity[0] -= ForceVector[0] * (Force * OtherChargeFactor);
            OtherVelocity[1] -= ForceVector[1] * (Force * OtherChargeFactor);

            Velocity[0] =      Math.max(-50, Math.min(Velocity[0]     , 50));
            Velocity[1] =      Math.max(-50, Math.min(Velocity[1]     , 50));
            OtherVelocity[0] = Math.max(-50, Math.min(OtherVelocity[0], 50));
            OtherVelocity[1] = Math.max(-50, Math.min(OtherVelocity[1], 50));

            Velocity[0] =      isNaN(Velocity[0]) ?      0 :      Velocity[0];
            Velocity[1] =      isNaN(Velocity[1]) ?      0 :      Velocity[1];
            OtherVelocity[0] = isNaN(OtherVelocity[0]) ? 0 : OtherVelocity[0];
            OtherVelocity[1] = isNaN(OtherVelocity[1]) ? 0 : OtherVelocity[1];

            Particle.setAttribute("Velocity", JSON.stringify(Velocity));
            OtherParticle.setAttribute("Velocity", JSON.stringify(OtherVelocity));
        });

        Position[0] = Position[0] + Velocity[0];
        Position[1] = Position[1] + Velocity[1];

        Position[0] = Math.max(0, Math.min(Position[0], Api.Playground.clientWidth));
        Position[1] = Math.max(0, Math.min(Position[1], Api.Playground.clientHeight));

        Position[0] = isNaN(Position[0]) ? window.innerWidth / 2 : Position[0];
        Position[1] = isNaN(Position[1]) ? window.innerHeight / 2 : Position[1];

        Particle.style.left = `${Position[0]}px`;
        Particle.style.top = `${Position[1]}px`;
        Particle.setAttribute("Position", JSON.stringify([Position[0], Position[1]]));
    });

    requestAnimationFrame(SimulationLoop);
}

SimulationLoop();