function Form({ handleChange, form, handleSubmit }) {
  return (
    <form onSubmit={(e) => e.preventDefault(e)} className="details-form">
      <div className="input-group">
        <label className="font-medium block mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="py-3 px-4 w-full rounded-sm bg-neutral-800 text-neutral-100"
        />
      </div>
      <div className="input-group mt-6">
        <label className="font-medium block mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="py-3 px-4 rounded-sm w-full bg-neutral-800 text-neutral-100"
        />
      </div>
      <div className="input-group mt-6">
        <label className="font-medium block mb-2" htmlFor="description">
          Description of our meeting
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What's the purpose of our meeting?"
          className="py-2 px-4 w-full rounded-sm bg-neutral-800 text-neutral-100"
        />
      </div>
      <button
        onClick={() => handleSubmit()}
        className="mt-4 bg-neutral-700 hover:bg-neutral-600 rounded px-6 py-3 text-white font-medium transition-colors text-sm"
      >
        Confirm Meeting
      </button>
    </form>
  );
}

export default Form;
