// Note positions for treble and bass staves
// You can expand these easily later

const treblePositions = [
    { code: "1G", y: 0 },
    { code: "1F", y: 10 },
    { code: "1E", y: 20 },
    { code: "1D", y: 30 },
    { code: "1C", y: 40 },
    { code: "0B", y: 50 },
    { code: "0A", y: 60 },
    { code: "0G", y: 70 },
    { code: "0F", y: 80 },
    { code: "0E", y: 90 }
];

const bassPositions = [
    { code: "0D", y: -10 },
    { code: "0C", y: 0 },   // Middle C
    { code: "-1B", y: 10 },
    { code: "-1A", y: 20 },
    { code: "-1G", y: 30 },
    { code: "-1F", y: 40 },
    { code: "-1E", y: 50 },
    { code: "-1D", y: 60 },
    { code: "-1C", y: 70 },
    { code: "-2B", y: 80 }
];

function createSlots(staffId, positions, outputId) {
    const staff = document.getElementById(staffId);
    const width = 560;
    const leftOffset = 20;
    const columns = 10;

    for (let i = 0; i < columns; i++) {
        const x = leftOffset + (width / (columns - 1)) * i;

        positions.forEach(pos => {
            const slot = document.createElement("div");
            slot.className = "note-slot";
            slot.style.left = x + "px";
            slot.style.top = (20 + pos.y) + "px";
            slot.dataset.code = pos.code;

            slot.addEventListener("click", () => {
                const ta = document.getElementById(outputId);
                ta.value += (ta.value.trim() ? " " : "") + pos.code;
            });

            staff.appendChild(slot);
        });
    }
}

createSlots("trebleStaff", treblePositions, "rightCodes");
createSlots("bassStaff", bassPositions, "leftCodes");
