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
      <div className="input-group mt-6">
        <label className="font-medium block mb-2" htmlFor="duration">
          Meeting Duration (minutes)
        </label>
        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="py-3 px-4 w-full rounded-sm bg-neutral-800 text-neutral-100"
        >
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
          <option value="90">90 minutes</option>
        </select>
      </div>
      <button
        onClick={handleFormSubmit}
        disabled={isSubmitting}
        className="mt-4 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 disabled:cursor-not-allowed rounded px-6 py-3 text-white font-medium transition-colors text-sm w-full flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Confirm Meeting'
        )}
      </button>
    </form>
  );
}

export default Form;
