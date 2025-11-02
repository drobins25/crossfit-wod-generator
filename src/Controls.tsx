import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_EQUIPMENT, EQUIPMENT_LABEL, ALL_MUSCLE_GROUPS, MUSCLE_LABEL, type Equipment } from './types/WodMovements'
import {useWorkoutType, WorkoutType} from './workoutTypes/context'
import {getEquipmentForType, getWorkoutTypeOptions} from './workoutTypes/registry'
import { useBoard } from './store'

type Props = { date: string; setDate: (v: string) => void };

/* Date buttons (Prev | Date | Next) */
export function DatePickerButtons({ date, setDate }: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // --- local-safe ISO helpers (avoid TZ off-by-one) ---
    const toISO = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${da}`;
    };
    const parseISO = (s: string) => {
        const [y, m, d] = s.split('-').map(Number);
        const out = new Date();
        out.setFullYear(y, (m ?? 1) - 1, d ?? 1);
        out.setHours(0, 0, 0, 0);
        return out;
    };

    const fmt = React.useMemo(
        () =>
            new Intl.DateTimeFormat(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            }),
        []
    );

    const move = (delta: number) => {
        const base = parseISO(date);
        base.setDate(base.getDate() + delta);
        setDate(toISO(base));
    };

    const openNative = () => {
        const el = inputRef.current;
        if (!el) return;
        // keep in sync before opening
        el.value = date;
        // Modern Chromium / Safari 16.4+
        if (typeof el.showPicker === 'function') {
            el.showPicker();
        } else {
            // Fallback
            el.focus();
            el.click();
        }
    };

    const label = React.useMemo(() => fmt.format(parseISO(date)), [date, fmt]);

    return (
        <div className="segmented-wrap block-row">
            <div className="segmented-title marker line center">Workout Date</div>
            <h3 style={{fontSize: "xx-small", textAlign: 'center'}}>Pick the day you want to train. Tap the center date to open the
                calendar.</h3>

            {/* The visible 3-button row */}
            <div className="segmented-grid segmented-3 date-grid" role="group" aria-label="Session date">
                <button type="button" className="segmented-btn" onClick={() => move(-1)}>
                    ← Prev
                </button>

                <button
                    type="button"
                    className="segmented-btn is-active"
                    onClick={openNative}
                    aria-haspopup="dialog"
                    aria-label="Open calendar"
                    title="Open calendar"
                >
                    {label}
                </button>

                <button type="button" className="segmented-btn" onClick={() => move(1)}>
                    Next →
                </button>
            </div>

            {/* Hidden native date input the center button triggers */}
            <input
                ref={inputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                // visually hidden but still interactive for showPicker()/click()
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            />
        </div>
    );
}

export default function Controls() {
    const {workoutType, setWorkoutType} = useWorkoutType()
    const {date, setDate, equipSel, setEquipSel, focusSel, setFocusSel, workout, setWorkout, generateAll } = useBoard()

    const workoutTypes = React.useMemo(() => getWorkoutTypeOptions(), []);
    const [workoutStr, setWorkoutStr] = useState(String(workout))

    // --- Sticky "Select all" for equipment (persists across type changes + reloads) ---
    const [equipAllSticky, setEquipAllSticky] = useState(false)
    const allBoxRef = useRef<HTMLInputElement>(null)

    // On mount, read sticky flag from localStorage
    useEffect(() => {
        const sticky = localStorage.getItem('equipAllSticky') === '1'
        setEquipAllSticky(sticky)
    }, [])

    // Allowed equipment for the current workout type
    const allowedEquip: Equipment[] = useMemo(() => {
        return getEquipmentForType(workoutType)
    }, [workoutType])

    // Promote to sticky ONLY when user manually selects everything for this type
    useEffect(() => {
        const allForType = allowedEquip.length > 0 && allowedEquip.every(eq => equipSel.includes(eq))
        if (allForType && !equipAllSticky) {
            setEquipAllSticky(true)
            localStorage.setItem('equipAllSticky', '1')
        }
    }, [equipSel, allowedEquip, equipAllSticky])

    // Show indeterminate state when partially selected (and not sticky)
    useEffect(() => {
        if (!allBoxRef.current) return
        const allForType = allowedEquip.length > 0 && allowedEquip.every(eq => equipSel.includes(eq))
        const none = equipSel.length === 0
        allBoxRef.current.indeterminate = !allForType && !none && !equipAllSticky
    }, [equipSel, allowedEquip, equipAllSticky])

    // IMPORTANT: do NOT reset equipment here on workoutType changes.
    // The store owns that logic now to avoid loops.

    // Re-generate when inputs change
    useEffect(() => { generateAll() }, [date, equipSel, focusSel, workout])

    // Collapsible state
    const [equipCollapsed, setEquipCollapsed] = useState(true)
    const [focusCollapsed, setFocusCollapsed] = useState(true)

    // const allFocusSelected = focusSel.length === ALL_MUSCLE_GROUPS.length
    const toggleAllFocus = (checked: boolean) =>
        setFocusSel(() => (checked ? [...ALL_MUSCLE_GROUPS] : []))

    // ---- Training Focus "Select all" sticky state ----
    const [focusAllSticky, setFocusAllSticky] = React.useState(true);

    // Keep sticky button visually in sync if focusSel changes externally
    const allFocusSelected = focusSel.length === ALL_MUSCLE_GROUPS.length;
    React.useEffect(() => {
        setFocusAllSticky(allFocusSelected);
    }, [allFocusSelected]);

    const toggleAllFocusButtons = (checked: boolean) => {
        setFocusAllSticky(checked);
        setFocusSel(() => (checked ? [...ALL_MUSCLE_GROUPS] : []));
    };

    // Equipment "Select all" — controlled by equipAllSticky; acts on allowedEquip for current type
    const toggleAllEquip = (checked: boolean) => {
        setEquipAllSticky(checked)
        localStorage.setItem('equipAllSticky', checked ? '1' : '0')
        setEquipSel(() => (checked ? [...allowedEquip] : []))
    }

    // Stop header toggle when clicking controls in the header
    const stop = (e: React.MouseEvent) => e.stopPropagation()

    const [showTip, setShowTip] = useState(false)
    const tipRef = useRef<HTMLDivElement>(null)

    // close on outside tap
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!tipRef.current) return
            if (!tipRef.current.contains(e.target as Node)) setShowTip(false)
        }
        document.addEventListener('click', onDocClick)
        return () => document.removeEventListener('click', onDocClick)
    }, [])

    return (
        <div>
            {/* Workout Date */}
            <div className="section">
                <DatePickerButtons date={date} setDate={setDate}/>
            </div>
            <br/>
            {/* Total workout time (segmented buttons) */}
            <div className="section">
                <div className="segmented-wrap block-row">
                    <div className="segmented-title marker line center">Workout Duration</div>
                    <h3 style={{fontSize: "xx-small", textAlign: 'center'}}>Choose your total work time (excludes
                        warm-up/cool-down). Use the split slider to balance Lift ↔ HIIT.</h3>
                    <div className="segmented-grid segmented-3" role="radiogroup" aria-label="Workout duration">
                        {([10, 20, 30, 40, 50, 60] as const).map((m) => {
                            const active = workout === m;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    className={`segmented-btn ${active ? 'is-active' : ''}`}
                                    aria-pressed={active}
                                    onClick={() => {
                                        setWorkout(m);
                                        setWorkoutStr(String(m)); // keep legacy text state aligned
                                    }}
                                >
                                    {m} min
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <br/>
            {/* Workout Type */}
            <div className="section">
                <div className="segmented-wrap block-row">
                    <div className="segmented-title marker line center">Workout type</div>
                    <h3 style={{fontSize: "xx-small", textAlign: 'center'}}>Select a training style and we’ll generate
                        sessions that fit your space, gear, and style-specific formats.</h3>
                    <div className="segmented-grid segmented-3" role="group" aria-label="Workout type">
                        {getWorkoutTypeOptions().map(({id, label}) => {
                            const active = id === workoutType;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    className={`segmented-btn ${active ? 'is-active' : ''}`}
                                    aria-pressed={active}
                                    onClick={() => setWorkoutType(id as WorkoutType)}
                                    title={label}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <br/>
            {/* Equipment (collapsible) */}
            <section
                className={`section collapsible ${equipCollapsed ? 'collapsed' : ''}`}
                aria-expanded={!equipCollapsed}
                aria-label="Equipment section"
            >
                <div
                    className="section-head"
                    onClick={() => setEquipCollapsed((c) => !c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setEquipCollapsed((c) => !c)}
                >
                    <div className="section-title">Equipment</div>

                    <div className="section-actions" onClick={stop}>
                        {/* Select all → button, reusing segmented styles */}
                        <button
                            type="button"
                            className={`segmented-btn sm ${equipAllSticky ? 'is-active' : ''}`}
                            aria-pressed={equipAllSticky}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleAllEquip(!equipAllSticky); // your existing handler
                            }}
                        >
                            Select all
                        </button>

                        {!equipCollapsed && (
                            <button className="btn ghost sm" onClick={() => setEquipCollapsed(true)}>Done</button>
                        )}
                        <span className="chev">▾</span>
                    </div>
                </div>

                <div className="section-body padded">
                    <div>
                        {/* segmented button grid instead of checkboxes */}
                        <div
                            className="segmented-grid segmented-auto equip-grid"
                            role="group"
                            aria-label="Equipment"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {allowedEquip.map((eq) => {
                                const active = equipSel.includes(eq);
                                return (
                                    <button
                                        key={eq}
                                        type="button"
                                        className={`segmented-btn ${active ? 'is-active' : ''}`}
                                        aria-pressed={active}
                                        title={EQUIPMENT_LABEL[eq]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEquipSel((s) => {
                                                const next = active ? s.filter((x) => x !== eq) : [...s, eq];
                                                // if "Select all" was sticky and user toggles any chip off, unstick it
                                                if (equipAllSticky && next.length !== allowedEquip.length) {
                                                    setEquipAllSticky(false);
                                                }
                                                return next;
                                            });
                                        }}
                                    >
                                        {EQUIPMENT_LABEL[eq]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <br/>
            {/* Training Focus (collapsible) */}
            <section
                className={`section collapsible ${focusCollapsed ? 'collapsed' : ''}`}
                aria-expanded={!focusCollapsed}
                aria-label="Focus Areas section"
            >
                <div
                    className="section-head"
                    onClick={() => setFocusCollapsed((c) => !c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFocusCollapsed((c) => !c)}
                >
                    <div className="section-title">
                        <span className="section-title-row">Training Focus</span>
                    </div>

                    <div className="section-actions" onClick={(e) => e.stopPropagation()}>
                        {/* Select all → segmented button (matches Equipment) */}
                        <button
                            type="button"
                            className={`segmented-btn sm ${focusAllSticky ? 'is-active' : ''}`}
                            aria-pressed={focusAllSticky}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleAllFocusButtons(!focusAllSticky);
                            }}
                            title="Select all focus areas"
                        >
                            Select all
                        </button>

                        {!focusCollapsed && (
                            <button className="btn ghost sm" onClick={() => setFocusCollapsed(true)}>Done</button>
                        )}
                        <span className="chev">▾</span>
                    </div>
                </div>

                <div className="section-body padded">
                    <div>
                        {/* segmented button grid instead of checkboxes */}
                        <div
                            className="segmented-grid segmented-auto focus-grid"
                            role="group"
                            aria-label="Training focus"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {ALL_MUSCLE_GROUPS.map((mg) => {
                                const active = focusSel.includes(mg);
                                return (
                                    <button
                                        key={mg}
                                        type="button"
                                        className={`segmented-btn ${active ? 'is-active' : ''}`}
                                        aria-pressed={active}
                                        title={MUSCLE_LABEL[mg]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFocusSel((s) => {
                                                const next = active ? s.filter((x) => x !== mg) : [...s, mg];

                                                // keep sticky state honest:
                                                if (focusAllSticky && next.length !== ALL_MUSCLE_GROUPS.length) {
                                                    setFocusAllSticky(false);
                                                } else if (!focusAllSticky && next.length === ALL_MUSCLE_GROUPS.length) {
                                                    setFocusAllSticky(true);
                                                }
                                                return next;
                                            });
                                        }}
                                    >
                                        {MUSCLE_LABEL[mg]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
