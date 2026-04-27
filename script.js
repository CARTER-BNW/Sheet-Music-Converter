let lastPlaced = [];
let pendingNote = null;

// TREBLE STAFF (correct real-world mapping)
// bottom line = E4 = 0E
// second line = G4 = 0G
// middle C = ledger below = 0C

const treblePositions = [
    { code: "1G", y: -10 }, // above top line
    { code: "1F", y: 0 },   // top line
    { code: "1E", y: 10 },
    { code: "1D", y: 20 },
    { code: "1C", y: 30 },
    { code: "0B", y: 40 },  // middle line
    { code: "0A", y: 50 },
    { code: "0G", y: 60 },  // SECOND LINE FROM BOTTOM (correct G4)
    { code: "0F", y: 70 },
    { code: "0E", y: 80 },  // bottom line
    { code: "0D", y: 90 },
    { code: "0C", y: 100 }  // Middle C (ledger)
];

// BASS STAFF (correct mapping)
const bassPositions = [
    { code: "0C", y: -10 },  // Middle C (ledger above)
    { code: "-1B", y: 0 },
    { code: "-1A", y: 10 },  // top line
    { code: "-1G", y: 20 },
    { code: "-1F", y: 30 },
    { code: "-1E", y: 40 },  // middle line
    { code: "-1D", y: 50 },
    { code: "-1C", y: 60 },
    { code: "-2B", y: 70 },  // bottom line
    { code: "-2A", y: 80 },
    { code: "-2G", y: 90 }
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
            slot.dataset.x = x;
            slot.dataset.y = 20 + pos.y;
            slot.dataset.output = outputId;

            slot.addEventListener("click", openAccidentalPopup);
            staff.appendChild(slot);
        });
    }
}

function openAccidentalPopup(e) {
    const popup = document.getElementById("accidentalPopup");
    popup.style.left = e.pageX + "px";
    popup.style.top = e.pageY + "px";
    popup.style.display = "block";

    pendingNote = {
        code: e.target.dataset.code,
        x: e.target.dataset.x,
        y: e.target.dataset.y,
        output: e.target.dataset.output
    };
}

document.querySelectorAll("#accidentalPopup button").forEach(btn => {
    btn.addEventListener("click", () => {
        placeNote(pendingNote, btn.dataset.acc);
        document.getElementById("accidentalPopup").style.display = "none";
        pendingNote = null;
    });
});

function placeNote(note, accidental) {
    const fullCode = note.code + accidental;

    const ta = document.getElementById(note.output);
    ta.value += (ta.value.trim() ? " " : "") + fullCode;

    const head = document.createElement("div");
    head.className = "notehead";
    head.style.left = note.x + "px";
    head.style.top = note.y + "px";

    document.body.appendChild(head);

    lastPlaced.push({ element: head, output: note.output, code: fullCode });
}

document.getElementById("undoBtn").addEventListener("click", () => {
    const last = lastPlaced.pop();
    if (!last) return;

    last.element.remove();

    const ta = document.getElementById(last.output);
    let parts = ta.value.trim().split(/\s+/);
    parts.pop();
    ta.value = parts.join(" ");
});

createSlots("trebleStaff", treblePositions, "rightCodes");
createSlots("bassStaff", bassPositions, "leftCodes");
