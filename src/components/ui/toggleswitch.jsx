
import "./toggleswitch.css"

export default function ToggleSwitch({
  checked = false,
  onChange,
  name,
  disabled = false,
}) {
  return (
    <div className="toggle-button-cover">
      <div className="button r" id="button-3">
        <input
          className="checkbox"
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          disabled={disabled}
          aria-label={name || "Toggle switch"}
        />

        <div className="knobs" />
        <div className="layer" />
      </div>
    </div>
  )
}
