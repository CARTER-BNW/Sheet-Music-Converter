let lastPlaced = [];
let pendingNote = null;

// ---------------- TREBLE STAFF (correct mapping) ----------------
const treblePositions = [
    { code: "1G", y: -10 }, // space above top line
    { code: "1F", y: 0 },   // top line
    { code: "1E", y: 10 },  // space
    { code: "1D", y: 20 },  // 2nd line from top
    { code: "1C", y: 30 },  // space
    { code: "0B", y: 40 },  // middle line
    { code: "0A", y: 50 },  // space
    { code: "0G", y: 60 },  // 2nd line from bottom (correct G4)
    { code: "0F", y: 70 },  // space
    { code: "0E", y: 80 },  // bottom line
    { code: "0D", y: 90 },  // space below
    { code: "0C", y: 100 }  // Middle C (ledger)
];

// ---------------- BASS STAFF (correct mapping) ----------------
const bassPositions = [
    { code: "-1B", y: -10 }, // space above top line
    { code: "-1A", y: 0 },   // top line
    { code: "-1G", y: 10 },  // space
    { code: "-1F", y: 20 },  // 2nd line from top
    { code: "-1E", y: 30 },  // space
    { code: "-1D", y: 40 },  // middle line
    { code: "-1C", y: 50 },  // space
    { code: "-2B", y: 60 },  // 2nd line from bottom
    { code: "-2A", y: 70 },  // space
    { code: "-2G", y: 80 },  // bottom line
    { code: "0C", y: -20 }   // Middle C (ledger above)
];

// ---------------- SLOT CREATION ----------------
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

// ---------------- ACCIDENTAL POPUP ----------------
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

// ---------------- PLACE NOTE ----------------
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

// ---------------- UNDO ----------------
document.getElementById("undoBtn").addEventListener("click", () => {
    const last = lastPlaced.pop();
    if (!last) return;

    last.element.remove();

    const ta = document.getElementById(last.output);
    let parts = ta.value.trim().split(/\s+/);
    parts.pop();
    ta.value = parts.join(" ");
});

// ---------------- INIT ----------------
createSlots("trebleStaff", treblePositions, "rightCodes");
createSlots("bassStaff", bassPositions, "leftCodes");
