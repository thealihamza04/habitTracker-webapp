import React, { useState, useEffect } from "react";

const AddHabitModal = ({ setHabits, isEdit, habit }) => {
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  // Prefill form in edit mode
  useEffect(() => {
    if (isEdit && habit) {
      setHabitName(habit.name);
      setHabitDescription(habit.description);
    }
  }, [isEdit, habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      // Edit habit
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habit.id
            ? { ...h, name: habitName, description: habitDescription }
            : h
        )
      );
    } else {
      // Add new habit
      setHabits((prev) => [
        ...prev,
        { id: Date.now(), name: habitName, description: habitDescription },
      ]);
    }
    setHabitName("");
    setHabitDescription("");
    document.getElementById("my_modal_1").close();
  };

  return (
    <div>
      <dialog id='my_modal_1' className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>
            {isEdit ? "Edit Habit" : "Add New Habit"}
          </h3>
          <form onSubmit={handleSubmit} className='mt-4'>
            <input
              type='text'
              placeholder='Enter habit name'
              className='input input-bordered w-full mb-4'
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required
            />
            <textarea
              placeholder='Enter habit description'
              className='textarea resize-none w-full mb-4'
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              required
            />
            <div className='modal-action'>
              <button type='submit' className='btn btn-primary'>
                {isEdit ? "Update Habit" : "Add Habit"}
              </button>
              <button
                type='button'
                className='btn'
                onClick={() => document.getElementById("my_modal_1").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AddHabitModal;
