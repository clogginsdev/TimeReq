import { useState } from 'react';

function Form({ handleChange, form, handleSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault(e)} className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
        Schedule Meeting
      </h2>
      <div className="input-group">
        <label htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          autoComplete="name"
        />
      </div>
      <div className="input-group mt-6">
        <label htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="input-group mt-6">
        <label htmlFor="description">
          Meeting Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What would you like to discuss?"
        />
      </div>
      <div className="input-group mt-6">
        <label htmlFor="duration">
          Duration
        </label>
        <select
          id="duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
        >
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
          <option value="90">90 minutes</option>
        </select>
      </div>
      <button
        onClick={handleFormSubmit}
        disabled={isSubmitting}
        className="mt-8"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scheduling...
          </>
        ) : (
          'Schedule Meeting'
        )}
      </button>
    </form>
  );
}

export default Form;
