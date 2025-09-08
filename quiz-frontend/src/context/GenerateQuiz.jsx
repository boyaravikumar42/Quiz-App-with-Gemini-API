import React, { useState } from "react";
import axios from "axios";

const GenerateQuizForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    topic: "",
    questionCount: 1,
    difficulty: "easy",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "questionCount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes/generate`, form,{Headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${localStorage.getItem("token")}` }});
      setQuestions(res.data || []);
      console.log("Generated Questions:", res.data);
    } catch (err) {
      alert("Error generating quiz");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" required />
        <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic" className="w-full p-2 border" required />
        <input type="number" name="questionCount" value={form.questionCount} onChange={handleChange} min={1} max={50} className="w-full p-2 border" required />
        <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-2 border">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>
      <div className="mt-6">
        {questions.length > 0 && (
          <ul>
            {questions.map((q, idx) => (
              <li key={idx} className="mb-2 p-2 border rounded">{q.question}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GenerateQuizForm;