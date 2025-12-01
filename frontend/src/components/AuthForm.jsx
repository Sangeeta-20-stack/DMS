export default function AuthForm({ title, buttonLabel, onSubmit, fields }) {
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>{title}</h2>

        <form onSubmit={onSubmit}>
          {fields.map((f) => (
            <div key={f.name} className="input-group">
              <label>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                required
                onChange={f.onChange}
              />
            </div>
          ))}

          <button className="btn-orange">{buttonLabel}</button>
        </form>
      </div>
    </div>
  );
}
