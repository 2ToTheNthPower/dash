import { Icon } from './Icon'

interface OnboardingProps {
  onDemo: () => void
  onConnect: () => void
}

export function Onboarding({ onDemo, onConnect }: OnboardingProps) {
  return (
    <div className="overlay onboarding-overlay">
      <div
        className="onboarding-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="onboarding-brand">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="bolt" size={20} />
          </span>
          <span>Dash</span>
        </div>

        <div className="onboarding-hero">
          <p className="eyebrow">A friendlier home screen</p>
          <h2 id="onboarding-title">Welcome to your home, simplified.</h2>
          <p>
            Dash is a calm front door for Home Assistant. Build a dashboard by tapping
            cards, control your home with one touch, and skip the YAML.
          </p>
        </div>

        <div className="onboarding-choices">
          <button type="button" className="onboarding-choice recommended" onClick={onConnect}>
            <span className="onboarding-choice-icon">
              <Icon name="plug" size={22} />
            </span>
            <span className="onboarding-choice-copy">
              <strong>Connect Home Assistant</strong>
              <small>Use your real lights, sensors, scenes, and automations.</small>
            </span>
            <span className="onboarding-badge">Recommended</span>
          </button>

          <button type="button" className="onboarding-choice" onClick={onDemo}>
            <span className="onboarding-choice-icon">
              <Icon name="home" size={22} />
            </span>
            <span className="onboarding-choice-copy">
              <strong>Explore the demo first</strong>
              <small>Look around with sample data and connect whenever you are ready.</small>
            </span>
          </button>
        </div>

        <p className="onboarding-foot">
          You can switch between demo data and your home at any time in settings. Nothing is
          ever sent to a third party.
        </p>
      </div>
    </div>
  )
}
