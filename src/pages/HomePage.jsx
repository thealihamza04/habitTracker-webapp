import React, { useState, useEffect } from "react";
import HabitModal from "../components/Habit/AddHabitModal";
import { Pencil, Trash, Plus, Edit, X } from "lucide-react";
import { TiTick } from "react-icons/ti";
import {
  MdOutlineEdit,
  MdOutlineCancel,
  MdOutlineLocalFireDepartment,
} from "react-icons/md";
import { TbSum } from "react-icons/tb";
import HabitChart from "../components/Habit/HabitChart";

const HabitsList = ({
  habits,
  onEdit,
  onDelete,
  isEditModeOn,
  onHabitDone,
  getStreak,
  onHabitClick,
}) => {
  return (
    <ul className='list w-full max-w-4xl mx-auto px-4'>
      {habits.map((habit) => (
        <li key={habit.id} className='cursor-pointer'>
          <div
            onClick={() => onHabitClick(habit)}
            className='card card-bordered border border-base-300 p-4 mb-4 bg-base-100'
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-3'>
                  <img
                    className='w-10 h-10 rounded-box grayscale'
                    src={`https://api.dicebear.com/7.x/icons/svg?seed=${habit.name}`}
                    alt='habit icon'
                  />
                  <div>
                    <h2 className='text-lg font-bold'>{habit.name}</h2>
                    <p className='text-xs font-medium uppercase opacity-50 line-clamp-1'>
                      {habit.description}
                    </p>
                  </div>
                </div>

                <div className='text-sm opacity-50 flex flex-wrap space-x-4 pt-1 pl-1'>
                  <p className='flex items-center gap-1'>
                    <MdOutlineLocalFireDepartment /> {getStreak(habit.id)}
                  </p>
                  <p className='flex items-center gap-1'>
                    <TbSum /> {habit?.doneDates?.length || 0}
                  </p>
                </div>
              </div>

              <div
                className='flex gap-2 flex-shrink-0'
                onClick={(e) => e.stopPropagation()}
              >
                {isEditModeOn ? (
                  <>
                    <button
                      onClick={() => onEdit(habit)}
                      className='btn btn-sm btn-outline'
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(habit.id)}
                      className='btn btn-sm btn-outline btn-error'
                    >
                      <Trash size={18} />
                    </button>
                  </>
                ) : (
                  !habit.doneDates?.includes(
                    new Date().toISOString().slice(0, 10)
                  ) && (
                    <button
                      onClick={() => onHabitDone(habit.id)}
                      className='btn btn-sm btn-success'
                    >
                      <TiTick size={18} />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <dialog className='confirm-modal modal' id='deletemodal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Confirm Deletion</h3>
        <p className='py-4'>Are you sure you want to delete this habit?</p>
        <div className='modal-action'>
          <button className='btn btn-error' onClick={onConfirm}>
            Yes
          </button>
          <button className='btn' onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </dialog>
  );
};

const HabitDetailModal = ({ habit, streak }) => {
  if (!habit) return null;

  return (
    <dialog id='habitDetailModal' className='modal'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>{habit.name}</h3>
        <p className='py-2'>{habit.description}</p>
        <p className='text-sm opacity-70 mb-4'>🔥 Streak: {streak}</p>
        <HabitChart />
        <div className='modal-action'>
          <form method='dialog'>
            <button className='btn'>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

const HomePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [habit, setHabit] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [habits, setHabits] = useState(() => {
    const storedHabits = localStorage.getItem("habits");
    return storedHabits ? JSON.parse(storedHabits) : [];
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const handleEdit = (habit) => {
    setIsEdit(true);
    setHabit(habit);
    document.getElementById("my_modal_1").showModal();
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    document.getElementById("deletemodal").showModal();
  };

  const confirmDelete = () => {
    setHabits(habits.filter((h) => h.id !== deleteId));
    setDeleteId(null);
    document.getElementById("deletemodal").close();
  };

  const cancelDelete = () => {
    setDeleteId(null);
    document.getElementById("deletemodal").close();
  };

  const handleHabitDone = (id) => {
    const today = new Date().toISOString().slice(0, 10);
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              doneDates: [...(habit.doneDates || []), today],
            }
          : habit
      )
    );
  };

  const calculateStreak = (id) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit || !habit.doneDates) return 0;

    const doneSet = new Set(habit.doneDates);
    let streak = 0;
    let date = new Date();

    while (doneSet.has(date.toISOString().slice(0, 10))) {
      streak++;
      date.setDate(date.getDate() - 1);
    }

    return streak;
  };

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
    document.getElementById("habitDetailModal").showModal();
  };

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-white px-4 py-18 space-y-5'>
      <h1 className='text-3xl font-bold text-primary flex items-center gap-2'>
        Your Habits <MdOutlineLocalFireDepartment className='text-error' />
      </h1>

      {habits.length > 0 && (
        <HabitsList
          habits={habits}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isEditModeOn={isEditMode}
          onHabitDone={handleHabitDone}
          getStreak={calculateStreak}
          onHabitClick={handleHabitClick}
        />
      )}

      {habits.length > 0 && (
        <button
          className='fixed top-4 right-4 btn btn-circle btn-outline text-primary shadow-md'
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? <X size={20} /> : <Edit size={20} />}
        </button>
      )}

      {habits.length === 0 && (
        <div className='flex flex-col items-center mt-12 text-center'>
          <img
            src='https://img.freepik.com/free-vector/writing-wall-concept-illustration_114360-8320.jpg?uid=R196173958&ga=GA1.1.339049276.1724678178&semt=ais_items_boosted&w=740'
            alt='Building habits'
            className='w-auto h-[70svh]'
          />
          <p className='italic mt-4'>
            No habits yet, start building good routines!
          </p>
        </div>
      )}

      {!isEditMode && (
        <button
          onClick={() => {
            setIsEdit(false);
            setHabit(null);
            document.getElementById("my_modal_1").showModal();
          }}
          className='btn btn-primary fixed bottom-6 right-6 rounded-full shadow-xl'
        >
          <Plus size={20} />
          <span className='hidden sm:inline'>Add Habit</span>
        </button>
      )}

      <HabitModal setHabits={setHabits} isEdit={isEdit} habit={habit} />
      <ConfirmDeleteModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      <HabitDetailModal
        habit={selectedHabit}
        streak={selectedHabit ? calculateStreak(selectedHabit.id) : 0}
      />
    </div>
  );
};

export default HomePage;
