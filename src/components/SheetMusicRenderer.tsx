import React from 'react';
import { InstrumentData, MusicScore, ScoreNoteEvent } from '../types/karawi';

interface SheetMusicRendererProps {
  score: MusicScore;
  instrument: InstrumentData;
  bpm: number;
  currentIdx: number;
  loopSection: boolean;
  onSelectNote: (index: number, event: ScoreNoteEvent) => void;
}

// Map note pitch or display label to vertical staff step (0 = bottom line E4, 8 = top line F5)
function getStaffStep(ev: ScoreNoteEvent, instrument: InstrumentData): number {
  if (ev.noteId === 'rest') return 4;
  const noteObj = instrument.notes.find((n) => n.id === ev.noteId);
  const idx = noteObj ? instrument.notes.indexOf(noteObj) : 0;

  // Map standard numeric notation cleanly onto staff lines/spaces
  const mapByLabel: Record<string, number> = {
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    'i': 7,
    D: 1,
    T: 5,
    P: 6,
    B: 1,
    Ti: 5,
    Te: 6,
    G: 1,
    g: 2,
    R: 6,
    W: 2,
    w: 4,
  };

  if (ev.display in mapByLabel) {
    return mapByLabel[ev.display];
  }
  return Math.min(7, Math.max(0, idx));
}

export const SheetMusicRenderer: React.FC<SheetMusicRendererProps> = ({
  score,
  instrument,
  bpm,
  currentIdx,
  loopSection,
  onSelectNote,
}) => {
  // Group notes into systems (rows) of 8 notes (2 measures of 4/4 per row)
  const notesPerSystem = 8;
  const systems: { startIndex: number; events: ScoreNoteEvent[] }[] = [];
  for (let i = 0; i < score.notes.length; i += notesPerSystem) {
    systems.push({
      startIndex: i,
      events: score.notes.slice(i, i + notesPerSystem),
    });
  }

  const staffTop = 44;
  const lineGap = 11; // 5 lines = 44px total height
  const stepToY = (step: number) => staffTop + 4 * lineGap - step * (lineGap / 2);

  return (
    <div className="rounded-2xl bg-[#FFFEFA] border border-[#DFCCA8] shadow-inner p-5 sm:p-8 text-[#1E1410] overflow-x-auto">
      {/* Classical Sheet Music Header (matching user's attached reference style) */}
      <div className="min-w-[600px] max-w-4xl mx-auto">
        <div className="text-center space-y-1 mb-4">
          <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1410] tracking-tight">
            {score.title}
          </h3>
          <p className="font-serif-display italic text-sm text-[#4A382E]">{instrument.name}</p>
          <p className="italic text-[11px] text-[#6E594E]">
            *partitur interaktif Karawitan Jambi — ketuk not balok untuk mendengarkan nada
          </p>
        </div>

        <div className="flex items-end justify-between text-xs mb-5 border-b border-[#E8DCC6] pb-2.5">
          <span className="italic font-serif-display text-[#3A2820]">
            {score.difficulty === 'Dasar' ? 'Moderato · Lembut' : 'Con Espressione'}
          </span>
          <div className="text-right leading-tight">
            <div className="font-medium text-[#2B1810]">{score.regionOrigin}</div>
            <div className="italic text-[11px] text-[#6E594E]">Aransemen Pembelajaran KARAWI</div>
          </div>
        </div>

        {/* Musical Staff Systems */}
        <div className="space-y-6">
          {systems.map((sys, sysIdx) => {
            const svgWidth = 760;
            const svgHeight = 136;
            const leftPad = sysIdx === 0 ? 112 : 76;
            const rightPad = 24;
            const usableWidth = svgWidth - leftPad - rightPad;
            const slotW = usableWidth / notesPerSystem;
            const firstMeasureNum = sys.events[0]?.measure || sysIdx * 2 + 1;

            return (
              <div key={sysIdx} className="w-full">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label={`Paranada baris ${sysIdx + 1} untuk ${score.title}`}
                >
                  {/* Top system annotations on row 1: Tempo, Rehearsal [A], dynamic p */}
                  {sysIdx === 0 && (
                    <g>
                      <text x="64" y="20" fontSize="12" fontWeight="700" fill="#1E1410" fontFamily="serif">
                        ♩ = {bpm}
                      </text>
                      <rect x="132" y="6" width="20" height="20" fill="none" stroke="#1E1410" strokeWidth="1.5" />
                      <text x="142" y="20" fontSize="13" fontWeight="700" textAnchor="middle" fill="#1E1410" fontFamily="serif">
                        A
                      </text>
                      <text x="166" y="34" fontSize="13" fontStyle="italic" fontWeight="700" fill="#1E1410" fontFamily="serif">
                        mf
                      </text>
                    </g>
                  )}

                  {/* Measure number at start of subsequent systems */}
                  {sysIdx > 0 && (
                    <text x="26" y="34" fontSize="10" fontStyle="italic" fill="#63483A" fontFamily="serif">
                      {firstMeasureNum}
                    </text>
                  )}

                  {/* Instrument short label on left */}
                  <text
                    x="18"
                    y={staffTop + 26}
                    fontSize="11"
                    fontWeight="600"
                    fill="#3A2820"
                    fontFamily="serif"
                  >
                    {instrument.shortName.split(' ')[0].slice(0, 3)}.
                  </text>

                  {/* Bracket & left barline */}
                  <line x1="48" y1={staffTop} x2="48" y2={staffTop + 4 * lineGap} stroke="#1E1410" strokeWidth="2.2" />

                  {/* 5 Horizontal Staff Lines */}
                  {[0, 1, 2, 3, 4].map((lineIdx) => (
                    <line
                      key={lineIdx}
                      x1="48"
                      y1={staffTop + lineIdx * lineGap}
                      x2={svgWidth - rightPad}
                      y2={staffTop + lineIdx * lineGap}
                      stroke="#2B1810"
                      strokeWidth="0.95"
                    />
                  ))}

                  {/* Treble Clef glyph */}
                  <text
                    x="53"
                    y={staffTop + 37}
                    fontSize="44"
                    fill="#1E1410"
                    fontFamily="Georgia, serif"
                  >
                    𝄞
                  </text>

                  {/* Time Signature on first system */}
                  {sysIdx === 0 && (
                    <g fontFamily="Georgia, serif" fontWeight="700" fontSize="17" fill="#1E1410" textAnchor="middle">
                      <text x="92" y={staffTop + 19}>4</text>
                      <text x="92" y={staffTop + 39}>4</text>
                    </g>
                  )}

                  {/* Vertical Measure Barlines (every 4 beats) */}
                  <line
                    x1={leftPad + 4 * slotW - slotW * 0.45}
                    y1={staffTop}
                    x2={leftPad + 4 * slotW - slotW * 0.45}
                    y2={staffTop + 4 * lineGap}
                    stroke="#1E1410"
                    strokeWidth="1.1"
                  />

                  {/* Right closing barline (double barline on final system) */}
                  <line
                    x1={svgWidth - rightPad}
                    y1={staffTop}
                    x2={svgWidth - rightPad}
                    y2={staffTop + 4 * lineGap}
                    stroke="#1E1410"
                    strokeWidth={sysIdx === systems.length - 1 ? '2.6' : '1.1'}
                  />
                  {sysIdx === systems.length - 1 && (
                    <line
                      x1={svgWidth - rightPad - 5}
                      y1={staffTop}
                      x2={svgWidth - rightPad - 5}
                      y2={staffTop + 4 * lineGap}
                      stroke="#1E1410"
                      strokeWidth="1"
                    />
                  )}

                  {/* Notes & Rests */}
                  {sys.events.map((ev, localIdx) => {
                    const globalIdx = sys.startIndex + localIdx;
                    const cx = leftPad + localIdx * slotW + slotW * 0.25;
                    const step = getStaffStep(ev, instrument);
                    const cy = stepToY(step);
                    const isCurrent = globalIdx === currentIdx;
                    const inLoop =
                      loopSection &&
                      score.loopRange &&
                      globalIdx >= score.loopRange[0] &&
                      globalIdx <= score.loopRange[1];
                    const isRest = ev.noteId === 'rest';
                    const stemUp = step <= 3;
                    const noteColor = isCurrent ? '#5B0E14' : '#1E1410';

                    return (
                      <g
                        key={globalIdx}
                        onClick={() => onSelectNote(globalIdx, ev)}
                        className="cursor-pointer"
                      >
                        {/* Loop region subtle tint */}
                        {inLoop && !isCurrent && (
                          <rect
                            x={cx - 18}
                            y={staffTop - 10}
                            width="36"
                            height={4 * lineGap + 24}
                            rx="4"
                            fill="#F0CB7D"
                            opacity="0.22"
                          />
                        )}

                        {/* Active playing highlight bar */}
                        {isCurrent && (
                          <rect
                            x={cx - 17}
                            y={staffTop - 14}
                            width="34"
                            height={4 * lineGap + 30}
                            rx="6"
                            fill="#DFB054"
                            opacity="0.45"
                            stroke="#C69032"
                            strokeWidth="1.2"
                          />
                        )}

                        {isRest ? (
                          <text
                            x={cx}
                            y={staffTop + 31}
                            fontSize="24"
                            textAnchor="middle"
                            fill={noteColor}
                            fontFamily="serif"
                          >
                            𝄽
                          </text>
                        ) : (
                          <g>
                            {/* Ledger line if below bottom line */}
                            {step === 0 && (
                              <line
                                x1={cx - 10}
                                y1={cy}
                                x2={cx + 10}
                                y2={cy}
                                stroke={noteColor}
                                strokeWidth="1"
                              />
                            )}
                            {/* Stem */}
                            <line
                              x1={stemUp ? cx + 5.5 : cx - 5.5}
                              y1={cy}
                              x2={stemUp ? cx + 5.5 : cx - 5.5}
                              y2={stemUp ? cy - 28 : cy + 28}
                              stroke={noteColor}
                              strokeWidth="1.4"
                            />
                            {/* Tilted Elliptical Notehead */}
                            <ellipse
                              cx={cx}
                              cy={cy}
                              rx="6.2"
                              ry="4.5"
                              transform={`rotate(-20 ${cx} ${cy})`}
                              fill={noteColor}
                            />
                          </g>
                        )}

                        {/* Notation number + lyric/technique cue below staff */}
                        <text
                          x={cx}
                          y={staffTop + 4 * lineGap + 26}
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                          fill={isCurrent ? '#5B0E14' : '#3A2820'}
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {ev.display}
                        </text>
                        {ev.lyricOrCue && (
                          <text
                            x={cx}
                            y={staffTop + 4 * lineGap + 41}
                            fontSize="10"
                            textAnchor="middle"
                            fill="#63483A"
                            fontFamily="Georgia, serif"
                          >
                            {ev.lyricOrCue}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })}
        </div>

        {/* Footer attribution matching classical sheet print */}
        <div className="mt-6 pt-3 border-t border-[#EFE2CA] text-center text-[11px] font-serif-display text-[#6E594E]">
          KARAWI Digital Karawitan Jambi · Partitur {instrument.name}
        </div>
      </div>
    </div>
  );
};
