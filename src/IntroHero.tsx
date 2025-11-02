import * as React from 'react';

export default function IntroHero() {
    const goToControls = () => {
        const el = document.getElementById('controls');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="hero panel">
            <div className="hero-inner">
                <h1 className="hero-title marker">Your Everyday Workout Generator</h1>
                <p className="hero-sub">
                    Pick your date and time, choose a style, and we’ll build a smart, balanced session—
                    complete with coach notes, built-in variety, and quick how-to links.
                </p>

                {/*<ul className="hero-bullets">*/}
                {/*    <li>🧠 <strong>Smart structure</strong> — EMOMs, chippers, ladders & more</li>*/}
                {/*    <li>🧰 <strong>Gear-aware</strong> — uses what you have (or nothing at all)</li>*/}
                {/*    <li>🎯 <strong>Focus friendly</strong> — bias or avoid muscle groups on the fly</li>*/}
                {/*    <li>📎 <strong>Coach notes</strong> — clear intent, pacing & scaling tips</li>*/}
                {/*    <li>🎥 <strong>How-tos</strong> — one-tap movement guides when you need them</li>*/}
                {/*</ul>*/}

                <div className="hero-cta">
                    <button type="button" className="cta-btn" onClick={goToControls}>
                        Generate today’s workout
                    </button>
                </div>

                <div className="hero-foot small">
                    Built for CrossFit-style WODs, Total Gym sessions, and Chair Yoga flows.
                </div>
            </div>
        </section>
    );
}
